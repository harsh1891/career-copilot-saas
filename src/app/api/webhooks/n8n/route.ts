import { NextResponse } from "next/server";
import { runDailyAutomation } from "@/server/workflows/daily-run";

export async function POST(request: Request) {
  const secret = request.headers.get("x-n8n-secret");
  if (process.env.N8N_WEBHOOK_SECRET && secret !== process.env.N8N_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Invalid webhook secret" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const run = await runDailyAutomation(body.userId);
  return NextResponse.json({ run });
}
