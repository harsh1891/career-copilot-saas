import { getDb } from "@/server/db";

export async function getDashboardSummary(userId: string) {
  const db = getDb();
  const [matches, applications, resumes, runs] = await Promise.all([
    db.jobMatch.findMany({
      where: { userId },
      include: { job: true },
      orderBy: { score: "desc" },
      take: 10
    }),
    db.application.groupBy({
      by: ["status"],
      where: { userId },
      _count: { status: true }
    }),
    db.tailoredResume.count({ where: { userId } }),
    db.automationRun.findMany({
      where: { OR: [{ userId }, { userId: null }] },
      orderBy: { startedAt: "desc" },
      take: 5
    })
  ]);

  const averageScore = matches.length
    ? Math.round(matches.reduce((sum, match) => sum + match.score, 0) / matches.length)
    : 0;

  return {
    metrics: {
      freshMatches: matches.length,
      averageScore,
      tailoredResumes: resumes,
      applications: applications.reduce<Record<string, number>>((acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      }, {})
    },
    topMatches: matches,
    recentRuns: runs
  };
}
