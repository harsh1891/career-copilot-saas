import type { JobBoardAdapter, ScrapedJob } from "@/server/jobs/types";

type GreenhouseJob = {
  id: number;
  title: string;
  absolute_url: string;
  location?: { name?: string };
  content?: string;
  updated_at?: string;
};

export class GreenhouseBoardAdapter implements JobBoardAdapter {
  source = "GREENHOUSE" as const;

  async search(): Promise<ScrapedJob[]> {
    const boards = (process.env.GREENHOUSE_BOARDS ?? "").split(",").map((board) => board.trim()).filter(Boolean);
    const results: ScrapedJob[] = [];

    for (const board of boards) {
      const response = await fetch(`https://boards-api.greenhouse.io/v1/boards/${board}/jobs?content=true`);
      if (!response.ok) continue;
      const data = (await response.json()) as { jobs?: GreenhouseJob[] };
      for (const job of data.jobs ?? []) {
        results.push({
          source: this.source,
          externalId: String(job.id),
          title: job.title,
          company: board,
          location: job.location?.name,
          remote: /remote/i.test(job.location?.name ?? ""),
          description: job.content ?? "",
          canonicalUrl: job.absolute_url,
          applyUrl: job.absolute_url,
          postedAt: job.updated_at ? new Date(job.updated_at) : undefined,
          detectedAts: "greenhouse"
        });
      }
    }

    return results;
  }
}
