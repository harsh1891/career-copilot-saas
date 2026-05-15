export function renderAtsSafeResumeHtml(markdown: string) {
  const escaped = markdown
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      body { font-family: Arial, Helvetica, sans-serif; font-size: 11pt; line-height: 1.35; color: #111827; }
      h1 { font-size: 18pt; margin: 0 0 8px; }
      h2 { font-size: 12pt; margin: 16px 0 6px; border-bottom: 1px solid #d1d5db; }
      p, li { margin: 0 0 5px; }
      ul { margin: 0 0 8px 18px; padding: 0; }
      a { color: #111827; text-decoration: none; }
    </style>
  </head>
  <body>${escaped.replace(/\n/g, "<br />")}</body>
</html>`;
}
