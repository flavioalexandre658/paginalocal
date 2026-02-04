import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export interface StatItem {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down";
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface StatsGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: 2 | 3 | 4;
}

export function StatsGrid({ children, className, columns = 4 }: StatsGridProps) {
  const colsClass = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 lg:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-4", colsClass[columns], className)}>
      {children}
    </div>
  );
}

interface StatCardProps {
  stat: StatItem;
  className?: string;
}

export function StatCard({ stat, className }: StatCardProps) {
  const Icon = stat.icon;
  const TrendIcon = stat.trend === "up" ? IconTrendingUp : IconTrendingDown;

  return (
    <div className={cn("rounded-xl border bg-card p-5 shadow-sm", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {stat.title}
          </p>
          {stat.description && (
            <p className="text-xs text-muted-foreground/70">
              {stat.description}
            </p>
          )}
        </div>
        {Icon && <Icon className="h-5 w-5 text-muted-foreground/50" />}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold">{stat.value}</span>
        {stat.change && stat.trend && (
          <div className="flex items-center gap-0.5">
            <TrendIcon
              className={cn(
                "h-3 w-3",
                stat.trend === "up" ? "text-[#2D9A5D]" : "text-destructive"
              )}
            />
            <span
              className={cn(
                "text-xs font-medium",
                stat.trend === "up" ? "text-[#2D9A5D]" : "text-destructive"
              )}
            >
              {stat.change}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

interface StatsBlocksProps {
  stats: StatItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function StatsBlocks({ stats, columns = 4, className }: StatsBlocksProps) {
  return (
    <StatsGrid columns={columns} className={className}>
      {stats.map((stat) => (
        <StatCard key={stat.title} stat={stat} />
      ))}
    </StatsGrid>
  );
}
