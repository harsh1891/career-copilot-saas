import { chromium } from "playwright";
import type { AutoApplyAdapter, AutoApplyInput, AutoApplyResult } from "@/server/auto-apply/types";

export class LeverAdapter implements AutoApplyAdapter {
  id = "lever";

  canHandle(url: string) {
    return /jobs\.lever\.co/.test(url);
  }

  async apply(input: AutoApplyInput): Promise<AutoApplyResult> {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    try {
      await page.goto(input.jobUrl, { waitUntil: "domcontentloaded" });
      await page.locator('input[name="name"]').fill(input.profile.name).catch(() => undefined);
      await page.locator('input[name="email"]').fill(input.profile.email).catch(() => undefined);
      await page.locator('input[type="file"]').first().setInputFiles(input.resumePath).catch(() => undefined);

      if (input.confirmBeforeSubmit) {
        return { status: "confirmation_required", confirmationUrl: page.url() };
      }

      await page.getByRole("button", { name: /submit application|apply/i }).click();
      return { status: "applied", confirmationUrl: page.url() };
    } catch (error) {
      return { status: "failed", error: error instanceof Error ? error.message : "Unknown error" };
    } finally {
      await browser.close();
    }
  }
}
