import type { JobBoardAdapter, JobSearchContext, ScrapedJob } from "@/server/jobs/types";

export class CompanyCareerPageAdapter implements JobBoardAdapter {
  source = "COMPANY" as const;

  async search(_context: JobSearchContext): Promise<ScrapedJob[]> {
    return [];
  }
}
