"use client";

import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { IconCookie, IconSettings, IconChevronUp } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════
// VARIANTES
// ═══════════════════════════════════════════════

const cookieBannerPglVariants = cva(
  "overflow-hidden bg-white",
  {
    variants: {
      variant: {
        default:
          "rounded-2xl border border-black/[0.08] shadow-xl shadow-black/10",
        compact: "rounded-xl border border-black/[0.08] shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const cookieToggleRowVariants = cva(
  "flex items-center justify-between gap-3 rounded-xl bg-black/[0.02] p-3",
  {
    variants: {
      disabled: {
        true: "opacity-70",
        false: "",
      },
    },
    defaultVariants: {
      disabled: false,
    },
  }
);

// ═══════════════════════════════════════════════
// CONTEXT (compartilha estado entre slots)
// ═══════════════════════════════════════════════

interface CookieBannerPglCtx {
  isExpanded: boolean;
  setIsExpanded: (v: boolean) => void;
}

const Ctx = React.createContext<CookieBannerPglCtx | null>(null);

function useCtx() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("CookieBannerPgl.* must be used inside CookieBannerPgl");
  return ctx;
}

// ═══════════════════════════════════════════════
// COMPONENTE PAI
// ═══════════════════════════════════════════════

export interface CookieBannerPglProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cookieBannerPglVariants> {
  isExpanded: boolean;
  setIsExpanded: (v: boolean) => void;
}

const CookieBannerPgl = React.forwardRef<HTMLDivElement, CookieBannerPglProps>(
  (
    { className, variant, isExpanded, setIsExpanded, children, ...props },
    ref
  ) => {
    return (
      <div
        className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 sm:px-4 sm:pb-4"
        style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
      >
        <div className="mx-auto max-w-2xl">
          <Ctx.Provider value={{ isExpanded, setIsExpanded }}>
            <div
              ref={ref}
              className={cn(cookieBannerPglVariants({ variant, className }))}
              role="dialog"
              aria-label="Aviso de cookies"
              {...props}
            >
              {children}
            </div>
          </Ctx.Provider>
        </div>
      </div>
    );
  }
);
CookieBannerPgl.displayName = "CookieBannerPgl";

// ═══════════════════════════════════════════════
// SLOTS (collapsed mode)
// ═══════════════════════════════════════════════

const CookieBannerPglCollapsed = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { isExpanded } = useCtx();
  if (isExpanded) return null;
  return (
    <div className={cn("flex items-center gap-3 p-3 sm:gap-4 sm:p-4", className)}>
      {children}
    </div>
  );
};

const CookieBannerPglIcon = ({ className }: { className?: string }) => (
  <span
    className={cn(
      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/[0.04]",
      className
    )}
    aria-hidden="true"
  >
    <IconCookie className="size-4 text-black/55" />
  </span>
);

const CookieBannerPglMessage = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <p className={cn("flex-1 text-[13px] leading-relaxed text-black/55", className)}>
    {children}
  </p>
);

const CookieBannerPglPolicyLink = ({
  href = "https://decolou.com/politica-de-privacidade",
  children = "Saiba mais",
}: {
  href?: string;
  children?: React.ReactNode;
}) => (
  <Link
    href={href}
    className="font-medium text-black/80 underline-offset-2 hover:underline"
  >
    {children}
  </Link>
);

const CookieBannerPglActions = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn("flex shrink-0 items-center gap-1.5 sm:gap-2", className)}
  >
    {children}
  </div>
);

const CookieBannerPglSettingsButton = ({
  onClick,
  className,
}: {
  onClick?: () => void;
  className?: string;
}) => {
  const { setIsExpanded } = useCtx();
  return (
    <button
      type="button"
      onClick={() => {
        if (onClick) onClick();
        setIsExpanded(true);
      }}
      aria-label="Configurar cookies"
      className={cn(
        "rounded-xl p-1.5 text-black/55 outline-none",
        "transition-[background,color] duration-150",
        "hover:bg-black/5 hover:text-black/80",
        "focus:ring-2 focus:ring-black/20",
        className
      )}
    >
      <IconSettings className="size-4" />
    </button>
  );
};

