import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireCurrentUser } from "@/server/auth";
import { getDb } from "@/server/db";

export default async function JobsPage() {
  const user = await requireCurrentUser();
  const jobs = await getDb().jobMatch.findMany({
    where: { userId: user.id },
    include: { job: { include: { source: true } } },
    orderBy: { score: "desc" },
    take: 100
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Job Matches</h1>
      <div className="grid gap-4">
        {jobs.length === 0 ? (
          <Card>
            <CardContent className="pt-5 text-sm text-slate-400">No job matches yet. Run automation after uploading your master resume.</CardContent>
          </Card>
        ) : jobs.map((match) => (
          <Card key={match.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{match.job.title}</CardTitle>
                <p className="mt-2 text-sm text-slate-400">{match.job.company}</p>
              </div>
              <Badge className="border-cyan-400/40 text-cyan-200">{match.score}% ATS</Badge>
            </CardHeader>
            <CardContent className="text-sm text-slate-400">Source: {match.job.source?.name ?? "Unknown"} · Tailored resume and cover letter pipeline enabled.</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
