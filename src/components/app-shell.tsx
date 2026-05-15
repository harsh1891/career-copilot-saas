import Link from "next/link";
import { BriefcaseBusiness, ChartNoAxesCombined, FileText, Gauge, Settings, UserRoundCheck } from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/jobs", label: "Job Matches", icon: BriefcaseBusiness },
  { href: "/analytics", label: "ATS Analytics", icon: ChartNoAxesCombined },
  { href: "/resumes", label: "Tailored Resumes", icon: FileText },
  { href: "/applications", label: "Applications", icon: UserRoundCheck },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-800 bg-slate-950/95 p-5 lg:block">
        <Link href="/dashboard" className="flex items-center gap-3 text-lg font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-cyan-400 text-slate-950">AI</span>
          Career Copilot
        </Link>
        <nav className="mt-8 grid gap-1">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-slate-900 hover:text-white">
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="lg:pl-64">
        <div className="mx-auto w-full max-w-7xl px-5 py-6">{children}</div>
      </main>
    </div>
  );
}
