"use client";

import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const MAIN_DOMAIN = process.env.NEXT_PUBLIC_MAIN_DOMAIN || "decolou.com";

interface UnpublishedSiteCoverProps {
  storeName?: string;
  category?: string;
  city?: string;
  primaryColor?: string;
}

/**
 * Tela "Em construção" mostrada para visitantes públicos quando o site
 * ainda NÃO está publicado (`store.isActive = false`).
 *
 * Substitui o blueprint inteiro — site não vaza informação preliminar.
 * O dono (autenticado) NUNCA vê esta tela; o controle é feito pelo
 * caller (`page.tsx`) com base em `isOwner`.
 *
 * Design Linear/HIG: paleta black/opacity, system-ui, espaçamento generoso,
 * skeleton blocks (`bg-[#f5f5f4]`) que insinuam o site sendo montado.
 */
export function UnpublishedSiteCover({
  storeName,
  category,
  city,
  primaryColor = "#1c2028",
}: UnpublishedSiteCoverProps) {
  const plansUrl = `https://${MAIN_DOMAIN}/painel`;
  const signupUrl = `https://${MAIN_DOMAIN}/cadastro`;

  return (
    <main
      className="min-h-screen w-full"
      style={{
        backgroundColor: "#fafaf9",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-between px-6 py-12 md:py-16">
        {/* ── Top bar: Decolou brand ────────────────────────── */}
        <UnpublishedCoverBrand />

        {/* ── Centerpiece: state card + ghost preview ───────── */}
        <div className="flex w-full flex-1 flex-col items-center justify-center gap-10 py-10 md:py-16">
          <UnpublishedCoverHeading
            storeName={storeName}
            category={category}
            city={city}
            primaryColor={primaryColor}
          />

          <UnpublishedCoverSkeletonHero />

          <UnpublishedCoverActions plansUrl={plansUrl} />
        </div>

        {/* ── Footer: signup nudge ──────────────────────────── */}
        <UnpublishedCoverSignupNudge signupUrl={signupUrl} />
      </div>
    </main>
  );
}

UnpublishedSiteCover.displayName = "UnpublishedSiteCover";

// ───────────────────────── Slots ─────────────────────────

function UnpublishedCoverBrand({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className="flex h-7 w-7 items-center justify-center rounded-[8px]"
        style={{ backgroundColor: "rgba(0,0,0,0.04)" }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(0,0,0,0.55)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 14l4-4 4 4 4-4 4 4" />
          <path d="M4 20l4-4 4 4 4-4 4 4" />
        </svg>
      </div>
      <span className="text-[13px] font-medium text-black/55">decolou</span>
    </div>
  );
}

function UnpublishedCoverHeading({
  storeName,
  category,
  city,
  primaryColor,
}: {
  storeName?: string;
  category?: string;
  city?: string;
  primaryColor?: string;
}) {
  const subtitleParts: string[] = [];
  if (category) subtitleParts.push(category);
  if (city) subtitleParts.push(city);
  const subtitle = subtitleParts.join(" • ");

  return (
    <div className="flex w-full flex-col items-center text-center">
      {/* Status pill */}
      <div
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-3 py-1.5 shadow-sm"
        aria-label="Status do site"
      >
        <span
          className="relative flex h-1.5 w-1.5"
          aria-hidden="true"
        >
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
            style={{ backgroundColor: primaryColor || "#1c2028" }}
          />
          <span
            className="relative inline-flex h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: primaryColor || "#1c2028" }}
          />
        </span>
        <span className="text-[12px] font-medium text-black/55">
          Em construção
        </span>
      </div>

      <h1 className="max-w-2xl text-balance text-3xl font-semibold tracking-tight text-black/80 md:text-[40px] md:leading-[1.1]">
        {storeName ? (
          <>
            <span className="text-black/40">Em breve, </span>
            <span>{storeName}</span>
          </>
        ) : (
          "Este site está sendo preparado"
        )}
      </h1>

      <p className="mt-4 max-w-xl text-pretty text-[15px] leading-relaxed text-black/55 md:text-[16px]">
        Estamos finalizando os últimos detalhes desta página
        {subtitle ? ` — ${subtitle}` : ""}. Volte em breve para conferir o
        resultado.
      </p>
    </div>
  );
}

function UnpublishedCoverSkeletonHero({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-full max-w-3xl overflow-hidden rounded-[24px] border border-black/[0.06] bg-white p-6 shadow-[0_2px_24px_rgba(0,0,0,0.04)] md:p-8",
        className
      )}
    >
      {/* Mock browser dots */}
      <div className="mb-6 flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-black/[0.08]" />
        <span className="h-2 w-2 rounded-full bg-black/[0.08]" />
        <span className="h-2 w-2 rounded-full bg-black/[0.08]" />
      </div>

      {/* Hero skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-7 w-2/3 rounded-[10px] bg-[#f5f5f4]" />
        <Skeleton className="h-4 w-4/5 rounded-md bg-[#f5f5f4]" />
        <Skeleton className="h-4 w-3/5 rounded-md bg-[#f5f5f4]" />
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-9 w-32 rounded-full bg-[#f5f5f4]" />
          <Skeleton className="h-9 w-24 rounded-full bg-[#f5f5f4]" />
        </div>
      </div>

      {/* Image skeleton */}
      <Skeleton className="mt-8 h-48 w-full rounded-[16px] bg-[#f5f5f4] md:h-56" />

      {/* Cards row */}
      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="space-y-2 rounded-[12px] border border-black/[0.06] p-4"
          >
            <Skeleton className="h-4 w-3/4 rounded-md bg-[#f5f5f4]" />
            <Skeleton className="h-3 w-full rounded-md bg-[#f5f5f4]" />
            <Skeleton className="h-3 w-5/6 rounded-md bg-[#f5f5f4]" />
          </div>
        ))}
      </div>
    </div>
  );
}

