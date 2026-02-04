import * as React from "react";
import { IconInfoCircle } from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ColorVariant = "primary" | "emerald" | "blue" | "purple" | "amber" | "red" | "muted";

const colorVariants: Record<ColorVariant, { gradient: string; text: string; icon: string }> = {
  primary: {
    gradient: "bg-linear-to-br from-primary/5 to-primary/10",
    text: "text-primary",
    icon: "text-primary",
  },
  emerald: {
    gradient: "bg-linear-to-br from-[#2D9A5D]/5 to-[#2D9A5D]/10",
    text: "text-[#2D9A5D]",
    icon: "text-[#2D9A5D]",
  },
  blue: {
    gradient: "bg-linear-to-br from-[#4E55D9]/5 to-[#4E55D9]/10",
    text: "text-[#4E55D9]",
    icon: "text-[#4E55D9]",
  },
  purple: {
    gradient: "bg-linear-to-br from-[#8491D9]/5 to-[#8491D9]/10",
    text: "text-[#8491D9]",
    icon: "text-[#8491D9]",
  },
  amber: {
    gradient: "bg-linear-to-br from-amber-500/5 to-amber-500/10",
    text: "text-amber-600",
    icon: "text-amber-600",
  },
  red: {
    gradient: "bg-linear-to-br from-red-500/5 to-red-500/10",
    text: "text-red-600",
    icon: "text-red-600",
  },
  muted: {
    gradient: "bg-muted/30",
    text: "text-foreground",
    icon: "text-muted-foreground",
  },
};

interface StatsCardsGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

function StatsCardsGrid({ children, columns = 4, className }: StatsCardsGridProps) {
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-3 mb-6", gridCols[columns], className)}>
      {children}
    </div>
  );
}

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  tooltip?: string;
  color?: ColorVariant;
  highlight?: boolean;
  className?: string;
}

function StatsCard({
  icon,
  title,
  value,
  subtitle,
  tooltip,
  color = "muted",
  highlight = false,
  className,
}: StatsCardProps) {
  const variant = colorVariants[color];

  return (
    <div
      className={cn(
        "rounded-xl border p-4 relative overflow-hidden",
        variant.gradient,
        className
      )}
    >
      {highlight && (
        <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-6 -mt-6" />
      )}
      <div className={cn("flex items-center gap-2 mb-1", variant.text)}>
        <span className={cn("size-4 [&>svg]:size-4", variant.icon)}>{icon}</span>
        <span className="text-xs font-medium uppercase tracking-wide">{title}</span>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <IconInfoCircle className="size-3.5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-[250px]">
                <p className="text-xs">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <p className={cn("text-2xl font-bold", highlight || color !== "muted" ? variant.text : "")}>
        {value}
      </p>
      {subtitle && (
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      )}
    </div>
  );
}

interface StatsCardCompactProps {
  children: React.ReactNode;
  className?: string;
}

function StatsCardCompact({ children, className }: StatsCardCompactProps) {
  return (
    <div className={cn("rounded-xl border bg-muted/30 p-4 space-y-3", className)}>
      {children}
    </div>
  );
}

interface StatsCardCompactRowProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  color?: "emerald" | "red" | "blue" | "purple" | "amber" | "muted";
}

function StatsCardCompactRow({ icon, label, value, color = "muted" }: StatsCardCompactRowProps) {
  const textColors = {
    emerald: "text-[#2D9A5D]",
    red: "text-red-600",
    blue: "text-[#4E55D9]",
    purple: "text-[#8491D9]",
    amber: "text-amber-600",
    muted: "text-foreground",
  };

  return (
    <div className="flex items-center justify-between">
      <div className={cn("flex items-center gap-2", textColors[color])}>
        <span className="size-4 [&>svg]:size-4">{icon}</span>
        <span className="text-xs font-medium">{label}</span>
      </div>
      <span className={cn("font-semibold", textColors[color])}>{value}</span>
    </div>
  );
}

interface StatsCardSkeletonProps {
  count?: number;
  columns?: 2 | 3 | 4;
}

function StatsCardSkeleton({ count = 4, columns = 4 }: StatsCardSkeletonProps) {
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-3 mb-6", gridCols[columns])}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="rounded-xl border p-4">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-3 w-20 mt-2" />
        </div>
      ))}
    </div>
  );
}

export {
  StatsCardsGrid,
  StatsCard,
  StatsCardCompact,
  StatsCardCompactRow,
  StatsCardSkeleton,
  type ColorVariant,
};
