import { Queue } from "bullmq";

let dailyQueue: Queue | null = null;

export function getDailyAutomationQueue() {
  if (!dailyQueue) {
    const connection = { url: process.env.REDIS_URL ?? "redis://localhost:6379" };
    dailyQueue = new Queue("daily-automation", { connection });
  }

  return dailyQueue;
}

export async function enqueueDailyAutomation(userId?: string) {
  return getDailyAutomationQueue().add(
    "run",
    { userId },
    {
      attempts: 3,
      backoff: { type: "exponential", delay: 60_000 },
      removeOnComplete: 100,
      removeOnFail: 500
    }
  );
}
