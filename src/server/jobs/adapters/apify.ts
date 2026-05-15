import type { JobBoardAdapter, JobSearchContext, ScrapedJob } from "@/server/jobs/types";

type ApifyItem = {
  id?: string;
  title?: string;
  companyName?: string;
  company?: string;
  location?: string;
  description?: string;
  url?: string;
  applyUrl?: string;
  postedAt?: string;
};

export class ApifyJobAdapter implements JobBoardAdapter {
  source = "LINKEDIN" as const;

  async search(context: JobSearchContext): Promise<ScrapedJob[]> {
    if (!process.env.APIFY_TOKEN) return [];

    const query = `${context.roles.join(" OR ")} ${context.techStacks.join(" ")}`.trim();
    const endpoint = new URL("https://api.apify.com/v2/acts/apify~linkedin-jobs-scraper/run-sync-get-dataset-items");
    endpoint.searchParams.set("token", process.env.APIFY_TOKEN);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        queries: [query],
        location: context.locations[0] ?? "United States",
        datePosted: "past24h",
        maxItems: 50
      })
    });

    if (!response.ok) {
      throw new Error(`Apify job scrape failed: ${response.status}`);
    }

    const items = (await response.json()) as ApifyItem[];
    return items
      .filter((item) => item.title && (item.companyName || item.company) && item.url)
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
        detectedAts: "linkedin"
      }));
  }
}
