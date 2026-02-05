"use client"

import * as React from "react"
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconSearch,
} from "@tabler/icons-react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  type Table as TanstackTable,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface DataTableRootProps {
  children: React.ReactNode
  className?: string
}

export function DataTableRoot({ children, className }: DataTableRootProps) {
  return (
    <div className={cn("w-full space-y-4", className)}>
      {children}
    </div>
  )
}

interface DataTableToolbarProps {
  children: React.ReactNode
  className?: string
}

export function DataTableToolbar({ children, className }: DataTableToolbarProps) {
  return (
    <div className={cn(
      "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 rounded-2xl",
      "border border-slate-200/40 bg-white/70 shadow-xl shadow-slate-200/50 backdrop-blur-xl",
      "dark:border-slate-700/40 dark:bg-slate-900/70 dark:shadow-slate-900/50",
      className
    )}>
      {children}
    </div>
  )
}

interface DataTableSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function DataTableSearch({ value, onChange, placeholder = "Buscar...", className }: DataTableSearchProps) {
  return (
    <div className={cn("relative w-full sm:max-w-xs", className)}>
      <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
      <Input
        placeholder={placeholder}
        value={value ?? ""}
        onChange={(event) => onChange(String(event.target.value))}
        className="pl-9 bg-white/50 border-slate-200/60 shadow-sm dark:bg-slate-800/50 dark:border-slate-700/60"
      />
    </div>
  )
}

interface DataTableActionsProps {
  children: React.ReactNode
  className?: string
}

export function DataTableActions({ children, className }: DataTableActionsProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {children}
    </div>
  )
}

interface DataTableContentProps {
  children: React.ReactNode
  className?: string
  stickyLastColumn?: boolean
}

export function DataTableContent({ children, className, stickyLastColumn }: DataTableContentProps) {
  return (
    <div className={cn(
      "rounded-2xl border border-slate-200/40 bg-white/70 shadow-xl shadow-slate-200/50 backdrop-blur-xl overflow-hidden",
      "dark:border-slate-700/40 dark:bg-slate-900/70 dark:shadow-slate-900/50",
      className
    )}>
      <div className={cn(
        "overflow-x-auto",
        stickyLastColumn && "relative"
      )}>
        {children}
      </div>
    </div>
  )
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  stickyLastColumn?: boolean
  emptyState?: React.ReactNode
  onRowClick?: (row: TData) => void
}

