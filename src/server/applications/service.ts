import { z } from "zod";
import { getDb } from "@/server/db";

export const applicationInput = z.object({
  jobId: z.string(),
  status: z.enum(["SAVED", "READY", "CONFIRMATION_REQUIRED", "APPLIED", "FAILED", "SKIPPED"]).default("SAVED"),
  notes: z.string().optional(),
  confirmationUrl: z.string().url().optional()
});

export async function listApplications(userId: string) {
  return getDb().application.findMany({
    where: { userId },
    include: { job: true },
    orderBy: { updatedAt: "desc" }
  });
}

export async function upsertApplication(userId: string, input: unknown) {
  const data = applicationInput.parse(input);
  const existing = await getDb().application.findFirst({
    where: { userId, jobId: data.jobId }
  });

  if (existing) {
    return getDb().application.update({
      where: { id: existing.id },
      data: {
        status: data.status,
        notes: data.notes,
        confirmationUrl: data.confirmationUrl,
        submittedAt: data.status === "APPLIED" ? new Date() : undefined
      }
    });
  }

  return getDb().application.create({
    data: {
      userId,
      jobId: data.jobId,
      status: data.status,
      notes: data.notes,
      confirmationUrl: data.confirmationUrl,
      submittedAt: data.status === "APPLIED" ? new Date() : undefined
    }
  });
}
