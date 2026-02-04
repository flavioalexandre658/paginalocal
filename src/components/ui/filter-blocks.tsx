"use client"

import * as React from "react"
import { useCallback, useMemo } from "react"
import {
  IconCalendar,
  IconChevronDown,
  IconX,
  IconAdjustments,
  IconSearch,
  IconFilter,
  IconRefresh,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface FilterBarProps {
  children: React.ReactNode
  className?: string
}

export function FilterBar({ children, className }: FilterBarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 p-4 rounded-xl",
        "bg-gradient-to-b from-muted/40 to-card",
        "border border-border/50 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  )
}

interface FilterBarRowProps {
  children: React.ReactNode
  className?: string
}

export function FilterBarRow({ children, className }: FilterBarRowProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row gap-3", className)}>
      {children}
    </div>
  )
}

interface FilterSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function FilterSearch({
  value,
  onChange,
  placeholder = "Buscar...",
  className,
}: FilterSearchProps) {
  return (
    <div className={cn("relative flex-1 max-w-md", className)}>
      <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 bg-card border-border/50"
      />
    </div>
  )
}

interface FilterActionsProps {
  children: React.ReactNode
  className?: string
}

export function FilterActions({ children, className }: FilterActionsProps) {
  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)}>
      {children}
    </div>
  )
}

interface FilterChipProps {
  label: string
  isActive: boolean
  onClick: () => void
  className?: string
}

export function FilterChip({ label, isActive, onClick, className }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border shadow-sm",
        isActive
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-card hover:bg-muted/50 text-foreground border-border/50 hover:border-primary/30",
        className
      )}
    >
      {label}
    </button>
  )
}

interface FilterChipGroupProps {
  children: React.ReactNode
  className?: string
}

export function FilterChipGroup({ children, className }: FilterChipGroupProps) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>{children}</div>
  )
}

interface FilterSelectOption {
  value: string
  label: string
}

interface FilterSelectProps {
  value?: string
  onChange: (value: string | undefined) => void
  options: FilterSelectOption[]
  placeholder?: string
  allLabel?: string
  className?: string
}

