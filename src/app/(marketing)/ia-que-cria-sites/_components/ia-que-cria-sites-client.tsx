"use client"

import Link from "next/link"
import {
  IconArrowRight,
  IconSparkles,
  IconBrush,
  IconPencil,
  IconSearch,
  IconDeviceMobile,
  IconShieldCheck,
  IconCheck,
  IconWorld,
  IconBrandWhatsapp,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { PglButton } from "@/components/ui/pgl-button"
import { MarketingHeader } from "../../_components/marketing-header"
import { MarketingFooter } from "../../_components/marketing-footer"
import { ScrollReveal, StaggerGroup, StaggerItem } from "@/components/marketing/scroll-reveal"
import {
  FAQAccordion,
  FAQItem,
  FAQTrigger,
  FAQContent,
} from "@/components/marketing/faq-accordion"

/* ------------------------------------------------------------------ */
/*  Data                                                                */
/* ------------------------------------------------------------------ */

const STEPS = [
  {
    step: "Passo 1",
    title: "Diga o nome do seu negocio",
    desc: "A IA busca suas informacoes no Google — fotos, avaliacoes, endereco e horarios — e usa tudo para criar seu site.",
  },
  {
    step: "Passo 2",
    title: "A IA cria seu site completo",
    desc: "Em segundos, a inteligencia artificial gera design profissional, textos otimizados para SEO e layout responsivo.",
  },
  {
    step: "Passo 3",
    title: "Personalize e publique",
    desc: "Edite textos, cores e fontes clicando direto no site. Quando estiver pronto, publique com um clique.",
  },
]

const FEATURES = [
  {
    icon: IconBrush,
    kicker: "Design por IA",
    title: "Um site completo, criado para voce.",
    desc: "Nao tem jeito com design? Sem problema. A IA analisa seu negocio e gera um site profissional com cores, tipografia e layout pensados para converter visitantes em clientes.",
  },
  {
    icon: IconSearch,
    kicker: "SEO",
    title: "Apareca no Google sem esforco.",
    desc: "A IA gera meta tags, titulos e descricoes otimizados para sua cidade e seu nicho. Seu site nasce pronto para ranquear no topo das buscas.",
  },
  {
    icon: IconPencil,
    kicker: "Redator com IA",
    title: "Textos profissionais escritos por IA.",
    desc: "Todo o conteudo — titulos, descricoes de servicos, chamadas de acao — e escrito por inteligencia artificial e otimizado para atrair clientes.",
  },
  {
    icon: IconShieldCheck,
    kicker: "Seguranca",
    title: "Seu site seguro, protegido e rapido.",
    desc: "SSL incluso, hospedagem de alta performance e carregamento ultra-rapido. Seu site esta protegido e pronto para receber milhares de visitas.",
  },
]

const INCLUDED = [
  "Design profissional gerado por IA",
  "Textos e conteudo escritos por IA",
  "SEO otimizado para Google",
  "100% responsivo (celular, tablet, desktop)",
  "Botao WhatsApp integrado",
  "Integracao Google Meu Negocio",
  "Editor visual intuitivo",
  "SSL e hospedagem inclusos",
  "Dominio personalizado (planos pagos)",
  "Suporte por WhatsApp e email",
]

const FAQS = [
  {
    q: "Como a IA do Decolou cria meu site?",
    a: "Voce informa o nome do seu negocio e a IA busca informacoes no Google — fotos, avaliacoes, endereco. Com esses dados, ela gera um site completo com design profissional, textos otimizados para SEO e layout responsivo. Tudo em menos de 30 segundos.",
  },
  {
    q: "Preciso saber programar para usar?",
    a: "Nao. Zero codigo. A IA faz tudo automaticamente. Depois, voce pode editar textos, cores e fontes clicando diretamente no site. Se sabe usar o WhatsApp, sabe usar o Decolou.",
  },
  {
    q: "O site gerado pela IA e realmente profissional?",
    a: "Sim. A IA usa modelos de design testados e comprovados, com tipografia profissional, cores harmonicas e layout otimizado para conversao. O resultado e equivalente ao de uma agencia, por uma fracao do custo.",
  },
  {
    q: "A IA cria sites para qualquer tipo de negocio?",
    a: "Sim. De barbearias a agencias digitais, de pizzarias a consultorios. A IA se adapta ao seu segmento, gerando conteudo e design especificos para o seu tipo de negocio.",
  },
  {
    q: "Posso testar de graca antes de pagar?",
    a: "Sim. Voce pode criar e visualizar seu site gratuitamente. Para publicar online e acessar recursos como dominio personalizado, escolha um plano a partir de R$ 59,90/mes.",
  },
  {
    q: "Quanto tempo leva para o site aparecer no Google?",
    a: "O site ja nasce com SEO otimizado. O tempo para aparecer nos resultados depende do Google, mas geralmente leva de 3 a 14 dias. Negocios com perfil no Google Meu Negocio tendem a ranquear mais rapido.",
  },
]

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

interface Props {
  isLoggedIn?: boolean
}

export function IAQueCriaSitesClient({ isLoggedIn = false }: Props) {
  const ctaHref = isLoggedIn ? "/painel" : "/cadastro"

  return (
    <main className="min-h-dvh bg-white" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <MarketingHeader isLoggedIn={isLoggedIn} />

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/*  HERO                                                          */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-20 text-center md:py-28">
        <ScrollReveal className="mx-auto flex max-w-[700px] flex-col items-center gap-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#6366f1]/[0.08] px-4 py-1.5 text-sm font-medium text-[#6366f1]">
            <IconSparkles className="size-4" />
            Inteligencia artificial
          </span>

          <h1
            className="text-[44px] font-medium leading-[1.05] tracking-[-0.02em] text-black/80 md:text-[72px]"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            A IA que cria sites profissionais em segundos
          </h1>

          <p className="max-w-[520px] text-base text-black/55 md:text-lg">
            Diga o nome do seu negocio e nossa inteligencia artificial cria um site completo — com design, textos e SEO otimizado. Sem codigo, sem designer.
          </p>

          <div className="flex items-center gap-3">
            <PglButton variant="dark" size="lg" asChild>
              <Link href={ctaHref}>
                Criar meu site gratis
                <IconArrowRight className="size-4" />
              </Link>
            </PglButton>
          </div>

          <p className="text-sm text-black/30">Gratis para criar.</p>
        </ScrollReveal>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/*  3 STEPS                                                       */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-white pt-24 md:pt-32">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-14">
          <ScrollReveal className="mb-12 text-center">
            <span className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#6366f1]">
              Como funciona
            </span>
            <h2
              className="mt-2 text-[32px] font-medium leading-[1.1] tracking-[-0.02em] text-black/80 md:text-[40px]"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Seu site criado com IA em 3 passos
            </h2>
          </ScrollReveal>

          <StaggerGroup className="grid gap-6 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <StaggerItem key={step.step}>
                <div className="flex h-full flex-col rounded-2xl bg-black/[0.03] p-6">
                  <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#6366f1]/[0.08] px-3 py-1 text-xs font-semibold text-[#6366f1]">
                    {step.step}
                  </span>
                  <h3 className="mb-2 text-lg font-semibold text-black/80">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-black/55">{step.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/*  FEATURES — 2x2 large cards with mockups                      */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-white pt-24 md:pt-32">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-14">
          <ScrollReveal className="mb-4">
            <span className="text-sm font-medium text-[#6366f1]">Simples e aprimorado com IA</span>
          </ScrollReveal>
          <ScrollReveal className="mb-12">
            <h2
              className="max-w-[520px] text-[32px] font-medium leading-[1.1] tracking-[-0.02em] text-black/80 md:text-[40px]"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Tudo e feito para voce
            </h2>
            <p className="mt-3 max-w-lg text-base text-black/55">
              Todo site do Decolou inclui SEO, conteudo escrito por IA e hospedagem segura.
            </p>
          </ScrollReveal>

          <div className="grid gap-4 md:grid-cols-2">
            {FEATURES.map((f) => (
              <ScrollReveal key={f.title}>
                <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-black/[0.03]">
                  {/* Text content */}
                  <div className="flex flex-1 flex-col gap-2 p-6 md:p-8">
                    <span className="text-xs font-semibold text-[#6366f1]">{f.kicker}</span>
                    <h3
                      className="text-xl font-medium text-black/80 md:text-2xl"
                      style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                    >
                      {f.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-black/55">{f.desc}</p>
                  </div>
                  {/* Mockup area */}
                  <div className="px-6 pb-0 md:px-8">
                    <FeatureMockup type={f.kicker} />
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/*  SOLUTION — 3 column text section                              */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-white pt-24 md:pt-32">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-14">
          <ScrollReveal className="mb-4">
            <span className="text-sm font-medium text-[#6366f1]">Solucao completa</span>
          </ScrollReveal>
          <ScrollReveal className="mb-12">
            <h2
              className="max-w-[600px] text-[32px] font-medium leading-[1.1] tracking-[-0.02em] text-black/80 md:text-[40px]"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              A IA que cria sites com tudo que sua empresa precisa.
            </h2>
            <p className="mt-3 max-w-xl text-base text-black/55">
              Comece com um site criado em 30 segundos e expanda com editor visual, SEO e integracao com Google — tudo em uma plataforma com inteligencia artificial.
            </p>
          </ScrollReveal>

          <StaggerGroup className="grid gap-6 md:grid-cols-3">
            <StaggerItem>
              <div className="rounded-2xl border border-black/[0.08] bg-white p-6">
                <h3 className="mb-3 text-base font-semibold text-black/80">Editor visual sem codigo</h3>
                <p className="text-sm leading-relaxed text-black/55">
                  A IA do Decolou cria seu site e voce personaliza com o editor intuitivo. Clique em qualquer texto para editar, troque cores, fontes e temas — tudo em tempo real, sem precisar mexer em codigo.
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="rounded-2xl border border-black/[0.08] bg-white p-6">
                <h3 className="mb-3 text-base font-semibold text-black/80">Integracao Google e WhatsApp</h3>
                <p className="text-sm leading-relaxed text-black/55">
                  A IA importa fotos, avaliacoes e horarios do Google Meu Negocio. O botao de WhatsApp fica visivel em todas as paginas, transformando visitantes em contatos reais.
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="rounded-2xl border border-black/[0.08] bg-white p-6">
                <h3 className="mb-3 text-base font-semibold text-black/80">Da ideia a internet em 30 segundos</h3>
                <p className="text-sm leading-relaxed text-black/55">
                  Responda 3 perguntas sobre seu negocio e a IA gera um site profissional completo. Sem modelos para preencher, sem decisoes tecnicas. Resultados instantaneos com design profissional.
                </p>
              </div>
            </StaggerItem>
          </StaggerGroup>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/*  INCLUDED — checklist                                          */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-white pt-24 md:pt-32">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-14">
          <ScrollReveal>
            <div className="overflow-hidden rounded-3xl bg-black/[0.03] p-8 md:p-12">
              <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
                <div className="lg:max-w-[360px]">
                  <h2
                    className="text-[28px] font-medium leading-[1.1] tracking-[-0.02em] text-black/80 md:text-[32px]"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                  >
                    Tudo incluso quando a IA cria seu site
                  </h2>
                  <p className="mt-3 text-sm text-black/55">
                    Cada site gerado pela IA do Decolou ja vem com tudo que voce precisa para atrair clientes.
                  </p>
                  <PglButton variant="dark" size="lg" asChild className="mt-6">
                    <Link href={ctaHref}>
                      Criar meu site
                      <IconArrowRight className="size-4" />
                    </Link>
                  </PglButton>
                </div>

                <div className="flex-1">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {INCLUDED.map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <IconCheck className="mt-0.5 size-5 shrink-0 text-emerald-500" />
                        <span className="text-sm text-black/80">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/*  FAQ                                                           */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-white pt-24 md:pt-32">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-14">
          <div className="flex flex-col gap-12 lg:flex-row lg:gap-24">
            <ScrollReveal className="lg:w-[360px] lg:shrink-0">
              <div className="lg:sticky lg:top-24">
                <h2
                  className="text-[28px] font-medium leading-[1.1] tracking-[-0.02em] text-black/80 md:text-[32px]"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                  Perguntas frequentes
                </h2>
                <p className="mt-3 text-sm text-black/55">
                  Tire suas duvidas sobre como a IA do Decolou cria sites profissionais.
                </p>
              </div>
            </ScrollReveal>

            <div className="flex-1">
              <FAQAccordion type="single" collapsible>
                {FAQS.map((faq, i) => (
                  <FAQItem key={i} value={`faq-${i}`}>
                    <FAQTrigger>{faq.q}</FAQTrigger>
                    <FAQContent>{faq.a}</FAQContent>
                  </FAQItem>
                ))}
              </FAQAccordion>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/*  CTA                                                           */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-14">
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-3xl bg-black/80 px-6 py-20 text-center sm:px-12 md:py-28">
              <div className="pointer-events-none absolute -left-20 -top-20 size-64 rounded-full bg-white/[0.03] blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -right-20 size-64 rounded-full bg-white/[0.03] blur-3xl" />

              <div className="relative">
                <h2
                  className="mx-auto max-w-[600px] text-[32px] font-medium leading-[1.1] text-white/90 md:text-[48px]"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                  Deixe a IA criar seu site agora
                </h2>
                <p className="mx-auto mt-5 max-w-md text-base text-white/50">
                  Em 30 segundos voce tera um site profissional pronto para atrair clientes pelo Google.
                </p>
                <div className="mt-10">
                  <PglButton asChild size="lg" className="bg-white text-black/80 shadow-lg hover:bg-white/90 hover:text-black hover:shadow-xl">
                    <Link href={ctaHref}>
                      Criar meu site gratis
                      <IconArrowRight className="size-4" />
                    </Link>
                  </PglButton>
                </div>
                <p className="mt-4 text-sm text-white/30">Sem cartao de credito. Cancele quando quiser.</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <MarketingFooter />
    </main>
  )
}

/* ------------------------------------------------------------------ */
/*  Feature mockup skeletons                                            */
/* ------------------------------------------------------------------ */

function FeatureMockup({ type }: { type: string }) {
  if (type === "Design por IA") {
    return (
      <div className="overflow-hidden rounded-t-2xl border border-b-0 border-black/[0.06] bg-white shadow-sm">
        <div className="flex h-6 items-center gap-1.5 border-b border-black/[0.04] px-3">
          <div className="size-2 rounded-full bg-red-300" />
          <div className="size-2 rounded-full bg-amber-300" />
          <div className="size-2 rounded-full bg-emerald-300" />
        </div>
        <div className="bg-gradient-to-br from-black/80 to-black/60 px-5 py-8 text-center">
          <div className="mx-auto h-2.5 w-16 rounded bg-white/25" />
          <div className="mx-auto mt-3 h-4 w-40 rounded bg-white/40" />
          <div className="mx-auto mt-2 h-2.5 w-28 rounded bg-white/15" />
          <div className="mx-auto mt-4 h-6 w-20 rounded-lg bg-white/80" />
        </div>
        <div className="grid grid-cols-3 gap-2 p-3">
          <div className="h-12 rounded-lg bg-black/[0.04]" />
          <div className="h-12 rounded-lg bg-black/[0.04]" />
          <div className="h-12 rounded-lg bg-black/[0.04]" />
        </div>
      </div>
    )
  }

  if (type === "SEO") {
    return (
      <div className="pb-2">
        <div className="mx-auto flex max-w-xs items-center gap-2 rounded-full border border-black/[0.06] bg-white px-4 py-2.5">
          <IconSearch className="size-4 text-black/30" />
          <div className="h-3 w-28 rounded bg-black/10" />
        </div>
        <div className="mx-auto mt-4 max-w-xs space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className={cn("rounded-xl p-3", i === 1 ? "border border-black/[0.08] bg-white shadow-sm" : "bg-black/[0.02]")}>
              <div className="h-2 w-20 rounded bg-black/[0.06]" />
              <div className={cn("mt-1.5 h-3 w-40 rounded", i === 1 ? "bg-black/15" : "bg-black/[0.06]")} />
              <div className="mt-1 h-2 w-full rounded bg-black/[0.04]" />
              {i === 1 && (
                <div className="mt-2 flex items-center gap-1">
                  <div className="size-1.5 rounded-full bg-emerald-400" />
                  <div className="h-1.5 w-12 rounded bg-emerald-400/30" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (type === "Redator com IA") {
    return (
      <div className="space-y-3 pb-2">
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <div className="space-y-2">
            <div className="h-3 w-40 rounded bg-black/10" />
            <div className="h-2.5 w-full rounded bg-black/[0.06]" />
            <div className="h-2.5 w-[90%] rounded bg-black/[0.06]" />
            <div className="h-2.5 w-[70%] rounded bg-black/[0.06]" />
          </div>
          <div className="mt-3 flex items-center gap-1">
            <div className="h-2.5 w-16 rounded bg-black/[0.06]" />
            <div className="h-3.5 w-px animate-pulse bg-black/40" />
          </div>
        </div>
      </div>
    )
  }

  if (type === "Seguranca") {
    return (
      <div className="flex flex-col items-center gap-3 pb-4">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10">
          <IconShieldCheck className="size-7 text-emerald-500" />
        </div>
        <div className="flex w-full max-w-[200px] flex-col gap-2">
          {["SSL ativo", "Hospedagem CDN", "99.9% uptime"].map((label) => (
            <div key={label} className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 shadow-sm">
              <IconCheck className="size-3.5 text-emerald-500" />
              <span className="text-xs font-medium text-black/80">{label}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return null
}
