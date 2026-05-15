import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/server/auth";
import { getProfile, upsertProfile } from "@/server/profiles/service";

export async function GET() {
  const user = await requireCurrentUser();
  const profile = await getProfile(user.id);
  return NextResponse.json({ user, profile });
}

export async function PUT(request: Request) {
  const user = await requireCurrentUser();
  const body = await request.json();
  const profile = await upsertProfile(user.id, body);
  return NextResponse.json({ profile });
}
