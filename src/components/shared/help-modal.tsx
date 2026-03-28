"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { IconX, IconMail, IconBrandWhatsapp } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";
import { usePlanRestrictions } from "@/hooks/use-plan-restrictions";
import { Skeleton } from "@/components/ui/skeleton";

// ─── Env constants ────────────────────────────────────────────────

const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "contato@decolou.com";
const SUPPORT_NUMBER = process.env.NEXT_PUBLIC_SUPPORT_NUMBER ?? "";

// ─── Option card ──────────────────────────────────────────────────

function HelpOption({
  href,
  onClick,
  icon,
  title,
  description,
}: {
  href?: string;
  onClick?: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  const className = cn(
    "flex w-full items-start gap-4 rounded-xl border border-black/5 p-3 text-left",
    "transition-colors duration-150 hover:bg-black/[0.03]",
  );

  const content = (
    <>
      <div className="mt-0.5 shrink-0 text-black/40">{icon}</div>
      <div className="flex-1">
        <h3 className="mb-0.5 text-sm font-medium text-black/80">{title}</h3>
        <p className="text-sm text-black/55">{description}</p>
      </div>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}

// ─── Modal ────────────────────────────────────────────────────────

interface Props {
  open: boolean;
  onClose: () => void;
}

export function HelpModal({ open, onClose }: Props) {
  const { data: session } = useSession();
  const { hasActiveSubscription, isLoading: planLoading } = usePlanRestrictions();

  const firstName = session?.user?.name?.split(" ")[0] ?? "";
  const isPaid = hasActiveSubscription();

  const whatsappUrl = SUPPORT_NUMBER
    ? `https://wa.me/55${SUPPORT_NUMBER}?text=${encodeURIComponent("Ola! Preciso de ajuda com minha conta no Decolou.")}`
    : null;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogPrimitive.Portal>
        {/* Overlay */}
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-[90] bg-black/30",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          )}
        />

        {/* Content */}
        <DialogPrimitive.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-[90] w-full max-w-md -translate-x-1/2 -translate-y-1/2 outline-none",
            "rounded-3xl bg-white shadow-lg",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          )}
        >
          {/* Close button */}
          <DialogPrimitive.Close
            className={cn(
              "absolute right-4 top-4 z-10 rounded-full bg-black/5 p-1.5",
              "text-black/55 transition-colors hover:bg-black/10",
              "focus:outline-none focus:ring-2 focus:ring-black/20",
            )}
          >
            <IconX className="size-4" />
            <span className="sr-only">Fechar</span>
          </DialogPrimitive.Close>

          {/* Header */}
          <div className="flex flex-col gap-0 px-6 pt-8 pb-0">
            <DialogPrimitive.Title className="text-2xl font-semibold text-black/80">
              {firstName ? `Oi ${firstName},` : "Ola,"}
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="text-2xl font-semibold text-black/55">
              como podemos ajudar?
            </DialogPrimitive.Description>
          </div>

          {/* Options */}
          <div className="mx-4 mt-5 mb-4 space-y-2.5">
            {planLoading ? (
              <>
                <Skeleton className="h-[70px] w-full rounded-xl bg-[#f5f5f4]" />
                <Skeleton className="h-[70px] w-full rounded-xl bg-[#f5f5f4]" />
              </>
            ) : (
              <>
                {/* Email — available to all */}
                <HelpOption
                  href={`mailto:${SUPPORT_EMAIL}`}
                  icon={<IconMail className="size-5" />}
                  title="Envie um e-mail"
                  description={`Fale com nosso suporte em ${SUPPORT_EMAIL}`}
                />

                {/* WhatsApp — paid only */}
                {isPaid && whatsappUrl && (
                  <HelpOption
                    href={whatsappUrl}
                    icon={<IconBrandWhatsapp className="size-5" />}
                    title="WhatsApp"
                    description="Converse com nossa equipe pelo WhatsApp"
                  />
                )}
              </>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
