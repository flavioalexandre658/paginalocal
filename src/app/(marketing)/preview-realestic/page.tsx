import { Metadata } from "next";
import { DesignTokensProvider } from "@/components/site-renderer/design-tokens-provider";
import type { DesignTokens } from "@/types/ai-generation";

// Realestic design tokens — blue accent, clean modern
const realesticTokens: DesignTokens = {
  palette: {
    primary: "#171717",
    secondary: "#1f1f1f",
    accent: "#3675FF",
    background: "#FFFFFF",
    surface: "#fcfcfc",
    text: "#171717",
    textMuted: "#8a8a8a",
  },
  headingFont: "satoshi",
  bodyFont: "satoshi",
  style: "elegant",
  borderRadius: "lg",
  spacing: "spacious",
  highlightStyle: "inherit",
};

/* ─────────────────── Mock content ─────────────────── */

const headerContent = {
  storeName: "Realestic",
  logoUrl: "",
  ctaText: "Fale Conosco",
  ctaLink: "#contato",
};

const heroContent = {
  headline: "Encontre o imóvel que combina com sua *vida*",
  tagline: "Imóveis",
  subheadline: "Seu novo lar está mais perto do que imagina. Experiência e dedicação para encontrar o imóvel perfeito.",
  ctaText: "Ver imóveis",
  ctaLink: "#imoveis",
  backgroundImage: "",
};

const visionContent = {
  title: "Os valores que guiam tudo o que *fazemos*",
  subtitle: "Nossa Missão",
  ctaText: "Saiba mais",
  ctaLink: "#sobre",
  items: [
    { name: "Imóvel dos Sonhos", description: "Descubra seu espaço ideal com nossas opções de imóveis cuidadosamente selecionados." },
    { name: "Investimento Seguro", description: "Análise profissional para garantir o melhor retorno no seu investimento imobiliário." },
    { name: "Suporte Completo", description: "Acompanhamento em todas as etapas, da busca até a assinatura do contrato." },
  ],
};

const propertiesContent = {
  title: "Encontre seu *imóvel* ideal aqui",
  subtitle: "Imóveis",
  ctaText: "Ver todos",
  ctaLink: "#imoveis",
  items: [
    { name: "Residência Jardim", description: "Rua das Flores, 123 - São Paulo", badge: "Disponível", details: "3 quartos · 2 banheiros · 180m²", image: "" },
    { name: "Apartamento Centro", description: "Av. Paulista, 456 - São Paulo", badge: "Destaque", details: "2 quartos · 1 banheiro · 85m²", image: "" },
    { name: "Casa Alphaville", description: "Alameda Santos, 789 - Barueri", badge: "Disponível", details: "4 quartos · 3 banheiros · 320m²", image: "" },
    { name: "Cobertura Duplex", description: "Rua Oscar Freire, 1010 - SP", badge: "Novo", details: "3 quartos · 2 banheiros · 210m²", image: "" },
    { name: "Studio Moderno", description: "Vila Madalena, 222 - São Paulo", badge: "Disponível", details: "1 quarto · 1 banheiro · 45m²", image: "" },
    { name: "Sobrado Vila Nova", description: "Rua Augusta, 333 - São Paulo", badge: "Destaque", details: "3 quartos · 2 banheiros · 160m²", image: "" },
  ],
};

const featuresContent = {
  title: "Descubra as vantagens e *benefícios* exclusivos",
  subtitle: "Diferenciais",
  items: [
    { name: "Orientação Especializada", description: "Insights profissionais para decisões imobiliárias com confiança." },
    { name: "Busca Personalizada", description: "Encontramos imóveis que combinam com suas necessidades únicas." },
    { name: "Negociação Eficiente", description: "Expertise em negociação para garantir o melhor valor." },
    { name: "Documentação Completa", description: "Assessoria jurídica e documental em todas as etapas." },
    { name: "Pós-Venda", description: "Suporte contínuo mesmo após a conclusão do negócio." },
    { name: "Avaliação Precisa", description: "Laudos e avaliações baseados em dados de mercado atualizados." },
  ],
};

