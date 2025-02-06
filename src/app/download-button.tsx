"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { APP_ID } from "@/lib/utils";
import { api } from "@/trpc/react";
import { ArrowDownToLine } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function DownloadButton({
  fileKey,
  mediaId,
  downloadCount,
}: {
  fileKey: string;
  mediaId: number;
  downloadCount: number;
}) {
  // State management
  const [count, setCount] = useState(downloadCount);
  const memoCount = useMemo(() => {
    return count;
  }, [count]);
  const { toast } = useToast();

  const { mutate, data, isPending, isSuccess } =
    api.media.download.useMutation();

  // Functions
  function handleDownload() {
    // Update the download count in the database
    mutate({ mediaId: mediaId });

    incrementCount();
  }

  function incrementCount() {
    setCount((cur) => cur + 1);
  }

  function decrementCount() {
    setCount((cur) => cur - 1);
  }

  // Effects
  // If the download is successful but has a false status, show an error toast
  useEffect(() => {
    if (isSuccess && !data?.status && data?.message) {
      decrementCount();

      toast({
        title: "Failed to download",
        description: data.message,
        variant: "destructive",
      });
    }
  }, [isSuccess, data, toast]);

  // If the download is successful and has a true status, increment the count
  useEffect(() => {
    if (isSuccess && data?.status) {
      const link = document.createElement("a");
      link.href = `https://${APP_ID}.ufs.sh/f/${fileKey}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [data?.status, fileKey, isSuccess]);

  return (
    <Button
      className="flex items-center gap-2"
      onClick={handleDownload}
      disabled={isPending}
    >
      <ArrowDownToLine />
      <span>{memoCount}</span>
      <div className="md:hidden">Downloads</div>
    </Button>
  );
}
