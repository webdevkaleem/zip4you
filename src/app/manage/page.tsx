import HeroWrapper from "@/components/hero-wrapper";
import { Separator } from "@/components/ui/separator";
import CheckIfAdmin from "@/lib/check-if-admin";
import { redirect } from "next/navigation";
import FadeIn from "@/components/fade-in";
import { auth } from "@clerk/nextjs/server";
import { api } from "@/trpc/server";
import Download from "../../components/download";
import NoUploads from "../no-uploads";

export default async function Page() {
  const { userId } = await auth();
  const isAdmin = await CheckIfAdmin();

  if (!userId) redirect("/not-authorized");
  if (!isAdmin) redirect("/not-authorized");

  const allMedia = await api.media.admin({
    userId,
  });

  return (
    <FadeIn>
      <HeroWrapper>
        <h1>Manage Files</h1>
        <p>All of the files on the site will be shown here.</p>
        <Separator className="mx-auto w-1/2 sm:w-1/3 lg:w-1/5" />

        <div className="flex flex-col gap-6 md:mx-auto md:w-2/3">
          {allMedia.length > 0 ? (
            allMedia.map((media) => {
              if (media.key && media.name && media.size && media.visibility)
                return (
                  <Download
                    fileKey={media.key}
                    label={media.name}
                    key={media.id}
                    size={media.size}
                    showDlt={true}
                    mediaId={media.id}
                    startDate={media.createdAt}
                    visibility={media.visibility}
                  />
                );
            })
          ) : (
            <NoUploads />
          )}
        </div>
      </HeroWrapper>
    </FadeIn>
  );
}
