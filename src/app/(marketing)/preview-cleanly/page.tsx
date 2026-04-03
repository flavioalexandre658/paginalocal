import { Metadata } from "next";
import { DesignTokensProvider } from "@/components/site-renderer/design-tokens-provider";
import type { DesignTokens } from "@/types/ai-generation";

const cleanlyTokens: DesignTokens = {
  palette: {
    primary: "#171206",
    secondary: "#5B5955",
    accent: "#FEBF03",
    background: "#FFFFFF",
    surface: "#f2f7f9",
    text: "#171206",
    textMuted: "#5B5955",
  },
  headingFont: "inter",
  bodyFont: "inter",
  style: "bold",
  borderRadius: "lg",
  spacing: "spacious",
  highlightStyle: "inherit",
};

const headerContent = { storeName: "Cleanly", ctaText: "Agendar limpeza", ctaLink: "#contato", phone: "(11) 98765-4321", email: "contato@cleanly.com.br" };
const heroContent = { headline: "Experimente o melhor em *limpeza* profissional!", subheadline: "Serviços de limpeza residencial e comercial com produtos ecológicos e equipe treinada.", tagline: "Avaliação 4.9/5", ctaText: "Agendar limpeza", ctaLink: "#contato", backgroundImage: "" };
const partnersContent = { title: "Parceiros:", items: [{ value: "EcoClean", label: "parceiro" }, { value: "GreenWash", label: "parceiro" }, { value: "PureHome", label: "parceiro" }, { value: "SparkPro", label: "parceiro" }, { value: "FreshAir", label: "parceiro" }] };
const servicesContent = { title: "Limpeza *Ecológica*", subtitle: "Serviços", items: [{ name: "Limpeza Residencial", description: "Limpeza completa para casas e apartamentos com produtos seguros.", image: "" }, { name: "Limpeza Comercial", description: "Soluções profissionais para escritórios e espaços comerciais.", image: "" }, { name: "Limpeza Pós-Obra", description: "Remoção de resíduos e limpeza profunda após reformas.", image: "" }] };
const aboutContent = { title: "Por que escolher a *Cleanly*?", subtitle: "Diferenciais", items: [{ name: "Produtos Ecológicos", description: "Utilizamos apenas produtos biodegradáveis e seguros para sua família." }, { name: "Equipe Treinada", description: "Profissionais certificados e com experiência comprovada." }, { name: "Garantia de Satisfação", description: "Se não ficar satisfeito, voltamos e limpamos novamente." }, { name: "Agendamento Flexível", description: "Escolha o melhor horário para você, inclusive fins de semana." }] };
const howWorksContent = { title: "Como a *Cleanly* funciona", subtitle: "Como funciona", items: [{ name: "Escolha o serviço", description: "Selecione o tipo de limpeza e a data desejada.", image: "" }, { name: "Confirmação rápida", description: "Receba a confirmação em minutos com todos os detalhes.", image: "" }, { name: "Limpeza impecável", description: "Nossa equipe chega no horário e entrega resultados.", image: "" }] };
const statsContent = { title: "Nossos números", items: [{ value: "4.9", label: "Avaliação média" }, { value: "500+", label: "Clientes satisfeitos" }, { value: "10k+", label: "Limpezas realizadas" }, { value: "98%", label: "Taxa de satisfação" }] };
const benefitsContent = { title: "Benefícios de contratar a *Cleanly*", subtitle: "Benefícios", items: [{ name: "Economize tempo", description: "Contratar um profissional para limpar seu espaço libera horas do seu dia para o que realmente importa." }, { name: "Ambiente mais saudável", description: "Limpeza profissional remove alérgenos, bactérias e poluentes que afetam sua saúde." }, { name: "Menos estresse", description: "Pare de se preocupar com limpeza e comece a aproveitar mais a vida!" }] };
const testimonialsContent = { title: "O que nossos *clientes* dizem", subtitle: "Depoimentos", items: [{ text: "A Cleanly transformou minha rotina! Casa sempre impecável.", author: "Maria Santos", role: "Cliente residencial", rating: 5, image: "" }, { text: "Serviço pontual e profissional. Recomendo para todos.", author: "João Lima", role: "Empresário", rating: 5, image: "" }, { text: "Produtos ecológicos e resultado incrível. Nota 10!", author: "Ana Costa", role: "Mãe de família", rating: 5, image: "" }] };
const faqContent = { title: "Perguntas *frequentes*", subtitle: "FAQ", items: [{ question: "Quais produtos vocês utilizam?", answer: "Utilizamos exclusivamente produtos ecológicos e biodegradáveis, seguros para crianças e animais de estimação." }, { question: "Como faço para agendar?", answer: "Você pode agendar pelo nosso site, WhatsApp ou telefone. Respondemos em até 30 minutos." }, { question: "Vocês atendem aos fins de semana?", answer: "Sim! Atendemos de segunda a sábado, com horários flexíveis incluindo manhã e tarde." }, { question: "Qual a garantia do serviço?", answer: "Se não ficar 100% satisfeito, voltamos e refazemos a limpeza sem custo adicional." }] };
const ctaContent = { title: "Pronto para uma casa mais limpa?", subtitle: "Agende agora", ctaText: "Agendar limpeza", ctaLink: "#contato" };
const footerContent = { storeName: "Cleanly", tagline: "Serviços profissionais de limpeza residencial e comercial com produtos ecológicos.", copyrightText: "" };
const navigation = [{ label: "Início", href: "#", isExternal: false }, { label: "Serviços", href: "#services", isExternal: false }, { label: "Sobre", href: "#about", isExternal: false }, { label: "FAQ", href: "#faq", isExternal: false }, { label: "Contato", href: "#contato", isExternal: false }];

