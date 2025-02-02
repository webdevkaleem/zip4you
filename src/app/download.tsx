import FadeIn from "@/components/fade-in";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { APP_ID, formatBytes } from "@/lib/utils";
import { ArrowDownToLine } from "lucide-react";
import Link from "next/link";

export default function Download({
  fileKey,
  label,
  size,
}: {
  fileKey: string;
  label: string;
  size: number;
}) {
  return (
    <FadeIn>
      <div className="flex flex-col gap-4 rounded-md border px-6 py-4 text-left hover:bg-accent md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <p>{label}</p>
          <Badge className="w-fit">{formatBytes(size)}</Badge>
        </div>

        {/* Actions */}
        <Button asChild>
          <Link href={`https://${APP_ID}.ufs.sh/f/${fileKey}`} download>
            <ArrowDownToLine />
            <div className="md:hidden">Download</div>
          </Link>
        </Button>
      </div>
    </FadeIn>
  );
}
