# Environment Variables

## Required for app boot

- `DATABASE_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

## Required for generated application assets

- `OPENAI_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET`

## Optional AI enrichment

- `GEMINI_API_KEY`

## Scraping

- `APIFY_TOKEN`
- `GREENHOUSE_BOARDS`: comma-separated Greenhouse board tokens
- `LEVER_COMPANIES`: comma-separated Lever company slugs

## Queues and orchestration

- `REDIS_URL`
- `N8N_WEBHOOK_SECRET`
- `CRON_SECRET`

## Notifications

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
