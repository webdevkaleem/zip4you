import FadeIn from "@/components/fade-in";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { APP_ID, formatBytes } from "@/lib/utils";
import { ArrowDownToLine } from "lucide-react";
import Link from "next/link";
import DeleteButton from "./delete-button";

export default async function Download({
  fileKey,
  label,
  size,
  showDlt = false,
}: {
  fileKey: string;
  label: string;
  size: number;
  showDlt?: boolean;
}) {
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

          <Button>
            <Link
              href={`https://${APP_ID}.ufs.sh/f/${fileKey}`}
              download
              className="flex items-center gap-2"
            >
              <ArrowDownToLine />
              <div className="md:hidden">Download</div>
            </Link>
          </Button>
        </div>
      </div>
    </FadeIn>
  );
}
