import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ResumesPage() {
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
    </div>
  );
}
