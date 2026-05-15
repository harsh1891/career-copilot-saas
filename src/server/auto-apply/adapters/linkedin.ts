import type { AutoApplyAdapter, AutoApplyInput, AutoApplyResult } from "@/server/auto-apply/types";

export class LinkedInEasyApplyAdapter implements AutoApplyAdapter {
  id = "linkedin-easy-apply";

  canHandle(url: string) {
    return /linkedin\.com\/jobs/.test(url);
  }

  async apply(input: AutoApplyInput): Promise<AutoApplyResult> {
    return {
      status: "confirmation_required",
      confirmationUrl: input.jobUrl,
      error: "LinkedIn Easy Apply requires an authenticated browser profile and human review."
    };
  }
}
