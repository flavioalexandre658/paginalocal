import { Metadata } from "next";
import { DesignTokensProvider } from "@/components/site-renderer/design-tokens-provider";
import type { DesignTokens } from "@/types/ai-generation";

// Larko design tokens — dark green + lime, elegant consulting
const larkoTokens: DesignTokens = {
  palette: {
    primary: "#154528",
    secondary: "#E6F048",
    accent: "#309C5B",
    background: "#FFFFFF",
    surface: "#FBF9F5",
    text: "#000000",
    textMuted: "#548768",
  },
  headingFont: "geist",
  bodyFont: "geist",
  style: "elegant",
  borderRadius: "sm",
  spacing: "spacious",
  highlightStyle: "inherit",
};

/* ─────────────────── Mock content ─────────────────── */

const headerContent = {
  storeName: "Larko Consultoria",
  logoUrl: "",
  ctaText: "Fale conosco",
  ctaLink: "#contato",
};

const heroContent = {
  headline: "Estrategias que *transformam* negocios e geram *resultados*",
  subheadline:
    "Somos uma consultoria de marketing e estrategia digital que ajuda empresas a crescer com inteligencia, posicionamento e execucao de alto nivel.",
  ctaText: "Agendar reuniao",
  ctaLink: "#contato",
  ctaType: "link" as const,
  tagline: "Marketing & Consultoria",
  badgeText: "Resultados comprovados",
  brands: [
    { name: "Google Partner" },
    { name: "Meta Business" },
    { name: "HubSpot" },
    { name: "RD Station" },
    { name: "Semrush" },
  ],
};

const servicesContent = {
  title: "O que *fazemos*",
  subtitle: "Solucoes completas para acelerar o crescimento da sua empresa",
  items: [
    {
      name: "Estrategia Digital",
      description:
        "Planejamento estrategico com analise de mercado, posicionamento de marca e roadmap de crescimento personalizado para seu negocio.",
    },
    {
      name: "Marketing de Performance",
      description:
        "Campanhas de trafego pago em Google, Meta e LinkedIn com otimizacao continua para maximizar ROI e gerar leads qualificados.",
    },
    {
      name: "Branding & Identidade",
      description:
        "Construcao de marca forte com identidade visual, tom de voz, manual de marca e estrategia de comunicacao integrada.",
    },
    {
      name: "Consultoria de Vendas",
      description:
        "Estruturacao de funil de vendas, CRM, automacoes e treinamento de equipe para converter mais oportunidades em clientes.",
    },
  ],
};

const galleryContent = {
  title: "Projetos em *destaque*",
  subtitle: "Cases reais de clientes que transformaram seus resultados com a Larko",
  images: [
    {
      url: "",
      caption: "NovaTech — Reposicionamento de Marca",
      alt: "Case NovaTech reposicionamento de marca",
    },
    {
      url: "",
      caption: "HealthPlus — Campanha de Aquisicao",
      alt: "Case HealthPlus campanha de aquisicao",
    },
    {
      url: "",
      caption: "UrbanFit — Estrategia Omnichannel",
      alt: "Case UrbanFit estrategia omnichannel",
    },
  ],
};

const aboutContent = {
  title: "Larko Consultoria",
  subtitle: "Marketing Estrategico &\nConsultoria de Negocios",
  paragraphs: [
    "Nascemos da vontade de fazer marketing de verdade — aquele que entende o negocio, respeita o cliente e entrega resultado mensuravel.",
    "Com mais de 10 anos de experiencia no mercado, combinamos estrategia, criatividade e dados para ajudar empresas a crescerem de forma sustentavel e previsivel.",
  ],
  highlights: [
    { label: "150+", value: "Projetos entregues" },
    { label: "98%", value: "Clientes satisfeitos" },
    { label: "10+", value: "Anos de experiencia" },
    { label: "3x", value: "ROI medio dos clientes" },
  ],
  ctaText: "Conheca nossa historia",
  image: "",
};

const ctaContent = {
  title: "Pronto para *escalar* seu negocio?",
  subtitle:
    "Agende uma consultoria gratuita e descubra como podemos ajudar sua empresa a atingir o proximo nivel de crescimento.",
  ctaText: "Agendar consultoria gratuita",
  ctaType: "link" as const,
  ctaLink: "#contato",
};

const solutionsContent = {
  title: "Nossas *solucoes*",
  subtitle: "Metodologias testadas para cada fase do crescimento",
  items: [
    {
      name: "Growth Accelerator",
      description:
        "Programa intensivo de 90 dias para startups e PMEs que precisam escalar rapidamente com estrategia de aquisicao, retencao e monetizacao.",
      image: "",
    },
    {
      name: "Brand Authority",
      description:
        "Construcao de autoridade de marca atraves de conteudo estrategico, PR digital, SEO e posicionamento no mercado para se tornar referencia no segmento.",
      image: "",
    },
    {
      name: "Digital Transformation",
      description:
        "Transformacao digital completa com automacao de marketing, integracao de ferramentas, dashboards de BI e treinamento de equipe para operar com eficiencia.",
      image: "",
    },
  ],
};

