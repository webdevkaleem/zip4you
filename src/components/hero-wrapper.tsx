export default function HeroWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex flex-col gap-6 text-center">{children}</div>;
}
