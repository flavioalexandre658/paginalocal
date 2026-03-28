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
    q: "Como o Decolou cria meu site com IA?",
    a: "Basta digitar o nome do seu negocio. Nossa IA busca suas informacoes no Google — fotos, avaliacoes, endereco e horarios — e cria um site profissional completo em segundos. Voce pode personalizar tudo depois no editor visual.",
  },
  {
    q: "Posso personalizar o design do site gerado pela IA?",
    a: "Sim, totalmente. O editor visual permite alterar cores, fontes, temas, textos e imagens clicando diretamente no site. Voce edita tudo em tempo real, sem precisar de conhecimento tecnico e sem tocar em codigo.",
  },
  {
    q: "Meu site sera otimizado para SEO?",
    a: "Sim. Todos os sites incluem meta tags otimizadas, codigo limpo, carregamento ultra-rapido e sao totalmente responsivos. O conteudo e gerado pela IA ja pensando em SEO para sua cidade e seu nicho, ajudando seu negocio a aparecer no topo do Google.",
  },
  {
    q: "Como funciona a integracao com o Google Meu Negocio?",
    a: "Ao criar seu site, importamos automaticamente as fotos, avaliacoes, nota, horario de funcionamento e endereco do seu perfil no Google. Isso deixa seu site completo desde o primeiro momento, sem voce precisar preencher nada manualmente.",
  },
  {
    q: "Posso usar o construtor de sites de graca?",
    a: "Sim. Voce pode criar e visualizar seu site gratuitamente. Para publicar online e acessar recursos como dominio personalizado e rastreamento de contatos, escolha um dos nossos planos a partir de R$ 59,90/mes.",
  },
  {
    q: "Como funciona o dominio personalizado?",
    a: "Com um plano ativo, voce pode conectar seu proprio dominio (ex: seunegocio.com.br) ao site. Nos cuidamos de toda a configuracao tecnica de DNS para voce — basta informar o dominio e a gente faz o resto.",
  },
]

export function FAQSection() {
  return (
    <section className="bg-white pt-24 md:pt-32">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-14">
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
