import FadeIn from "@/components/fade-in";
import HeroWrapper from "@/components/hero-wrapper";
import { Button } from "@/components/ui/button";
import { TriangleAlert } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <FadeIn>
      <HeroWrapper>
        <div className="flex flex-col gap-4 text-center">
          <TriangleAlert className="mx-auto h-16 w-16 stroke-1" />
          <h2>The resource does not exist</h2>
          <p>
            Could not find the requested resource which you are looking for.
            Kindly check the URL and try again.
          </p>
          <Link href={"/"} className="mx-auto">
            <Button>Home Page</Button>
          </Link>
        </div>
      </HeroWrapper>
    </FadeIn>
  );
}
