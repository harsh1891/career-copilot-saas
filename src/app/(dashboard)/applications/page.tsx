import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ApplicationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Application Tracker</h1>
      <Card>
        <CardHeader>
          <CardTitle>Auto-apply queue</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-400">Greenhouse and Lever adapters are ready for confirmation-first application flows. LinkedIn Easy Apply is gated behind authenticated browser review.</CardContent>
      </Card>
    </div>
  );
}
