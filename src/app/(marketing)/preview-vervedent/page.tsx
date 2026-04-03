import { Metadata } from "next";
import { DesignTokensProvider } from "@/components/site-renderer/design-tokens-provider";
import type { DesignTokens } from "@/types/ai-generation";

// Verve Dent design tokens — teal/cyan healthcare accent
const verveTokens: DesignTokens = {
  palette: {
    primary: "#01494B",
    secondary: "#029297",
    accent: "#68F8FD",
    background: "#F5FFFF",
    surface: "#FAFAFA",
    text: "#1A1A1A",
    textMuted: "#333333",
  },
  headingFont: "inter",
  bodyFont: "inter",
  style: "elegant",
  borderRadius: "lg",
  spacing: "spacious",
  highlightStyle: "inherit",
};

/* ─────────────────── Mock content ─────────────────── */

const headerContent = {
  storeName: "Verve Odontologia",
  logoUrl: "",
  ctaText: "Agendar consulta",
  ctaLink: "#contact",
  phone: "(11) 3456-7890",
  email: "contato@verveodon.com.br",
};

const heroContent = {
  headline: "Seu sorriso merece *cuidado* de verdade",
  subheadline:
    "Tratamentos odontologicos modernos com tecnologia de ponta, equipe especializada e ambiente acolhedor. Agende sua consulta e descubra o melhor da odontologia.",
  tagline: "Odontologia moderna e humanizada",
  ctaText: "Agendar consulta",
  ctaLink: "#contact",
  ctaType: "link" as const,
  secondaryCtaText: "Conheca a clinica",
  secondaryCtaLink: "#about",
  backgroundImage: "",
  overlayOpacity: 0.3,
  brands: [
    { name: "10+ Anos" },
    { name: "5000+ Pacientes" },
    { name: "4.9 Google" },
    { name: "CRO Ativo" },
  ],
};

const aboutContent = {
  title: "Cuidando do seu sorriso com *excelencia*",
  subtitle: "SOBRE NOS",
  paragraphs: [
    "Somos uma clinica odontologica dedicada a oferecer tratamentos de alta qualidade em um ambiente moderno e acolhedor. Nossa equipe combina experiencia clinica com as mais recentes tecnologias.",
    "Desde 2014, atendemos milhares de pacientes com foco em resultados naturais, conforto e atendimento humanizado. Cada tratamento e planejado de forma personalizada.",
    "Contamos com equipamentos de ultima geracao, incluindo scanner intraoral 3D, laser e sedacao consciente para garantir sua tranquilidade.",
  ],
  highlights: [
    { label: "Equipe Especializada", value: "Dentistas com pos-graduacao e atualizacao constante" },
    { label: "Tecnologia Avancada", value: "Scanner 3D, laser e radiografia digital" },
    { label: "Ambiente Acolhedor", value: "Clinica projetada para seu conforto total" },
  ],
  ctaText: "Agende sua visita",
  image: "",
};

const teamContent = {
  title: "Conheca nossa *equipe*",
  subtitle: "PROFISSIONAIS",
  items: [
    {
      name: "Dra. Ana Paula Ribeiro",
      description: "Ortodontia e Harmonizacao Orofacial — CRO-SP 98234",
    },
    {
      name: "Dr. Rafael Mendes",
      description: "Implantodontia e Protese — CRO-SP 76521",
    },
    {
      name: "Dra. Camila Torres",
      description: "Odontopediatria e Prevencao — CRO-SP 65412",
    },
    {
      name: "Dr. Bruno Carvalho",
      description: "Endodontia e Dentistica — CRO-SP 87345",
    },
  ],
};

const servicesContent = {
  title: "Tratamentos para cada *necessidade*",
  subtitle: "SERVICOS",
  items: [
    {
      name: "Implantes Dentarios",
      description:
        "Reabilitacao oral com implantes de titanio de alta qualidade. Planejamento digital 3D para resultados precisos e duradouros.",
    },
    {
      name: "Ortodontia",
      description:
        "Aparelhos fixos, alinhadores invisiveis e ortodontia estetica. Tratamentos personalizados para todas as idades.",
    },
    {
      name: "Clareamento Dental",
      description:
        "Clareamento profissional a laser com resultados visiveis na primeira sessao. Dentes mais brancos de forma segura.",
    },
    {
      name: "Lentes de Contato Dental",
      description:
        "Facetas ultrafinas em porcelana para um sorriso harmonico e natural. Minima preparacao dentaria.",
    },
    {
      name: "Odontopediatria",
      description:
        "Atendimento infantil com acolhimento e ludicidade. Prevencao, tratamento e acompanhamento do desenvolvimento oral.",
    },
    {
      name: "Protese Dentaria",
      description:
        "Proteses fixas e removiveis com materiais de alta qualidade. Devolucao da funcao mastigatoria e estetica.",
    },
  ],
};

const contactContent = {
  title: "Agende sua *consulta*",
  subtitle: "Preencha o formulario e nossa equipe entrara em contato para confirmar seu horario.",
  showMap: false,
  showForm: true,
  formFields: ["name" as const, "email" as const, "phone" as const, "message" as const],
  phone: "(11) 3456-7890",
  email: "contato@verveodon.com.br",
  address: "Av. Paulista, 1234 — Conj. 801, Bela Vista, Sao Paulo — SP",
};

