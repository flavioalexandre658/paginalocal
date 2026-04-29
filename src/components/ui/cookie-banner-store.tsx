"use client";

import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { IconCookie, IconSettings, IconChevronUp } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════
// TOKENS — herdados do template do cliente
// ═══════════════════════════════════════════════

/**
 * Tokens de cor/tipografia/raio adquiridos das CSS variables
 * `--pgl-*` injetadas pelo `<DesignTokensProvider>` do site renderer.
 *
 * Quando alguma var não existe (template legacy), usamos fallback
 * conservador.  Tudo é referenciado via `var(--pgl-...)` no CSS final
 * para que o banner reaja AO MESMO TEMPO em que o usuário troca
 * paleta/fonte no editor.
 */
const TOKENS = {
  bg: "var(--pgl-background, #ffffff)",
  surface: "var(--pgl-surface, #f5f5f4)",
  text: "var(--pgl-text, #1a1a1a)",
  textMuted: "var(--pgl-text-muted, rgba(0,0,0,0.55))",
  accent: "var(--pgl-accent, var(--pgl-primary, #3b82f6))",
  primary: "var(--pgl-primary, #1a1a1a)",
  fontHeading: "var(--pgl-font-heading, var(--pgl-font-body, system-ui))",
  fontBody: "var(--pgl-font-body, system-ui)",
} as const;

// ═══════════════════════════════════════════════
// VARIANTES
// ═══════════════════════════════════════════════

const cookieBannerStoreVariants = cva(
  "overflow-hidden",
  {
    variants: {
      placement: {
        bottom: "rounded-2xl",
        compact: "rounded-xl",
      },
    },
    defaultVariants: {
      placement: "bottom",
    },
  }
);

// ═══════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════

interface CookieBannerStoreCtx {
  isExpanded: boolean;
  setIsExpanded: (v: boolean) => void;
}

const Ctx = React.createContext<CookieBannerStoreCtx | null>(null);

function useCtx() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("CookieBannerStore.* must be used inside CookieBannerStore");
  return ctx;
}

// ═══════════════════════════════════════════════
// COMPONENTE PAI
// ═══════════════════════════════════════════════

export interface CookieBannerStoreProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cookieBannerStoreVariants> {
  isExpanded: boolean;
  setIsExpanded: (v: boolean) => void;
  /**
   * CSS vars do template (`--pgl-*`) replicadas inline para que o banner
   * herde cores/fontes/raio mesmo estando em `position: fixed` fora do
   * `<DesignTokensProvider>`. Passadas pelo orquestrador
   * `CookieConsent`.
   */
  cssVars?: React.CSSProperties;
}

const CookieBannerStore = React.forwardRef<HTMLDivElement, CookieBannerStoreProps>(
  (
    {
      className,
      placement,
      isExpanded,
      setIsExpanded,
      cssVars,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 sm:px-4 sm:pb-4"
        style={{ ...cssVars, fontFamily: TOKENS.fontBody }}
      >
        <div className="mx-auto max-w-2xl">
          <Ctx.Provider value={{ isExpanded, setIsExpanded }}>
            <div
              ref={ref}
              role="dialog"
              aria-label="Aviso de cookies"
              className={cn(
                cookieBannerStoreVariants({ placement, className }),
                "shadow-[0_8px_30px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.04)]"
              )}
              style={{
                backgroundColor: TOKENS.bg,
                color: TOKENS.text,
                borderRadius:
                  "calc(var(--pgl-radius, 16px) + 8px)",
              }}
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
CookieBannerStore.displayName = "CookieBannerStore";

// ═══════════════════════════════════════════════
// SLOTS — collapsed
// ═══════════════════════════════════════════════

const CookieBannerStoreCollapsed = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { isExpanded } = useCtx();
  if (isExpanded) return null;
  return (
    <div className={cn("flex items-center gap-3 p-4 sm:gap-4", className)}>
      {children}
    </div>
  );
};

const CookieBannerStoreIcon = ({ className }: { className?: string }) => (
  <span
    className={cn(
      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
      className
    )}
    style={{ backgroundColor: TOKENS.surface }}
    aria-hidden="true"
  >
    <IconCookie className="size-4" style={{ color: TOKENS.accent }} />
  </span>
);

const CookieBannerStoreMessage = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <p
    className={cn("flex-1 text-[13px] leading-relaxed sm:text-[14px]", className)}
    style={{ color: TOKENS.textMuted, fontFamily: TOKENS.fontBody }}
  >
    {children}
  </p>
);

const CookieBannerStorePolicyLink = ({
  href = "https://decolou.com/politica-de-privacidade",
  children = "Saiba mais",
}: {
  href?: string;
  children?: React.ReactNode;
}) => (
  <Link
    href={href}
    className="font-medium underline-offset-2 hover:underline"
    style={{ color: TOKENS.accent }}
  >
    {children}
  </Link>
);

const CookieBannerStoreActions = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex shrink-0 items-center gap-1.5 sm:gap-2", className)}>
    {children}
  </div>
);

const CookieBannerStoreSettingsButton = ({
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
        "rounded-full p-2 transition-opacity hover:opacity-80 focus:outline-none focus:ring-2",
        className
      )}
      style={{ color: TOKENS.textMuted }}
    >
      <IconSettings className="size-4" />
    </button>
  );
};

