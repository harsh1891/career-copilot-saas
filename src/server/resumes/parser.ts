export async function parseResumeBuffer(buffer: Buffer, mimeType: string) {
  if (mimeType === "application/pdf") {
    const pdf = (await import("pdf-parse")).default;
    const parsed = await pdf(buffer);
    return parsed.text.trim();
  }

  if (mimeType.startsWith("text/")) {
    return buffer.toString("utf-8").trim();
  }

  return "";
}
