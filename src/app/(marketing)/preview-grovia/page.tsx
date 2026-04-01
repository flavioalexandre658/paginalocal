import { Metadata } from "next";
import { DesignTokensProvider } from "@/components/site-renderer/design-tokens-provider";
import type { DesignTokens } from "@/types/ai-generation";

// Grovia-inspired design tokens
const groviaTokens: DesignTokens = {
  palette: {
    primary: "#1a1a1a",
    secondary: "#605f5f",
    accent: "#fecd1a",
    background: "#f4f2ee",
    surface: "#f0ece6",
    text: "#1a1a1a",
    textMuted: "#605f5f",
  },
  headingFont: "inter",
  bodyFont: "inter",
  style: "elegant",
  borderRadius: "lg",
  spacing: "spacious",
  highlightStyle: "inherit",
};

// Mock content for each section
const headerContent = {
  storeName: "Grovia",
  logoUrl: "",
  ctaText: "Get Started",
  ctaLink: "#pricing",
};

const heroContent = {
  headline: "Built for *high performance* teams",
  subheadline:
    "Grovia gives your team everything it needs to stay aligned, track performance, and scale with confidence — all in one place.",
  badgeText: "✦ Now in Beta",
  ctaText: "Start Free Trial",
  ctaLink: "#",
  ctaType: "link" as const,
  secondaryCtaText: "View Demo",
  secondaryCtaLink: "#",
  tagline: "SaaS Platform",
  brands: [
    { name: "Pluto Inc" },
    { name: "VitaHealth" },
    { name: "BoxMedia" },
    { name: "NovaTech" },
    { name: "Acme Corp" },
    { name: "Zenith AI" },
  ],
};

const servicesStepsContent = {
  title: "How it *works*",
  subtitle:
    "Create your workspace and invite your team. Get everything ready in minutes.",
  items: [
    {
      name: "Set up your workspace",
      description:
        "Create your workspace and invite your team. Get everything ready in minutes with our guided onboarding.",
      ctaText: "Learn more",
      ctaLink: "#",
    },
    {
      name: "Connect your tools",
      description:
        "Integrate with the tools your team already uses. Sync data automatically and keep everything in one place.",
      ctaText: "See integrations",
      ctaLink: "#",
    },
    {
      name: "Track & grow",
      description:
        "Monitor key metrics, automate reports, and make data-driven decisions to scale your business faster.",
      ctaText: "View analytics",
      ctaLink: "#",
    },
  ],
};

const servicesFeatureContent = {
  title: "Everything you need to *scale*",
  subtitle: "Powerful features designed for modern teams.",
  items: [
    {
      name: "Client Portal",
      description:
        "Centralized access for teams and clients. Share progress, gather feedback, and keep everyone aligned.",
    },
    {
      name: "Analytics Dashboard",
      description:
        "Real-time insights into team performance, project status, and business metrics at a glance.",
    },
    {
      name: "Workflow Automation",
      description:
        "Automate repetitive tasks and focus on what matters. Set triggers, conditions, and actions effortlessly.",
    },
    {
      name: "Team Collaboration",
      description:
        "Built-in messaging, file sharing, and task management. Keep your team connected and productive.",
    },
  ],
};

const statsContent = {
  title: "Powerful *integrations*",
  items: [
    { value: "Slack", label: "Explore 50+ supported integrations" },
    { value: "Notion", label: "Securely link your account" },
    { value: "HubSpot", label: "Sync and streamline your workflow" },
    { value: "Jira", label: "Track progress in real time" },
  ],
};

const pricingContent = {
  title: "Simple, transparent *pricing*",
  subtitle: "Start free. Scale when you're ready.",
  showBillingToggle: false,
  plans: [
    {
      name: "Starter",
      price: "Free",
      description: "For early-stage teams",
      features: [
        "Access to core features",
        "Up to 5 team members",
        "Basic analytics",
        "Community support",
      ],
      highlighted: false,
      ctaText: "Get Started",
      ctaType: "link" as const,
    },
    {
      name: "Pro",
      price: "$24/mo",
      description: "For growing businesses",
      features: [
        "Everything in Starter",
        "Unlimited team members",
        "Advanced analytics",
        "Priority support",
        "Custom integrations",
        "API access",
      ],
      highlighted: true,
      ctaText: "Start Free Trial",
      ctaType: "link" as const,
    },
  ],
};

const testimonialsContent = {
  title: "Success *stories*",
  subtitle: "Grovia has partnered with growing businesses to build foundations for sustainable success. Explore real stories of transformation.",
  items: [
    // Case study cards (first 4)
    {
      text: "Helped Pluto scale their product team and streamline onboarding as they expanded into new markets.",
      author: "Pluto Inc",
      role: "Product & Operations",
      rating: 5,
    },
    {
      text: "Partnered with VitaHealth to set up their first operations team from the ground up.",
      author: "VitaHealth",
      role: "Healthcare & Wellness",
      rating: 5,
    },
    {
      text: "Supported BoxMedia, a creative agency, in building their client success team and internal delivery process.",
      author: "BoxMedia",
      role: "Creative Agency",
      rating: 5,
    },
    {
      text: "Helped NovaTech optimize cross-functional collaboration between marketing, product, and sales teams.",
      author: "NovaTech",
      role: "Technology",
      rating: 5,
    },
    // Testimonial quotes (last 3)
    {
      text: "Grovia helped us streamline our operations and scale faster than we imagined. Their mix of strategy and execution is unmatched.",
      author: "Talia Smith",
      role: "Head of Product at Forma",
      rating: 5,
    },
    {
      text: "Working with Grovia felt like having an extension of our team. They understood our challenges and delivered real, measurable results.",
      author: "Jordan Johnson",
      role: "COO at Metricon",
      rating: 5,
    },
    {
      text: "From the first meeting, Grovia brought clarity and momentum to our hiring strategy. We've seen a major improvement in team performance.",
      author: "Samuel Torres",
      role: "Founder at Bloomtech",
      rating: 5,
    },
  ],
};

