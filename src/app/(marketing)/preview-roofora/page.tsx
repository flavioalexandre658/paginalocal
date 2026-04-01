import { Metadata } from "next";
import { DesignTokensProvider } from "@/components/site-renderer/design-tokens-provider";
import type { DesignTokens } from "@/types/ai-generation";

// Roofora design tokens — dark green + lime accent
const rooforaTokens: DesignTokens = {
  palette: {
    primary: "#0E1201",
    secondary: "#1a2003",
    accent: "#CDF660",
    background: "#FFFFFF",
    surface: "#0E1201",
    text: "#000000",
    textMuted: "#00000099",
  },
  headingFont: "urbanist",
  bodyFont: "urbanist",
  style: "bold",
  borderRadius: "full",
  spacing: "spacious",
  highlightStyle: "inherit",
};

/* ─────────────────── Mock content ─────────────────── */

const headerContent = {
  storeName: "Apex Telhados",
  logoUrl: "",
  ctaText: "Orçamento Grátis",
  ctaLink: "#contact",
  phone: "(11) 98765-4321",
  email: "contato@apextelhados.com.br",
};

const heroContent = {
  headline: "Telhados que Protegem o Que Importa",
  subheadline:
    "Soluções completas em coberturas, reformas e impermeabilização. Nossa equipe especializada garante qualidade, durabilidade e o melhor custo-benefício para o seu projeto.",
  tagline: "Especialistas em Coberturas e Telhados",
  badgeText: "500+",
  ctaText: "Solicitar Orçamento",
  ctaLink: "#contact",
  ctaType: "link" as const,
  secondaryCtaText: "Fale Conosco Agora",
  secondaryCtaLink: "#contact",
  backgroundImage: "",
  overlayOpacity: 0.55,
  brands: [
    { name: "Brasilit" },
    { name: "Eternit" },
    { name: "Tegula" },
    { name: "Precon" },
    { name: "Eucatex" },
  ],
};

const aboutContent = {
  title: "Qualidade e Confiança em Cada *Projeto*",
  subtitle: "SOBRE NÓS",
  paragraphs: [
    "Atendimento rápido e profissional em toda a região.",
    "Equipe certificada com mais de 15 anos de experiência.",
    "Materiais de primeira linha e garantia em todos os serviços.",
  ],
  highlights: [
    {
      label: "Nossa Missão",
      value:
        "Na Apex Telhados, nossa missão é oferecer soluções em coberturas que combinam segurança, estética e durabilidade. Trabalhamos para que cada cliente tenha a tranquilidade de um telhado bem feito.",
    },
    {
      label: "Nossa Expertise",
      value:
        "Com mais de 15 anos no mercado, nossa equipe domina desde telhados residenciais simples até projetos comerciais de grande porte, sempre utilizando as melhores técnicas e materiais disponíveis.",
    },
    {
      label: "Nossos Valores",
      value:
        "Transparência, comprometimento e respeito ao cliente são os pilares do nosso trabalho. Cada obra é tratada com dedicação, pontualidade e atenção aos mínimos detalhes.",
    },
  ],
  image: "",
};

const servicesContent = {
  title: "Soluções Completas para Seu Telhado",
  subtitle: "Nossos Serviços",
  items: [
    {
      name: "Telhados Residenciais",
      description:
        "Instalação e reforma de telhados para casas e sobrados com materiais de alta qualidade. Projetos personalizados que unem beleza, funcionalidade e proteção para sua família.",
      ctaText: "Saiba Mais",
      ctaLink: "#contact",
    },
    {
      name: "Energia Solar",
      description:
        "Instalação de painéis solares integrados ao telhado, reduzindo sua conta de energia em até 95%. Projetos sob medida com retorno garantido do investimento.",
      ctaText: "Saiba Mais",
      ctaLink: "#contact",
    },
    {
      name: "Impermeabilização",
      description:
        "Proteção completa contra infiltrações e umidade com produtos de última geração. Garantimos a estanqueidade de lajes, terraços e coberturas com garantia estendida.",
      ctaText: "Saiba Mais",
      ctaLink: "#contact",
    },
    {
      name: "Reformas de Telhado",
      description:
        "Revitalização completa de coberturas desgastadas, incluindo troca de telhas, madeiramento e estrutura metálica. Devolvemos segurança e beleza ao seu imóvel.",
      ctaText: "Saiba Mais",
      ctaLink: "#contact",
    },
    {
      name: "Calhas e Rufos",
      description:
        "Instalação e manutenção de sistemas de escoamento pluvial. Calhas, rufos, condutores e pingadeiras dimensionados corretamente para evitar transbordamentos e danos.",
      ctaText: "Saiba Mais",
      ctaLink: "#contact",
    },
    {
      name: "Manutenção Preventiva",
      description:
        "Inspeções periódicas para identificar e corrigir problemas antes que se agravem. Limpeza de calhas, verificação de telhas e revisão da estrutura para maior durabilidade.",
      ctaText: "Saiba Mais",
      ctaLink: "#contact",
    },
  ],
};

