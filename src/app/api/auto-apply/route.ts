import { NextResponse } from "next/server";
import { z } from "zod";
import { requireCurrentUser } from "@/server/auth";
import { runAutoApply } from "@/server/auto-apply/service";
import { upsertApplication } from "@/server/applications/service";
import { getClientKey, rateLimit } from "@/server/rate-limit";

const autoApplyRequest = z.object({
  jobUrl: z.string().url(),
  resumePath: z.string(),
  coverLetterPath: z.string().optional(),
  profile: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
    location: z.string().optional(),
    linkedInUrl: z.string().optional(),
    githubUrl: z.string().optional(),
    portfolioUrl: z.string().optional()
  }),
  confirmBeforeSubmit: z.boolean().default(true)
});

export async function POST(request: Request) {
  const user = await requireCurrentUser();
  const limit = rateLimit(`auto-apply:${getClientKey(request, user.id)}`, { limit: 3, windowMs: 60_000 });
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many auto-apply requests" }, { status: 429 });
  }
  const raw = await request.json();
  const input = autoApplyRequest.parse(raw);
  const result = await runAutoApply(input);
  if (raw.jobId) {
    await upsertApplication(user.id, {
      jobId: raw.jobId,
      status: result.status === "applied" ? "APPLIED" : result.status === "confirmation_required" ? "CONFIRMATION_REQUIRED" : "FAILED",
      confirmationUrl: result.confirmationUrl,
      notes: result.error
    });
  }
  return NextResponse.json({ result });
}
