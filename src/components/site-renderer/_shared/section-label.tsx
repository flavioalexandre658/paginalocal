import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function SectionLabel({ children, className }: Props) {
  return (
    <p
      className={cn(
        "text-xs font-medium uppercase tracking-wider text-[--pgl-accent] mb-3",
        className
      )}
    >
      {children}
    </p>
  );
}
