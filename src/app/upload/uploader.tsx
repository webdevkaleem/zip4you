"use client";

import { useToast } from "@/hooks/use-toast";
import { UploadDropzone } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { useMediaStore } from "@/stores/media";
import { api } from "@/trpc/react";
import { createId } from "@paralleldrive/cuid2";
import JSZip from "jszip";
import { useEffect } from "react";

export default function Uploader() {
  // Variables
  const { toast } = useToast();

  // State management
  const { setName, setSize, setKey, setShow, resetMedia } = useMediaStore();

  // Derived Functions
  const { mutate: create_mutate } = api.media.create.useMutation();

  // Reset the state on mount
  useEffect(() => {
    resetMedia();
  }, [resetMedia]);

  // JSX
  return (
    <UploadDropzone
      className="border-solid ut-label:text-primary md:mx-auto md:w-2/3"
      appearance={{
        button:
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2",
      }}
      endpoint="multiFileUploader"
      onBeforeUploadBegin={async (files) => {
        // Make a zip of the files and return the zip file to be uploaded on the server
        const zip = new JSZip();

        files.forEach((file) => {
          zip.file(`${file.name}`, file);
        });

        const zipContent = await zip.generateAsync({ type: "blob" });
        const zipName = `${createId()}`;

        // Create a File object from the blob and wrap it in an array
        const zipFile = new File([zipContent], `${zipName}.zip`, {
          type: "application/zip",
        });

        // Set the state
        setSize(zipContent.size);
        setName(zipName);

        // Return an array of File objects
        return [zipFile];
      }}
      onClientUploadComplete={(res) => {
        if (!res[0]) return;

        const responseFirst = res[0];

        // Set the key into state and show the file
        setKey(responseFirst.key);
        setShow(true);

        // Save the file on the document database as well
        create_mutate({
          key: responseFirst.key,
          name: responseFirst.name,
          size: responseFirst.size,
        });
      }}
      onUploadError={(error: Error) => {
        // Do something with the error.
        alert(`ERROR! ${error.message}`);
        toast({
          title: error.message,
          variant: "destructive",
        });
      }}
      config={{ cn }}
      onUploadAborted={() => {
        // Reset the state
        resetMedia();
      }}
    />
  );
}
