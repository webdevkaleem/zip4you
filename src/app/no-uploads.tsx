import { CopyX } from "lucide-react";

export default function NoUploads() {
  return (
    <div className="flex flex-col gap-6 text-center opacity-50">
      <CopyX className="mx-auto h-16 w-16 stroke-1" />
      <h5>No uploads yet</h5>
    </div>
  );
}
