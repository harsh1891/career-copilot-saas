import { MetricCard } from "@/components/metric-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Automation Dashboard</h1>
        <p className="mt-2 text-slate-400">Daily job discovery, scoring, tailoring, and application readiness in one place.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Fresh matches" value="24" detail="Posted in the last day" />
        <MetricCard label="Avg ATS score" value="78%" detail="Across active roles" />
        <MetricCard label="Resumes generated" value="12" detail="ATS-safe PDFs queued" />
        <MetricCard label="Apply tasks" value="5" detail="Need confirmation" />
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
    </div>
  );
}
