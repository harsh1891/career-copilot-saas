import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/server/auth";
import { listApplications, upsertApplication } from "@/server/applications/service";

export async function GET() {
  const user = await requireCurrentUser();
  const applications = await listApplications(user.id);
  return NextResponse.json({ applications });
}

export async function POST(request: Request) {
  const user = await requireCurrentUser();
  const application = await upsertApplication(user.id, await request.json());
  return NextResponse.json({ application });
}
