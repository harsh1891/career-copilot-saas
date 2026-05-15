import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireCurrentUser } from "@/server/auth";
import { listApplications } from "@/server/applications/service";

export default async function ApplicationsPage() {
  const user = await requireCurrentUser();
  const applications = await listApplications(user.id);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Application Tracker</h1>
      <Card>
        <CardHeader>
          <CardTitle>Auto-apply queue</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-slate-400">
          {applications.length === 0 ? (
            <p>Greenhouse and Lever adapters are ready for confirmation-first application flows. LinkedIn Easy Apply is gated behind authenticated browser review.</p>
          ) : (
            applications.map((application) => (
              <div key={application.id} className="flex items-center justify-between rounded-md border border-slate-800 p-3">
                <div>
                  <p className="text-slate-100">{application.job.title}</p>
                  <p>{application.job.company}</p>
                </div>
                <Badge>{application.status}</Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