const statsContent = {
  items: [
    { value: "15+", label: "Anos de Experiência" },
    { value: "98%", label: "Clientes Satisfeitos" },
    { value: "500+", label: "Projetos Realizados" },
    { value: "24/7", label: "Atendimento de Emergência" },
  ],
};

const galleryContent = {
  title: "Projetos que Falam por Si",
  subtitle: "NOSSOS PROJETOS",
  images: [
    { url: "", caption: "Telhado Colonial Residencial" },
    { url: "", caption: "Cobertura Metálica Comercial" },
    { url: "", caption: "Instalação de Painéis Solares" },
    { url: "", caption: "Reforma Completa de Telhado" },
    { url: "", caption: "Impermeabilização de Terraço" },
    { url: "", caption: "Sistema de Calhas sob Medida" },
  ],
};

const howWorksContent = {
  title: "Do Primeiro Contato à Obra Finalizada",
  subtitle: "COMO FUNCIONA",
  items: [
    {
      name: "Contato e Consulta",
      description:
        "Entre em contato por telefone, WhatsApp ou formulário. Nossa equipe responde rapidamente para entender suas necessidades e agendar uma visita técnica sem compromisso.",
    },
    {
      name: "Inspeção e Orçamento",
      description:
        "Nossos técnicos visitam o local para uma avaliação completa da cobertura. Após a inspeção, você recebe um orçamento detalhado, transparente e sem surpresas.",
    },
    {
      name: "Execução e Entrega",
      description:
        "Com o projeto aprovado, iniciamos a obra com pontualidade e organização. Acompanhe cada etapa e receba sua cobertura finalizada dentro do prazo combinado.",
    },
  ],
};

const testimonialsContent = {
  title: "O Que Nossos Clientes Dizem",
  subtitle: "DEPOIMENTOS",
  items: [
    {
      text: "A Apex Telhados reformou toda a cobertura da minha casa em tempo recorde. Profissionais educados, obra limpa e resultado impecável. Recomendo de olhos fechados!",
      author: "Carlos Eduardo Silva",
      role: "Proprietário Residencial",
      rating: 5,
    },
    {
      text: "Contratamos a Apex para instalar energia solar no nosso galpão. O projeto foi entregue antes do prazo e já estamos economizando mais de 80% na conta de luz. Excelente investimento!",
      author: "Fernanda Oliveira",
      role: "Empresária",
      rating: 5,
    },
    {
      text: "Depois de anos sofrendo com infiltrações, finalmente encontrei uma empresa séria. A impermeabilização ficou perfeita e o atendimento desde o orçamento até a entrega foi nota 10.",
      author: "Roberto Mendes",
      role: "Síndico",
      rating: 5,
    },
    {
      text: "Precisei de um reparo urgente após uma tempestade e a equipe da Apex veio no mesmo dia. Resolveram tudo com muita agilidade e competência. São parceiros de confiança!",
      author: "Ana Paula Costa",
      role: "Proprietária Residencial",
      rating: 5,
    },
    {
      text: "Trabalhamos com a Apex em três condomínios e o resultado sempre supera as expectativas. Preço justo, materiais de qualidade e equipe comprometida do início ao fim.",
      author: "Marcos Augusto Lima",
      role: "Administrador de Condomínios",
      rating: 5,
    },
    {
      text: "A instalação das calhas e rufos ficou impecável. Acabou com o problema de água escorrendo pelas paredes. Equipe pontual e muito profissional.",
      author: "Juliana Ferreira",
      role: "Proprietária Residencial",
      rating: 5,
    },
  ],
};

const faqContent = {
  title: "Dúvidas Frequentes Sobre Nossos Serviços",
  subtitle: "PERGUNTAS FREQUENTES",
  items: [
    {
      question: "Qual o prazo médio para a reforma de um telhado?",
      answer:
        "O prazo varia conforme o tamanho e a complexidade do projeto. Telhados residenciais simples levam de 3 a 7 dias úteis, enquanto projetos maiores podem levar de 2 a 4 semanas. Após a visita técnica, informamos o cronograma detalhado.",
    },
    {
      question: "Vocês oferecem garantia nos serviços?",
      answer:
        "Sim! Todos os nossos serviços possuem garantia por escrito. A garantia de mão de obra é de 5 anos e os materiais seguem a garantia do fabricante, que pode chegar a 25 anos dependendo do produto escolhido.",
    },
    {
      question: "É possível instalar energia solar em qualquer tipo de telhado?",
      answer:
        "Na maioria dos casos, sim. Nossos engenheiros avaliam a estrutura, inclinação e orientação do telhado para garantir a melhor eficiência dos painéis. Caso seja necessário algum reforço estrutural, incluímos no orçamento.",
    },
    {
      question: "Como funciona o orçamento? É cobrado pela visita técnica?",
      answer:
        "O orçamento é totalmente gratuito e sem compromisso. Agendamos uma visita técnica ao local, avaliamos as condições da cobertura e apresentamos uma proposta detalhada com valores, materiais e prazos.",
    },
    {
      question: "Vocês atendem em quais regiões?",
      answer:
        "Atendemos toda a Grande São Paulo e região metropolitana. Para projetos em outras localidades do estado, entre em contato para verificarmos a disponibilidade e condições de atendimento.",
    },
  ],
};

