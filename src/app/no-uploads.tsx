import { CopyX } from "lucide-react";

export default function NoUploads() {
  return (
    <div className="mt-20 flex flex-col gap-12 text-center opacity-50">
      <CopyX className="mx-auto h-16 w-16 stroke-1" />
      <h4>No uploads yet</h4>
    </div>
  );
}
