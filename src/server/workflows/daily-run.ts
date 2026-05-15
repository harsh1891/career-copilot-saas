import { getDb } from "@/server/db";
import { scoreResumeAgainstJob } from "@/server/ai/ats";
import { generateApplicationAssets } from "@/server/ai/pipeline";
import { buildSearchContext, fetchAndStoreJobs } from "@/server/jobs/service";
import { sendDailySummary } from "@/server/notifications/service";
import { getMasterResume } from "@/server/resumes/service";
import { logger } from "@/server/logger";

export async function runDailyAutomation(userId?: string) {
  const db = getDb();
  const run = await db.automationRun.create({ data: { userId, status: "RUNNING" } });

  try {
    const users = await db.user.findMany({
      where: userId ? { id: userId } : {},
      include: { profile: true }
    });

    let jobsFetched = 0;
    let jobsStored = 0;
    let resumesCreated = 0;

    for (const user of users) {
      if (!user.profile) continue;
      const resume = await getMasterResume(user.id);
      if (!resume?.rawText) continue;

      const context = buildSearchContext(user.profile);
      const jobs = await fetchAndStoreJobs(context);
      jobsFetched += jobs.length;
      jobsStored += jobs.length;

      const scoredJobs = [];

      for (const job of jobs) {
        const ats = scoreResumeAgainstJob(resume.rawText, job.description);
        await db.aTSScore.upsert({
          where: { jobId_resumeId: { jobId: job.id, resumeId: resume.id } },
          create: { userId: user.id, jobId: job.id, resumeId: resume.id, ...ats },
          update: ats
        });
        await db.jobMatch.upsert({
          where: { userId_jobId: { userId: user.id, jobId: job.id } },
          create: { userId: user.id, jobId: job.id, score: ats.score },
          update: { score: ats.score }
        });
        scoredJobs.push({ job, score: ats.score });
      }

      const canGenerateAssets = Boolean(process.env.OPENAI_API_KEY && process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
      if (canGenerateAssets) {
        const topJobs = scoredJobs.sort((a, b) => b.score - a.score).slice(0, 5);
        for (const item of topJobs) {
          try {
            await generateApplicationAssets({ userId: user.id, jobId: item.job.id, resumeId: resume.id });
            resumesCreated += 1;
          } catch (error) {
            logger.warn("asset generation failed for job", {
              userId: user.id,
              jobId: item.job.id,
              error: error instanceof Error ? error.message : error
            });
          }
        }
      }

      if (process.env.RESEND_API_KEY) {
        try {
          await sendDailySummary(user.id);
        } catch (error) {
          logger.warn("daily summary failed", {
            userId: user.id,
            error: error instanceof Error ? error.message : error
          });
        }
      }
    }

    return db.automationRun.update({
      where: { id: run.id },
      data: { status: "SUCCEEDED", completedAt: new Date(), jobsFetched, jobsStored, resumesCreated }
    });
  } catch (error) {
    logger.error("daily automation failed", { error: error instanceof Error ? error.message : error });
    await db.automationRun.update({
      where: { id: run.id },
      data: { status: "FAILED", completedAt: new Date(), error: error instanceof Error ? error.message : "Unknown error" }
    });
    throw error;
  }
}
