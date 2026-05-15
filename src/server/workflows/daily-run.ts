import { getDb } from "@/server/db";
import { scoreResumeAgainstJob } from "@/server/ai/ats";
import { buildSearchContext, fetchAndStoreJobs } from "@/server/jobs/service";
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

    for (const user of users) {
      if (!user.profile) continue;
      const resume = await getMasterResume(user.id);
      if (!resume?.rawText) continue;

      const context = buildSearchContext(user.profile);
      const jobs = await fetchAndStoreJobs(context);
      jobsFetched += jobs.length;
      jobsStored += jobs.length;

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
      }
    }

    return db.automationRun.update({
      where: { id: run.id },
      data: { status: "SUCCEEDED", completedAt: new Date(), jobsFetched, jobsStored }
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
