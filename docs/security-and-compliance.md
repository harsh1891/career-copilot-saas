# Security and Compliance Notes

- Keep all provider keys in environment variables or a managed secret store.
- Use Clerk session protection on all user API routes.
- Use service-role Supabase keys only on the server.
- Keep auto-apply confirmation enabled by default.
- Do not invent or inflate resume claims. The tailoring prompt and truth report are designed to preserve truthful content only.
- Respect job-board terms and rate limits. Prefer official APIs or approved scraping providers where available.
- Captcha, MFA, and ambiguous form questions must pause for user confirmation.
- Store only necessary application data and allow users to delete resumes and generated assets.
