import Link from "next/link";
import { ArrowRight, Bot, FileCheck2, Radar, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const workflow = [
  { icon: Radar, title: "Daily discovery", text: "Apify and adapters gather fresh SWE jobs from boards, ATS platforms, and company pages." },
  { icon: FileCheck2, title: "ATS fit analysis", text: "The scoring engine compares each role with the master resume and detects missing skills." },
  { icon: Bot, title: "Truthful tailoring", text: "OpenAI and Gemini prompts rewrite only supported experience and flag risky claims." },
  { icon: Send, title: "Apply assist", text: "Playwright adapters prepare applications with optional confirmation before submit." }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="grid min-h-[88vh] items-center border-b border-slate-800 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,.16),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(16,185,129,.12),transparent_30%)] px-5 py-16">
        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex rounded-md border border-cyan-400/30 px-3 py-1 text-sm text-cyan-200">AI career copilot for SWE applications</div>
            <h1 className="max-w-4xl text-5xl font-semibold tracking-normal text-white md:text-7xl">Career Copilot</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Automate daily job discovery, ATS scoring, resume tailoring, cover letters, summaries, and optional semi-automated applications across major job boards and ATS platforms.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/onboarding">
                  Start onboarding <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard">View dashboard</Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-3">
            {workflow.map((item) => (
              <Card key={item.title}>
                <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-900 text-cyan-300">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-slate-400">{item.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
