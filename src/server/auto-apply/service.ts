import { GreenhouseAdapter } from "@/server/auto-apply/adapters/greenhouse";
import { LeverAdapter } from "@/server/auto-apply/adapters/lever";
import { LinkedInEasyApplyAdapter } from "@/server/auto-apply/adapters/linkedin";
import type { AutoApplyInput } from "@/server/auto-apply/types";

const adapters = [new GreenhouseAdapter(), new LeverAdapter(), new LinkedInEasyApplyAdapter()];

export async function runAutoApply(input: AutoApplyInput) {
  const adapter = adapters.find((candidate) => candidate.canHandle(input.jobUrl));
  if (!adapter) throw new Error("No auto-apply adapter supports this job URL");
  return adapter.apply(input);
}
