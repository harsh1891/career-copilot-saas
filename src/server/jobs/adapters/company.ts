import type { JobBoardAdapter, ScrapedJob } from "@/server/jobs/types";

export class CompanyCareerPageAdapter implements JobBoardAdapter {
  source = "COMPANY" as const;

  async search(): Promise<ScrapedJob[]> {
    return [];
  }
}
