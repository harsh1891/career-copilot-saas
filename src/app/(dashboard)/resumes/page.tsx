import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireCurrentUser } from "@/server/auth";
import { getDb } from "@/server/db";

export default async function ResumesPage() {
  const user = await requireCurrentUser();
  const resumes = await getDb().tailoredResume.findMany({
    where: { userId: user.id },
    include: { job: true },
    orderBy: { createdAt: "desc" },
    take: 50
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Tailored Resumes</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-cyan-300" />
            ATS-safe PDF pipeline
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-6 text-slate-400">
          Each generated resume is rendered from validated Markdown into simple semantic HTML before PDF generation, avoiding columns, icons, images, and complex layouts that break ATS parsing.
        </CardContent>
      </Card>
      <div className="grid gap-3">
        {resumes.map((resume) => (
          <Card key={resume.id}>
            <CardHeader>
              <CardTitle>{resume.job.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-400">{resume.job.company} · {resume.pdfStorageKey ? "PDF uploaded" : "PDF pending"}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