export function FilterSelect({
  value,
  onChange,
  options,
  placeholder = "Selecionar",
  allLabel = "Todos",
  className,
}: FilterSelectProps) {
  return (
    <Select
      value={value || "all"}
      onValueChange={(v) => onChange(v === "all" ? undefined : v)}
    >
      <SelectTrigger className={cn("h-9 bg-card border-border/50", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{allLabel}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

interface FilterClearButtonProps {
  onClick: () => void
  className?: string
}

export function FilterClearButton({ onClick, className }: FilterClearButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={cn("gap-2 text-muted-foreground hover:text-destructive", className)}
    >
      <IconX className="size-4" />
      Limpar
    </Button>
  )
}

interface FilterPopoverProps {
  trigger: React.ReactNode
  children: React.ReactNode
  activeCount?: number
  className?: string
}

export function FilterPopover({
  trigger,
  children,
  activeCount = 0,
  className,
}: FilterPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className={cn("gap-2", className)}>
          <IconFilter className="size-4" />
          {trigger}
          {activeCount > 0 && (
            <Badge
              variant="secondary"
              className="h-5 min-w-5 px-1.5 rounded-full text-[10px]"
            >
              {activeCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        {children}
      </PopoverContent>
    </Popover>
  )
}

interface FilterGroupProps {
  label: string
  children: React.ReactNode
  className?: string
}

export function FilterGroup({ label, children, className }: FilterGroupProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium">{label}</Label>
      {children}
    </div>
  )
}

function getDateRangePresets() {
  const today = new Date()
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())

  const last7Days = new Date(startOfToday)
  last7Days.setDate(last7Days.getDate() - 7)

  const last30Days = new Date(startOfToday)
  last30Days.setDate(last30Days.getDate() - 30)

  const last90Days = new Date(startOfToday)
  last90Days.setDate(last90Days.getDate() - 90)

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
  const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0)

  const startOfYear = new Date(today.getFullYear(), 0, 1)

  return [
    { label: "7 dias", startDate: last7Days.toISOString(), endDate: today.toISOString() },
    { label: "30 dias", startDate: last30Days.toISOString(), endDate: today.toISOString() },
    { label: "90 dias", startDate: last90Days.toISOString(), endDate: today.toISOString() },
    { label: "Este mês", startDate: startOfMonth.toISOString(), endDate: today.toISOString() },
    { label: "Mês passado", startDate: startOfLastMonth.toISOString(), endDate: endOfLastMonth.toISOString() },
    { label: "Este ano", startDate: startOfYear.toISOString(), endDate: today.toISOString() },
  ]
}

function formatDateForInput(isoString?: string): string {
  if (!isoString) return ""
  const date = new Date(isoString)
  return date.toISOString().split("T")[0]
}

function formatDateForDisplay(isoString?: string): string {
  if (!isoString) return ""
  const date = new Date(isoString)
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
}

interface DateRangeFilterProps {
  startDate?: string
  endDate?: string
  onDateChange: (startDate?: string, endDate?: string) => void
  label?: string
  className?: string
}

export function DateRangeFilter({
  startDate,
  endDate,
  onDateChange,
  label = "Período",
  className,
}: DateRangeFilterProps) {
  const datePresets = useMemo(() => getDateRangePresets(), [])
  const hasDateFilter = startDate || endDate

  const selectedPreset = useMemo(() => {
    if (!startDate || !endDate) return null
    return datePresets.find((p) => p.startDate === startDate && p.endDate === endDate)
  }, [startDate, endDate, datePresets])

  const isCustomRange = hasDateFilter && !selectedPreset

  const displayText = useMemo(() => {
    if (selectedPreset) return selectedPreset.label
    if (startDate && endDate) {
      return `${formatDateForDisplay(startDate)} - ${formatDateForDisplay(endDate)}`
    }
    if (startDate) return `A partir de ${formatDateForDisplay(startDate)}`
    if (endDate) return `Até ${formatDateForDisplay(endDate)}`
    return label
  }, [startDate, endDate, selectedPreset, label])

  const selectPreset = useCallback(
    (preset: { startDate: string; endDate: string }) => {
      const isSamePreset = startDate === preset.startDate && endDate === preset.endDate
      if (isSamePreset) {
        onDateChange(undefined, undefined)
      } else {
        onDateChange(preset.startDate, preset.endDate)
      }
    },
    [startDate, endDate, onDateChange]
  )

  const handleStartDateChange = useCallback(
    (value: string) => {
      const newDate = value ? new Date(value + "T00:00:00").toISOString() : undefined
      onDateChange(newDate, endDate)
    },
    [endDate, onDateChange]
  )

  const handleEndDateChange = useCallback(
    (value: string) => {
      const newDate = value ? new Date(value + "T23:59:59").toISOString() : undefined
      onDateChange(startDate, newDate)
    },
    [startDate, onDateChange]
  )

  const clearFilter = useCallback(() => {
    onDateChange(undefined, undefined)
  }, [onDateChange])

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="hidden md:flex items-center gap-1.5">
        {datePresets.map((preset) => {
          const isSelected = startDate === preset.startDate && endDate === preset.endDate
          return (
            <Button
              key={preset.label}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => selectPreset(preset)}
              className={cn(
                "h-8 px-3 text-xs cursor-pointer transition-all",
                isSelected
                  ? "shadow-sm"
                  : "border-border/50 hover:border-primary/30 hover:bg-primary/5"
              )}
            >
              {preset.label}
            </Button>
          )
        })}

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={isCustomRange ? "default" : "outline"}
              size="sm"
              className={cn(
                "h-8 px-3 text-xs cursor-pointer gap-1.5",
                isCustomRange
                  ? "shadow-sm"
                  : "border-border/50 hover:border-primary/30 hover:bg-primary/5"
              )}
            >
              <IconAdjustments className="size-3.5" />
              {isCustomRange ? displayText : "Personalizado"}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" sideOffset={8} className="w-80 p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Período personalizado</h4>
                {hasDateFilter && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilter}
                    className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive cursor-pointer"
                  >
                    <IconX className="size-3 mr-1" />
                    Limpar
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Data inicial</Label>
                  <div className="relative">
                    <IconCalendar className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                    <input
                      type="date"
                      value={formatDateForInput(startDate)}
                      onChange={(e) => handleStartDateChange(e.target.value)}
                      className="flex h-9 w-full rounded-md border border-border/50 bg-card pl-9 pr-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Data final</Label>
                  <div className="relative">
                    <IconCalendar className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                    <input
                      type="date"
                      value={formatDateForInput(endDate)}
                      onChange={(e) => handleEndDateChange(e.target.value)}
                      className="flex h-9 w-full rounded-md border border-border/50 bg-card pl-9 pr-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  </div>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {hasDateFilter && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilter}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive cursor-pointer"
          >
            <IconX className="size-4" />
          </Button>
        )}
      </div>

      <div className="md:hidden">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "gap-2 cursor-pointer h-9 border-border/50 shadow-sm",
                hasDateFilter && "bg-primary/5 border-primary/30 text-primary hover:bg-primary/10"
              )}
            >
              <IconCalendar className="size-4" />
              <span>{hasDateFilter ? displayText : label}</span>
              {hasDateFilter ? (
                <Badge
                  variant="secondary"
                  className="size-5 p-0 flex items-center justify-center rounded-full text-[10px] bg-primary text-primary-foreground"
                >
                  ✓
                </Badge>
              ) : (
                <IconChevronDown className="size-3.5 opacity-50" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-80 p-0">
            <div className="p-3 border-b border-border/50 bg-muted/30">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <IconCalendar className="size-4 text-muted-foreground" />
                  Filtrar por período
                </h4>
                {hasDateFilter && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilter}
                    className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive cursor-pointer"
                  >
                    <IconX className="size-3 mr-1" />
                    Limpar
                  </Button>
                )}
              </div>
            </div>

            <div className="p-3 space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {datePresets.map((preset) => {
                  const isSelected = startDate === preset.startDate && endDate === preset.endDate
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => selectPreset(preset)}
                      className={cn(
                        "px-2.5 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer border",
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-card hover:bg-muted/50 text-foreground border-border/50 hover:border-primary/30"
                      )}
                    >
                      {preset.label}
                    </button>
                  )
                })}
              </div>

              <div className="border-t border-border/50 pt-3">
                <p className="text-[11px] text-muted-foreground font-medium mb-2 uppercase tracking-wide">
                  Período personalizado
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Início</Label>
                    <div className="relative">
                      <IconCalendar className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                      <input
                        type="date"
                        value={formatDateForInput(startDate)}
                        onChange={(e) => handleStartDateChange(e.target.value)}
                        className="flex h-9 w-full rounded-md border border-border/50 bg-card pl-9 pr-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Fim</Label>
                    <div className="relative">
                      <IconCalendar className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                      <input
                        type="date"
                        value={formatDateForInput(endDate)}
                        onChange={(e) => handleEndDateChange(e.target.value)}
                        className="flex h-9 w-full rounded-md border border-border/50 bg-card pl-9 pr-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

