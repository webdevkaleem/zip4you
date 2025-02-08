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
        "relative mx-auto flex min-h-dvh w-full max-w-screen-2xl flex-col justify-between gap-6 px-6 py-4",
        className,
      )}
    >
      {children}
    </main>
  );
}