const testimonialsContent = {
  title: "O que nossos *pacientes* dizem",
  subtitle: "DEPOIMENTOS",
  items: [
    {
      text: "Fiz meu implante na clinica e o resultado ficou incrivel. Equipe super atenciosa e o ambiente e muito confortavel. Recomendo de olhos fechados!",
      author: "Mariana Silva",
      role: "Implante Dentario",
      rating: 5,
    },
    {
      text: "Sempre tive medo de dentista, mas aqui me senti acolhida desde a primeira consulta. O clareamento ficou natural e lindo.",
      author: "Pedro Henrique",
      role: "Clareamento Dental",
      rating: 5,
    },
    {
      text: "Levei meus filhos para a primeira consulta e eles adoraram. A dentista tem uma paciencia incrivel com criancas. Voltaremos sempre!",
      author: "Camila Rodrigues",
      role: "Odontopediatria",
      rating: 5,
    },
    {
      text: "Meu tratamento ortodontico esta sendo acompanhado com muito cuidado. A clinica e moderna e os horarios sao flexiveis.",
      author: "Lucas Ferreira",
      role: "Ortodontia",
      rating: 5,
    },
    {
      text: "As lentes de contato ficaram perfeitas, super naturais. Todo mundo elogia meu sorriso agora. Valeu muito a pena!",
      author: "Beatriz Oliveira",
      role: "Lentes de Contato",
      rating: 5,
    },
  ],
};

const ctaContent = {
  title: "Receba dicas de *saude bucal* no seu email",
  subtitle: "Cadastre-se na nossa newsletter e fique por dentro de novidades, promocoes e conteudos exclusivos sobre cuidados dentarios.",
  ctaText: "Inscrever-se",
  ctaType: "link" as const,
  ctaLink: "#",
};

const footerContent = {
  copyrightText: "\u00a9 2026 Verve Odontologia. Todos os direitos reservados.",
  storeName: "Verve Odontologia",
  phone: "(11) 3456-7890",
  email: "contato@verveodon.com.br",
  address: "Av. Paulista, 1234 — Conj. 801, Bela Vista, Sao Paulo — SP",
  showSocial: true,
};

const navigation = [
  { label: "Inicio", href: "#", isExternal: false },
  { label: "Sobre", href: "#about", isExternal: false },
  { label: "Servicos", href: "#services", isExternal: false },
  { label: "Equipe", href: "#team", isExternal: false },
  { label: "Contato", href: "#contact", isExternal: false },
];

export const metadata: Metadata = {
  title: "Verve Design Preview",
  robots: { index: false, follow: false },
};

// Verve Dent template sections
import { VerveHeader } from "@/templates/vervedent/sections/header";
import { VerveHero } from "@/templates/vervedent/sections/hero";
import { VerveAbout } from "@/templates/vervedent/sections/about";
import { VerveTeam } from "@/templates/vervedent/sections/team";
import { VerveServices } from "@/templates/vervedent/sections/services";
import { VerveContact } from "@/templates/vervedent/sections/contact";
import { VerveTestimonials } from "@/templates/vervedent/sections/testimonials";
import { VerveCta } from "@/templates/vervedent/sections/cta";
import { VerveFooter } from "@/templates/vervedent/sections/footer";

export default function VervePreviewPage() {
  return (
    <DesignTokensProvider tokens={verveTokens}>
      <div style={{ backgroundColor: "var(--pgl-background)", minHeight: "100vh" }}>
        {/* Preview badge */}
        <div className="fixed top-4 right-4 z-[9999] rounded-full bg-black/80 px-4 py-2 text-xs font-medium text-white/80 backdrop-blur">
          Verve Design Preview
        </div>

        {/* Header */}
        <SectionLabel label="header / variant 1 — glassmorphism nav" />
        <VerveHeader
          content={headerContent}
          tokens={verveTokens}
          navigation={navigation}
        />

        {/* Hero */}
        <SectionLabel label="hero / variant 1 — split hero" />
        <VerveHero content={heroContent} tokens={verveTokens} />

        {/* About */}
        <SectionLabel label="about / variant 1 — about clinic" />
        <VerveAbout content={aboutContent} tokens={verveTokens} />

        {/* Team */}
        <SectionLabel label="services / variant 1 — team grid" />
        <VerveTeam content={teamContent} tokens={verveTokens} />

        {/* Services */}
        <SectionLabel label="services / variant 2 — services grid" />
        <VerveServices content={servicesContent} tokens={verveTokens} />

        {/* Contact / Appointment */}
        <SectionLabel label="contact / variant 1 — appointment form" />
        <VerveContact content={contactContent} tokens={verveTokens} />

        {/* Testimonials */}
        <SectionLabel label="testimonials / variant 1 — carousel" />
        <VerveTestimonials content={testimonialsContent} tokens={verveTokens} />

        {/* CTA / Newsletter */}
        <SectionLabel label="cta / variant 1 — newsletter" />
        <VerveCta content={ctaContent} tokens={verveTokens} />

        {/* Footer */}
        <SectionLabel label="footer / variant 1 — clean footer" />
        <VerveFooter
          content={footerContent}
          tokens={verveTokens}
          navigation={navigation}
        />
      </div>
    </DesignTokensProvider>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="mx-auto max-w-[1200px] px-6 pt-4">
      <div className="inline-flex items-center gap-2 rounded-full bg-black/5 px-3 py-1 text-xs font-mono text-black/50">
        <span className="w-2 h-2 rounded-full bg-teal-400" />
        {label}
      </div>
    </div>
  );
}
