"use client";

import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function FilterOptions() {
  // Variables
  const router = useRouter();

  // State management
  const [showDeleted, setShowDeleted] = useState(false);
  const [showPrivate, setShowPrivate] = useState(false);

  useEffect(() => {
    if (showDeleted && showPrivate) {
      return router.push(`/?showDeleted=true&showPrivate=true`);
    } else if (showDeleted) {
      return router.push(`/?showDeleted=true`);
    } else if (showPrivate) {
      return router.push(`/?showPrivate=true`);
    }

    router.push("/");
  }, [router, showDeleted, showPrivate]);

  return (
    <div className="flex gap-6 text-sm">
      <div className="flex items-center gap-4">
        <span>Show Deleted</span>
        <Switch checked={showDeleted} onCheckedChange={setShowDeleted} />
      </div>

      <div className="flex items-center gap-4">
        <span>Show Private</span>
        <Switch checked={showPrivate} onCheckedChange={setShowPrivate} />
      </div>
    </div>
  );
}
