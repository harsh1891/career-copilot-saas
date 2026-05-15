import crypto from "crypto";
import type { ScrapedJob } from "@/server/jobs/types";

export function fingerprintJob(job: Pick<ScrapedJob, "title" | "company" | "location" | "canonicalUrl">) {
  const normalized = [job.title, job.company, job.location ?? "", job.canonicalUrl]
    .join("|")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

  return crypto.createHash("sha256").update(normalized).digest("hex");
}

export function dedupeJobs(jobs: ScrapedJob[]) {
  const seen = new Set<string>();
  return jobs.filter((job) => {
    const fp = fingerprintJob(job);
    if (seen.has(fp)) return false;
    seen.add(fp);
    return true;
  });
}
