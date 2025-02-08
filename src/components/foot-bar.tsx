import { Heart } from "lucide-react";
import Link from "next/link";

export default function FootBar() {
  return (
    <div className="flex w-full flex-col items-center justify-between gap-4 rounded-md bg-foreground px-8 py-4 text-background sm:flex-row sm:gap-0">
      <div className="flex items-center gap-2">
        <span>Made with </span>
        <Heart className="fill-destructive stroke-destructive" />
        <span>
          by{" "}
          <Link
            href={"https://github.com/webdevkaleem"}
            className="underline underline-offset-4 transition-all duration-300 hover:underline-offset-8"
            target="_blank"
          >
            webdevkaleem
          </Link>
        </span>
      </div>
      <p>&copy; 2025 All rights reserved</p>
    </div>
  );
}
