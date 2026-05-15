# Architecture

## Daily Flow

1. n8n or cron triggers `/api/webhooks/n8n`.
2. The backend loads each user profile and master resume.
3. Resume text is parsed and stored from upload time.
4. Search context is generated from preferred roles, stack, location, seniority, and remote preference.
5. Scraping adapters fetch jobs from Apify-backed job boards and extensible ATS/company adapters.
6. Jobs are deduplicated by canonical fingerprint and stored in PostgreSQL.
7. ATS scores are calculated per job/resume pair.
8. Job matches are created for dashboard display.
9. AI tailoring and PDF rendering services can generate truthful job-specific assets.
10. Notifications summarize top matches through email and future Telegram integration.
11. Optional auto-apply tasks use Playwright adapters with retries and confirmation gates.

## Extension Points

- Add a job board by implementing `JobBoardAdapter`.
- Add an ATS apply flow by implementing `AutoApplyAdapter`.
- Add a storage provider behind `src/server/storage/service.ts`.
- Add scoring features inside `src/server/ai/ats.ts`.
- Add orchestration steps inside `src/server/workflows/daily-run.ts`.
