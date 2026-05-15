import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/server/auth";
import { createResumeFromUpload } from "@/server/resumes/service";

export async function POST(request: Request) {
  const user = await requireCurrentUser();
  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing resume file" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const resume = await createResumeFromUpload({
    userId: user.id,
    fileName: file.name,
    mimeType: file.type || "application/octet-stream",
    buffer,
    isMaster: form.get("isMaster") !== "false"
  });

  return NextResponse.json({ resume });
}
