import { Worker } from "bullmq";
import { runDailyAutomation } from "@/server/workflows/daily-run";
import { logger } from "@/server/logger";

const connection = { url: process.env.REDIS_URL ?? "redis://localhost:6379" };

new Worker(
  "daily-automation",
  async (job) => {
    logger.info("daily automation worker started", { jobId: job.id, data: job.data });
    return runDailyAutomation(job.data.userId);
  },
  {
    connection,
    concurrency: 3,
    limiter: {
      max: 10,
      duration: 60_000
    }
  }
);

logger.info("daily automation worker listening");
