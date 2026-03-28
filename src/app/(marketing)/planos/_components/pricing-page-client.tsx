"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { useAction } from "next-safe-action/hooks"
import toast from "react-hot-toast"
import {
  IconCheck,
  IconAlertCircle,
  IconArrowRight,
  IconShieldCheck,
  IconSearch,
  IconBrandWhatsapp,
  IconPhone,
  IconDeviceMobile,
  IconHeadset,
  IconLock,
  IconStar,
  IconX,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { PglButton } from "@/components/ui/pgl-button"
import { MarketingHeader } from "../../_components/marketing-header"
import { MarketingFooter } from "../../_components/marketing-footer"
import { ScrollReveal } from "@/components/marketing/scroll-reveal"
import { createCheckoutSession } from "@/actions/subscriptions/create-checkout-session.action"
import type { IPlan, BillingInterval } from "@/interfaces/subscription.interface"

/* ------------------------------------------------------------------ */
/*  Features                                                            */
/* ------------------------------------------------------------------ */

const FREE_FEATURES = [
  { label: "1 site", included: true },
  { label: "Criacao com IA", included: true },
  { label: "Editor visual", included: true },
  { label: "Subdominio decolou.com", included: true },
  { label: "SSL e hospedagem", included: true },
  { label: "Dominio personalizado", included: false },
  { label: "SEO avancado", included: false },
  { label: "Analytics", included: false },
]

const PRO_FEATURES = [
  { label: "Dominio proprio", desc: "Conecte seu dominio profissional" },
  { label: "SEO avancado", desc: "Aparecer no Google e buscadores IA" },
  { label: "Gestao de Clientes (CRM)", desc: "Acompanhe seus leads e contatos" },
  { label: "Analytics completo do site", desc: "Visitas, cliques e conversoes" },
  { label: "Ate 5 sites", desc: "Gerencie multiplos negocios" },
  { label: "Suporte direto no WhatsApp" },
]

const AGENCY_FEATURES = [
  { label: "Tudo do Pro +", desc: "Todas as features do plano Pro incluidas" },
  { label: "Sites ilimitados", desc: "Crie quantos sites precisar" },
  { label: "Suporte prioritario", desc: "Atendimento com prioridade" },
]

const ALL_PLANS_FEATURES = [
  { icon: IconSearch, title: "SEO otimizado", desc: "Seu site preparado para o topo do Google" },
  { icon: IconBrandWhatsapp, title: "Botao WhatsApp", desc: "Clientes entram em contato com um toque" },
  { icon: IconPhone, title: "Clique para ligar", desc: "Ligacao direta do celular do cliente" },
  { icon: IconDeviceMobile, title: "100% responsivo", desc: "Funciona em qualquer dispositivo" },
  { icon: IconLock, title: "SSL e hospedagem", desc: "Site seguro com certificado SSL incluso" },
  { icon: IconHeadset, title: "Suporte dedicado", desc: "Atendimento por email e WhatsApp" },
]

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

function formatPrice(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

interface Props {
  plans: IPlan[]
  isLoggedIn?: boolean
  currentPlanType?: string | null
}

export function PricingPageClient({ plans, isLoggedIn = false, currentPlanType = null }: Props) {
  const searchParams = useSearchParams()
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const [interval, setInterval] = useState<BillingInterval>("MONTHLY")
  const { executeAsync: createCheckout, isExecuting } = useAction(createCheckoutSession)

  const limitReached = searchParams.get("limite") === "1"
  const subscriptionCanceled = searchParams.get("subscription") === "canceled"
  const storeSlug = searchParams.get("store")

  const filteredPlans = useMemo(() => plans.filter((p) => p.type !== "ESSENTIAL"), [plans])
  const proPlan = filteredPlans.find((p) => p.type === "PRO")
  const agencyPlan = filteredPlans.find((p) => p.type === "AGENCY")

  // Show free card only if user is NOT logged in, or logged in with no paid plan
  const hasPaidPlan = currentPlanType === "PRO" || currentPlanType === "AGENCY"
  const showFreeCard = !hasPaidPlan
  const isFreeCurrent = isLoggedIn && !currentPlanType

  async function handleSelect(planId: string) {
    if (!isLoggedIn) {
      const storeParam = storeSlug ? `&store=${storeSlug}` : ""
      window.location.href = `/cadastro?plan=${planId}&interval=${interval}${storeParam}`
      return
    }
    setSelectedPlanId(planId)
    const result = await createCheckout({ planId, billingInterval: interval, storeSlug: storeSlug || undefined })
    if (result?.data?.checkoutUrl) {
      window.location.href = result.data.checkoutUrl
    } else {
      toast.error(result?.serverError || "Erro ao criar sessao de pagamento.")
      setSelectedPlanId(null)
    }
  }

  function getPrice(plan: IPlan) {
    return interval === "MONTHLY" ? plan.monthlyPriceInCents : plan.yearlyPriceInCents
  }

  function getSavings(plan: IPlan) {
    const full = plan.monthlyPriceInCents * 12
    const savings = full - plan.yearlyPriceInCents
    return { savings, pct: Math.round((savings / full) * 100) }
  }

  return (
    <main className="min-h-dvh bg-white" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <MarketingHeader isLoggedIn={isLoggedIn} />

      <div className="mx-auto max-w-[1200px] px-4 pt-16 pb-8 sm:px-6 md:pt-24 lg:px-14">

        {/* ── Alerts ── */}
        {(limitReached || subscriptionCanceled) && (
          <div className="mx-auto mb-10 max-w-2xl rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
            <div className="flex items-center gap-3">
              <IconAlertCircle className="size-5 shrink-0 text-amber-600" />
              <p className="text-sm text-amber-800">
                {limitReached
                  ? "Voce atingiu o limite do plano gratuito. Assine um plano para desbloquear mais funcionalidades."
                  : "O pagamento foi cancelado. Voce pode tentar novamente quando quiser."}
              </p>
            </div>
          </div>
        )}

        {/* ── Hero ── */}
        <ScrollReveal className="text-center">
          <h1
            className="mx-auto max-w-[600px] text-[40px] font-medium leading-[1.1] tracking-[-0.02em] text-black/80 md:text-[56px]"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Planos simples, sem surpresas
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base text-black/55 md:text-lg">
            Tudo que voce precisa para ter seu negocio no topo do Google. Comece gratis e faca upgrade quando quiser.
          </p>
        </ScrollReveal>

        {/* ── Billing toggle ── */}
        <ScrollReveal className="mt-10 flex justify-center">
          <div className="inline-flex items-center rounded-full border border-black/[0.08] p-1">
            <button
              onClick={() => setInterval("MONTHLY")}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-[background,color,box-shadow] duration-150",
                interval === "MONTHLY"
                  ? "bg-black/80 text-white shadow-button-dark"
                  : "text-black/55 hover:text-black/80",
              )}
            >
              Mensal
            </button>
            <button
              onClick={() => setInterval("YEARLY")}
              className={cn(
                "relative rounded-full px-5 py-2 text-sm font-medium transition-[background,color,box-shadow] duration-150",
                interval === "YEARLY"
                  ? "bg-black/80 text-white shadow-button-dark"
                  : "text-black/55 hover:text-black/80",
              )}
            >
              Anual
              <span className="ml-2 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                Economize
              </span>
            </button>
          </div>
        </ScrollReveal>

        {/* ── Plan cards ── */}
        <div className={cn(
          "mx-auto mt-14 grid gap-6",
          showFreeCard ? "max-w-[1100px] lg:grid-cols-3" : "max-w-[900px] lg:grid-cols-2",
        )}>

          {/* ── FREE ── */}
          {showFreeCard && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
            >
              <div className={cn(
                "relative flex h-full flex-col rounded-3xl border p-6 md:p-8",
                isFreeCurrent
                  ? "border-black/80 ring-1 ring-black/80"
                  : "border-black/[0.08] bg-white",
              )}>
                {isFreeCurrent && (
                  <div className="absolute -top-3 left-6">
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/80 px-3 py-1 text-xs font-semibold text-white">
                      Plano atual
                    </span>
                  </div>
                )}

                <h3 className="text-2xl font-semibold text-black/80">Gratis</h3>
                <p className="mt-1 text-sm text-black/55">Para testar e criar seu primeiro site</p>

                <div className="mt-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-semibold tracking-tight text-black/80">R$ 0</span>
                    <span className="text-base text-black/40">/mes</span>
                  </div>
                  <p className="mt-1.5 text-sm text-black/40">Gratis para sempre</p>
                </div>

                <div className="my-6 h-px bg-black/[0.06]" />

                <div className="mb-8 flex flex-1 flex-col gap-3">
                  {FREE_FEATURES.map((f) => (
                    <div key={f.label} className="flex items-center gap-3">
                      {f.included ? (
                        <IconCheck className="size-5 shrink-0 text-emerald-500" />
                      ) : (
                        <IconX className="size-5 shrink-0 text-black/20" />
                      )}
                      <span className={cn("text-sm", f.included ? "text-black/80" : "text-black/30")}>
                        {f.label}
                      </span>
                    </div>
                  ))}
                </div>

                {isFreeCurrent ? (
                  <PglButton variant="default" size="lg" className="w-full" disabled>
                    Plano atual
                  </PglButton>
                ) : (
                  <PglButton variant="outline" size="lg" asChild className="w-full">
                    <Link href="/cadastro">
                      Comecar gratis
                      <IconArrowRight className="size-4" />
                    </Link>
                  </PglButton>
                )}
              </div>
            </motion.div>
          )}

          {/* ── PRO ── */}
          {proPlan && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: showFreeCard ? 0.1 : 0 }}
            >
              <div className={cn(
                "relative flex h-full flex-col overflow-hidden rounded-3xl border-2 bg-white",
                currentPlanType === "PRO" ? "border-black/80" : "border-[#6366f1]",
              )}>
                {/* Badge */}
                <div className={cn(
                  "px-6 py-2.5 text-center",
                  currentPlanType === "PRO" ? "bg-black/80" : "bg-[#6366f1]",
                )}>
                  <span className="flex items-center justify-center gap-1.5 text-sm font-semibold text-white">
                    {currentPlanType === "PRO" ? (
                      "Plano atual"
                    ) : (
                      <><IconStar className="size-4 fill-white" /> Mais popular</>
                    )}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6 md:p-8">
                  <h3 className="text-2xl font-semibold text-black/80">{proPlan.name}</h3>
                  {proPlan.description && (
                    <p className="mt-1 text-sm text-black/55">{proPlan.description}</p>
                  )}

                  <div className="mt-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-semibold tracking-tight text-black/80">
                        {formatPrice(getPrice(proPlan))}
                      </span>
                      <span className="text-base text-black/40">
                        /{interval === "MONTHLY" ? "mes" : "ano"}
                      </span>
                    </div>
                    {interval === "YEARLY" && getSavings(proPlan).savings > 0 && (
                      <p className="mt-1.5 text-sm font-medium text-emerald-600">
                        Economia de {formatPrice(getSavings(proPlan).savings)} ({getSavings(proPlan).pct}% off)
                      </p>
                    )}
                  </div>

                  <div className="my-6 h-px bg-black/[0.06]" />

                  <div className="mb-8 flex flex-1 flex-col gap-4">
                    {PRO_FEATURES.map((f) => (
                      <div key={f.label} className="flex gap-3">
                        <IconCheck className="mt-0.5 size-5 shrink-0 text-[#6366f1]" />
                        <div>
                          <span className="text-sm font-medium text-black/80">{f.label}</span>
                          {f.desc && <p className="text-sm text-black/40">{f.desc}</p>}
                        </div>
                      </div>
                    ))}
                  </div>

                  {currentPlanType === "PRO" ? (
                    <PglButton variant="default" size="lg" className="w-full" disabled>
                      Plano atual
                    </PglButton>
                  ) : (
                    <PglButton
                      variant="dark"
                      size="lg"
                      className="w-full"
                      onClick={() => handleSelect(proPlan.id)}
                      loading={isExecuting && selectedPlanId === proPlan.id}
                      disabled={isExecuting}
                    >
                      {!(isExecuting && selectedPlanId === proPlan.id) && (
                        <>{currentPlanType === "AGENCY" ? "Fazer downgrade" : "Comecar com Pro"}</>
                      )}
                      {!(isExecuting && selectedPlanId === proPlan.id) && <IconArrowRight className="size-4" />}
                    </PglButton>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── AGENCY ── */}
          {agencyPlan && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: showFreeCard ? 0.2 : 0.1 }}
            >
              <div className={cn(
                "relative flex h-full flex-col rounded-3xl border bg-white p-6 transition-all duration-150 md:p-8",
                currentPlanType === "AGENCY"
                  ? "border-2 border-black/80"
                  : "border-black/[0.08] hover:border-black/20",
              )}>
                {currentPlanType === "AGENCY" && (
                  <div className="absolute -top-3 left-6">
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/80 px-3 py-1 text-xs font-semibold text-white">
                      Plano atual
                    </span>
                  </div>
                )}

                <h3 className="text-2xl font-semibold text-black/80">{agencyPlan.name}</h3>
                {agencyPlan.description && (
                  <p className="mt-1 text-sm text-black/55">{agencyPlan.description}</p>
                )}

                <div className="mt-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-semibold tracking-tight text-black/80">
                      {formatPrice(getPrice(agencyPlan))}
                    </span>
                    <span className="text-base text-black/40">
                      /{interval === "MONTHLY" ? "mes" : "ano"}
                    </span>
                  </div>
                  {interval === "YEARLY" && getSavings(agencyPlan).savings > 0 && (
                    <p className="mt-1.5 text-sm font-medium text-emerald-600">
                      Economia de {formatPrice(getSavings(agencyPlan).savings)} ({getSavings(agencyPlan).pct}% off)
                    </p>
                  )}
                </div>

                <div className="my-6 h-px bg-black/[0.06]" />

                <div className="mb-8 flex flex-1 flex-col gap-4">
                  {AGENCY_FEATURES.map((f) => (
                    <div key={f.label} className="flex gap-3">
                      <IconCheck className="mt-0.5 size-5 shrink-0 text-black/80" />
                      <div>
                        <span className="text-sm font-medium text-black/80">{f.label}</span>
                        {f.desc && <p className="text-sm text-black/40">{f.desc}</p>}
                      </div>
                    </div>
                  ))}
                </div>

                {currentPlanType === "AGENCY" ? (
                  <PglButton variant="default" size="lg" className="w-full" disabled>
                    Plano atual
                  </PglButton>
                ) : (
                  <PglButton
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={() => handleSelect(agencyPlan.id)}
                    loading={isExecuting && selectedPlanId === agencyPlan.id}
                    disabled={isExecuting}
                  >
                    {!(isExecuting && selectedPlanId === agencyPlan.id) && "Comecar com Agencia"}
                    {!(isExecuting && selectedPlanId === agencyPlan.id) && <IconArrowRight className="size-4" />}
                  </PglButton>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* ── All plans include ── */}
        <section className="mt-24 md:mt-32">
          <ScrollReveal className="mb-12 text-center">
            <h2
              className="text-[28px] font-medium leading-[1.1] tracking-[-0.02em] text-black/80 md:text-[36px]"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Incluido em todos os planos
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-black/55 md:text-base">
              Recursos essenciais para seu negocio crescer online
            </p>
          </ScrollReveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ALL_PLANS_FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="flex items-start gap-4 rounded-2xl bg-black/[0.03] p-5 transition-colors duration-150 hover:bg-black/[0.05]"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#6366f1]/[0.08] text-[#6366f1]">
                  <f.icon className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-black/80">{f.title}</h3>
                  <p className="mt-0.5 text-sm text-black/55">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Guarantee ── */}
        <section className="mt-24 md:mt-32">
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-3xl bg-black/80 px-6 py-16 text-center sm:px-12 md:py-20">
              <div className="pointer-events-none absolute -left-20 -top-20 size-64 rounded-full bg-white/[0.03] blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -right-20 size-64 rounded-full bg-white/[0.03] blur-3xl" />
              <div className="relative">
                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-white/10">
                  <IconShieldCheck className="size-6 text-white/80" />
                </div>
                <h3
                  className="text-2xl font-medium text-white/90 md:text-3xl"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                  Garantia de 7 dias
                </h3>
                <p className="mx-auto mt-3 max-w-md text-base text-white/50">
                  Se nao gostar, devolvemos seu dinheiro. Sem perguntas, sem burocracia.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </section>

        <p className="mt-8 text-center text-sm text-black/30">
          Pagamento seguro via Stripe. Cancele a qualquer momento.
        </p>
      </div>

      <MarketingFooter />
    </main>
  )
}
