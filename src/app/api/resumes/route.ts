import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/server/auth";
import { getDb } from "@/server/db";

export async function GET() {
  const user = await requireCurrentUser();
  const resumes = await getDb().resume.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ resumes });
}
