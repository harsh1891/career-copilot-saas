import type { JobBoardAdapter, ScrapedJob } from "@/server/jobs/types";

type LeverPosting = {
  id: string;
  text: string;
  hostedUrl: string;
  applyUrl?: string;
  categories?: { location?: string };
  descriptionPlain?: string;
  createdAt?: number;
};

export class LeverBoardAdapter implements JobBoardAdapter {
  source = "LEVER" as const;

  async search(): Promise<ScrapedJob[]> {
    const companies = (process.env.LEVER_COMPANIES ?? "").split(",").map((company) => company.trim()).filter(Boolean);
    const results: ScrapedJob[] = [];

    for (const company of companies) {
      const response = await fetch(`https://api.lever.co/v0/postings/${company}?mode=json`);
      if (!response.ok) continue;
      const postings = (await response.json()) as LeverPosting[];
      for (const posting of postings) {
        results.push({
          source: this.source,
          externalId: posting.id,
          title: posting.text,
          company,
          location: posting.categories?.location,
          remote: /remote/i.test(posting.categories?.location ?? ""),
          description: posting.descriptionPlain ?? "",
          canonicalUrl: posting.hostedUrl,
          applyUrl: posting.applyUrl ?? posting.hostedUrl,
          postedAt: posting.createdAt ? new Date(posting.createdAt) : undefined,
          detectedAts: "lever"
        });
      }
    }

    return results;
  }
}
