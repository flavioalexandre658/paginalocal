import { Metadata } from "next";
import { DesignTokensProvider } from "@/components/site-renderer/design-tokens-provider";
import type { DesignTokens } from "@/types/ai-generation";

// Bellezza design tokens — rose gold beauty accent
const bellezzaTokens: DesignTokens = {
  palette: {
    primary: "#2D2B30",
    secondary: "#8B7355",
    accent: "#BFA492",
    background: "#FFFFFF",
    surface: "#F5F0EB",
    text: "#2D2B30",
    textMuted: "#4D4D4D",
  },
  headingFont: "playfair-display",
  bodyFont: "poppins",
  style: "elegant",
  borderRadius: "lg",
  spacing: "spacious",
  highlightStyle: "inherit",
};

/* ─────────────────── Mock content ─────────────────── */

const headerContent = {
  storeName: "Bellezza",
  logoUrl: "",
  ctaText: "Compre agora",
  ctaLink: "#products",
  phone: "(11) 98765-4321",
  email: "contato@bellezza.com.br",
};

const heroContent = {
  headline: "Descubra a *beleza* que voce merece",
  subheadline:
    "Cosmeticos premium selecionados para realcar sua beleza natural. Formulas veganas, cruelty-free e com ingredientes botanicos de alta performance.",
  ctaText: "Compre agora",
  ctaLink: "#products",
  ctaType: "link" as const,
  backgroundImage: "",
  overlayOpacity: 0.3,
  brands: [
    { name: "500+ Produtos" },
    { name: "Cruelty-Free" },
    { name: "Frete Gratis" },
    { name: "4.9 Avaliacoes" },
  ],
};

const aboutContent = {
  title: "Beleza que *transforma*",
  subtitle: "NOSSA HISTORIA",
  paragraphs: [
    "Nascemos da paixao por cosmeticos naturais e da vontade de oferecer produtos que respeitam sua pele e o meio ambiente. Cada formula e desenvolvida com ingredientes botanicos de alta qualidade.",
    "Desde 2019, selecionamos marcas independentes e artesanais que compartilham nossos valores de sustentabilidade e eficacia comprovada.",
    "Nosso compromisso e com a beleza consciente — produtos veganos, cruelty-free e com embalagens reciclaveis que fazem bem para voce e para o planeta.",
  ],
  highlights: [
    { label: "100% Vegano", value: "Todos os produtos sao livres de ingredientes de origem animal" },
    { label: "Sustentavel", value: "Embalagens reciclaveis e processos eco-conscientes" },
    { label: "Dermatologicamente Testado", value: "Formulas seguras aprovadas por dermatologistas" },
  ],
  ctaText: "Conheca nossa historia",
  image: "",
};

const catalogContent = {
  title: "Nossas Categorias",
  subtitle: "Encontre o produto perfeito para sua rotina de beleza",
  categories: [
    { name: "Skincare", description: "Cuidados diarios para uma pele radiante e saudavel", image: "" },
    { name: "Maquiagem", description: "Cores e texturas para todas as ocasioes", image: "" },
    { name: "Cabelos", description: "Tratamentos e finalizadores profissionais", image: "" },
    { name: "Perfumaria", description: "Fragancias exclusivas e sofisticadas", image: "" },
    { name: "Corpo & Banho", description: "Hidratacao e cuidados corporais completos", image: "" },
  ],
};

const bestsellersContent = {
  title: "Mais *vendidos*",
  subtitle: "Os queridinhos das nossas clientes",
  items: [
    { name: "Serum Vitamina C 30ml", description: "Iluminador facial com acido hialuronico e vitamina E", price: "R$ 129,90", image: "" },
    { name: "Creme Hidratante Noturno", description: "Regeneracao celular com retinol e colageno vegetal", price: "R$ 89,90", image: "" },
    { name: "Agua Micelar Rosas 200ml", description: "Limpeza suave com extrato de rosas damascenas", price: "R$ 49,90", image: "" },
    { name: "Protetor Solar FPS 50", description: "Protecao diaria com toque seco e vitamina E", price: "R$ 69,90", image: "" },
  ],
};

const benefitsContent = {
  title: "Por que escolher a *Bellezza*",
  subtitle: "Compromisso com qualidade e sustentabilidade em cada produto",
  items: [
    { name: "100% Vegano", description: "Todos os nossos produtos sao formulados sem ingredientes de origem animal e nao testados em animais." },
    { name: "Ingredientes Naturais", description: "Formulas com extratos botanicos, oleos essenciais e ativos de alta performance derivados da natureza." },
    { name: "Frete Gratis", description: "Entrega gratuita para compras acima de R$ 150 em todo o Brasil. Embalagens eco-friendly." },
    { name: "Satisfacao Garantida", description: "Troca ou devolucao em ate 30 dias se voce nao estiver 100% satisfeita com seu produto." },
  ],
};

const productsContent = {
  title: "Todos os Produtos",
  subtitle: "Explore nosso catalogo completo de cosmeticos premium",
  items: [
    { name: "Oleo Facial de Rosa Mosqueta", description: "Regenerador e anti-idade com vitamina A natural", price: "R$ 79,90", image: "" },
    { name: "Mascara Capilar de Argan", description: "Hidratacao profunda com oleo de argan organico", price: "R$ 59,90", image: "" },
    { name: "Tonico Facial de Hamamelis", description: "Equilibra a oleosidade e refina os poros", price: "R$ 39,90", image: "" },
    { name: "Batom Matte Longa Duracao", description: "Cobertura intensa com formula hidratante", price: "R$ 54,90", image: "" },
    { name: "Esfoliante Corporal de Cafe", description: "Remove celulas mortas e ativa a circulacao", price: "R$ 44,90", image: "" },
    { name: "Perfume Floral Exclusivo 50ml", description: "Notas de jasmin, peonia e sândalo", price: "R$ 189,90", image: "" },
  ],
};

