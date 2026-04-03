import { Metadata } from "next";
import { DesignTokensProvider } from "@/components/site-renderer/design-tokens-provider";
import type { DesignTokens } from "@/types/ai-generation";

const stratexTokens: DesignTokens = {
  palette: {
    primary: "#141414",
    secondary: "#1f514c",
    accent: "#1F514C",
    background: "#FFFFFF",
    surface: "#fafafa",
    text: "#141414",
    textMuted: "#636363",
  },
  headingFont: "playfair-display",
  bodyFont: "inter",
  style: "elegant",
  borderRadius: "lg",
  spacing: "spacious",
  highlightStyle: "inherit",
};

/* ─────────────────── Mock content ─────────────────── */

const headerContent = {
  storeName: "Stratex",
  logoUrl: "",
  ctaText: "Fale conosco",
  ctaLink: "#contato",
};

const heroContent = {
  headline: "Consultoria especializada que impulsiona *resultados* reais",
  subheadline: "Eleve seu negócio com insights especializados, estratégias sob medida e suporte dedicado para crescimento sustentável.",
  tagline: "Avaliação 4.9/5",
  ctaText: "Fale conosco",
  ctaLink: "#contato",
  backgroundImage: "",
};

const partnersContent = {
  title: "Parceiros:",
  items: [
    { value: "TechCorp", label: "parceiro", image: "https://framerusercontent.com/images/Qifbcz2UjIveHTCuImUZcqT9kZg.svg" },
    { value: "DataFlow", label: "parceiro", image: "https://framerusercontent.com/images/6QEz8kJbwqWFzbNDcgcMwaBk7Jk.svg" },
    { value: "CloudBase", label: "parceiro", image: "https://framerusercontent.com/images/UsU6TSwGi1GYzawTJkBdu5BNeqg.svg" },
    { value: "MetricHub", label: "parceiro", image: "https://framerusercontent.com/images/K7N7aNahky7BhBGyGdXp7oSDc.svg" },
    { value: "Automate", label: "parceiro", image: "https://framerusercontent.com/images/4I0nUFgLGKqAqwEE0S5l6yrCXzQ.svg" },
  ],
};

const aboutContent = {
  title: "Consultoria especializada para o *sucesso* do seu negócio",
  subtitle: "Por que nos escolher",
  storeName: "Stratex",
  competitorHeading: "Outras Empresas",
  advantageHeading: "Com Stratex",
  items: [
    { name: "Consultoria Personalizada", description: "Estratégias sob medida para atender às necessidades e objetivos únicos do seu negócio." },
    { name: "Suporte Dedicado", description: "Orientação especializada e assistência prática em cada etapa da sua jornada." },
    { name: "Preços Transparentes", description: "Sem surpresas — estrutura de preços clara para que você pague apenas pelo que precisa." },
  ],
  paragraphs: [
    { name: "Estratégias Genéricas", description: "Soluções padronizadas que não consideram as necessidades específicas do seu negócio." },
    { name: "Orientação Limitada", description: "Clientes enfrentam desafios complexos com suporte mínimo de especialistas." },
    { name: "Taxas Ocultas", description: "Custos inesperados e cobranças adicionais que inflam seu investimento total." },
  ],
};

const servicesContent = {
  title: "Expertise confiável para impulsionar seu maior *sucesso*",
  subtitle: "Serviços",
  items: [
    { name: "Consultoria Estratégica", description: "Planejamento e execução de estratégias de crescimento personalizadas.", image: "", badge: "Estratégia" },
    { name: "Transformação Digital", description: "Modernização de processos com tecnologia e inovação.", image: "", badge: "Digital" },
    { name: "Gestão de Projetos", description: "Coordenação profissional de projetos complexos com metodologias ágeis.", image: "", badge: "Gestão" },
  ],
};

const testimonialsContent = {
  title: "O que nossos clientes dizem sobre a *experiência* conosco",
  subtitle: "Depoimentos",
  items: [
    { text: "A Stratex revolucionou nossa compreensão do cliente. A equipe é excepcional!", author: "Maria Santos", role: "CEO, TechCorp", rating: 5, image: "" },
    { text: "Resultados impressionantes desde o primeiro mês. Estratégias que realmente funcionam.", author: "João Lima", role: "Diretor, DataFlow", rating: 5, image: "" },
    { text: "Profissionalismo e dedicação em cada etapa do processo. Altamente recomendado.", author: "Ana Costa", role: "Fundadora, CloudBase", rating: 5, image: "" },
  ],
};

