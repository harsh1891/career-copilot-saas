import type { JobSourceType } from "@prisma/client";

export type JobSearchContext = {
  roles: string[];
  techStacks: string[];
  locations: string[];
  postedWithinHours: number;
  remote: boolean;
};

export type ScrapedJob = {
  source: JobSourceType;
  externalId?: string;
  title: string;
  company: string;
  location?: string;
  remote?: boolean;
  description: string;
  canonicalUrl: string;
  applyUrl?: string;
  postedAt?: Date;
  detectedAts?: string;
};

export interface JobBoardAdapter {
  source: JobSourceType;
  search(context: JobSearchContext): Promise<ScrapedJob[]>;
}
