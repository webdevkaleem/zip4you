"use client";

import { api } from "@/trpc/react";
import { useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function ChangeVisibilityButton({
  name,
  size,
  fileKey,
  visibility,
}: {
  name: string;
  size: number;
  fileKey: string;
  visibility: "public" | "private";
}) {
  // State management
  const [visibilityState, setVisibilityState] = useState<string>(visibility);

  const router = useRouter();
  const { toast } = useToast();

  const { mutate, isPending, isSuccess, data, reset } =
    api.media.edit.useMutation();

  // Only run the handleUpdate when the current visibility state is different from the new visibility state
  useEffect(() => {
    if (visibilityState !== visibility) {
      mutate({
        key: fileKey,
        name,
        size,
        visibility: visibilityState as "public" | "private",
      });
    }
  }, [fileKey, mutate, name, size, visibility, visibilityState]);

  // On success revalidate the current path
  useEffect(() => {
    if (isSuccess && data.status) {
      // Toast message
      toast({
        title: "Media visibility changed successfully",
      });

      // Reset the state
      reset();
      router.refresh();
    }
  }, [data, isSuccess, reset, router, toast]);

  return (
    <Select
      value={visibilityState}
      onValueChange={setVisibilityState}
      disabled={isPending}
    >
      <SelectTrigger className={"sm:w-32"} disabled={isPending}>
        {isPending && <Loader2 className="w-3 animate-spin" />}
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="public">Public</SelectItem>
        <SelectItem value="private">Private</SelectItem>
      </SelectContent>
    </Select>
  );
}
