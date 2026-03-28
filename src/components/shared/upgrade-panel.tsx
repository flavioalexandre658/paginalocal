"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { IconCheck, IconChevronUp, IconStar } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { PglButton } from "@/components/ui/pgl-button";
import { createCheckoutSession } from "@/actions/subscriptions/create-checkout-session.action";

type BillingInterval = "MONTHLY" | "YEARLY";

interface PlanData {
  id: string;
  name: string;
  type: string;
  monthlyPriceInCents: number;
  yearlyPriceInCents: number;
}

interface Feature {
  label: string;
  description?: string;
}

const PLAN_FEATURES: Record<string, Feature[]> = {
  PRO: [
    { label: "Dominio proprio", description: "Conecte seu dominio profissional" },
    { label: "SEO avancado", description: "Aparecer no Google, ChatGPT e buscadores IA" },
    { label: "Gestao de Clientes (CRM)" },
    { label: "Analytics completo do site" },
    { label: "Ate 5 sites" },
    { label: "Suporte direto no WhatsApp" },
  ],
  AGENCY: [
    { label: "Tudo do Pro +", description: "Todas as features do plano Pro incluidas" },
    { label: "Sites ilimitados", description: "Crie quantos sites precisar" },
    { label: "Suporte prioritario", description: "Atendimento com prioridade" },
  ],
};

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(cents / 100);
}

function monthlyPrice(p: PlanData, i: BillingInterval): number {
  return i === "MONTHLY" ? p.monthlyPriceInCents : p.yearlyPriceInCents / 12;
}

interface Props {
  plans: PlanData[];
  storeSlug?: string;
  loading?: boolean;
  currentPlanType?: string | null;
}

const PLAN_ORDER: Record<string, number> = { PRO: 1, AGENCY: 2 };

