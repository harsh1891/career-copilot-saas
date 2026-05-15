import { Upload, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-5 py-10 text-slate-100">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-4xl font-semibold">Set up your job copilot</h1>
          <p className="mt-3 text-slate-400">Create your profile, upload a master resume, then let the daily automation build matches and assets.</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Profile preferences</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <input className="rounded-md border border-slate-800 bg-slate-900 px-3 py-2" placeholder="Preferred roles: Frontend SWE, Full Stack Engineer" />
            <input className="rounded-md border border-slate-800 bg-slate-900 px-3 py-2" placeholder="Tech stack: TypeScript, React, Node.js, PostgreSQL" />
            <input className="rounded-md border border-slate-800 bg-slate-900 px-3 py-2" placeholder="Locations: Remote, New York, San Francisco" />
            <div className="flex flex-wrap gap-3">
              <Button>
                <Upload className="h-4 w-4" />
                Upload resume
              </Button>
              <Button variant="secondary">
                <WandSparkles className="h-4 w-4" />
                Generate first run
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
