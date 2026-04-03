import { Metadata } from "next";
import { DesignTokensProvider } from "@/components/site-renderer/design-tokens-provider";
import type { DesignTokens } from "@/types/ai-generation";

// Folioxa design tokens — dark/orange creative portfolio
const folioxaTokens: DesignTokens = {
  palette: {
    primary: "#212121",
    secondary: "#3CBA8C",
    accent: "#FF6E13",
    background: "#F7F7F7",
    surface: "#F3F3F1",
    text: "#000000",
    textMuted: "#666666",
  },
  headingFont: "outfit",
  bodyFont: "outfit",
  style: "bold",
  borderRadius: "lg",
  spacing: "spacious",
  highlightStyle: "inherit",
};

/* ─────────────────── Mock content ─────────────────── */

const headerContent = {
  storeName: "Lucas Studio",
  logoUrl: "",
  ctaText: "Fale comigo",
  ctaLink: "#contact",
  phone: "(11) 99876-5432",
  email: "contato@lucasstudio.com.br",
};

const heroContent = {
  headline: "Transformo ideias em *experiencias* digitais memoraveis",
  subheadline:
    "Designer e desenvolvedor full-stack com 8+ anos criando interfaces, marcas e produtos digitais que conectam pessoas e geram resultados reais.",
  ctaText: "Ver projetos",
  ctaLink: "#projects",
  ctaType: "link" as const,
  secondaryCtaText: "Fale comigo",
  secondaryCtaLink: "#contact",
  tagline: "Designer & Developer",
  backgroundImage: "",
  overlayOpacity: 0.3,
  brands: [
    { name: "Figma" },
    { name: "React" },
    { name: "Next.js" },
    { name: "TypeScript" },
    { name: "Framer Motion" },
    { name: "Tailwind" },
  ],
};

const galleryContent = {
  title: "Projetos *selecionados*",
  subtitle: "Uma selecao dos meus melhores trabalhos em design e desenvolvimento",
  images: [
    { url: "", caption: "NovaTech — Redesign SaaS Dashboard" },
    { url: "", caption: "Lumina — Identidade Visual Agencia" },
    { url: "", caption: "FinApp — App Mobile Fintech" },
    { url: "", caption: "Studio Bloom — E-commerce Cosmeticos" },
    { url: "", caption: "Vortex — Landing Page Startup" },
    { url: "", caption: "Orbita — Design System Completo" },
  ],
};

const aboutContent = {
  title: "Lucas Studio",
  subtitle: "UI/UX Design &\nDesenvolvimento Web",
  paragraphs: [
    // [0] Process card title
    "3 passos para o seu sucesso",
    // [1-3] Process steps
    "Criar Design",
    "Desenvolver",
    "Lançar",
    // [4-5] Row 2 card 1 (support)
    "Suporte 24h por E-mail",
    "Entre em contato a qualquer momento e receba ajuda em até 24 horas.",
    // [6-7] Row 2 card 2 (dark stat)
    "100%",
    "Clientes satisfeitos",
    // [8-9] Row 2 card 3 (dark feature)
    "Construa e lance sites com confiança",
    "Processo simplificado para criar, personalizar e publicar sites modernos.",
  ],
  highlights: [
    // [0] Main stat (accent number + description)
    { label: "20+", value: "Projetos concluídos" },
    // [1+] Checklist items
    { label: "Entrega no prazo", value: "" },
    { label: "Design de alta qualidade", value: "" },
    { label: "Satisfação garantida", value: "" },
  ],
  ctaText: "Fale comigo",
  image: "",
};

const processContent = {
  title: "Meu *processo*",
  subtitle: "Como transformo sua visao em realidade em 3 etapas claras",
  items: [
    {
      name: "Descoberta",
      description: "Entendo seus objetivos, publico e desafios. Pesquiso concorrentes e defino a estrategia ideal para o projeto com briefing detalhado.",
    },
    {
      name: "Design & Build",
      description: "Crio wireframes, prototipos interativos e o design final em Figma. Apos aprovacao, desenvolvo com codigo limpo e performatico.",
    },
    {
      name: "Entrega & Suporte",
      description: "Testes rigorosos, deploy e lancamento. Ofereco suporte pos-entrega com ajustes e otimizacoes para garantir o melhor resultado.",
    },
  ],
};

