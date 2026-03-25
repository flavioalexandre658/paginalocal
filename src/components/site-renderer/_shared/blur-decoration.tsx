import { cn } from "@/lib/utils";

interface Props {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  color?: "primary" | "secondary" | "accent";
}

const POSITION_CLASSES: Record<NonNullable<Props["position"]>, string> = {
  "top-right": "-top-40 -right-40",
  "top-left": "-top-40 -left-40",
  "bottom-right": "-bottom-40 -right-40",
  "bottom-left": "-bottom-40 -left-40",
};

const COLOR_CLASSES: Record<NonNullable<Props["color"]>, string> = {
  primary: "bg-[--pgl-primary]/10",
  secondary: "bg-[--pgl-secondary]/10",
  accent: "bg-[--pgl-accent]/10",
};

export function BlurDecoration({
  position = "top-right",
  color = "primary",
}: Props) {
  return (
    <div
      className={cn(
        "absolute w-80 h-80 rounded-full blur-3xl pointer-events-none",
        POSITION_CLASSES[position],
        COLOR_CLASSES[color]
      )}
      aria-hidden="true"
    />
  );
}