function UnpublishedCoverActions({
  plansUrl,
  className,
}: {
  plansUrl: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full max-w-xl flex-col items-center gap-4 rounded-[20px] border border-black/[0.06] bg-white p-5 shadow-sm md:p-6",
        className
      )}
    >
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/[0.04]">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(0,0,0,0.55)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4l3 2" />
          </svg>
        </div>
        <p className="text-[13px] font-medium text-black/55">
          É o dono deste site?
        </p>
      </div>

      <p className="text-center text-[14px] leading-relaxed text-black/55">
        Acesse o painel da{" "}
        <span className="font-medium text-black/80">Decolou</span> e clique em{" "}
        <span className="font-medium text-black/80">Publicar</span> para deixar
        seu site no ar.
      </p>

      <a
        href={plansUrl}
        className={cn(
          "group inline-flex h-10 items-center justify-center gap-2 rounded-full px-5 text-[13px] font-medium text-white",
          "bg-black/80 transition-[background,transform] duration-150",
          "hover:bg-black hover:scale-[1.01]",
          "focus:outline-none focus:ring-2 focus:ring-black/20"
        )}
      >
        Ir para o painel
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="transition-transform duration-150 group-hover:translate-x-0.5"
        >
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      </a>
    </div>
  );
}

function UnpublishedCoverSignupNudge({
  signupUrl,
  className,
}: {
  signupUrl: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mt-12 flex flex-col items-center gap-1 text-center",
        className
      )}
    >
      <p className="text-[12px] font-medium text-black/40">
        Quer um site assim para o seu negócio?
      </p>
      <a
        href={signupUrl}
        className="text-[13px] font-medium text-black/80 underline-offset-4 transition-colors hover:underline"
      >
        Criar com a Decolou
      </a>
    </div>
  );
}

export {
  UnpublishedCoverBrand,
  UnpublishedCoverHeading,
  UnpublishedCoverSkeletonHero,
  UnpublishedCoverActions,
  UnpublishedCoverSignupNudge,
};
