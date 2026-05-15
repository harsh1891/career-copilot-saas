import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/server/auth";
import { getDb } from "@/server/db";

export async function GET() {
  const user = await requireCurrentUser();
  const matches = await getDb().jobMatch.findMany({
    where: { userId: user.id },
    include: {
      job: true
    },
    orderBy: { score: "desc" },
    take: 100
  });

  return NextResponse.json({ matches });
}
