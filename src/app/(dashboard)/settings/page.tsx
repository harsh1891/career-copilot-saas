import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Automation controls</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-slate-400">
          <p>Enable daily automation, email summaries, Telegram delivery, and confirmation-before-submit from the profile API.</p>
          <p>Secrets are loaded from environment variables and initialized lazily for build-safe deployment.</p>
        </CardContent>
      </Card>
    </div>
  );
}
