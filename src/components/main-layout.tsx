import { cn } from "@/lib/utils";

export default function MainLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main
      className={cn(
        "relative mx-auto min-h-screen w-full max-w-screen-2xl px-6 py-4",
        className,
      )}
    >
      {children}
    </main>
  );
}
