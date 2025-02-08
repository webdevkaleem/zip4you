import { LoaderCircle } from "lucide-react";

export default function Loader() {
  return (
    <div className="absolute left-0 top-0 flex h-full w-full animate-pulse items-center justify-center">
      <LoaderCircle className="animate-spin" />
    </div>
  );
}
