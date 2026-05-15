import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const jobs = [
  { title: "Frontend Software Engineer", company: "Stripe", score: 91, source: "Greenhouse" },
  { title: "New Grad SWE", company: "Datadog", score: 84, source: "Lever" },
  { title: "Full Stack Engineer Intern", company: "Figma", score: 76, source: "LinkedIn" }
];

export default function JobsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Job Matches</h1>
      <div className="grid gap-4">
        {jobs.map((job) => (
          <Card key={`${job.company}-${job.title}`}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{job.title}</CardTitle>
                <p className="mt-2 text-sm text-slate-400">{job.company}</p>
              </div>
              <Badge className="border-cyan-400/40 text-cyan-200">{job.score}% ATS</Badge>
            </CardHeader>
            <CardContent className="text-sm text-slate-400">Source: {job.source} · Tailored resume and cover letter pipeline enabled.</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
