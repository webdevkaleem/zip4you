import FadeIn from "@/components/fade-in";
import HeroWrapper from "@/components/hero-wrapper";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Page() {
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

          <Button variant={"outline"} asChild>
            <SignInButton>Sign Up</SignInButton>
          </Button>
        </div>
      </HeroWrapper>
    </FadeIn>
  );
}
