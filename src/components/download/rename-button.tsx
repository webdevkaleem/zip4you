"use client";

import { api } from "@/trpc/react";
import { useEffect, useState } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Edit, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { slugToLabel } from "@/lib/utils";

export default function RenameButton({
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
  const [text, setText] = useState<string>(slugToLabel(name));
  const [model, setModel] = useState<boolean>(false);

  const router = useRouter();

  const { mutate, isPending, isSuccess, data, reset } =
    api.media.edit.useMutation();

  function handleDiscard() {
    reset();
  }

  function handleSave() {
    if (text !== name) {
      mutate({
        key: fileKey,
        name: text,
        size,
        visibility,
      });
    }
  }

  // Only run the handleUpdate when the current visibility state is different from the new visibility state
  useEffect(() => {
    if (isSuccess && data.status) {
      setModel(false);
      reset();
      router.refresh();
    }
  }, [data, isSuccess, router, reset]);

  return (
    <Dialog open={model} onOpenChange={setModel}>
      <DialogTrigger asChild disabled={isPending}>
        <div className="flex cursor-pointer items-center gap-4">
          <p className="truncate lg:max-w-64">{name}</p>
          <Edit className="w-4" />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rename Media</DialogTitle>
          <DialogDescription>
            Kindly rename the file to something more meaningful.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isPending}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="destructive"
              disabled={isPending}
              onClick={handleDiscard}
            >
              Close
            </Button>
          </DialogClose>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending && <Loader2 className="w-3 animate-spin" />}
            <span>Save</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