const servicesContent = {
  title: "Servicos que *ofereco*",
  subtitle: "Solucoes completas para sua presenca digital",
  items: [
    {
      name: "Web Design",
      description: "Sites responsivos, landing pages e aplicacoes web com design moderno e foco em conversao.",
      ctaText: "Saiba mais",
    },
    {
      name: "Branding",
      description: "Identidade visual completa — logo, paleta, tipografia e manual da marca que transmite sua essencia.",
      ctaText: "Saiba mais",
    },
    {
      name: "UI/UX Design",
      description: "Interfaces intuitivas com pesquisa de usuario, wireframes, prototipos e testes de usabilidade.",
      ctaText: "Saiba mais",
    },
    {
      name: "Desenvolvimento",
      description: "Front-end com React, Next.js e TypeScript. Performance otimizada e SEO de alto nivel.",
      ctaText: "Saiba mais",
    },
    {
      name: "Motion Design",
      description: "Animacoes e micro-interacoes que dao vida as interfaces e melhoram a experiencia do usuario.",
      ctaText: "Saiba mais",
    },
  ],
};

const awardsContent = {
  title: "Premios & Reconhecimentos",
  items: [
    { value: "Awwwards Site of the Day", label: "2025" },
    { value: "CSS Design Awards", label: "2024" },
    { value: "Webby Awards Nominee", label: "2024" },
    { value: "FWA of the Month", label: "2023" },
  ],
};

const howWorksContent = {
  title: "Como *funciona*",
  subtitle: "Do primeiro contato ao lancamento — transparencia em cada etapa",
  items: [
    {
      name: "Briefing & Proposta",
      description: "Voce me conta sua ideia e objetivos. Eu analiso, pesquiso e envio uma proposta detalhada com escopo, prazo e investimento.",
    },
    {
      name: "Prototipo & Validacao",
      description: "Crio prototipos navegaveis em Figma para voce testar e validar antes de qualquer linha de codigo. Ajustes ilimitados nesta fase.",
    },
    {
      name: "Desenvolvimento & Deploy",
      description: "Transformo o design aprovado em codigo producao-ready com testes, otimizacao de performance e deploy na infraestrutura ideal.",
    },
  ],
};

const pricingContent = {
  title: "Planos sob *medida*",
  subtitle: "Precos",
  plans: [
    {
      name: "Starter",
      price: "R$ 2.500",
      description: "Ideal para landing pages e projetos menores que precisam de presenca online profissional.",
      features: [
        "Design de ate 5 paginas",
        "Responsivo mobile",
        "SEO basico",
        "Entrega em 72h",
        "Desenvolvimento completo",
        "1 rodada de revisao",
      ],
      ctaText: "Comecar agora",
      highlighted: false,
    },
    {
      name: "Profissional",
      price: "R$ 5.900",
      description: "Para startups e negocios que precisam de um site focado em conversao.",
      features: [
        "Ate 10 paginas",
        "UI/UX personalizado",
        "Animacoes avancadas",
        "Entrega em 48h",
        "Revisoes ilimitadas",
        "CMS integrado",
      ],
      ctaText: "Escolher Pro",
      highlighted: true,
    },
    {
      name: "Premium",
      price: "R$ 9.900",
      description: "Para marcas estabelecidas que precisam de um site totalmente customizado e de alta performance.",
      features: [
        "Ate 20 paginas",
        "Estrategia de marca",
        "Suporte prioritario",
        "Revisoes ilimitadas",
        "Codigo customizado",
        "CMS + E-commerce",
      ],
      ctaText: "Fale comigo",
      highlighted: false,
    },
  ],
};

