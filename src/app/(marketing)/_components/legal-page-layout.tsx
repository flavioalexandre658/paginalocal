import Link from "next/link"
import { IconChevronRight } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { MarketingHeader } from "./marketing-header"
import { MarketingFooter } from "./marketing-footer"

/* ------------------------------------------------------------------ */
/*  Layout                                                              */
/* ------------------------------------------------------------------ */

interface LegalPageLayoutProps {
  icon: React.ReactNode
  title: string
  description: string
  lastUpdated?: string
  breadcrumbLabel: string
  isLoggedIn?: boolean
  hasSubscription?: boolean
  children: React.ReactNode
}

export function LegalPageLayout({
  icon,
  title,
  description,
  lastUpdated,
  breadcrumbLabel,
  isLoggedIn,
  children,
}: LegalPageLayoutProps) {
  return (
    <main className="min-h-dvh bg-white" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <MarketingHeader isLoggedIn={isLoggedIn} />

      <div className="mx-auto max-w-[800px] px-4 pt-12 pb-8 sm:px-6 md:pt-20">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-1.5 text-sm text-black/40">
          <Link href="/" className="transition-colors hover:text-black/80">Inicio</Link>
          <IconChevronRight className="size-3.5" />
          <span className="text-black/80">{breadcrumbLabel}</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-[#6366f1]/[0.08] text-[#6366f1]">
            {icon}
          </div>
          <h1
            className="text-[32px] font-medium leading-[1.1] tracking-[-0.02em] text-black/80 md:text-[40px]"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            {title}
          </h1>
          <p className="mt-3 text-base text-black/55">{description}</p>
          {lastUpdated && (
            <p className="mt-2 text-sm text-black/30">Ultima atualizacao: {lastUpdated}</p>
          )}
        </div>

        {/* Content */}
        <div className="space-y-10">
          {children}
        </div>
      </div>

      <MarketingFooter />
    </main>
  )
}

/* ------------------------------------------------------------------ */
/*  Section                                                             */
/* ------------------------------------------------------------------ */

interface LegalSectionProps {
  id?: string
  title: string
  children: React.ReactNode
}

export function LegalSection({ id, title, children }: LegalSectionProps) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="mb-4 text-lg font-semibold text-black/80">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-black/55 [&_ul]:ml-4 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_li]:text-black/55 [&_strong]:font-medium [&_strong]:text-black/80 [&_a]:text-[#6366f1] [&_a]:underline [&_a]:underline-offset-2">
        {children}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Highlight box                                                       */
/* ------------------------------------------------------------------ */

interface LegalHighlightProps {
  variant?: "info" | "warning" | "success"
  children: React.ReactNode
}

const highlightStyles = {
  info: "border-[#6366f1]/20 bg-[#6366f1]/[0.04] text-[#6366f1]",
  warning: "border-amber-500/20 bg-amber-500/[0.04] text-amber-700",
  success: "border-emerald-500/20 bg-emerald-500/[0.04] text-emerald-700",
}

export function LegalHighlight({ variant = "info", children }: LegalHighlightProps) {
  return (
    <div className={cn("rounded-xl border px-4 py-3 text-sm leading-relaxed", highlightStyles[variant])}>
      {children}
    </div>
  )
}