const CookieBannerPglAcceptButton = ({
  onClick,
  children = "Aceitar",
  className,
}: {
  onClick: () => void;
  children?: React.ReactNode;
  className?: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "inline-flex h-8 items-center justify-center rounded-xl px-4 text-[13px] font-medium text-white outline-none",
      "bg-black/80 transition-[background,color] duration-150",
      "hover:bg-black",
      "focus:ring-2 focus:ring-black/20",
      className
    )}
  >
    {children}
  </button>
);

// ═══════════════════════════════════════════════
// SLOTS (expanded mode — preferences)
// ═══════════════════════════════════════════════

const CookieBannerPglExpanded = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { isExpanded } = useCtx();
  if (!isExpanded) return null;
  return <div className={cn("p-4 sm:p-5", className)}>{children}</div>;
};

const CookieBannerPglHeader = ({
  title = "Preferências de Cookies",
  className,
}: {
  title?: string;
  className?: string;
}) => {
  const { setIsExpanded } = useCtx();
  return (
    <div className={cn("mb-4 flex items-center justify-between", className)}>
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/[0.04]">
          <IconCookie className="size-4 text-black/55" aria-hidden="true" />
        </span>
        <h3 className="text-base font-semibold text-black/80">{title}</h3>
      </div>
      <button
        type="button"
        onClick={() => setIsExpanded(false)}
        aria-label="Minimizar"
        className={cn(
          "rounded-xl p-1.5 text-black/55 outline-none",
          "transition-[background,color] duration-150",
          "hover:bg-black/5 hover:text-black/80",
          "focus:ring-2 focus:ring-black/20"
        )}
      >
        <IconChevronUp className="size-4 rotate-180" />
      </button>
    </div>
  );
};

const CookieBannerPglToggleList = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={cn("mb-4 space-y-2", className)}>{children}</div>;

interface CookieBannerPglToggleProps {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

const CookieBannerPglToggle = ({
  title,
  description,
  checked,
  disabled = false,
  onChange,
}: CookieBannerPglToggleProps) => (
  <div className={cookieToggleRowVariants({ disabled })}>
    <div className="min-w-0 flex-1">
      <h4 className="text-[13px] font-medium text-black/80">
        {title}
        {disabled && (
          <span className="ml-1.5 text-[11px] font-normal text-black/40">
            (obrigatório)
          </span>
        )}
      </h4>
      <p className="mt-0.5 text-[12px] text-black/55">{description}</p>
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={title}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors",
        checked ? "bg-black/80" : "bg-black/10",
        disabled && "cursor-not-allowed opacity-60"
      )}
    >
      <span
        className={cn(
          "block h-5 w-5 rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  </div>
);

const CookieBannerPglFooter = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={cn("flex gap-2", className)}>{children}</div>;

const CookieBannerPglSecondary = ({
  onClick,
  children,
  className,
}: {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "inline-flex h-9 flex-1 items-center justify-center rounded-xl px-4 text-[13px] font-medium text-black/80 outline-none",
      "border border-black/10 bg-white transition-[background,color] duration-150",
      "hover:border-black/20 hover:bg-black/[0.02]",
      "focus:ring-2 focus:ring-black/20",
      className
    )}
  >
    {children}
  </button>
);

const CookieBannerPglPrimary = ({
  onClick,
  children,
  className,
}: {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "inline-flex h-9 flex-1 items-center justify-center rounded-xl px-4 text-[13px] font-medium text-white outline-none",
      "bg-black/80 transition-[background,color] duration-150",
      "hover:bg-black",
      "focus:ring-2 focus:ring-black/20",
      className
    )}
  >
    {children}
  </button>
);

// ═══════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════

export {
  CookieBannerPgl,
  CookieBannerPglCollapsed,
  CookieBannerPglIcon,
  CookieBannerPglMessage,
  CookieBannerPglPolicyLink,
  CookieBannerPglActions,
  CookieBannerPglSettingsButton,
  CookieBannerPglAcceptButton,
  CookieBannerPglExpanded,
  CookieBannerPglHeader,
  CookieBannerPglToggleList,
  CookieBannerPglToggle,
  CookieBannerPglFooter,
  CookieBannerPglSecondary,
  CookieBannerPglPrimary,
  cookieBannerPglVariants,
};