const faqContent = {
  title: "Frequently asked *questions*",
  subtitle: "Everything you need to know about Grovia.",
  items: [
    {
      question: "How do I get started with Grovia?",
      answer:
        "Simply sign up for a free account, create your workspace, and invite your team. Our guided onboarding will walk you through everything in minutes.",
    },
    {
      question: "Can I integrate with my existing tools?",
      answer:
        "Yes! Grovia supports 50+ integrations including Slack, Notion, Jira, HubSpot, and more. We also offer a REST API for custom integrations.",
    },
    {
      question: "Is there a free plan?",
      answer:
        "Absolutely. Our Starter plan is free forever and includes core features for up to 5 team members. Upgrade when you need more.",
    },
    {
      question: "How does billing work?",
      answer:
        "We offer monthly and annual billing. Annual plans save 20%. You can upgrade, downgrade, or cancel anytime — no contracts.",
    },
    {
      question: "Do you offer customer support?",
      answer:
        "All plans include access to our help center and community. Pro plans get priority email and chat support with a guaranteed 4-hour response time.",
    },
  ],
};

const footerContent = {
  copyrightText: "2025 Grovia. All rights reserved.",
  showSocial: true,
  storeName: "Grovia",
  tagline: "Built for high-performance teams.",
  navLinks: [
    { label: "Features", href: "#services" },
    { label: "Pricing", href: "#pricing" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],
};

const navigation = [
  { label: "Features", href: "#services", isExternal: false },
  { label: "Pricing", href: "#pricing", isExternal: false },
  { label: "Case Studies", href: "#testimonials", isExternal: false },
  { label: "FAQ", href: "#faq", isExternal: false },
];

export const metadata: Metadata = {
  title: "Grovia Design Preview",
  robots: { index: false, follow: false },
};

// Grovia template sections
import { GroviaHeader as HeaderPillFloating } from "@/templates/grovia/sections/header";
import { GroviaHero as HeroDashboardShowcase } from "@/templates/grovia/sections/hero";
import { GroviaProcess as ServicesNumberedSteps } from "@/templates/grovia/sections/process";
import { GroviaFeatures as ServicesFeatureShowcase } from "@/templates/grovia/sections/features";
import { GroviaIntegrations as StatsIntegrationGrid } from "@/templates/grovia/sections/integrations";
import { GroivaPricing as PricingGlassmorphism } from "@/templates/grovia/sections/pricing";
import { GroviaTestimonials as TestimonialsCaseStudy } from "@/templates/grovia/sections/testimonials";
import { GroviaFaq as FaqSplitClean } from "@/templates/grovia/sections/faq";
import { GroviaFooter as FooterNewsletterGrid } from "@/templates/grovia/sections/footer";

export default function GroviaPreviewPage() {
  return (
    <DesignTokensProvider tokens={groviaTokens}>
      <div style={{ backgroundColor: "var(--pgl-background)", minHeight: "100vh" }}>
        {/* Section Label */}
        <div className="fixed top-4 right-4 z-[9999] rounded-full bg-black/80 px-4 py-2 text-xs font-medium text-white/80 backdrop-blur">
          Grovia Design Preview
        </div>

        {/* Header */}
        <SectionLabel label="header / variant 6 — pill-floating" />
        <HeaderPillFloating
          content={headerContent}
          tokens={groviaTokens}
          navigation={navigation}
        />

        {/* Hero */}
        <SectionLabel label="hero / variant 6 — dashboard-showcase" />
        <HeroDashboardShowcase content={heroContent} tokens={groviaTokens} />

        {/* Services — Numbered Steps */}
        <SectionLabel label="services / variant 5 — numbered-steps" />
        <ServicesNumberedSteps
          content={servicesStepsContent}
          tokens={groviaTokens}
        />

        {/* Services — Feature Showcase */}
        <SectionLabel label="services / variant 6 — feature-showcase" />
        <ServicesFeatureShowcase
          content={servicesFeatureContent}
          tokens={groviaTokens}
        />

        {/* Stats — Integration Grid */}
        <SectionLabel label="stats / variant 3 — integration-grid" />
        <StatsIntegrationGrid content={statsContent} tokens={groviaTokens} />

        {/* Pricing — Glassmorphism */}
        <SectionLabel label="pricing / variant 6 — glassmorphism" />
        <PricingGlassmorphism content={pricingContent} tokens={groviaTokens} />

        {/* Testimonials — Case Study */}
        <SectionLabel label="testimonials / variant 4 — case-study" />
        <TestimonialsCaseStudy
          content={testimonialsContent}
          tokens={groviaTokens}
        />

        {/* FAQ — Split Clean */}
        <SectionLabel label="faq / variant 3 — split-clean" />
        <FaqSplitClean content={faqContent} tokens={groviaTokens} />

        {/* Footer — Newsletter Grid */}
        <SectionLabel label="footer / variant 6 — newsletter-grid" />
        <FooterNewsletterGrid
          content={footerContent}
          tokens={groviaTokens}
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
