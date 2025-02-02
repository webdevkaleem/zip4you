import { auth, clerkClient } from "@clerk/nextjs/server";

export default async function CheckIfLoggedIn() {
  const { userId } = await auth();

  if (!userId) return false;

  const client = await clerkClient();

  const user = await client.users.getUser(userId);

  if (!user) return false;

  return true;
}