const testimonialsContent = {
  title: "O que nossos *clientes* dizem",
  subtitle: "Depoimentos de quem ja cresceu com a Larko",
  items: [
    {
      text: "A Larko transformou nossa estrategia digital. Em 6 meses triplicamos os leads qualificados e dobramos o faturamento com campanhas inteligentes.",
      author: "Carolina Bastos",
      role: "CEO da NovaTech",
      image: "",
    },
    {
      text: "Profissionalismo e resultado. A equipe entende o negocio antes de propor qualquer acao, o que faz toda diferenca na qualidade das entregas.",
      author: "Ricardo Almeida",
      role: "Diretor Comercial da HealthPlus",
      image: "",
    },
    {
      text: "Melhor investimento que fizemos em marketing. O ROI das campanhas superou todas as expectativas e o suporte e impecavel.",
      author: "Fernanda Oliveira",
      role: "Fundadora da UrbanFit",
      image: "",
    },
    {
      text: "A consultoria de vendas reestruturou nosso funil e treinamos toda equipe. Resultado: 40% mais conversao em apenas 3 meses de trabalho.",
      author: "Marcos Tavares",
      role: "Head de Vendas da LogiPrime",
      image: "",
    },
  ],
};

const footerContent = {
  copyrightText: "\u00a9 2026 Larko Consultoria. Todos os direitos reservados.",
  storeName: "Larko Consultoria",
  showSocial: true,
};

const navigation = [
  { label: "Inicio", href: "#", isExternal: false },
  { label: "Servicos", href: "#services", isExternal: false },
  { label: "Sobre", href: "#about", isExternal: false },
  { label: "Solucoes", href: "#solutions", isExternal: false },
  { label: "Contato", href: "#contato", isExternal: false },
];

export const metadata: Metadata = {
  title: "Larko Template Preview",
  robots: { index: false, follow: false },
};

// Larko template sections
import { LarkoHeader } from "@/templates/larko/sections/header";
import { LarkoHero } from "@/templates/larko/sections/hero";
import { LarkoServices } from "@/templates/larko/sections/services";
import { LarkoGallery } from "@/templates/larko/sections/gallery";
import { LarkoAbout } from "@/templates/larko/sections/about";
import { LarkoCta } from "@/templates/larko/sections/cta";
import { LarkoSolutions } from "@/templates/larko/sections/solutions";
import { LarkoTestimonials } from "@/templates/larko/sections/testimonials";
import { LarkoFooter } from "@/templates/larko/sections/footer";
import { LarkoContact } from "@/templates/larko/sections/contact";

const contactContent = {
  title: "Pronto para *crescer?*",
  subtitle: "Conectar-se com a Larko significa desbloquear estrategias de marketing sob medida que geram resultados reais. Vamos construir uma estrategia vencedora juntos!",
  showMap: false,
  showForm: true,
  formFields: ["name", "email", "message"] as ("name" | "email" | "phone" | "message")[],
};

export default function LarkoPreviewPage() {
  return (
    <DesignTokensProvider tokens={larkoTokens}>
      <div style={{ backgroundColor: "var(--pgl-background)", minHeight: "100vh" }}>
        {/* Preview badge */}
        <div className="fixed top-4 right-4 z-[9999] rounded-full bg-black/80 px-4 py-2 text-xs font-medium text-white/80 backdrop-blur">
          Larko Template Preview
        </div>

        {/* Header */}
        <SectionLabel label="header / variant 1 — dark green nav" />
        <LarkoHeader
          content={headerContent}
          tokens={larkoTokens}
          navigation={navigation}
        />

        {/* Hero */}
        <SectionLabel label="hero / variant 1 — consulting hero" />
        <LarkoHero content={heroContent} tokens={larkoTokens} />

        {/* Services */}
        <SectionLabel label="services / variant 1 — services grid" />
        <LarkoServices content={servicesContent} tokens={larkoTokens} />

        {/* Gallery */}
        <SectionLabel label="gallery / variant 1 — project cases" />
        <LarkoGallery content={galleryContent} tokens={larkoTokens} />

        {/* About */}
        <SectionLabel label="about / variant 1 — about split" />
        <LarkoAbout content={aboutContent} tokens={larkoTokens} />

        {/* CTA */}
        <SectionLabel label="cta / variant 1 — cta dark" />
        <LarkoCta content={ctaContent} tokens={larkoTokens} />

        {/* Solutions */}
        <SectionLabel label="solutions / variant 1 — solutions cards" />
        <LarkoSolutions content={solutionsContent} tokens={larkoTokens} />

        {/* Testimonials */}
        <SectionLabel label="testimonials / variant 1 — testimonials carousel" />
        <LarkoTestimonials content={testimonialsContent} tokens={larkoTokens} />

        {/* Contact */}
        <SectionLabel label="contact / variant 1 — contact form" />
        <LarkoContact content={contactContent} tokens={larkoTokens} />

        {/* Footer */}
        <SectionLabel label="footer / variant 1 — footer with contact form" />
        <LarkoFooter content={footerContent} tokens={larkoTokens} />
      </div>
    </DesignTokensProvider>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="mx-auto max-w-[1200px] px-6 pt-4">
      <div className="inline-flex items-center gap-2 rounded-full bg-black/5 px-3 py-1 text-xs font-mono text-black/50">
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        {label}
      </div>
    </div>
  );
}
