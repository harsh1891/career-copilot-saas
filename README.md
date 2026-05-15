# Career Copilot SaaS

Full-stack AI-powered job application automation SaaS for SWE students and professionals.

## Stack

- Next.js 15 App Router, TypeScript, TailwindCSS, shadcn-style UI primitives
- Clerk authentication
- PostgreSQL with Prisma ORM
- OpenAI and Gemini-ready AI service layer
- Supabase Storage for resumes and generated assets
- BullMQ workers for long-running automation
- Apify-backed scraping adapter plus extensible job-board adapters
- Playwright auto-apply adapters for Greenhouse, Lever, and LinkedIn review flows
- Resend email summaries
- n8n orchestration webhook and workflow export

## Architecture

The Next.js app owns product UX, API routes, auth boundaries, and business services. n8n triggers scheduled orchestration. Workers handle long-running scraping, scoring, tailoring, PDF generation, notifications, and optional auto-apply tasks. PostgreSQL is the source of truth. Supabase Storage stores master resumes and generated application assets.

## Local Setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and fill the secrets.
3. Run `npm run prisma:migrate`.
4. Start the app with `npm run dev`.
5. Start background processing with `npm run worker:daily`.

For local infrastructure, run:

```bash
docker compose up -d
```

## Important Paths

- `prisma/schema.prisma`: SaaS data model
- `src/server/workflows/daily-run.ts`: daily automation workflow
- `src/server/jobs/adapters`: scraping adapters
- `src/server/auto-apply/adapters`: Playwright auto-apply adapters
- `src/server/ai`: ATS scoring and AI prompts
- `src/app/api`: HTTP API surface
- `n8n/daily-job-automation.json`: n8n workflow import
- `docker-compose.yml`: local PostgreSQL and Redis

## Deployment

Deploy the Next.js app on Vercel, provision PostgreSQL, Redis, Clerk, Supabase, Resend, OpenAI, Gemini, and Apify secrets, then import the n8n workflow or use Vercel Cron to hit the backend webhook.
