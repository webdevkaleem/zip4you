"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/trpc/react";
import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DeleteButton({ fileKey }: { fileKey: string }) {
  // Variables
  const { toast } = useToast();
  const router = useRouter();

  // Derived Functions
  const { mutate, isPending, isSuccess } = api.media.remove.useMutation();

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Media deleted successfully",
        variant: "destructive",
      });

      router.refresh();
    }
  }, [isSuccess, router, toast]);

  return (
    <Button
      variant={"destructive"}
      className="flex items-center gap-2"
      onClick={() => {
        mutate({
          key: fileKey,
        });
      }}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="animate-spin" />
      ) : (
        <>
          <Trash2 />
          <div className="md:hidden">Delete</div>
        </>
      )}
    </Button>
  );
}
