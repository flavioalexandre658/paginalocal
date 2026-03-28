"use client"

import * as React from "react"
import { PatternFormat, type PatternFormatProps } from "react-number-format"
import { cn } from "@/lib/utils"

// ═══════════════════════════════════════════════
// PglField — compound form field
// ═══════════════════════════════════════════════

const PglField = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => <div className={cn("flex flex-col gap-1.5", className)}>{children}</div>
PglField.displayName = "PglField"

// ─── Label ────────────────────────────────────────────────────────

const PglFieldLabel = ({
  children,
  className,
  htmlFor,
}: {
  children: React.ReactNode
  className?: string
  htmlFor?: string
}) => (
  <label
    htmlFor={htmlFor}
    className={cn("text-sm font-medium text-black/55", className)}
  >
    {children}
  </label>
)
PglFieldLabel.displayName = "PglFieldLabel"

// ─── Input ────────────────────────────────────────────────────────

const PglFieldInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full rounded-2xl px-4 py-2.5 text-sm font-medium text-black/80 outline-none",
      "ring-1 ring-black/10 transition-all duration-150",
      "placeholder:text-black/30",
      "hover:ring-black/30",
      "focus:ring-black/30",
      "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-black/[0.02]",
      className,
    )}
    {...props}
  />
))
PglFieldInput.displayName = "PglFieldInput"

// ─── Textarea ─────────────────────────────────────────────────────

const PglFieldTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full resize-none rounded-2xl px-4 py-2.5 text-sm font-medium text-black/80 outline-none",
      "ring-1 ring-black/10 transition-all duration-150",
      "placeholder:text-black/30",
      "hover:ring-black/30",
      "focus:ring-black/30",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  />
))
PglFieldTextarea.displayName = "PglFieldTextarea"

// ─── Phone (PatternFormat wrapper) ────────────────────────────────

interface PglFieldPhoneProps
  extends Omit<PatternFormatProps, "format" | "customInput"> {
  format?: string
  className?: string
}

const PglFieldPhone = React.forwardRef<HTMLInputElement, PglFieldPhoneProps>(
  ({ format = "(##) #####-####", className, ...props }, ref) => (
    <PatternFormat
      getInputRef={ref}
      format={format}
      mask="_"
      className={cn(
        "w-full rounded-2xl px-4 py-2.5 text-sm font-medium text-black/80 outline-none",
        "ring-1 ring-black/10 transition-all duration-150",
        "placeholder:text-black/30",
        "hover:ring-black/30",
        "focus:ring-black/30",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-black/[0.02]",
        className,
      )}
      {...props}
    />
  ),
)
PglFieldPhone.displayName = "PglFieldPhone"

// ─── Hint ─────────────────────────────────────────────────────────

const PglFieldHint = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => (
  <p className={cn("text-xs text-black/40", className)}>{children}</p>
)
PglFieldHint.displayName = "PglFieldHint"

// ─── Error ────────────────────────────────────────────────────────

const PglFieldError = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => (
  <p className={cn("text-xs font-medium text-red-500", className)}>{children}</p>
)
PglFieldError.displayName = "PglFieldError"

// ═══════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════

export {
  PglField,
  PglFieldLabel,
  PglFieldInput,
  PglFieldTextarea,
  PglFieldPhone,
  PglFieldHint,
  PglFieldError,
}
