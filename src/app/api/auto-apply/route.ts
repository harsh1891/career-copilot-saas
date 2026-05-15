import { NextResponse } from "next/server";
import { z } from "zod";
import { requireCurrentUser } from "@/server/auth";
import { runAutoApply } from "@/server/auto-apply/service";

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
  await requireCurrentUser();
  const input = autoApplyRequest.parse(await request.json());
  const result = await runAutoApply(input);
  return NextResponse.json({ result });
}
