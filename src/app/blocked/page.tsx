import FadeIn from "@/components/fade-in";
import HeroWrapper from "@/components/hero-wrapper";
import { Button } from "@/components/ui/button";
import CheckIfLoggedIn from "@/lib/check-if-logged-in";
import { SignInButton, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";

export default async function Page() {
  const isLoggedIn = await CheckIfLoggedIn();

  return (
    <FadeIn>
      <HeroWrapper>
        <h1 className="text-destructive">Why are you seeing this?</h1>
        <p>
          You have been blocked from accessing the app due to exceeding the rate
          limit. Kindly be patient and try again in a few minutes.
        </p>
        <div className="mx-auto flex gap-4">
          <Link href={"/"}>
            <Button>Home Page</Button>
          </Link>

          {/* Only show the login feature if the user IS NOT logged in */}
          {!isLoggedIn && (
            <Button variant={"outline"} asChild>
              <SignInButton>Sign Up</SignInButton>
            </Button>
          )}

          {/* Showing the logout button if the user IS logged in */}
          {isLoggedIn && (
            <Button variant={"outline"} className="text-destructive" asChild>
              <SignOutButton>Sign Out</SignOutButton>
            </Button>
          )}
        </div>
      </HeroWrapper>
    </FadeIn>
  );
}
