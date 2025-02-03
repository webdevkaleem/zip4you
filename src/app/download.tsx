import FadeIn from "@/components/fade-in";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CheckIfAdmin from "@/lib/check-if-admin";
import { APP_ID, formatBytes } from "@/lib/utils";
import { ArrowDownToLine } from "lucide-react";
import Link from "next/link";

export default async function Download({
  fileKey,
  label,
  size,
  toBeDeleted,
  visibility,
  showDeleted,
  showPrivate,
}: {
  fileKey: string;
  label: string;
  size: number;
  toBeDeleted: boolean;
  visibility: "public" | "private";
  showDeleted: string;
  showPrivate: string;
}) {
  const isAdmin = await CheckIfAdmin();

  if (!isAdmin && showDeleted) return;
  if (!isAdmin && showPrivate) return;

  return (
    <FadeIn>
      <div className="relative flex flex-col gap-4 rounded-md border px-6 py-4 text-left hover:bg-accent md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <p>{label}</p>
          <Badge className="w-fit">{formatBytes(size)}</Badge>
        </div>

        {/* Actions */}
        <Button disabled={toBeDeleted}>
          <Link href={`https://${APP_ID}.ufs.sh/f/${fileKey}`} download>
            <ArrowDownToLine />
            <div className="md:hidden">Download</div>
          </Link>
        </Button>

        {/* Fixed Badges */}
        {/* Only show if the user is an admin and has the option to show deleted media */}
        {isAdmin && showDeleted && toBeDeleted && (
          <Badge variant={"destructive"} className="absolute -right-3 -top-3">
            Deleted
          </Badge>
        )}

        {/* Only show if the user is an admin and has the option to show private media */}
        {isAdmin && showPrivate && visibility === "private" && (
          <Badge variant={"destructive"} className="absolute -left-3 -top-3">
            Private
          </Badge>
        )}
      </div>
    </FadeIn>
  );
}