const quoteContent = {
  title: "Na Realestic,",
  items: [
    {
      text: "nossa missão é simples: oferecer as melhores soluções imobiliárias, sob medida para suas necessidades. Entendemos que encontrar o imóvel perfeito é mais do que uma transação — é sobre criar um espaço onde a vida acontece. Nossa equipe dedicada combina experiência no setor com um olhar humano.",
      author: "Carlos Silva",
      role: "Fundador e CEO",
      image: "",
    },
  ],
};

const faqContent = {
  title: "Descubra as *vantagens* e benefícios exclusivos",
  subtitle: "Como funciona",
  backgroundImage: "",
  items: [
    { question: "Encontre seu imóvel ideal", answer: "Navegue por nosso catálogo completo, filtre por localização, preço e características para encontrar o lar perfeito." },
    { question: "Agende uma visita", answer: "Marque um horário para visitar o imóvel pessoalmente e conhecer cada detalhe do espaço." },
    { question: "Feche o negócio", answer: "Nossa equipe acompanha toda a documentação e negociação até a entrega das chaves." },
  ],
};

const aboutContent = {
  title: "O que nos torna o *parceiro* ideal para seu imóvel?",
  subtitle: "Por que nos escolher",
  backgroundImage: "",
  items: [
    { name: "Conhecimento Local", description: "Experiência profunda e insights sobre o mercado da região." },
    { name: "Busca Personalizada", description: "Encontramos imóveis que combinam com suas necessidades únicas." },
    { name: "Suporte Completo", description: "Da busca até a entrega das chaves, acompanhamos cada etapa." },
  ],
};

const testimonialsContent = {
  title: "Feedback real de clientes *satisfeitos*",
  subtitle: "Depoimentos",
  items: [
    { text: "A experiência foi incrível! Encontramos nosso apartamento dos sonhos em tempo recorde.", author: "Maria Santos", role: "São Paulo, SP", rating: 5, image: "" },
    { text: "Profissionalismo e atenção aos detalhes. Recomendo para todos que buscam um imóvel.", author: "João Lima", role: "Rio de Janeiro, RJ", rating: 5, image: "" },
    { text: "Do início ao fim, tudo foi transparente e eficiente. Equipe nota 10!", author: "Ana Costa", role: "Belo Horizonte, MG", rating: 5, image: "" },
    { text: "Encontraram exatamente o que procurávamos. Atendimento personalizado e dedicado.", author: "Pedro Oliveira", role: "Curitiba, PR", rating: 5, image: "" },
  ],
};

const blogsContent = {
  title: "Dicas e novidades sobre o mercado *imobiliário*",
  subtitle: "Blog",
  items: [
    { value: "Guia completo para comprar seu primeiro imóvel", label: "Dicas", image: "" },
    { value: "Como escolher o bairro ideal para morar", label: "Mercado", image: "" },
    { value: "Tendências de decoração para 2025", label: "Tendências", image: "" },
  ],
};

const ctaContent = {
  title: "Pronto para dar o próximo passo? Fale conosco.",
  subtitle: "Quer agendar uma visita?",
  ctaText: "Ver imóveis",
  ctaLink: "#imoveis",
};

const footerContent = {
  copyrightText: "Copyright @2026",
  storeName: "Realestic",
  tagline: "Descubra imóveis incríveis com toda *facilidade*!",
  heading: "Descubra imóveis incríveis com toda *facilidade*!",
};

const navigation = [
  { label: "Início", href: "#home", isExternal: false },
  { label: "Imóveis", href: "#imoveis", isExternal: false },
  { label: "Sobre", href: "#sobre", isExternal: false },
  { label: "Blog", href: "#blog", isExternal: false },
  { label: "Contato", href: "#contato", isExternal: false },
];

