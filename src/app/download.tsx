import FadeIn from "@/components/fade-in";
import { Badge } from "@/components/ui/badge";
import { formatBytes } from "@/lib/utils";
import DeleteButton from "./delete-button";
import DownloadButton from "./download-button";
import { redis } from "@/server/db/redis";

export default async function Download({
  fileKey,
  label,
  size,
  showDlt = false,
  mediaId,
}: {
  fileKey: string;
  label: string;
  size: number;
  showDlt?: boolean;
  mediaId: number;
}) {
  const downloadCount = await redis.get(`media:${mediaId}`);
  const downloadCountNum = downloadCount ? Number(downloadCount ?? 0) : 0;

  return (
    <FadeIn>
      <div className="relative flex flex-col gap-4 rounded-md border px-6 py-4 text-left hover:bg-accent md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <p>{label}</p>
          <Badge className="w-fit">{formatBytes(size)}</Badge>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {showDlt && <DeleteButton fileKey={fileKey} />}
          <DownloadButton
            fileKey={fileKey}
            mediaId={mediaId}
            downloadCount={downloadCountNum}
          />
        </div>
      </div>
    </FadeIn>
  );
}
