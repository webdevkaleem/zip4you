import { auth, clerkClient } from "@clerk/nextjs/server";

export default async function UserAvatar() {
  const { userId } = await auth();

  if (!userId) return "";

  const client = await clerkClient();

  const user = await client.users.getUser(userId);

  if (!user) return "";

  return user.imageUrl;
}