export const metadata: Metadata = {
  title: "Realestic Design Preview",
  robots: { index: false, follow: false },
};

// Realestic template sections
import { RealesticHeader } from "@/templates/realestic/sections/header";
import { RealesticHero } from "@/templates/realestic/sections/hero";
import { RealesticVision } from "@/templates/realestic/sections/vision";
import { RealesticProperties } from "@/templates/realestic/sections/properties";
import { RealesticFeatures } from "@/templates/realestic/sections/features";
import { RealesticQuote } from "@/templates/realestic/sections/quote";
import { RealesticFaq } from "@/templates/realestic/sections/faq";
import { RealesticAbout } from "@/templates/realestic/sections/about";
import { RealesticTestimonials } from "@/templates/realestic/sections/testimonials";
import { RealesticBlogs } from "@/templates/realestic/sections/blogs";
import { RealesticCta } from "@/templates/realestic/sections/cta";
import { RealesticFooter } from "@/templates/realestic/sections/footer";

export default function RealesticPreviewPage() {
  return (
    <DesignTokensProvider tokens={realesticTokens}>
      <div style={{ backgroundColor: "var(--pgl-background)", minHeight: "100vh" }}>
        {/* Preview badge */}
        <div className="fixed top-4 right-4 z-[9999] rounded-full bg-black/80 px-4 py-2 text-xs font-medium text-white/80 backdrop-blur">
          Realestic Design Preview
        </div>

        {/* Header */}
        <SectionLabel label="header / variant 1 — flat nav" />
        <RealesticHeader content={headerContent} tokens={realesticTokens} navigation={navigation} />

        {/* Hero */}
        <SectionLabel label="hero / variant 1 — centered hero" />
        <RealesticHero content={heroContent} tokens={realesticTokens} />

        {/* Vision (services v1) */}
        <SectionLabel label="services / variant 1 — vision cards" />
        <RealesticVision content={visionContent} tokens={realesticTokens} />

        {/* Properties (gallery v1) */}
        <SectionLabel label="gallery / variant 1 — property grid" />
        <RealesticProperties content={propertiesContent} tokens={realesticTokens} />

        {/* Features (services v2) */}
        <SectionLabel label="services / variant 2 — feature grid" />
        <RealesticFeatures content={featuresContent} tokens={realesticTokens} />

        {/* Quote (testimonials v1) */}
        <SectionLabel label="testimonials / variant 1 — quote split" />
        <RealesticQuote content={quoteContent} tokens={realesticTokens} />

        {/* FAQ */}
        <SectionLabel label="faq / variant 1 — accordion split" />
        <RealesticFaq content={faqContent} tokens={realesticTokens} />

        {/* About / Why Us */}
        <SectionLabel label="about / variant 1 — why us overlay" />
        <RealesticAbout content={aboutContent} tokens={realesticTokens} />

        {/* Testimonials (v2 carousel) */}
        <SectionLabel label="testimonials / variant 2 — carousel" />
        <RealesticTestimonials content={testimonialsContent} tokens={realesticTokens} />

        {/* Blogs (stats v1) */}
        <SectionLabel label="stats / variant 1 — blog grid" />
        <RealesticBlogs content={blogsContent} tokens={realesticTokens} />

        {/* CTA */}
        <SectionLabel label="cta / variant 1 — accent card" />
        <RealesticCta content={ctaContent} tokens={realesticTokens} />

        {/* Footer */}
        <SectionLabel label="footer / variant 1 — grid footer" />
        <RealesticFooter content={footerContent} tokens={realesticTokens} navigation={navigation} />
      </div>
    </DesignTokensProvider>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="mx-auto max-w-[1200px] px-6 pt-4">
      <div className="inline-flex items-center gap-2 rounded-full bg-black/5 px-3 py-1 text-xs font-mono text-black/50">
        <span className="w-2 h-2 rounded-full bg-blue-400" />
        {label}
      </div>
    </div>
  );
}
