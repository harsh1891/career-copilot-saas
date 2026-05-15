import { getDb } from "@/server/db";
import { parseResumeBuffer } from "@/server/resumes/parser";
import { uploadBuffer } from "@/server/storage/service";

export async function createResumeFromUpload(params: {
  userId: string;
  fileName: string;
  mimeType: string;
  buffer: Buffer;
  isMaster?: boolean;
}) {
  const storageKey = `users/${params.userId}/resumes/${Date.now()}-${params.fileName}`;
  const rawText = await parseResumeBuffer(params.buffer, params.mimeType);
  await uploadBuffer(storageKey, params.buffer, params.mimeType);

  if (params.isMaster) {
    await getDb().resume.updateMany({
      where: { userId: params.userId, isMaster: true },
      data: { isMaster: false }
    });
  }

  return getDb().resume.create({
    data: {
      userId: params.userId,
      label: params.isMaster ? "Master resume" : params.fileName,
      storageKey,
      fileName: params.fileName,
      mimeType: params.mimeType,
      rawText,
      isMaster: params.isMaster ?? false
    }
  });
}

export async function getMasterResume(userId: string) {
  return getDb().resume.findFirst({
    where: { userId, isMaster: true },
    orderBy: { createdAt: "desc" }
  });
}
