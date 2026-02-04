import { IconTrendingUp, IconTrendingDown, IconInfoCircle } from "@tabler/icons-react"
import { Card, CardHeader, CardFooter, CardDescription, CardTitle, CardAction } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface CardBlocksProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function CardBlocks({ children, className, onClick }: CardBlocksProps) {
  return (
    <Card
      className={cn(
        "from-primary/5 to-card bg-gradient-to-t shadow-xs dark:bg-card",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </Card>
  )
}

interface CardBlocksHeaderProps {
  children: React.ReactNode
  className?: string
}

export function CardBlocksHeader({ children, className }: CardBlocksHeaderProps) {
  return <CardHeader className={className}>{children}</CardHeader>
}

interface CardBlocksTitleProps {
  children: React.ReactNode
  className?: string
}

export function CardBlocksTitle({ children, className }: CardBlocksTitleProps) {
  return (
    <CardDescription className={className}>
      {children}
    </CardDescription>
  )
}

interface CardBlocksTitleWithInfoProps {
  children: React.ReactNode
  tooltip: string
  className?: string
}

export function CardBlocksTitleWithInfo({ children, tooltip, className }: CardBlocksTitleWithInfoProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <CardDescription>{children}</CardDescription>
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button" className="text-muted-foreground/50 hover:text-muted-foreground transition-colors">
              <IconInfoCircle className="size-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[280px] text-xs font-normal">
            {tooltip}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

interface CardBlocksValueProps {
  children: React.ReactNode
  className?: string
}

export function CardBlocksValue({ children, className }: CardBlocksValueProps) {
  return (
    <CardTitle className={cn("text-2xl font-semibold tabular-nums @[250px]/card:text-3xl", className)}>
      {children}
    </CardTitle>
  )
}

interface CardBlocksTrendProps {
  value: string | number
  trend: "up" | "down"
  className?: string
}

export function CardBlocksTrend({ value, trend, className }: CardBlocksTrendProps) {
  const TrendIcon = trend === "up" ? IconTrendingUp : IconTrendingDown

  return (
    <CardAction className={className}>
      <Badge
        variant="outline"
        className={cn(
          "gap-1",
          trend === "up"
            ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/20 dark:text-green-400"
            : "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-400"
        )}
      >
        <TrendIcon className="h-3.5 w-3.5" />
        {value}
      </Badge>
    </CardAction>
  )
}

interface CardBlocksFooterProps {
  children: React.ReactNode
  className?: string
}

export function CardBlocksFooter({ children, className }: CardBlocksFooterProps) {
  return (
    <CardFooter className={cn("flex-col items-start gap-1.5 text-sm", className)}>
      {children}
    </CardFooter>
  )
}

interface CardBlocksFooterTextProps {
  children: React.ReactNode
  className?: string
  icon?: React.ReactNode
}

export function CardBlocksFooterText({ children, className, icon }: CardBlocksFooterTextProps) {
  return (
    <div className={cn("line-clamp-1 flex items-center gap-2 font-medium", className)}>
      {children}
      {icon}
    </div>
  )
}

interface CardBlocksFooterSubtextProps {
  children: React.ReactNode
  className?: string
}

export function CardBlocksFooterSubtext({ children, className }: CardBlocksFooterSubtextProps) {
  return (
    <div className={cn("text-muted-foreground", className)}>
      {children}
    </div>
  )
}

interface CardBlocksIconProps {
  icon: React.ElementType
  className?: string
}

export function CardBlocksIcon({ icon: Icon, className }: CardBlocksIconProps) {
  return <Icon className={cn("text-muted-foreground size-6", className)} />
}

interface MetricCardProps {
  title: string
  titleTooltip?: string
  value: string | number
  trend?: {
    value: string | number
    direction: "up" | "down"
  }
  footer?: string
  subfooter?: string
  icon?: React.ElementType
  onClick?: () => void
  className?: string
}

export function MetricCard({
  title,
  titleTooltip,
  value,
  trend,
  footer,
  subfooter,
  icon: Icon,
  onClick,
  className,
}: MetricCardProps) {
  const TrendIcon = trend?.direction === "up" ? IconTrendingUp : IconTrendingDown

  return (
    <CardBlocks onClick={onClick} className={className}>
      <CardBlocksHeader>
        {titleTooltip ? (
          <CardBlocksTitleWithInfo tooltip={titleTooltip}>{title}</CardBlocksTitleWithInfo>
        ) : (
          <CardBlocksTitle>{title}</CardBlocksTitle>
        )}
        <CardBlocksValue>{value}</CardBlocksValue>
        {trend && (
          <CardBlocksTrend value={trend.value} trend={trend.direction} />
        )}
      </CardBlocksHeader>
      {(footer || subfooter) && (
        <CardBlocksFooter>
          {footer && (
            <CardBlocksFooterText icon={TrendIcon && <TrendIcon className="size-4" />}>
              {footer}
            </CardBlocksFooterText>
          )}
          {subfooter && (
            <CardBlocksFooterSubtext>{subfooter}</CardBlocksFooterSubtext>
          )}
        </CardBlocksFooter>
      )}
    </CardBlocks>
  )
}

interface StatCardProps {
  title: string
  titleTooltip?: string
  value: string | number
  subtitle?: string
  trend?: {
    value: number
    positive: boolean
  }
  icon?: React.ElementType
  onClick?: () => void
  className?: string
}

export function StatCard({
  title,
  titleTooltip,
  value,
  subtitle,
  trend,
  icon: Icon,
  onClick,
  className,
}: StatCardProps) {
  return (
    <CardBlocks onClick={onClick} className={className}>
      <CardBlocksHeader>
        <div className="flex items-center justify-between">
          {Icon && <CardBlocksIcon icon={Icon} />}
          {trend && (
            <Badge
              variant="outline"
              className={cn(
                "gap-1",
                trend.positive
                  ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/20 dark:text-green-400"
                  : "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-400"
              )}
            >
              {trend.positive ? (
                <IconTrendingUp className="size-3" />
              ) : (
                <IconTrendingDown className="size-3" />
              )}
              {trend.positive ? "+" : ""}
              {trend.value.toFixed(1)}%
            </Badge>
          )}
        </div>
        <div className="space-y-1 pt-3">
          {titleTooltip ? (
            <CardBlocksTitleWithInfo tooltip={titleTooltip}>{title}</CardBlocksTitleWithInfo>
          ) : (
            <CardBlocksTitle>{title}</CardBlocksTitle>
          )}
          <CardBlocksValue>{value}</CardBlocksValue>
          {subtitle && (
            <CardBlocksFooterSubtext className="flex items-center gap-1">
              {subtitle}
            </CardBlocksFooterSubtext>
          )}
        </div>
      </CardBlocksHeader>
    </CardBlocks>
  )
}

