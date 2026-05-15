import type { JobSourceType } from "@prisma/client";
import type { JobBoardAdapter, JobSearchContext, ScrapedJob } from "@/server/jobs/types";

type ApifyDatasetItem = {
  id?: string;
  title?: string;
  company?: string;
  companyName?: string;
  location?: string;
  description?: string;
  url?: string;
  applyUrl?: string;
  postedAt?: string;
};

const actorBySource: Partial<Record<JobSourceType, string>> = {
  INDEED: "hdb85~indeed-scraper",
  GLASSDOOR: "curious_coder~glassdoor-jobs-scraper",
  ZIPRECRUITER: "bebity~ziprecruiter-jobs-scraper",
  MONSTER: "epctex~monster-jobs-scraper"
};

export class ApifyBoardAdapter implements JobBoardAdapter {
  constructor(
    public source: JobSourceType,
    private readonly actorId = actorBySource[source]
  ) {}

  async search(context: JobSearchContext): Promise<ScrapedJob[]> {
    if (!process.env.APIFY_TOKEN || !this.actorId) return [];

    const endpoint = new URL(`https://api.apify.com/v2/acts/${this.actorId}/run-sync-get-dataset-items`);
    endpoint.searchParams.set("token", process.env.APIFY_TOKEN);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        query: `${context.roles.join(" OR ")} ${context.techStacks.join(" ")}`.trim(),
        location: context.locations[0] ?? "United States",
        postedWithin: context.postedWithinHours,
        maxItems: 50
      })
    });

    if (!response.ok) {
      throw new Error(`${this.source} Apify scrape failed: ${response.status}`);
    }

    const items = (await response.json()) as ApifyDatasetItem[];
    return items
      .filter((item) => item.title && (item.company || item.companyName) && item.url)
      .map((item) => ({
        source: this.source,
        externalId: item.id,
        title: item.title!,
        company: item.companyName ?? item.company ?? "Unknown company",
        location: item.location,
        remote: /remote/i.test(item.location ?? ""),
        description: item.description ?? "",
        canonicalUrl: item.url!,
        applyUrl: item.applyUrl ?? item.url,
        postedAt: item.postedAt ? new Date(item.postedAt) : undefined,
        detectedAts: detectAts(item.applyUrl ?? item.url ?? "")
      }));
  }
}

function detectAts(url: string) {
  if (/greenhouse/i.test(url)) return "greenhouse";
  if (/lever/i.test(url)) return "lever";
  if (/linkedin/i.test(url)) return "linkedin";
  return undefined;
}
