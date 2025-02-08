import HeroWrapper from "@/components/hero-wrapper";
import { Separator } from "@/components/ui/separator";
import CheckIfAdmin from "@/lib/check-if-admin";
import { redirect } from "next/navigation";
import Uploader from "./uploader";
import Stats from "./stats";
import FadeIn from "@/components/fade-in";

export default async function Page() {
  const isAdmin = await CheckIfAdmin();

  if (!isAdmin) redirect("/not-authorized");

  return (
    <FadeIn>
      <HeroWrapper>
        <h1>Upload Media</h1>
        <p>
          Anything that you upload here will be converted into a zip file and
          made public for every visitor on the website. Kindly upload at your
          own risk.
        </p>
        <Separator className="mx-auto w-1/2 sm:w-1/3 lg:w-1/5" />
        <Uploader />
        <Stats />
      </HeroWrapper>
    </FadeIn>
  );
}
