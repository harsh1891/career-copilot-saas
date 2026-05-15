import { Resend } from "resend";
import { getDb } from "@/server/db";

let resend: Resend | null = null;

function getResend() {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is missing");
    resend = new Resend(process.env.RESEND_API_KEY);
  }

  return resend;
}

export async function sendDailySummary(userId: string) {
  const db = getDb();
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { jobs: { include: { job: true }, orderBy: { score: "desc" }, take: 10 } }
  });
  if (!user) throw new Error("User not found");

  const body = user.jobs.map((match) => `${match.score}% - ${match.job.title} at ${match.job.company}`).join("\n");

  await getResend().emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "Career Copilot <updates@example.com>",
    to: user.email,
    subject: "Your daily SWE job matches",
    text: body || "No fresh matches today."
  });

  return db.notification.create({
    data: { userId, channel: "email", subject: "Your daily SWE job matches", body, sentAt: new Date() }
  });
}
