"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  const { name, size, resetMedia, show, key } = useMediaStore();

  // Derived Functions
  const {
    mutate: create_mutate,
    isPending: create_isPending,
    data: create_data,
    isSuccess: create_isSuccess,
  } = api.media.create.useMutation();

  const {
    mutate: remove_mutate,
    isPending: remove_isPending,
    data: remove_data,
    isSuccess: remove_isSuccess,
  } = api.media.remove.useMutation();

  function handleDelete() {
    // Delete the file from the server
    if (key.length > 0) {
      remove_mutate({
        key,
      });
    }

    // Delete the file from the client
    resetMedia();
  }

  function handleSave() {
    // Save the file to the server
    if (name.length > 0 && key.length > 0 && size > 0) {
      create_mutate({
        key,
        name,
        size,
      });
    }
  }

  // If saving is successful, show a toast, reset the state and redirect to the home page
  useEffect(() => {
    if (create_isSuccess) {
      toast({
        title: create_data.message,
      });

      resetMedia();
      router.push("/");
    }
  }, [create_isSuccess, create_data, resetMedia, toast, router]);

  // If removed successfully, show a toast and reset the state
  useEffect(() => {
    if (remove_isSuccess) {
      toast({
        title: remove_data.message,
        variant: "destructive",
      });

      resetMedia();
    }
  }, [remove_isSuccess, remove_data, resetMedia, toast]);

  return (
    <motion.div
      className="flex flex-col gap-2 md:mx-auto md:w-2/3"
      initial={{ opacity: 0 }}
      animate={show ? { opacity: 1 } : { opacity: 0 }}
    >
      {/* Row */}
      <div className="flex flex-col gap-4 rounded-md border px-6 py-4 text-sm md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 text-left">
          <p>{name}</p>
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
          <Button onClick={handleSave} disabled={create_isPending}>
            {create_isPending ? <Loader2 className="animate-spin" /> : <Send />}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