const blogContent = {
  title: "Artigos do *Blog*",
  subtitle: "Dicas de beleza, skincare e bem-estar para sua rotina diaria",
  images: [
    { url: "", caption: "10 passos para uma rotina de skincare perfeita" },
    { url: "", caption: "Ingredientes naturais que transformam sua pele" },
    { url: "", caption: "Tendencias de maquiagem para a primavera 2026" },
  ],
};

const instagramContent = {
  title: "Siga @bellezza no Instagram",
  subtitle: "Acompanhe novidades, lancamentos e dicas de beleza direto no seu feed",
  ctaText: "Siga-nos",
  ctaType: "link" as const,
  ctaLink: "https://instagram.com/bellezza",
};

const footerContent = {
  copyrightText: "\u00a9 2026 Bellezza. Todos os direitos reservados.",
  storeName: "Bellezza",
  phone: "(11) 98765-4321",
  email: "contato@bellezza.com.br",
  address: "Rua Oscar Freire, 890 — Jardins, Sao Paulo — SP",
  showSocial: true,
};

const navigation = [
  { label: "Inicio", href: "#", isExternal: false },
  { label: "Loja", href: "#products", isExternal: false },
  { label: "Artigos", href: "#blog", isExternal: false },
  { label: "Sobre", href: "#about", isExternal: false },
  { label: "Contato", href: "#contact", isExternal: false },
];

export const metadata: Metadata = {
  title: "Bloom Design Preview",
  robots: { index: false, follow: false },
};

// Bellezza template sections
import { BellezzaHeader } from "@/templates/bellezza/sections/header";
import { BellezzaHero } from "@/templates/bellezza/sections/hero";
import { BellezzaAbout } from "@/templates/bellezza/sections/about";
import { BellezzaCatalog } from "@/templates/bellezza/sections/catalog";
import { BellezzaBestsellers } from "@/templates/bellezza/sections/bestsellers";
import { BellezzaBenefits } from "@/templates/bellezza/sections/benefits";
import { BellezzaProducts } from "@/templates/bellezza/sections/products";
import { BellezzaBlog } from "@/templates/bellezza/sections/blog";
import { BellezzaInstagram } from "@/templates/bellezza/sections/instagram";
import { BellezzaFooter } from "@/templates/bellezza/sections/footer";

export default function BellezzaPreviewPage() {
  return (
    <DesignTokensProvider tokens={bellezzaTokens}>
      <div style={{ backgroundColor: "var(--pgl-background)", minHeight: "100vh" }}>
        {/* Preview badge */}
        <div className="fixed top-4 right-4 z-[9999] rounded-full bg-black/80 px-4 py-2 text-xs font-medium text-white/80 backdrop-blur">
          Bloom Design Preview
        </div>

        {/* Header */}
        <SectionLabel label="header / variant 1 — elegant nav" />
        <BellezzaHeader
          content={headerContent}
          tokens={bellezzaTokens}
          navigation={navigation}
        />

        {/* Hero */}
        <SectionLabel label="hero / variant 1 — beauty hero" />
        <BellezzaHero content={heroContent} tokens={bellezzaTokens} />

        {/* About */}
        <SectionLabel label="about / variant 1 — product showcase" />
        <BellezzaAbout content={aboutContent} tokens={bellezzaTokens} />

        {/* Catalog / Categories */}
        <SectionLabel label="catalog / variant 1 — categories" />
        <BellezzaCatalog content={catalogContent} tokens={bellezzaTokens} />

        {/* Bestsellers */}
        <SectionLabel label="featured-products / variant 1 — bestsellers" />
        <BellezzaBestsellers content={bestsellersContent} tokens={bellezzaTokens} />

        {/* Benefits */}
        <SectionLabel label="services / variant 1 — benefits" />
        <BellezzaBenefits content={benefitsContent} tokens={bellezzaTokens} />

        {/* All Products */}
        <SectionLabel label="featured-products / variant 2 — product list" />
        <BellezzaProducts content={productsContent} tokens={bellezzaTokens} />

        {/* Blog */}
        <SectionLabel label="gallery / variant 1 — blog articles" />
        <BellezzaBlog content={blogContent} tokens={bellezzaTokens} />

        {/* Instagram CTA */}
        <SectionLabel label="cta / variant 1 — instagram feed" />
        <BellezzaInstagram content={instagramContent} tokens={bellezzaTokens} />

        {/* Footer */}
        <SectionLabel label="footer / variant 1 — elegant footer" />
        <BellezzaFooter
          content={footerContent}
          tokens={bellezzaTokens}
        />
      </div>
    </DesignTokensProvider>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="mx-auto max-w-[1200px] px-6 pt-4">
      <div className="inline-flex items-center gap-2 rounded-full bg-black/5 px-3 py-1 text-xs font-mono text-black/50">
        <span className="w-2 h-2 rounded-full bg-amber-400" />
        {label}
      </div>
    </div>
  );
}
