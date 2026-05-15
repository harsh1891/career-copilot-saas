import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/server/auth";
import { getDashboardSummary } from "@/server/dashboard/service";

export async function GET() {
  const user = await requireCurrentUser();
  const summary = await getDashboardSummary(user.id);
  return NextResponse.json(summary);
}
