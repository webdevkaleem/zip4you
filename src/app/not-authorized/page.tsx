import FadeIn from "@/components/fade-in";
import HeroWrapper from "@/components/hero-wrapper";
import { Button } from "@/components/ui/button";
import { TriangleAlert } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <FadeIn>
      <HeroWrapper>
        <div className="flex flex-col gap-4 text-center">
          <TriangleAlert className="mx-auto h-16 w-16 stroke-1" />
          <h2>You arn&apos;t authorized</h2>
          <p>
            The reason why you are seeing this page is because you are not
            authorized to access the page you are trying to visit.
          </p>
          <Link href={"/"} className="mx-auto">
            <Button>Home Page</Button>
          </Link>
        </div>
      </HeroWrapper>
    </FadeIn>
  );
}
