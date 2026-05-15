import { JobSourceType } from "@prisma/client";
import { getDb } from "@/server/db";
import { dedupeJobs, fingerprintJob } from "@/server/jobs/dedupe";
import { ApifyJobAdapter } from "@/server/jobs/adapters/apify";
import { ApifyBoardAdapter } from "@/server/jobs/adapters/apify-board";
import { CompanyCareerPageAdapter } from "@/server/jobs/adapters/company";
import { GreenhouseBoardAdapter } from "@/server/jobs/adapters/ats/greenhouse";
import { LeverBoardAdapter } from "@/server/jobs/adapters/ats/lever";
import { logger } from "@/server/logger";
import { withRetry } from "@/server/retry";
import type { JobBoardAdapter, JobSearchContext } from "@/server/jobs/types";

const adapters: JobBoardAdapter[] = [
  new ApifyJobAdapter(),
  new ApifyBoardAdapter("INDEED"),
  new ApifyBoardAdapter("GLASSDOOR"),
  new ApifyBoardAdapter("ZIPRECRUITER"),
  new ApifyBoardAdapter("MONSTER"),
  new GreenhouseBoardAdapter(),
  new LeverBoardAdapter(),
  new CompanyCareerPageAdapter()
];

export function buildSearchContext(profile: {
  preferredRoles: string[];
  techStacks: string[];
  preferredLocations: string[];
  remotePreference: string;
}): JobSearchContext {
  return {
    roles: profile.preferredRoles.length ? profile.preferredRoles : ["software engineer"],
    techStacks: profile.techStacks,
    locations: profile.preferredLocations.length ? profile.preferredLocations : ["United States"],
    postedWithinHours: 24,
    remote: profile.remotePreference === "REMOTE" || profile.remotePreference === "FLEXIBLE"
  };
}

export async function fetchAndStoreJobs(context: JobSearchContext) {
  const scraped = dedupeJobs(
    (
      await Promise.all(
        adapters.map((adapter) =>
          withRetry(() => adapter.search(context), {
            attempts: 2,
            onRetry: (error, attempt) =>
              logger.warn("job adapter retry", {
                source: adapter.source,
                attempt,
                error: error instanceof Error ? error.message : error
              })
          }).catch((error) => {
            logger.warn("job adapter failed", {
              source: adapter.source,
              error: error instanceof Error ? error.message : error
            });
            return [];
          })
        )
      )
    ).flat()
  );
  const db = getDb();
  const stored = [];

  for (const job of scraped) {
    const source = await db.jobSource.upsert({
      where: { id: `${job.source.toLowerCase()}-source` },
      create: {
        id: `${job.source.toLowerCase()}-source`,
        type: job.source as JobSourceType,
        name: job.source
      },
      update: { enabled: true }
    });

    stored.push(
      await db.job.upsert({
        where: { fingerprint: fingerprintJob(job) },
        create: {
          sourceId: source.id,
          externalId: job.externalId,
          canonicalUrl: job.canonicalUrl,
          title: job.title,
          company: job.company,
          location: job.location,
          remote: job.remote ?? false,
          description: job.description,
          applyUrl: job.applyUrl,
          postedAt: job.postedAt,
          detectedAts: job.detectedAts,
          fingerprint: fingerprintJob(job)
        },
        update: {
          description: job.description,
          applyUrl: job.applyUrl,
          postedAt: job.postedAt,
          updatedAt: new Date()
        }
      })
    );
  }

  return stored;
}