const featuresContent = {
  title: "Benefícios que nos diferenciam das outras *empresas*",
  subtitle: "Diferenciais",
  items: [
    { name: "Consultorias Ilimitadas", description: "Agende quantas sessões estratégicas forem necessárias para o seu negócio." },
    { name: "Soluções Personalizadas", description: "Estratégias sob medida para seus objetivos únicos." },
    { name: "Insights Especializados", description: "Expertise do setor para decisões fundamentadas." },
    { name: "Estratégias com Dados", description: "Decisões seguras baseadas em pesquisa e análise." },
    { name: "Suporte Contínuo", description: "Orientação constante e recomendações atualizadas." },
    { name: "Execução Impecável", description: "Do planejamento à implementação, garantimos processos fluidos." },
  ],
};

const pricingContent = {
  title: "Preços flexíveis adaptados às suas *necessidades*",
  subtitle: "Preços",
  plans: [
    {
      name: "Standard",
      price: "R$299",
      description: "Ideal para pequenas equipes que buscam otimizar processos de consultoria.",
      ctaText: "Começar agora",
      ctaType: "link" as const,
      highlighted: false,
      features: ["Consultoria mensal", "Relatórios básicos", "Suporte por email", "1 reunião/mês"],
    },
    {
      name: "Premium",
      price: "R$799",
      description: "Para empresas que precisam de suporte dedicado e estratégias avançadas.",
      ctaText: "Começar agora",
      ctaType: "link" as const,
      highlighted: true,
      features: ["Consultoria semanal", "Analytics avançado", "Suporte prioritário", "Reuniões ilimitadas", "Estratégia personalizada"],
    },
  ],
};

const howWorksContent = {
  title: "Um processo comprovado para alcançar seus maiores *objetivos*",
  subtitle: "Como funciona",
  ctaText: "Fale conosco",
  ctaLink: "#contato",
  items: [
    { name: "Diagnóstico Inicial", description: "Analisamos seu negócio, mercado e concorrência para identificar oportunidades e desafios.", image: "" },
    { name: "Planejamento Estratégico", description: "Desenvolvemos um plano de ação personalizado com metas claras e cronograma definido.", image: "" },
    { name: "Execução e Resultados", description: "Implementamos as estratégias e acompanhamos métricas para garantir o sucesso.", image: "" },
  ],
};

const impactsContent = {
  title: "Resultados reais que geram impacto *duradouro* para todos",
  subtitle: "Impacto",
  description: "Entregamos estratégias sob medida, soluções inovadoras e suporte dedicado para crescimento sustentável.",
  backgroundImage: "https://framerusercontent.com/images/dI0cuWh7b6N8F0Vv0P0dYChCg.png",
  items: [
    { value: "R$7M+", label: "Receita" },
    { value: "72%", label: "Crescimento" },
    { value: "65%", label: "Habilidades" },
    { value: "78%", label: "Impacto" },
    { value: "1%", label: "Designers" },
    { value: "10+", label: "Consultores" },
  ],
};

const teamContent = {
  title: "Conheça os *especialistas* por trás do seu sucesso",
  subtitle: "Nossa equipe",
  items: [
    { name: "Carlos Silva", description: "CEO & Fundador", image: "" },
    { name: "Ana Oliveira", description: "Diretora de Estratégia", image: "" },
    { name: "Pedro Santos", description: "Head de Tecnologia", image: "" },
    { name: "Mariana Costa", description: "Head de Marketing", image: "" },
  ],
};

const faqContent = {
  title: "Respostas para suas *perguntas* mais comuns",
  subtitle: "FAQ",
  items: [
    { question: "Como funciona o processo de consultoria?", answer: "Começamos com um diagnóstico completo do seu negócio, seguido de um plano personalizado. Acompanhamos cada etapa da implementação com reuniões regulares e relatórios de progresso." },
    { question: "Qual o prazo para ver resultados?", answer: "Os primeiros resultados costumam aparecer entre 30 a 90 dias, dependendo da complexidade do projeto. Trabalhamos com metas mensuráveis desde o primeiro dia." },
    { question: "Vocês atendem empresas de todos os portes?", answer: "Sim! Temos planos adaptados para startups, PMEs e grandes empresas. Cada projeto recebe atenção personalizada independente do tamanho." },
    { question: "Como é feito o acompanhamento?", answer: "Através de dashboards em tempo real, reuniões semanais e relatórios mensais detalhados. Você sempre sabe exatamente o que está acontecendo." },
  ],
};

