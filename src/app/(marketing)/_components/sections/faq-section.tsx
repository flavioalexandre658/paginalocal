"use client"

import { ScrollReveal } from "@/components/marketing/scroll-reveal"
import {
  FAQAccordion,
  FAQItem,
  FAQTrigger,
  FAQContent,
} from "@/components/marketing/faq-accordion"

const FAQS = [
  {
    q: "Preciso de algo mais do que apenas um site para minha empresa. O Decolou pode me ajudar?",
    a: "Com certeza. O Decolou foi projetado como uma plataforma completa para criacao de negocios. Alem do site, voce tem CRM integrado, faturamento, analytics, ferramentas de SEO e assistencia de IA — tudo em uma unica plataforma, sem precisar contratar servicos separados.",
  },
  {
    q: "Como o Decolou me ajuda a administrar meu negocio no dia a dia?",
    a: "O Decolou vai muito alem da criacao do seu site. Ele ajuda voce a escrever conteudo de marketing, otimizar seu SEO, acompanhar leads pelo CRM, gerar faturas e fornece insights de desempenho do seu negocio — tudo automatizado por inteligencia artificial.",
  },
  {
    q: "Se eu usar o Decolou, precisarei pagar por varias ferramentas?",
    a: "Nao. O Decolou elimina a necessidade de contratar separadamente construtores de sites, sistemas de CRM, softwares de faturamento e ferramentas de marketing. Tudo em uma unica plataforma com uma assinatura simples a partir de R$ 29,90/mes.",
  },
  {
    q: "O Decolou e apenas para novas empresas, ou empresas ja estabelecidas tambem podem usa-lo?",
    a: "O Decolou funciona para ambos os casos. Seja voce um iniciante que precisa entrar online rapidamente ou uma empresa consolidada que quer modernizar sua presenca digital, a plataforma se adapta ao seu momento.",
  },
  {
    q: "Posso personalizar o design do site gerado pela IA?",
    a: "Sim, totalmente. Voce pode alterar cores, fontes, textos e imagens clicando diretamente no site. O editor visual permite ajustes em tempo real sem precisar de conhecimento tecnico — basta clicar e editar.",
  },
  {
    q: "Posso usar o construtor de sites de graca?",
    a: "Sim. Voce pode criar e testar seu site gratuitamente. Para publicar e acessar recursos premium como dominio personalizado, analytics e CRM, escolha um dos nossos planos.",
  },
]

export function FAQSection() {
  return (
    <section className="bg-white pt-24 md:pt-32">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-14">
        {/* Two-column layout: heading left, accordion right */}
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-24">

          {/* Left — sticky heading */}
          <ScrollReveal className="lg:w-[360px] lg:shrink-0">
            <div className="lg:sticky lg:top-24">
              <h2 className="font-heading text-[32px] leading-[40px] text-black/80 md:text-[40px] md:leading-[48px]">
                Perguntas frequentes
              </h2>
              <p className="mt-4 text-base text-black/55 leading-relaxed">
                Tire suas duvidas sobre o Decolou e descubra como podemos ajudar o seu negocio a crescer online.
              </p>
            </div>
          </ScrollReveal>

          {/* Right — accordion */}
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
  )
}
