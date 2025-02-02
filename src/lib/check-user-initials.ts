import { auth, clerkClient } from "@clerk/nextjs/server";

const defaultUserInitials = "U";

export default async function UserInitials() {
  const { userId } = await auth();

  if (!userId) return defaultUserInitials;

  const client = await clerkClient();

  const user = await client.users.getUser(userId);

  if (!user) return defaultUserInitials;

  if (!user.username) return defaultUserInitials;

  const firstInitial = user.username.charAt(0).toUpperCase();
  const secondInitial = user.username.charAt(1).toUpperCase();

  return firstInitial + secondInitial;
}
