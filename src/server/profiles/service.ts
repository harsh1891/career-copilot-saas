import { z } from "zod";
import { getDb } from "@/server/db";

export const profileInput = z.object({
  headline: z.string().max(160).optional(),
  location: z.string().max(120).optional(),
  preferredRoles: z.array(z.string()).default([]),
  techStacks: z.array(z.string()).default([]),
  preferredLocations: z.array(z.string()).default([]),
  experienceLevel: z.enum(["INTERN", "ENTRY", "MID", "SENIOR", "STAFF"]).default("ENTRY"),
  remotePreference: z.enum(["REMOTE", "HYBRID", "ONSITE", "FLEXIBLE"]).default("FLEXIBLE"),
  salaryMin: z.number().int().positive().optional(),
  requiresSponsorship: z.boolean().default(false),
  autoApplyEnabled: z.boolean().default(false),
  confirmBeforeSubmit: z.boolean().default(true),
  telegramChatId: z.string().optional()
});

export async function getProfile(userId: string) {
  return getDb().profile.findUnique({ where: { userId } });
}

export async function upsertProfile(userId: string, input: unknown) {
  const data = profileInput.parse(input);

  return getDb().profile.upsert({
    where: { userId },
    create: { userId, ...data },
    update: data
  });
}
