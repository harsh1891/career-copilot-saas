import { NextResponse } from "next/server";
import { z } from "zod";
import { requireCurrentUser } from "@/server/auth";
import { generateApplicationAssets } from "@/server/ai/pipeline";

const requestSchema = z.object({
  jobId: z.string(),
  resumeId: z.string()
});

export async function POST(request: Request) {
  const user = await requireCurrentUser();
  const body = requestSchema.parse(await request.json());
  const result = await generateApplicationAssets({
    userId: user.id,
    jobId: body.jobId,
    resumeId: body.resumeId
  });

  return NextResponse.json(result);
}
