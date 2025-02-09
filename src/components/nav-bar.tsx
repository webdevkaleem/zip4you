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
import ThemeSwitch from "./theme-switcher";

export default async function NavBar() {
  const isAdmin = await CheckIfAdmin();
  const isLoggedIn = await CheckIfLoggedIn();
  const userAvatar = await UserAvatar();
  const userInitials = await UserInitials();

  return (
    <div className="flex w-full items-center justify-between">
      <Link href={"/"} className="flex items-center gap-4">
        <svg
          width="48"
          height="48"
          viewBox="0 0 199 307"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 277.676V208.624C69.9011 247.753 160.244 224.928 196.928 208.624V277.676C110.038 327.163 30.7716 298.295 2 277.676Z"
            className="stroke-foreground"
            strokeWidth="4"
          />
          <path
            d="M17.8244 233.759V271.881"
            className="stroke-foreground"
            strokeWidth="4"
          />
          <path
            d="M26.4559 238.149V276.271"
            className="stroke-foreground"
            strokeWidth="4"
          />
          <path
            d="M2 190.676V121.624C69.9011 160.753 160.244 137.928 196.928 121.624V190.676C110.038 240.163 30.7716 211.296 2 190.676Z"
            className="stroke-foreground"
            strokeWidth="4"
          />
          <path
            d="M17.8244 146.759V184.882"
            className="stroke-foreground"
            strokeWidth="4"
          />
          <path
            d="M26.4559 154.711V192.834"
            className="stroke-foreground"
            strokeWidth="4"
          />
          <path
            d="M26.4559 69.8349V107.957"
            className="stroke-foreground"
            strokeWidth="4"
          />
          <path
            d="M2 34.4081V103.46C30.7716 124.08 110.038 152.947 196.928 103.46V34.4081M2 34.4081C69.9011 73.5375 160.244 50.712 196.928 34.4081M2 34.4081C33.4091 9.95218 116.367 -24.2861 196.928 34.4081"
            className="stroke-foreground"
            strokeWidth="4"
          />
          <path
            d="M17.8244 59.5433V97.6657"
            className="stroke-foreground"
            strokeWidth="4"
          />
        </svg>
        <span className="tracking-widest">Zip4You</span>
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src={userAvatar ?? "https://github.com/shadcn.png"} />
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
            <Link href={"/manage"}>
              <DropdownMenuItem>Manage</DropdownMenuItem>
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

          <DropdownMenuSeparator />
          <ThemeSwitch />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
