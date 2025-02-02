import { auth, clerkClient } from "@clerk/nextjs/server";

export default async function CheckIfAdmin() {
  const { userId } = await auth();

  if (!userId) return false;

  const client = await clerkClient();

  const user = await client.users.getUser(userId);

  if (!user) return false;

  if (user.privateMetadata.role !== "admin") {
    return false;
  }

  return true;
}