const CookieBannerStoreAcceptButton = ({
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
      "inline-flex h-9 items-center justify-center px-5 text-[13px] font-medium transition-[opacity,transform] duration-150 hover:opacity-90 active:scale-[0.98] focus:outline-none focus:ring-2",
      className
    )}
    style={{
      backgroundColor: TOKENS.accent,
      color: TOKENS.bg,
      fontFamily: TOKENS.fontBody,
      borderRadius: "var(--pgl-radius, 9999px)",
    }}
  >
    {children}
  </button>
);

// ═══════════════════════════════════════════════
// SLOTS — expanded (preferences)
// ═══════════════════════════════════════════════

const CookieBannerStoreExpanded = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { isExpanded } = useCtx();
  if (!isExpanded) return null;
  return <div className={cn("p-5", className)}>{children}</div>;
};

const CookieBannerStoreHeader = ({
  title = "Preferências de Cookies",
  className,
}: {
  title?: string;
  className?: string;
}) => {
  const { setIsExpanded } = useCtx();
  return (
    <div className={cn("mb-4 flex items-center justify-between", className)}>
      <div className="flex items-center gap-2.5">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-full"
          style={{ backgroundColor: TOKENS.surface }}
        >
          <IconCookie className="size-4" style={{ color: TOKENS.accent }} aria-hidden="true" />
        </span>
        <h3
          className="text-base font-semibold sm:text-[17px]"
          style={{
            color: TOKENS.text,
            fontFamily: TOKENS.fontHeading,
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h3>
      </div>
      <button
        type="button"
        onClick={() => setIsExpanded(false)}
        aria-label="Minimizar"
        className="rounded-full p-2 transition-opacity hover:opacity-80 focus:outline-none focus:ring-2"
        style={{ color: TOKENS.textMuted }}
      >
        <IconChevronUp className="size-4 rotate-180" />
      </button>
    </div>
  );
};

const CookieBannerStoreToggleList = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={cn("mb-4 space-y-2", className)}>{children}</div>;

interface CookieBannerStoreToggleProps {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

const CookieBannerStoreToggle = ({
  title,
  description,
  checked,
  disabled = false,
  onChange,
}: CookieBannerStoreToggleProps) => (
  <div
    className={cn(
      "flex items-center justify-between gap-3 p-3",
      disabled && "opacity-70"
    )}
    style={{
      backgroundColor: TOKENS.surface,
      borderRadius: "var(--pgl-radius, 12px)",
    }}
  >
    <div className="min-w-0 flex-1">
      <h4
        className="text-[13px] font-medium sm:text-[14px]"
        style={{ color: TOKENS.text, fontFamily: TOKENS.fontBody }}
      >
        {title}
        {disabled && (
          <span
            className="ml-1.5 text-[11px] font-normal"
            style={{ color: TOKENS.textMuted }}
          >
            (obrigatório)
          </span>
        )}
      </h4>
      <p
        className="mt-0.5 truncate text-[12px]"
        style={{ color: TOKENS.textMuted, fontFamily: TOKENS.fontBody }}
      >
        {description}
      </p>
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={title}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors",
        disabled && "cursor-not-allowed"
      )}
      style={{
        backgroundColor: checked
          ? TOKENS.accent
          : "color-mix(in srgb, var(--pgl-text, #000) 15%, transparent)",
      }}
    >
      <span
        className={cn(
          "absolute left-[2px] top-[2px] block h-5 w-5 rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  </div>
);

const CookieBannerStoreFooter = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={cn("flex gap-2", className)}>{children}</div>;

const CookieBannerStoreSecondary = ({
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
      "inline-flex h-10 flex-1 items-center justify-center px-4 text-[13px] font-medium transition-opacity duration-150 hover:opacity-80 focus:outline-none focus:ring-2",
      className
    )}
    style={{
      border: "1px solid color-mix(in srgb, var(--pgl-text, #000) 12%, transparent)",
      color: TOKENS.text,
      backgroundColor: "transparent",
      fontFamily: TOKENS.fontBody,
      borderRadius: "var(--pgl-radius, 9999px)",
    }}
  >
    {children}
  </button>
);

const CookieBannerStorePrimary = ({
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
      "inline-flex h-10 flex-1 items-center justify-center px-4 text-[13px] font-medium transition-[opacity,transform] duration-150 hover:opacity-90 active:scale-[0.98] focus:outline-none focus:ring-2",
      className
    )}
    style={{
      backgroundColor: TOKENS.accent,
      color: TOKENS.bg,
      fontFamily: TOKENS.fontBody,
      borderRadius: "var(--pgl-radius, 9999px)",
    }}
  >
    {children}
  </button>
);

// ═══════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════

export {
  CookieBannerStore,
  CookieBannerStoreCollapsed,
  CookieBannerStoreIcon,
  CookieBannerStoreMessage,
  CookieBannerStorePolicyLink,
  CookieBannerStoreActions,
  CookieBannerStoreSettingsButton,
  CookieBannerStoreAcceptButton,
  CookieBannerStoreExpanded,
  CookieBannerStoreHeader,
  CookieBannerStoreToggleList,
  CookieBannerStoreToggle,
  CookieBannerStoreFooter,
  CookieBannerStoreSecondary,
  CookieBannerStorePrimary,
  cookieBannerStoreVariants,
};