export const metadata: Metadata = { title: "Cleanly Design Preview", robots: { index: false, follow: false } };

import { CleanlyHeader } from "@/templates/cleanly/sections/header";
import { CleanlyHero } from "@/templates/cleanly/sections/hero";
import { CleanlyPartners } from "@/templates/cleanly/sections/partners";
import { CleanlyServices } from "@/templates/cleanly/sections/services";
import { CleanlyAbout } from "@/templates/cleanly/sections/about";
import { CleanlyHowWorks } from "@/templates/cleanly/sections/how-works";
import { CleanlyStats } from "@/templates/cleanly/sections/stats";
import { CleanlyBenefits } from "@/templates/cleanly/sections/benefits";
import { CleanlyTestimonials } from "@/templates/cleanly/sections/testimonials";
import { CleanlyFaq } from "@/templates/cleanly/sections/faq";
import { CleanlyCta } from "@/templates/cleanly/sections/cta";
import { CleanlyFooter } from "@/templates/cleanly/sections/footer";

export default function CleanlyPreviewPage() {
  return (
    <DesignTokensProvider tokens={cleanlyTokens}>
      <div style={{ backgroundColor: "var(--pgl-background)", minHeight: "100vh" }}>
        <div className="fixed top-4 right-4 z-[9999] rounded-full bg-black/80 px-4 py-2 text-xs font-medium text-white/80 backdrop-blur">
          Cleanly Design Preview
        </div>

        <SectionLabel label="header / variant 1 — dark nav" />
        <CleanlyHeader content={headerContent} tokens={cleanlyTokens} navigation={navigation} />

        <SectionLabel label="hero / variant 1 — dark hero" />
        <CleanlyHero content={heroContent} tokens={cleanlyTokens} />

        <SectionLabel label="stats / variant 1 — brand bar" />
        <CleanlyPartners content={partnersContent} tokens={cleanlyTokens} />

        <SectionLabel label="services / variant 1 — service cards" />
        <CleanlyServices content={servicesContent} tokens={cleanlyTokens} />

        <SectionLabel label="about / variant 1 — why choose us" />
        <CleanlyAbout content={aboutContent} tokens={cleanlyTokens} />

        <SectionLabel label="services / variant 2 — how it works" />
        <CleanlyHowWorks content={howWorksContent} tokens={cleanlyTokens} />

        <SectionLabel label="stats / variant 2 — impact stats" />
        <CleanlyStats content={statsContent} tokens={cleanlyTokens} />

        <SectionLabel label="services / variant 3 — benefits" />
        <CleanlyBenefits content={benefitsContent} tokens={cleanlyTokens} />

        <SectionLabel label="testimonials / variant 1 — carousel" />
        <CleanlyTestimonials content={testimonialsContent} tokens={cleanlyTokens} />

        <SectionLabel label="faq / variant 1 — accordion" />
        <CleanlyFaq content={faqContent} tokens={cleanlyTokens} />

        <SectionLabel label="cta / variant 1 — dark cta" />
        <CleanlyCta content={ctaContent} tokens={cleanlyTokens} />

        <SectionLabel label="footer / variant 1 — dark footer" />
        <CleanlyFooter content={footerContent} tokens={cleanlyTokens} navigation={navigation} />
      </div>
    </DesignTokensProvider>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="mx-auto max-w-[1200px] px-6 pt-4">
      <div className="inline-flex items-center gap-2 rounded-full bg-black/5 px-3 py-1 text-xs font-mono text-black/50">
        <span className="w-2 h-2 rounded-full bg-yellow-400" />
        {label}
      </div>
    </div>
  );
}
