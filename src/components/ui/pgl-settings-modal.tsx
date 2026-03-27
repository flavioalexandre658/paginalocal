"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { IconX } from "@tabler/icons-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// ═══════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════

const SettingsModalContext = React.createContext<{
  activeTab: string
  setActiveTab: (tab: string) => void
}>({ activeTab: "", setActiveTab: () => {} })

function useSettingsModal() {
  return React.useContext(SettingsModalContext)
}

// ═══════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════

const SettingsModal = DialogPrimitive.Root

const SettingsModalTrigger = DialogPrimitive.Trigger

// ═══════════════════════════════════════════════
// OVERLAY
// ═══════════════════════════════════════════════

const SettingsModalOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-[90] bg-black/30",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
SettingsModalOverlay.displayName = "SettingsModalOverlay"

// ═══════════════════════════════════════════════
// CONTENT (the dialog container)
// ═══════════════════════════════════════════════

interface SettingsModalContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  defaultTab?: string
}

const SettingsModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  SettingsModalContentProps
>(({ className, children, defaultTab = "", ...props }, ref) => {
  const [activeTab, setActiveTab] = React.useState(defaultTab)

  React.useEffect(() => {
    if (defaultTab) setActiveTab(defaultTab)
  }, [defaultTab])

  return (
    <DialogPrimitive.Portal>
      <SettingsModalOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-1/2 top-1/2 z-[90] -translate-x-1/2 -translate-y-1/2",
          "w-[calc(100%-2rem)] sm:w-full sm:max-w-[840px]",
          "h-[calc(100dvh-2rem)] md:h-[640px] md:max-h-[85dvh]",
          "overflow-hidden rounded-3xl bg-white shadow-lg",
          "md:bg-white/80 md:backdrop-blur-2xl",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "outline-hidden",
          className
        )}
        {...props}
      >
        <SettingsModalContext.Provider value={{ activeTab, setActiveTab }}>
          <DialogPrimitive.Title className="sr-only">Configuracoes</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">Configuracoes do site</DialogPrimitive.Description>

          {/* Close button */}
          <DialogPrimitive.Close className="absolute right-4 top-4 z-10 rounded-full bg-black/5 p-2 text-black/55 transition-colors hover:bg-black/10 hover:text-black/80 focus:outline-none focus:ring-2 focus:ring-black/20">
            <IconX className="size-4" />
            <span className="sr-only">Fechar</span>
          </DialogPrimitive.Close>

          <div className="flex h-full">
            {children}
          </div>
        </SettingsModalContext.Provider>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
})
SettingsModalContent.displayName = "SettingsModalContent"

// ═══════════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════════

const SettingsModalSidebar = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div className={cn(
      "hidden md:flex w-[220px] shrink-0 flex-col bg-black/[0.02] p-4",
      className
    )}>
      {children}
    </div>
  )
}

// ═══════════════════════════════════════════════
// SIDEBAR TITLE
// ═══════════════════════════════════════════════

const SettingsModalSidebarTitle = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <h2 className={cn("mb-4 text-base font-semibold text-black/80", className)}>
      {children}
    </h2>
  )
}

// ═══════════════════════════════════════════════
// SIDEBAR ITEM (tab button)
// ═══════════════════════════════════════════════

const sidebarItemVariants = cva(
  "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors text-left",
  {
    variants: {
      active: {
        true: "bg-black/5 text-black/80",
        false: "text-black/55 hover:bg-black/[0.03] hover:text-black/80",
      },
    },
    defaultVariants: {
      active: false,
    },
  }
)

const SettingsModalSidebarItem = ({
  value,
  icon,
  children,
  className,
}: {
  value: string
  icon?: React.ReactNode
  children: React.ReactNode
  className?: string
}) => {
  const { activeTab, setActiveTab } = useSettingsModal()
  const isActive = activeTab === value

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={cn(sidebarItemVariants({ active: isActive, className }))}
    >
      {icon && <span className="shrink-0 [&>svg]:size-5">{icon}</span>}
      {children}
    </button>
  )
}

// ═══════════════════════════════════════════════
// MOBILE TABS (horizontal, shown on small screens)
// ═══════════════════════════════════════════════

