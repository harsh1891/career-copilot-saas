# GitHub and Deployment Checklist

## GitHub

```bash
git add .
git commit -m "Initial Career Copilot SaaS scaffold"
git branch -M main
git remote add origin https://github.com/<your-user>/<your-repo>.git
git push -u origin main
```

## Vercel

1. Import the GitHub repo into Vercel.
2. Add the environment variables from `.env.example`.
3. Attach PostgreSQL, Redis, Clerk, Supabase Storage, Resend, OpenAI, Gemini, and Apify credentials.
4. Run Prisma migrations against production.
5. Configure n8n to call `/api/webhooks/n8n` with `x-n8n-secret`.

## Worker Hosting

The BullMQ worker should run as a separate long-lived process on a worker host such as Railway, Fly.io, Render, or a dedicated container service. Vercel serverless functions should enqueue work, not run persistent workers.