const testimonialsContent = {
  title: "O que meus *clientes* dizem",
  subtitle: "Depoimentos",
  items: [
    {
      text: "Transformou nossa ideia em um site polido e de alta conversao com excelente pensamento UI/UX e execucao impecavel.",
      author: "Mariana Costa",
      role: "Fundadora",
      rating: 5,
      image: "",
    },
    {
      text: "Wireframes convertidos em um site lindo e responsivo com layout perfeito, espacamento, fluxo suave e hierarquia visual envolvente.",
      author: "Rafael Mendes",
      role: "Product Manager",
      rating: 5,
      image: "",
    },
    {
      text: "Design impressionante que melhorou o engajamento significativamente com visuais modernos, cores equilibradas e navegacao suave.",
      author: "Camila Ferreira",
      role: "Head de Marketing",
      rating: 5,
      image: "",
    },
    {
      text: "Capturou a visao da marca perfeitamente e construiu um site premium, rapido e visualmente impressionante com excelente usabilidade.",
      author: "Lucas Andrade",
      role: "Consultor de Startups",
      rating: 5,
      image: "",
    },
    {
      text: "Interfaces limpas e modernas entregues com grande atencao aos detalhes, criatividade e experiencia de usuario consistente.",
      author: "Fernanda Lima",
      role: "Diretora Criativa",
      rating: 5,
      image: "",
    },
    {
      text: "Atencao aos detalhes, equilibrio de cores, consistencia de layout e tipografia fizeram nosso site se destacar dos concorrentes.",
      author: "Pedro Santos",
      role: "Co-Fundador",
      rating: 5,
      image: "",
    },
  ],
};

const faqContent = {
  title: "Perguntas *frequentes*",
  subtitle: "Tudo que voce precisa saber antes de comecar",
  items: [
    {
      question: "Qual o prazo medio de entrega de um projeto?",
      answer: "Depende da complexidade. Uma landing page leva de 2 a 3 semanas. Sites completos de 4 a 8 semanas. Apps web sob medida de 8 a 16 semanas. Sempre defino prazos realistas no briefing.",
    },
    {
      question: "Voce trabalha com contrato e NF?",
      answer: "Sim. Todo projeto inicia com contrato formal detalhando escopo, prazos e valores. Emito nota fiscal para todos os servicos prestados.",
    },
    {
      question: "Como funciona o pagamento?",
      answer: "Geralmente 50% na aprovacao da proposta e 50% na entrega final. Para projetos maiores, parcelo em marcos de entrega. Aceito PIX, transferencia e cartao.",
    },
    {
      question: "Posso solicitar alteracoes apos a entrega?",
      answer: "Claro! Cada plano inclui rodadas de revisao. Apos a entrega, ofereco 30 dias de suporte para ajustes pontuais sem custo adicional.",
    },
    {
      question: "Voce desenvolve o front-end ou so o design?",
      answer: "Ambos! Trabalho do conceito ao codigo. Entrego projetos completos em React/Next.js ou posso entregar apenas o design em Figma, conforme sua necessidade.",
    },
    {
      question: "Atende clientes de outros estados ou paises?",
      answer: "Sim, trabalho 100% remoto. Ja atendi clientes de todo o Brasil, Portugal, EUA e outros paises. Comunicacao por video call, Slack ou WhatsApp.",
    },
  ],
};

const ctaContent = {
  title: "Vamos criar algo *incrivel* juntos?",
  subtitle: "Tenho vagas limitadas por mes para manter a qualidade. Entre em contato e vamos conversar sobre seu projeto.",
  ctaText: "Iniciar projeto",
  ctaType: "link" as const,
  ctaLink: "#contact",
};

const footerContent = {
  copyrightText: "\u00a9 2026 Lucas Studio. Todos os direitos reservados.",
  storeName: "Lucas Studio",
  phone: "(11) 99876-5432",
  email: "contato@lucasstudio.com.br",
  showSocial: true,
};

const navigation = [
  { label: "Inicio", href: "#", isExternal: false },
  { label: "Projetos", href: "#projects", isExternal: false },
  { label: "Servicos", href: "#services", isExternal: false },
  { label: "Precos", href: "#pricing", isExternal: false },
  { label: "Contato", href: "#contact", isExternal: false },
];

export const metadata: Metadata = {
  title: "Folio Design Preview",
  robots: { index: false, follow: false },
};

