import CheckIfAdmin from "@/lib/check-if-admin";
import CheckIfLoggedIn from "@/lib/check-if-logged-in";
import { SignInButton, SignOutButton } from "@clerk/nextjs";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "@/lib/check-user-avatar";
import UserInitials from "@/lib/check-user-initials";
import Link from "next/link";

export default async function NavBar() {
  const isAdmin = await CheckIfAdmin();
  const isLoggedIn = await CheckIfLoggedIn();
  const userAvatar = await UserAvatar();
  const userInitials = await UserInitials();

  return (
    <div className="flex w-full items-center justify-between">
      <Link href={"/"}>Zip4You</Link>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src={userAvatar} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Only show the login feature if the user is not logged in */}
          {!isLoggedIn && (
            <SignInButton>
              <DropdownMenuItem>Sign Up</DropdownMenuItem>
            </SignInButton>
          )}

          {/* Show the upload files button if the user is an admin */}
          {isAdmin && (
            <Link href={"/upload"}>
              <DropdownMenuItem>Upload Files</DropdownMenuItem>
            </Link>
          )}

          {/* Show the my upload files button if the user is an admin */}
          {isAdmin && (
            <Link href={"/history"}>
              <DropdownMenuItem>History</DropdownMenuItem>
            </Link>
          )}

          {/* Showing the logout button if the user is logged in or the admin */}
          {isLoggedIn && (
            <SignOutButton>
              <DropdownMenuItem>
                <span className="text-destructive">Sign Out</span>
              </DropdownMenuItem>
            </SignOutButton>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
