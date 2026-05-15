import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/server/auth";
import { sendDailySummary } from "@/server/notifications/service";

export async function POST() {
  const user = await requireCurrentUser();
  const notification = await sendDailySummary(user.id);
  return NextResponse.json({ notification });
}