const contactContent = {
  title: "Entre em contato com nossa equipe de *especialistas*",
  subtitle: "Fale conosco",
};

const footerContent = {
  storeName: "Stratex",
  tagline: "Consultoria estratégica para negócios que buscam crescimento sustentável e resultados reais.",
  copyrightText: "",
};

const navigation = [
  { label: "Serviços", href: "#services", isExternal: false },
  { label: "Preços", href: "#pricing", isExternal: false },
  { label: "Equipe", href: "#team", isExternal: false },
  { label: "FAQ", href: "#faq", isExternal: false },
  { label: "Contato", href: "#contato", isExternal: false },
];

export const metadata: Metadata = {
  title: "Stratex Design Preview",
  robots: { index: false, follow: false },
};

import { StratexHeader } from "@/templates/stratex/sections/header";
import { StratexHero } from "@/templates/stratex/sections/hero";
import { StratexPartners } from "@/templates/stratex/sections/partners";
import { StratexAbout } from "@/templates/stratex/sections/about";
import { StratexServices } from "@/templates/stratex/sections/services";
import { StratexTestimonials } from "@/templates/stratex/sections/testimonials";
import { StratexFeatures } from "@/templates/stratex/sections/features";
import { StratexPricing } from "@/templates/stratex/sections/pricing";
import { StratexHowWorks } from "@/templates/stratex/sections/how-works";
import { StratexImpacts } from "@/templates/stratex/sections/impacts";
import { StratexTeam } from "@/templates/stratex/sections/team";
import { StratexFaq } from "@/templates/stratex/sections/faq";
import { StratexContact } from "@/templates/stratex/sections/contact";
import { StratexFooter } from "@/templates/stratex/sections/footer";

export default function StratexPreviewPage() {
  return (
    <DesignTokensProvider tokens={stratexTokens}>
      <div style={{ backgroundColor: "var(--pgl-background)", minHeight: "100vh" }}>
        <div className="fixed top-4 right-4 z-[9999] rounded-full bg-black/80 px-4 py-2 text-xs font-medium text-white/80 backdrop-blur">
          Stratex Design Preview
        </div>

        <SectionLabel label="header / variant 1 — flat serif nav" />
        <StratexHeader content={headerContent} tokens={stratexTokens} navigation={navigation} />

        <SectionLabel label="hero / variant 1 — dark hero" />
        <StratexHero content={heroContent} tokens={stratexTokens} />

        <SectionLabel label="stats / variant 1 — partners bar" />
        <StratexPartners content={partnersContent} tokens={stratexTokens} />

        <SectionLabel label="about / variant 1 — comparison grid" />
        <StratexAbout content={aboutContent} tokens={stratexTokens} />

        <SectionLabel label="services / variant 2 — service cards" />
        <StratexServices content={servicesContent} tokens={stratexTokens} />

        <SectionLabel label="testimonials / variant 1 — dark carousel" />
        <StratexTestimonials content={testimonialsContent} tokens={stratexTokens} />

        <SectionLabel label="services / variant 1 — feature grid" />
        <StratexFeatures content={featuresContent} tokens={stratexTokens} />

        <SectionLabel label="pricing / variant 1 — pricing tiers" />
        <StratexPricing content={pricingContent} tokens={stratexTokens} />

        <SectionLabel label="services / variant 3 — numbered steps" />
        <StratexHowWorks content={howWorksContent} tokens={stratexTokens} />

        <SectionLabel label="stats / variant 2 — impact stats" />
        <StratexImpacts content={impactsContent} tokens={stratexTokens} />

        <SectionLabel label="gallery / variant 1 — team carousel" />
        <StratexTeam content={teamContent} tokens={stratexTokens} />

        <SectionLabel label="faq / variant 1 — accordion" />
        <StratexFaq content={faqContent} tokens={stratexTokens} />

        <SectionLabel label="contact / variant 1 — dark form" />
        <StratexContact content={contactContent} tokens={stratexTokens} />

        <SectionLabel label="footer / variant 1 — 4-col footer" />
        <StratexFooter content={footerContent} tokens={stratexTokens} navigation={navigation} />
      </div>
    </DesignTokensProvider>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="mx-auto max-w-[1200px] px-6 pt-4">
      <div className="inline-flex items-center gap-2 rounded-full bg-black/5 px-3 py-1 text-xs font-mono text-black/50">
        <span className="w-2 h-2 rounded-full bg-teal-500" />
        {label}
      </div>
    </div>
  );
}
