import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/server/auth";
import { enqueueDailyAutomation } from "@/server/queue";
import { runDailyAutomation } from "@/server/workflows/daily-run";

export async function POST(request: Request) {
  const user = await requireCurrentUser();
  const { mode = "queue" } = await request.json().catch(() => ({ mode: "queue" }));

  if (mode === "inline") {
    const run = await runDailyAutomation(user.id);
    return NextResponse.json({ run });
  }

  const job = await enqueueDailyAutomation(user.id);
  return NextResponse.json({ queued: true, jobId: job.id });
}
