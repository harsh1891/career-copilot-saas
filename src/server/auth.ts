import { currentUser } from "@clerk/nextjs/server";
import { getDb } from "@/server/db";

export async function requireCurrentUser() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) {
    throw new Response("Missing email", { status: 400 });
  }

  return getDb().user.upsert({
    where: { clerkUserId: clerkUser.id },
    create: {
      clerkUserId: clerkUser.id,
      email,
      name: clerkUser.fullName
    },
    update: {
      email,
      name: clerkUser.fullName
    }
  });
}