interface ActiveFiltersProps {
  filters: Array<{
    key: string
    label: string
    value: string
  }>
  onRemove: (key: string) => void
  onClearAll: () => void
  className?: string
}

export function ActiveFilters({
  filters,
  onRemove,
  onClearAll,
  className,
}: ActiveFiltersProps) {
  if (filters.length === 0) return null

  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)}>
      <span className="text-xs text-muted-foreground">Filtros ativos:</span>
      {filters.map((filter) => (
        <Badge
          key={filter.key}
          variant="secondary"
          className="gap-1.5 pr-1 cursor-pointer hover:bg-destructive/10"
          onClick={() => onRemove(filter.key)}
        >
          <span className="text-muted-foreground">{filter.label}:</span>
          <span>{filter.value}</span>
          <IconX className="size-3" />
        </Badge>
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive"
      >
        <IconRefresh className="size-3 mr-1" />
        Limpar todos
      </Button>
    </div>
  )
}

interface FilterToggleProps {
  label: string
  isActive: boolean
  onChange: (active: boolean) => void
  activeLabel?: string
  inactiveLabel?: string
  className?: string
}

export function FilterToggle({
  label,
  isActive,
  onChange,
  activeLabel,
  inactiveLabel,
  className,
}: FilterToggleProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-xs text-muted-foreground">{label}:</span>
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={cn(
            "px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer border shadow-sm",
            isActive === true
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card hover:bg-muted/50 text-foreground border-border/50 hover:border-primary/30"
          )}
        >
          {activeLabel || "Sim"}
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={cn(
            "px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer border shadow-sm",
            isActive === false
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card hover:bg-muted/50 text-foreground border-border/50 hover:border-primary/30"
          )}
        >
          {inactiveLabel || "Não"}
        </button>
      </div>
    </div>
  )
}
