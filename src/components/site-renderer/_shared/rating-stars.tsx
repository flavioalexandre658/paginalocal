import { cn } from "@/lib/utils";

interface Props {
  rating: number;
  size?: "sm" | "md";
  className?: string;
}

export function RatingStars({ rating, size = "md", className }: Props) {
  const clampedRating = Math.min(5, Math.max(1, Math.round(rating)));

  return (
    <div
      className={cn(
        "flex items-center gap-0.5",
        size === "sm" ? "text-sm" : "text-base",
        className
      )}
      aria-label={`${clampedRating} de 5 estrelas`}
      role="img"
    >
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i < clampedRating;
        return (
          <svg
            key={i}
            viewBox="0 0 24 24"
            className={cn(
              size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4",
              filled ? "text-amber-400" : "text-muted-foreground/30"
            )}
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        );
      })}
    </div>
  );
}
