import FadeIn from "@/components/fade-in";
import { Badge } from "@/components/ui/badge";
import { formatBytes, slugToLabel } from "@/lib/utils";
import { redis } from "@/server/db/redis";
import CountdownTimer from "./countdown";
import DownloadButton from "./download-button";
import RenameButton from "./rename-button";

export default async function Download({
  fileKey,
  label,
  size,
  showDlt = false,
  mediaId,
  startDate,
  visibility,
}: {
  fileKey: string;
  label: string;
  size: number;
  showDlt?: boolean;
  mediaId: number;
  startDate: Date;
  visibility: "public" | "private";
}) {
  const downloadCount = await redis.get(`media:${mediaId}`);
  const downloadCountNum = downloadCount ? Number(downloadCount ?? 0) : 0;

  return (
    <FadeIn>
      <div className="relative flex flex-col gap-4 rounded-md border px-6 py-4 text-left hover:bg-accent md:justify-between lg:flex-row lg:items-center">
        {/* Hidden Private Media Tag */}
        {visibility === "private" && (
          <Badge
            className="right absolute -top-3 left-1/2 w-fit -translate-x-1/2 transform"
            variant={"destructive"}
          >
            Private
          </Badge>
        )}

        <div className="flex flex-col gap-4">
          {showDlt ? (
            <RenameButton
              name={label}
              fileKey={fileKey}
              size={size}
              visibility={visibility}
            />
          ) : (
            <p className="truncate">{slugToLabel(label)}</p>
          )}
          <div className="flex gap-4">
            <Badge className="w-fit">{formatBytes(size)}</Badge>
            <CountdownTimer startDate={startDate} />
          </div>
        </div>
        {/* Actions */}
        <div className="flex justify-between gap-2 lg:justify-normal">
          {/* These are the edit / delete buttons which should only be visisble if the showDlt is passed as true */}
          <DownloadButton
            fileKey={fileKey}
            mediaId={mediaId}
            downloadCount={downloadCountNum}
            showDlt={showDlt}
            label={label}
            size={size}
            visibility={visibility}
          />
        </div>
      </div>
    </FadeIn>
  );
}
