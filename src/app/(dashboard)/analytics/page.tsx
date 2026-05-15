import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">ATS Analytics</h1>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Common missing skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-300">
            {["Kubernetes", "GraphQL", "System design", "AWS Lambda"].map((skill) => (
              <div key={skill} className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span>{skill}</span>
                <span className="text-slate-500">Detected in job descriptions</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Scoring policy</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-6 text-slate-400">
            Scores combine explicit technical skill overlap, keyword coverage, seniority alignment, and role/location preferences. Tailoring prompts preserve truthful resume content and report unsupported claims.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