const ctaContent = {
  title: "Garanta a Proteção do Seu *Imóvel* Hoje",
  subtitle: "ENTRE EM CONTATO",
  ctaText: "Solicitar Orçamento Grátis",
  ctaType: "link" as const,
  ctaLink: "#contact",
};

const footerContent = {
  copyrightText: "© 2026 Apex Telhados. Todos os direitos reservados.",
  storeName: "Apex Telhados",
  phone: "(11) 98765-4321",
  email: "contato@apextelhados.com.br",
  address: "Rua das Coberturas, 350 - Vila Industrial, São Paulo - SP",
  showSocial: true,
};

const navigation = [
  { label: "Início", href: "#home", isExternal: false },
  { label: "Sobre", href: "#about", isExternal: false },
  { label: "Serviços", href: "#services", isExternal: false },
  { label: "Projetos", href: "#gallery", isExternal: false },
  { label: "Contato", href: "#contact", isExternal: false },
];

export const metadata: Metadata = {
  title: "Apex Design Preview",
  robots: { index: false, follow: false },
};

// Roofora template sections
import { RooforaHeader } from "@/templates/roofora/sections/header";
import { RooforaHero } from "@/templates/roofora/sections/hero";
import { RooforaAbout } from "@/templates/roofora/sections/about";
import { RooforaServices } from "@/templates/roofora/sections/services";
import { RooforaStats } from "@/templates/roofora/sections/stats";
import { RooforaGallery } from "@/templates/roofora/sections/gallery";
import { RooforaHowWorks } from "@/templates/roofora/sections/how-works";
import { RooforaTestimonials } from "@/templates/roofora/sections/testimonials";
import { RooforaFaq } from "@/templates/roofora/sections/faq";
import { RooforaCta } from "@/templates/roofora/sections/cta";
import { RooforaFooter } from "@/templates/roofora/sections/footer";

export default function RooforaPreviewPage() {
  return (
    <DesignTokensProvider tokens={rooforaTokens}>
      <div style={{ backgroundColor: "var(--pgl-background)", minHeight: "100vh" }}>
        {/* Preview badge */}
        <div className="fixed top-4 right-4 z-[9999] rounded-full bg-black/80 px-4 py-2 text-xs font-medium text-white/80 backdrop-blur">
          Roofora / Apex Design Preview
        </div>

        {/* Header */}
        <SectionLabel label="header / variant 1 — topbar + nav" />
        <RooforaHeader
          content={headerContent}
          tokens={rooforaTokens}
          navigation={navigation}
        />

        {/* Hero */}
        <SectionLabel label="hero / variant 1 — roofora hero" />
        <RooforaHero content={heroContent} tokens={rooforaTokens} />

        {/* About */}
        <SectionLabel label="about / variant 1 — tabs + checklist" />
        <RooforaAbout content={aboutContent} tokens={rooforaTokens} />

        {/* Services */}
        <SectionLabel label="services / variant 1 — service cards" />
        <RooforaServices content={servicesContent} tokens={rooforaTokens} />

        {/* Stats */}
        <SectionLabel label="stats / variant 1 — counter" />
        <RooforaStats content={statsContent} tokens={rooforaTokens} />

        {/* Gallery */}
        <SectionLabel label="gallery / variant 1 — project grid" />
        <RooforaGallery content={galleryContent} tokens={rooforaTokens} />

        {/* How It Works */}
        <SectionLabel label="how-works / variant 1 — 3 steps" />
        <RooforaHowWorks content={howWorksContent} tokens={rooforaTokens} />

        {/* Testimonials */}
        <SectionLabel label="testimonials / variant 1 — client reviews" />
        <RooforaTestimonials content={testimonialsContent} tokens={rooforaTokens} />

        {/* FAQ */}
        <SectionLabel label="faq / variant 1 — accordion" />
        <RooforaFaq content={faqContent} tokens={rooforaTokens} />

        {/* CTA */}
        <SectionLabel label="cta / variant 1 — banner" />
        <RooforaCta content={ctaContent} tokens={rooforaTokens} />

        {/* Footer */}
        <SectionLabel label="footer / variant 1 — dark columns" />
        <RooforaFooter
          content={footerContent}
          tokens={rooforaTokens}
        />
      </div>
    </DesignTokensProvider>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="mx-auto max-w-[1200px] px-6 pt-4">
      <div className="inline-flex items-center gap-2 rounded-full bg-black/5 px-3 py-1 text-xs font-mono text-black/50">
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
        {label}
      </div>
    </div>
  );
}
