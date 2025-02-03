"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { formatBytes } from "@/lib/utils";
import { useMediaStore } from "@/stores/media";
import { api } from "@/trpc/react";
import { Loader2, Send, Trash2 } from "lucide-react";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Stats() {
  // Variables
  const { toast } = useToast();
  const router = useRouter();

  // State management
  const { name, size, resetMedia, show, key, setName, setVisibility } =
    useMediaStore();

  // Derived Functions
  const {
    mutate: edit_mutate,
    isPending: edit_isPending,
    data: edit_data,
    isSuccess: edit_isSuccess,
  } = api.media.edit.useMutation();

  const { mutate: remove_mutate, isPending: remove_isPending } =
    api.media.remove.useMutation();

  function handleDelete() {
    // Delete the file from the server
    if (key.length > 0) {
      remove_mutate({
        key,
      });
    }

    // Delete the file from the client
    resetMedia();

    toast({
      title: "Media deleted successfully",
      variant: "destructive",
    });
  }

  function handleSave() {
    // Save the file to the server
    setVisibility("public");

    if (name.length > 0 && key.length > 0 && size > 0) {
      edit_mutate({
        key,
        name,
        size,
        visibility: "public",
      });
    }
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value.trim());
  }

  // If saving is successful, show a toast, reset the state and redirect to the home page
  useEffect(() => {
    if (edit_isSuccess) {
      toast({
        title: edit_data.message,
      });

      resetMedia();
      router.push("/");
    }
  }, [edit_isSuccess, edit_data, resetMedia, toast, router]);

  return (
    <motion.div
      className="flex flex-col gap-2 md:mx-auto md:w-2/3"
      initial={{ opacity: 0 }}
      animate={show ? { opacity: 1 } : { opacity: 0 }}
    >
      {/* Row */}
      <div className="flex flex-col gap-4 rounded-md border px-6 py-4 text-sm md:flex-row md:justify-between">
        <div className="flex w-full flex-col gap-2 text-left">
          <Input
            placeholder={name}
            className="w-full"
            onChange={handleNameChange}
          />
          <Badge className="w-fit">{formatBytes(size)}</Badge>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant={"destructive"} onClick={handleDelete}>
            {remove_isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Trash2 />
            )}
          </Button>
          <Button onClick={handleSave} disabled={edit_isPending}>
            {edit_isPending ? <Loader2 className="animate-spin" /> : <Send />}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