export function UpgradePanel({ plans, storeSlug, loading, currentPlanType }: Props) {
  const filteredPlans = plans.filter((p) => p.type !== "ESSENTIAL");

  // Sort: current plan always first, then by tier
  const allPlans = [...filteredPlans].sort((a, b) => {
    const aCurrent = a.type === currentPlanType ? 0 : 1;
    const bCurrent = b.type === currentPlanType ? 0 : 1;
    if (aCurrent !== bCurrent) return aCurrent - bCurrent;
    return (PLAN_ORDER[a.type] ?? 0) - (PLAN_ORDER[b.type] ?? 0);
  });

  // Auto-select: expand the plan that is NOT the current one
  const defaultSelected = currentPlanType
    ? (allPlans.find((p) => p.type !== currentPlanType)?.type ?? allPlans[0]?.type ?? "PRO")
    : "PRO";

  const [selectedType, setSelectedType] = useState(defaultSelected);
  const [interval, setInterval] = useState<BillingInterval>("YEARLY");
  const { executeAsync, isExecuting } = useAction(createCheckoutSession);
  const [checkoutId, setCheckoutId] = useState<string | null>(null);

  if (loading) return <UpgradeSkeleton />;
  if (allPlans.length === 0) return null;

  const activePlan = allPlans.find((p) => p.type === selectedType) ?? allPlans[0];
  const features = PLAN_FEATURES[activePlan.type] ?? [];
  const price = monthlyPrice(activePlan, interval);
  const savings = Math.round((1 - activePlan.yearlyPriceInCents / (activePlan.monthlyPriceInCents * 12)) * 100);
  const isBusy = isExecuting && checkoutId === activePlan.id;
  const isCurrentPlan = activePlan.type === currentPlanType;
  const currentTier = PLAN_ORDER[currentPlanType ?? ""] ?? 0;
  const activeTier = PLAN_ORDER[activePlan.type] ?? 0;
  const isDowngrade = currentTier > 0 && activeTier < currentTier;

  async function handleUpgrade() {
    if (isCurrentPlan) return;
    setCheckoutId(activePlan.id);
    const res = await executeAsync({ planId: activePlan.id, billingInterval: interval, storeSlug });
    if (res?.data?.checkoutUrl) window.location.href = res.data.checkoutUrl;
    setCheckoutId(null);
  }

  return (
    <div className="flex max-h-[calc(100dvh-2rem)] flex-col overflow-y-auto md:max-h-none md:flex-row md:overflow-visible">
      {/* ── Left column: branding ── */}
      <div className="flex flex-col justify-between gap-6 p-6 pb-4 md:w-[360px] md:p-10 md:pb-6">
        <div className="flex flex-col gap-5">
          {/* People icons */}
          <div className="flex items-center gap-0 text-black/80">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 32 32" className="size-8"><path d="M14.282 9.747c1.14 0 2.064-.904 2.064-2.02 0-1.115-.924-2.09-2.064-2.09s-2.065.975-2.065 2.09c0 1.116.924 2.02 2.065 2.02" /><path d="M22.612 4c-.434 0-.897.332-1.027.739L20.54 8.01a.72.72 0 0 1-.476.467L17.44 9.1a1.3 1.3 0 0 0-.613.45 3.198 3.198 0 0 1-3.607 1.085.43.43 0 0 0-.279 0c-.46.157-.863.438-1.165.81l-2.46 3.106c-.228.28-.34.635-.312.992l.272 3.37c.027.359.327.639.696.65a.714.714 0 0 0 .735-.603l.515-3.322a.7.7 0 0 1 .234-.428l1.103-.942-.19 12.915a.81.81 0 0 0 .821.815.82.82 0 0 0 .812-.674l1.218-7.334h.807l1.155 7.17c.078.483.504.839 1.003.839.581 0 1.043-.475 1.015-1.043l-.776-15.288 3.538-1.377c.475-.205.802-.642.86-1.147l.424-4.318A.805.805 0 0 0 22.61 4z" /></svg>
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 32 32" className="size-8"><path fillRule="evenodd" d="M9.663 4.739C9.533 4.332 9.07 4 8.635 4h.002a.805.805 0 0 0-.636.827l.425 4.318c.057.505.385.942.86 1.147l3.537 1.377-.776 15.288a1.004 1.004 0 0 0 1.09 1.04l.053.002a.82.82 0 0 0 .778-.544q.07-.136.098-.294l1.155-7.17h.806l1.155 7.17q.026.158.097.294a.82.82 0 0 0 .832.542l.074.003c.581 0 1.043-.475 1.015-1.043l-.776-15.288 3.538-1.377c.475-.205.802-.642.86-1.147l.424-4.318A.805.805 0 0 0 22.611 4h.001c-.434 0-.897.332-1.027.739L20.54 8.01a.72.72 0 0 1-.476.467L17.44 9.1q-.06.021-.115.046l-.025-.002c-.8.355-1.739.558-3.493-.044l-2.625-.624a.72.72 0 0 1-.475-.467zm6.102 3.672c1.14 0 2.064-.904 2.064-2.02S16.905 4.3 15.764 4.3c-1.14 0-2.064.975-2.064 2.09 0 1.117.924 2.02 2.065 2.02" clipRule="evenodd" /></svg>
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 32 32" className="size-8"><path d="M12.752 21.315a3.3 3.3 0 0 1-.594-.628l-1.067 2.835a1.24 1.24 0 0 1-.321.478l-2.517 2.328a.79.79 0 0 0 .072 1.219.78.78 0 0 0 .873.028l3.278-2.075a1.9 1.9 0 0 0 .659-.707l1.183-2.203zM16.39 12.222a2.076 2.076 0 0 1-2.068-2.08c0-1.148.946-2.142 2.067-2.142 1.12 0 2.067.981 2.067 2.141s-.927 2.08-2.067 2.08" /><path d="m22.3 15.024-2.764.137-1.447-1.503a4 4 0 0 0-.593-.502 1.26 1.26 0 0 0-.84-.203 2.78 2.78 0 0 1-1.932-.54 1.27 1.27 0 0 0-.814-.257c-.451.02-.899.12-1.322.299l-3.322 1.41a.846.846 0 0 0-.458 1.08l1.131 2.982a.714.714 0 0 0 .735.469.696.696 0 0 0 .604-.817l-.427-2.391a.2.2 0 0 1 .179-.234l1.784-.145-.317 3.433c-.181.88.141 1.787.835 2.352l3.94 3.207 1.66 3.702a.82.82 0 0 0 .705.496.806.806 0 0 0 .804-1.04l-1.21-4.034a3.4 3.4 0 0 0-.875-1.45l-2.052-2.106.565-3.468 1.481.983c.225.15.501.203.765.146l3.374-.724a.65.65 0 0 0 .51-.664.66.66 0 0 0-.698-.618z" /></svg>
          </div>
          <p className="text-2xl font-semibold leading-8 text-black/80">
            Tudo que voce precisa para crescer seu negocio.
          </p>
        </div>

        {/* Trust signal */}
        <div className="mt-auto hidden flex-col gap-2 md:flex">
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <IconStar key={i} className="size-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-xs font-medium text-black/40">Mais de 200 negocios</span>
          </div>
          <span className="text-xs font-medium text-black/40">Construidos com Decolou</span>
        </div>
      </div>

      {/* ── Right column: plan cards ── */}
      <div className="flex flex-1 flex-col gap-3 p-4 md:py-4 md:pl-0 md:pr-4">
        {allPlans.map((p) => {
          const isActive = p.type === selectedType;
          const isCurrent = p.type === currentPlanType;

          if (!isActive) {
            return (
              <div key={p.id} className="overflow-hidden rounded-2xl bg-black/[0.03]">
                <button
                  onClick={() => setSelectedType(p.type)}
                  className="flex w-full items-center gap-3 px-5 py-4 transition-[background,color] duration-150 hover:bg-black/[0.06]"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <span className="shrink-0 text-base font-medium text-black/55 sm:text-lg">{p.name}</span>
                    {isCurrent && (
                      <span className="shrink-0 rounded-full bg-black/5 px-2 py-0.5 text-[11px] font-semibold text-black/40">
                        Atual
                      </span>
                    )}
                    <IconChevronUp className="size-4 shrink-0 rotate-180 text-black/30" />
                  </div>
                  <span className="shrink-0 text-base font-medium text-black/55 sm:text-lg">
                    {formatPrice(monthlyPrice(p, interval))}<span className="text-xs text-black/30 sm:text-sm">/mes</span>
                  </span>
                </button>
              </div>
            );
          }

          return (
            <div key={p.id} className="overflow-hidden rounded-2xl bg-black/[0.03]">
              {/* Active plan header */}
              <div className="flex w-full items-center gap-3 px-5 py-4">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <span className="shrink-0 text-base font-semibold text-black/80 sm:text-lg">{p.name}</span>
                  {isCurrent && (
                    <span className="shrink-0 rounded-full bg-black/5 px-2 py-0.5 text-[11px] font-semibold text-black/40">
                      Atual
                    </span>
                  )}
                </div>
                <span className="shrink-0 text-base font-medium text-black/80 sm:text-lg">
                  {formatPrice(price)}<span className="text-xs text-black/30 sm:text-sm">/mes</span>
                </span>
              </div>

              {/* Expanded content */}
              <div className="px-5 pb-6">
                {/* Toggle + savings */}
                <div className="mb-5 flex items-center gap-3">
                  <div className="grid auto-cols-auto grid-flow-col rounded-xl bg-black/[0.06] p-0.5">
                    <button
                      onClick={() => setInterval("YEARLY")}
                      className={cn(
                        "rounded-[10px] px-3 py-0.5 text-sm font-medium transition-colors",
                        interval === "YEARLY"
                          ? "bg-white text-black/80 shadow-sm"
                          : "text-black/40 hover:text-black/60",
                      )}
                    >
                      Anual
                    </button>
                    <button
                      onClick={() => setInterval("MONTHLY")}
                      className={cn(
                        "rounded-[10px] px-3 py-0.5 text-sm font-medium transition-colors",
                        interval === "MONTHLY"
                          ? "bg-white text-black/80 shadow-sm"
                          : "text-black/40 hover:text-black/60",
                      )}
                    >
                      Mensal
                    </button>
                  </div>
                  {interval === "YEARLY" && savings > 0 && (
                    <span className="text-xs font-medium text-emerald-600">Economize {savings}%</span>
                  )}
                </div>

                {/* Divider */}
                <div className="mb-5 h-px bg-black/[0.06]" />

                {/* Features */}
                <div className="mb-6 flex flex-col gap-3">
                  {features.map((f) => (
                    <div key={f.label} className="flex gap-3">
                      <IconCheck className="mt-0.5 size-5 shrink-0 text-black/80" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-black/80">{f.label}</span>
                        {f.description && <span className="text-sm text-black/40">{f.description}</span>}
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                {isCurrent ? (
                  <PglButton
                    variant="default"
                    size="lg"
                    className="w-full"
                    disabled
                  >
                    Plano atual
                  </PglButton>
                ) : (
                  <PglButton
                    variant="dark"
                    size="lg"
                    shape="pill"
                    className="w-full"
                    onClick={handleUpgrade}
                    loading={isBusy}
                    disabled={isExecuting}
                  >
                    {!isBusy && (isDowngrade ? "Fazer downgrade" : "Fazer upgrade")}
                  </PglButton>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UpgradeSkeleton() {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="space-y-4 p-6 md:w-[360px] md:p-10">
        <Skeleton className="h-8 w-24 rounded-lg bg-[#f5f5f4]" />
        <Skeleton className="h-7 w-52 rounded-lg bg-[#f5f5f4]" />
        <Skeleton className="h-7 w-44 rounded-lg bg-[#f5f5f4]" />
      </div>
      <div className="flex-1 space-y-3 p-4">
        <Skeleton className="h-16 w-full rounded-2xl bg-[#f5f5f4]" />
        <Skeleton className="h-64 w-full rounded-2xl bg-[#f5f5f4]" />
      </div>
    </div>
  );
}
