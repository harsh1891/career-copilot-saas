import { MetricCard } from "@/components/metric-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireCurrentUser } from "@/server/auth";
import { getDashboardSummary } from "@/server/dashboard/service";

export default async function DashboardPage() {
  const user = await requireCurrentUser();
  const summary = await getDashboardSummary(user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Automation Dashboard</h1>
        <p className="mt-2 text-slate-400">Daily job discovery, scoring, tailoring, and application readiness in one place.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Fresh matches" value={String(summary.metrics.freshMatches)} detail="Ranked by ATS fit" />
        <MetricCard label="Avg ATS score" value={`${summary.metrics.averageScore}%`} detail="Across active roles" />
        <MetricCard label="Resumes generated" value={String(summary.metrics.tailoredResumes)} detail="ATS-safe PDFs created" />
        <MetricCard label="Applied" value={String(summary.metrics.applications.APPLIED ?? 0)} detail="Tracked submissions" />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Daily automation flow</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-6">
          {["Profile", "Resume", "Search", "Score", "Tailor", "Notify"].map((step) => (
            <div key={step} className="rounded-md border border-slate-800 bg-slate-900 p-4">
              <Badge>{step}</Badge>
              <p className="mt-3 text-sm text-slate-400">Ready for worker orchestration</p>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Top matches</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {summary.topMatches.length === 0 ? (
            <p className="text-sm text-slate-400">No matches yet. Upload a master resume and run the daily automation.</p>
          ) : (
            summary.topMatches.map((match) => (
              <div key={match.id} className="flex items-center justify-between rounded-md border border-slate-800 p-3">
                <div>
                  <p className="font-medium">{match.job.title}</p>
                  <p className="text-sm text-slate-400">{match.job.company}</p>
                </div>
                <Badge>{match.score}%</Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