const SettingsModalMobileTabs = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div className={cn(
      "flex gap-1 overflow-x-auto border-b border-black/5 px-4 pt-14 pb-0 md:hidden",
      className
    )}>
      {children}
    </div>
  )
}

const SettingsModalMobileTab = ({
  value,
  children,
  className,
}: {
  value: string
  children: React.ReactNode
  className?: string
}) => {
  const { activeTab, setActiveTab } = useSettingsModal()
  const isActive = activeTab === value

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={cn(
        "shrink-0 rounded-t-lg border-b-2 px-3 pb-2.5 pt-1 text-sm font-medium transition-colors",
        isActive
          ? "border-black/80 text-black/80"
          : "border-transparent text-black/40 hover:text-black/60",
        className
      )}
    >
      {children}
    </button>
  )
}

// ═══════════════════════════════════════════════
// BODY (scrollable content area)
// ═══════════════════════════════════════════════

const SettingsModalBody = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div className={cn(
      "flex-1 overflow-y-auto px-6 py-8 md:px-14 md:py-12 bg-white",
      className
    )}>
      {children}
    </div>
  )
}

// ═══════════════════════════════════════════════
// TAB PANEL (shows content for a specific tab)
// ═══════════════════════════════════════════════

const SettingsModalTabPanel = ({
  value,
  children,
  className,
}: {
  value: string
  children: React.ReactNode
  className?: string
}) => {
  const { activeTab } = useSettingsModal()
  if (activeTab !== value) return null

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      {children}
    </div>
  )
}

// ═══════════════════════════════════════════════
// FORM PRIMITIVES
// ═══════════════════════════════════════════════

const SettingsModalSection = ({
  title,
  description,
  children,
  className,
}: {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div>
        <h3 className="text-sm font-semibold text-black/80">{title}</h3>
        {description && <p className="mt-0.5 text-sm text-black/55">{description}</p>}
      </div>
      {children}
    </div>
  )
}

const SettingsModalOptionCard = ({
  selected,
  onClick,
  icon,
  title,
  description,
  className,
}: {
  selected: boolean
  onClick: () => void
  icon?: React.ReactNode
  title: string
  description: string
  className?: string
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all",
        selected
          ? "border-black/80 ring-1 ring-black/80 bg-black/[0.02]"
          : "border-black/10 hover:border-black/20 hover:bg-black/[0.01]",
        className
      )}
    >
      {icon && (
        <span className={cn(
          "shrink-0 [&>svg]:size-5",
          selected ? "text-black/80" : "text-black/40"
        )}>
          {icon}
        </span>
      )}
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-medium", selected ? "text-black/80" : "text-black/55")}>{title}</p>
        <p className="text-sm text-black/40">{description}</p>
      </div>
    </button>
  )
}

const SettingsModalToggle = ({
  checked,
  onChange,
  label,
  description,
  className,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  description?: string
  className?: string
}) => {
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-black/80">{label}</p>
        {description && <p className="text-sm text-black/40">{description}</p>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors",
          checked ? "bg-black/80" : "bg-black/10"
        )}
      >
        <span className={cn(
          "block h-5 w-5 rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-5" : "translate-x-0"
        )} />
      </button>
    </div>
  )
}

const SettingsModalInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { label?: string }
>(({ label, className, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-black/55">{label}</label>}
      <input
        ref={ref}
        className={cn(
          "w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm text-black/80 outline-none transition-colors",
          "placeholder:text-black/30",
          "focus:border-black/30 focus:ring-1 focus:ring-black/10",
          className
        )}
        {...props}
      />
    </div>
  )
})
SettingsModalInput.displayName = "SettingsModalInput"

// ═══════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════

export {
  SettingsModal,
  SettingsModalTrigger,
  SettingsModalContent,
  SettingsModalSidebar,
  SettingsModalSidebarTitle,
  SettingsModalSidebarItem,
  SettingsModalMobileTabs,
  SettingsModalMobileTab,
  SettingsModalBody,
  SettingsModalTabPanel,
  SettingsModalSection,
  SettingsModalOptionCard,
  SettingsModalToggle,
  SettingsModalInput,
  useSettingsModal,
  sidebarItemVariants,
}