export function DataTableTable<TData, TValue>({
  columns,
  data,
  stickyLastColumn,
  emptyState,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState("")

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  })

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="hover:bg-transparent bg-slate-50/50 border-b border-slate-200/60 dark:bg-slate-800/30 dark:border-slate-700/60">
            {headerGroup.headers.map((header, index) => {
              const isLast = index === headerGroup.headers.length - 1
              return (
                <TableHead
                  key={header.id}
                  className={cn(
                    "h-12 text-xs font-semibold text-slate-500 dark:text-slate-400",
                    stickyLastColumn && isLast && "sticky right-0 bg-slate-50/80 dark:bg-slate-800/80 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)]"
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              )
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
              className={cn(
                "hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors border-b border-slate-200/40 dark:border-slate-700/40",
                onRowClick && "cursor-pointer"
              )}
              onClick={() => onRowClick?.(row.original)}
            >
              {row.getVisibleCells().map((cell, index) => {
                const isLast = index === row.getVisibleCells().length - 1
                return (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      "py-4",
                      stickyLastColumn && isLast && "sticky right-0 bg-white/80 dark:bg-slate-900/80 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)]"
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                )
              })}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-32 text-center">
              {emptyState || (
                <p className="text-slate-500 dark:text-slate-400">Nenhum resultado encontrado</p>
              )}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

interface DataTableHeaderCellProps {
  children: React.ReactNode
  className?: string
  sticky?: boolean
}

export function DataTableHeaderCell({ children, className, sticky }: DataTableHeaderCellProps) {
  return (
    <TableHead
      className={cn(
        "h-12 text-xs font-semibold text-slate-500 dark:text-slate-400",
        sticky && "sticky right-0 bg-slate-50/80 dark:bg-slate-800/80 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)]",
        className
      )}
    >
      {children}
    </TableHead>
  )
}

interface DataTableCellProps {
  children: React.ReactNode
  className?: string
  sticky?: boolean
}

export function DataTableCell({ children, className, sticky }: DataTableCellProps) {
  return (
    <TableCell
      className={cn(
        "py-4",
        sticky && "sticky right-0 bg-white/80 dark:bg-slate-900/80 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)]",
        className
      )}
    >
      {children}
    </TableCell>
  )
}

interface DataTablePaginationProps<TData> {
  table: TanstackTable<TData>
  showSelection?: boolean
  showPageSize?: boolean
  className?: string
}

export function DataTablePagination<TData>({
  table,
  showSelection = false,
  showPageSize = true,
  className
}: DataTablePaginationProps<TData>) {
  return (
    <div className={cn(
      "flex items-center justify-between p-4 rounded-2xl",
      "border border-slate-200/40 bg-white/70 shadow-xl shadow-slate-200/50 backdrop-blur-xl",
      "dark:border-slate-700/40 dark:bg-slate-900/70 dark:shadow-slate-900/50",
      className
    )}>
      {showSelection ? (
        <div className="hidden sm:block">
          <Label className="text-sm text-slate-500 dark:text-slate-400">
            {table.getFilteredSelectedRowModel().rows.length} de{" "}
            {table.getFilteredRowModel().rows.length} selecionado(s)
          </Label>
        </div>
      ) : (
        <div />
      )}
      <div className="flex items-center gap-4 ml-auto">
        {showPageSize && (
          <div className="hidden sm:flex items-center gap-2">
            <Label className="text-sm text-slate-500 dark:text-slate-400">Por página</Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger className="h-8 w-[70px] bg-white/50 border-slate-200/60 dark:bg-slate-800/50 dark:border-slate-700/60">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 50, 100].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">Página</span>
          <span className="font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
            {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="icon"
            className="hidden h-8 w-8 cursor-pointer border-slate-200/60 shadow-sm lg:flex dark:border-slate-700/60"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <IconChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 cursor-pointer border-slate-200/60 shadow-sm dark:border-slate-700/60"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <IconChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 cursor-pointer border-slate-200/60 shadow-sm dark:border-slate-700/60"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <IconChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hidden h-8 w-8 cursor-pointer border-slate-200/60 shadow-sm lg:flex dark:border-slate-700/60"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <IconChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

interface ServerPaginationProps {
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  showPageSize?: boolean
  className?: string
}

export function ServerPagination({
  page,
  pageSize,
  totalCount,
  totalPages,
  onPageChange,
  onPageSizeChange,
  showPageSize = true,
  className
}: ServerPaginationProps) {
  const canPreviousPage = page > 1
  const canNextPage = page < totalPages

  return (
    <div className={cn(
      "flex items-center justify-between p-4 rounded-2xl",
      "border border-slate-200/40 bg-white/70 shadow-xl shadow-slate-200/50 backdrop-blur-xl",
      "dark:border-slate-700/40 dark:bg-slate-900/70 dark:shadow-slate-900/50",
      className
    )}>
      <div className="hidden sm:block">
        <Label className="text-sm text-slate-500 dark:text-slate-400">
          {totalCount.toLocaleString('pt-BR')} registro(s)
        </Label>
      </div>
      <div className="flex items-center gap-4 ml-auto">
        {showPageSize && (
          <div className="hidden sm:flex items-center gap-2">
            <Label className="text-sm text-slate-500 dark:text-slate-400">Por página</Label>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              <SelectTrigger className="h-8 w-[70px] bg-white/50 border-slate-200/60 dark:bg-slate-800/50 dark:border-slate-700/60">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 50, 100].map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">Página</span>
          <span className="font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
            {page} de {totalPages || 1}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="icon"
            className="hidden h-8 w-8 cursor-pointer border-slate-200/60 shadow-sm lg:flex dark:border-slate-700/60"
            onClick={() => onPageChange(1)}
            disabled={!canPreviousPage}
          >
            <IconChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 cursor-pointer border-slate-200/60 shadow-sm dark:border-slate-700/60"
            onClick={() => onPageChange(page - 1)}
            disabled={!canPreviousPage}
          >
            <IconChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 cursor-pointer border-slate-200/60 shadow-sm dark:border-slate-700/60"
            onClick={() => onPageChange(page + 1)}
            disabled={!canNextPage}
          >
            <IconChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hidden h-8 w-8 cursor-pointer border-slate-200/60 shadow-sm lg:flex dark:border-slate-700/60"
            onClick={() => onPageChange(totalPages)}
            disabled={!canNextPage}
          >
            <IconChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

interface DataTableSkeletonProps {
  columns?: number
  rows?: number
  showToolbar?: boolean
  className?: string
}

export function DataTableSkeleton({
  columns = 5,
  rows = 5,
  showToolbar = true,
  className
}: DataTableSkeletonProps) {
  return (
    <div className={cn("w-full space-y-4", className)}>
      {showToolbar && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 rounded-2xl border border-slate-200/40 bg-white/70 dark:border-slate-700/40 dark:bg-slate-900/70">
          <Skeleton className="h-10 w-full sm:max-w-xs" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      )}
      <div className="rounded-2xl border border-slate-200/40 bg-white/70 overflow-hidden dark:border-slate-700/40 dark:bg-slate-900/70">
        <div className="bg-slate-50/50 dark:bg-slate-800/30 p-3 border-b border-slate-200/60 dark:border-slate-700/60">
          <div className="flex gap-4">
            {Array.from({ length: columns }).map((_, i) => (
              <Skeleton key={i} className="h-4 flex-1" />
            ))}
          </div>
        </div>
        <div className="divide-y divide-slate-200/40 dark:divide-slate-700/40">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="p-4">
              <div className="flex gap-4 items-center">
                {Array.from({ length: columns }).map((_, j) => (
                  <Skeleton key={j} className="h-6 flex-1" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface DataTableEmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function DataTableEmptyState({
  icon,
  title,
  description,
  action,
  className
}: DataTableEmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 py-12", className)}>
      {icon && (
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
          {icon}
        </div>
      )}
      <div className="text-center">
        <p className="font-medium text-slate-700 dark:text-slate-200">{title}</p>
        {description && (
          <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>
        )}
      </div>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

interface DataTableRowActionsProps {
  children: React.ReactNode
  className?: string
  vertical?: boolean
}

export function DataTableRowActions({ children, className, vertical = true }: DataTableRowActionsProps) {
  return (
    <div className={cn(
      "flex items-center gap-1",
      vertical ? "flex-col" : "flex-row justify-end",
      className
    )}>
      {children}
    </div>
  )
}

interface MobileCardListProps {
  children: React.ReactNode
  className?: string
}

export function MobileCardList({ children, className }: MobileCardListProps) {
  return (
    <div className={cn("lg:hidden space-y-3", className)}>
      {children}
    </div>
  )
}

interface MobileCardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function MobileCard({ children, className, onClick }: MobileCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/40 bg-white/70 shadow-xl shadow-slate-200/50 backdrop-blur-xl overflow-hidden",
        "dark:border-slate-700/40 dark:bg-slate-900/70 dark:shadow-slate-900/50",
        onClick && "cursor-pointer hover:border-primary/30 transition-colors",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

interface MobileCardHeaderProps {
  children: React.ReactNode
  className?: string
  actions?: React.ReactNode
}

export function MobileCardHeader({ children, className, actions }: MobileCardHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-3 p-4 pb-0", className)}>
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {children}
      </div>
      {actions && (
        <div className="flex items-center gap-1 shrink-0">
          {actions}
        </div>
      )}
    </div>
  )
}

interface MobileCardAvatarProps {
  initials: string
  color?: string
  className?: string
  statusColor?: string
}

export function MobileCardAvatar({ initials, color, className, statusColor }: MobileCardAvatarProps) {
  return (
    <div className="relative shrink-0">
      <div
        className={cn(
          "size-10 rounded-full flex items-center justify-center text-white font-semibold text-sm",
          color || "bg-primary",
          className
        )}
      >
        {initials}
      </div>
      {statusColor && (
        <div
          className={cn(
            "absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-white dark:border-slate-900",
            statusColor
          )}
        />
      )}
    </div>
  )
}

interface MobileCardTitleProps {
  title: React.ReactNode
  subtitle?: string | React.ReactNode
  badge?: React.ReactNode
  className?: string
}

export function MobileCardTitle({ title, subtitle, badge, className }: MobileCardTitleProps) {
  return (
    <div className={cn("min-w-0 flex-1", className)}>
      <div className="flex items-center gap-2 flex-wrap">
        <p className="font-medium text-sm truncate text-slate-900 dark:text-white">{title}</p>
        {badge}
      </div>
      {subtitle && (
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{subtitle}</p>
      )}
    </div>
  )
}

interface MobileCardContentProps {
  children: React.ReactNode
  className?: string
}

export function MobileCardContent({ children, className }: MobileCardContentProps) {
  return (
    <div className={cn("p-4 space-y-3", className)}>
      {children}
    </div>
  )
}

interface MobileCardRowProps {
  icon?: React.ReactNode
  label: string
  value?: React.ReactNode
  className?: string
}

export function MobileCardRow({ icon, label, value, className }: MobileCardRowProps) {
  return (
    <div className={cn("flex items-center justify-between gap-2 text-sm", className)}>
      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 min-w-0">
        {icon}
        <span className="truncate">{label}</span>
      </div>
      {value && (
        <span className="font-medium shrink-0 text-slate-700 dark:text-slate-200">{value}</span>
      )}
    </div>
  )
}

interface MobileCardGridProps {
  children: React.ReactNode
  columns?: 2 | 3
  className?: string
}

export function MobileCardGrid({ children, columns = 2, className }: MobileCardGridProps) {
  return (
    <div className={cn(
      "grid gap-2 text-sm",
      columns === 2 ? "grid-cols-2" : "grid-cols-3",
      className
    )}>
      {children}
    </div>
  )
}

interface MobileCardFooterProps {
  children: React.ReactNode
  className?: string
}

export function MobileCardFooter({ children, className }: MobileCardFooterProps) {
  return (
    <div className={cn(
      "flex items-center justify-between gap-3 px-4 py-3 border-t border-slate-200/40 bg-slate-50/50",
      "dark:border-slate-700/40 dark:bg-slate-800/30",
      className
    )}>
      {children}
    </div>
  )
}

interface MobileCardEmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  className?: string
}

export function MobileCardEmptyState({ icon, title, description, className }: MobileCardEmptyStateProps) {
  return (
    <div className={cn("lg:hidden", className)}>
      <div className="rounded-2xl border border-slate-200/40 bg-white/70 p-8 dark:border-slate-700/40 dark:bg-slate-900/70">
        <div className="flex flex-col items-center gap-3 text-center">
          {icon && (
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
              {icon}
            </div>
          )}
          <div>
            <p className="font-medium text-slate-700 dark:text-slate-200">{title}</p>
            {description && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  type TanstackTable,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
}
