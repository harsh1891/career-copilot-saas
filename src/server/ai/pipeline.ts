import { getDb } from "@/server/db";
import { scoreResumeAgainstJob } from "@/server/ai/ats";
import { analyzeJobDescription } from "@/server/ai/job-analysis";
import { generateCoverLetter, tailorResume } from "@/server/ai/resume-tailoring";
import { renderResumePdf } from "@/server/resumes/pdf";
import { uploadBuffer } from "@/server/storage/service";

export async function generateApplicationAssets(input: {
  userId: string;
  jobId: string;
  resumeId: string;
}) {
  const db = getDb();
  const [job, resume] = await Promise.all([
    db.job.findUniqueOrThrow({ where: { id: input.jobId } }),
    db.resume.findUniqueOrThrow({ where: { id: input.resumeId } })
  ]);

  if (!resume.rawText) {
    throw new Error("Resume text is empty. Upload a parseable PDF or text resume first.");
  }

  const ats = scoreResumeAgainstJob(resume.rawText, job.description);
  const jobAnalysis = await analyzeJobDescription(job.description);
  await db.aTSScore.upsert({
    where: { jobId_resumeId: { jobId: job.id, resumeId: resume.id } },
    create: { userId: input.userId, jobId: job.id, resumeId: resume.id, ...ats },
    update: ats
  });

  const tailored = await tailorResume({
    masterResume: resume.rawText,
    jobDescription: job.description,
    jobTitle: job.title,
    company: job.company
  });

  const pdf = await renderResumePdf(tailored.markdownResume);
  const pdfStorageKey = `users/${input.userId}/tailored-resumes/${job.id}-${Date.now()}.pdf`;
  await uploadBuffer(pdfStorageKey, Buffer.from(pdf), "application/pdf");

  const tailoredResume = await db.tailoredResume.create({
    data: {
      userId: input.userId,
      jobId: job.id,
      resumeId: resume.id,
      markdown: tailored.markdownResume,
      pdfStorageKey,
      truthReport: {
        ...tailored.truthReport,
        jobAnalysis,
        missingEvidence: tailored.missingEvidence,
        riskyClaims: tailored.riskyClaims
      }
    }
  });

  const coverLetterBody = await generateCoverLetter({
    masterResume: resume.rawText,
    jobDescription: job.description,
    jobTitle: job.title,
    company: job.company
  });

  const coverLetter = await db.coverLetter.create({
    data: {
      userId: input.userId,
      jobId: job.id,
      body: coverLetterBody
    }
  });

  await db.jobMatch.upsert({
    where: { userId_jobId: { userId: input.userId, jobId: job.id } },
    create: { userId: input.userId, jobId: job.id, score: ats.score, status: "assets_ready" },
    update: { score: ats.score, status: "assets_ready" }
  });

  return { ats, tailoredResume, coverLetter };
}