// Folioxa template sections
import { FolioxaHeader } from "@/templates/folioxa/sections/header";
import { FolioxaHero } from "@/templates/folioxa/sections/hero";
import { FolioxaGallery } from "@/templates/folioxa/sections/gallery";
import { FolioxaAbout } from "@/templates/folioxa/sections/about";
import { FolioxaProcess } from "@/templates/folioxa/sections/process";
import { FolioxaServices } from "@/templates/folioxa/sections/services";
import { FolioxaAwards } from "@/templates/folioxa/sections/awards";
import { FolioxaHowWorks } from "@/templates/folioxa/sections/how-works";
import { FolioxaPricing } from "@/templates/folioxa/sections/pricing";
import { FolioxaTestimonials } from "@/templates/folioxa/sections/testimonials";
import { FolioxaFaq } from "@/templates/folioxa/sections/faq";
import { FolioxaCta } from "@/templates/folioxa/sections/cta";
import { FolioxaFooter } from "@/templates/folioxa/sections/footer";

export default function FolioxaPreviewPage() {
  return (
    <DesignTokensProvider tokens={folioxaTokens}>
      <div style={{ backgroundColor: "var(--pgl-background)", minHeight: "100vh" }}>
        {/* Preview badge */}
        <div className="fixed top-4 right-4 z-[9999] rounded-full bg-black/80 px-4 py-2 text-xs font-medium text-white/80 backdrop-blur">
          Folio Design Preview
        </div>

        {/* Header */}
        <SectionLabel label="header / variant 1 — dark nav" />
        <FolioxaHeader
          content={headerContent}
          tokens={folioxaTokens}
          navigation={navigation}
        />

        {/* Hero */}
        <SectionLabel label="hero / variant 1 — profile hero" />
        <FolioxaHero content={heroContent} tokens={folioxaTokens} />

        {/* Gallery / Projects */}
        <SectionLabel label="gallery / variant 1 — projects grid" />
        <FolioxaGallery content={galleryContent} tokens={folioxaTokens} />

        {/* About */}
        <SectionLabel label="about / variant 1 — about split" />
        <FolioxaAbout content={aboutContent} tokens={folioxaTokens} />

        {/* Process Steps */}
        <SectionLabel label="services / variant 1 — process steps" />
        <FolioxaProcess content={processContent} tokens={folioxaTokens} />

        {/* Services Cards */}
        <SectionLabel label="services / variant 2 — services cards" />
        <FolioxaServices content={servicesContent} tokens={folioxaTokens} />

        {/* Awards */}
        <SectionLabel label="stats / variant 1 — awards" />
        <FolioxaAwards content={awardsContent} tokens={folioxaTokens} />

        {/* How It Works */}
        <SectionLabel label="services / variant 3 — how it works" />
        <FolioxaHowWorks content={howWorksContent} tokens={folioxaTokens} />

        {/* Pricing */}
        <SectionLabel label="pricing / variant 1 — pricing plans" />
        <FolioxaPricing content={pricingContent} tokens={folioxaTokens} />

        {/* Testimonials */}
        <SectionLabel label="testimonials / variant 1 — testimonials" />
        <FolioxaTestimonials content={testimonialsContent} tokens={folioxaTokens} />

        {/* FAQ */}
        <SectionLabel label="faq / variant 1 — faq accordion" />
        <FolioxaFaq content={faqContent} tokens={folioxaTokens} />

        {/* CTA */}
        <SectionLabel label="cta / variant 1 — cta dark" />
        <FolioxaCta content={ctaContent} tokens={folioxaTokens} />

        {/* Footer */}
        <SectionLabel label="footer / variant 1 — minimal footer" />
        <FolioxaFooter
          content={footerContent}
          tokens={folioxaTokens}
        />
      </div>
    </DesignTokensProvider>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="mx-auto max-w-[1200px] px-6 pt-4">
      <div className="inline-flex items-center gap-2 rounded-full bg-black/5 px-3 py-1 text-xs font-mono text-black/50">
        <span className="w-2 h-2 rounded-full bg-orange-400" />
        {label}
      </div>
    </div>
  );
}
