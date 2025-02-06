import FadeIn from "@/components/fade-in";
import HeroWrapper from "@/components/hero-wrapper";
import { Separator } from "@/components/ui/separator";
import { api, HydrateClient } from "@/trpc/server";
import Download from "./download";
import NoUploads from "./no-uploads";

export default async function Page() {
  const allMedia = await api.media.getAll();

  return (
    <HydrateClient>
      <FadeIn>
        <HeroWrapper>
          <h1>Download the most recent zip files</h1>
          <p>
            Everything on this site is public. Worry not, everything is deleted
            automatically after 24 hours. Kindly download at your own risk.
          </p>
          <Separator className="mx-auto w-1/2 sm:w-1/3 lg:w-1/5" />

          <div className="flex flex-col gap-6 md:mx-auto md:w-2/3">
            {allMedia.length > 0 ? (
              allMedia.map((media) => {
                if (media.key && media.name && media.size)
                  return (
                    <Download
                      fileKey={media.key}
                      label={media.name}
                      key={media.id}
                      size={media.size}
                      mediaId={media.id}
                    />
                  );
              })
            ) : (
              <NoUploads />
            )}
          </div>
        </HeroWrapper>
      </FadeIn>
    </HydrateClient>
  );
}
