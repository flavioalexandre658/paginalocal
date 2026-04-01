import { Metadata } from "next";
import { DesignTokensProvider } from "@/components/site-renderer/design-tokens-provider";
import type { DesignTokens } from "@/types/ai-generation";

// Plumbflow design tokens — dark navy + orange accent
const plumbflowTokens: DesignTokens = {
  palette: {
    primary: "#142F45",
    secondary: "#35AAF3",
    accent: "#FF5E15",
    background: "#FFFFFF",
    surface: "#F1F2FA",
    text: "#2C282B",
    textMuted: "#4B5554",
  },
  headingFont: "satoshi",
  bodyFont: "satoshi",
  style: "bold",
  borderRadius: "full",
  spacing: "spacious",
  highlightStyle: "inherit",
};

/* ─────────────────── Mock content ─────────────────── */

const headerContent = {
  storeName: "PlumbFlow",
  logoUrl: "",
  ctaText: "(124) 567 8900",
  ctaLink: "tel:+1245678900",
  phone: "(123) 456-7890",
  email: "support@plumbflow.com",
};

const heroContent = {
  headline: "Fast Solutions for Plumbing Problems",
  subheadline:
    "From minor leaks to major plumbing emergencies, our expert team is ready to deliver fast, reliable and affordable solutions ensuring your home stays safe.",
  tagline: "Your Trusted Plumbing Experts",
  badgeText: "130K +",
  ctaText: "Get a Free Quote",
  ctaLink: "#contact",
  ctaType: "link" as const,
  secondaryCtaText: "Contact Us Today",
  secondaryCtaLink: "#contact",
  backgroundImage: "",
  overlayOpacity: 0.55,
  brands: [
    { name: "HomeAdvisor" },
    { name: "Angi" },
    { name: "BBB A+" },
    { name: "Yelp 5★" },
    { name: "Google" },
  ],
};

const aboutContent = {
  title: "Plumbing Solutions for Every Home",
  subtitle: "WHO WE ARE",
  // paragraphs = bullet points (checklist items)
  paragraphs: [
    "Reliable, fast, and efficient service.",
    "Skilled plumbers, quality work.",
    "Affordable pricing, no surprises.",
    "Satisfaction guaranteed, every time.",
  ],
  // highlights = tabs (label = tab name, value = tab description)
  highlights: [
    { label: "Our Mission", value: "At FixFlow, our mission is to provide fast, reliable, and high-quality plumbing services tailored to meet the unique needs of our customers. We strive to be your trusted partner in keeping your home and business." },
    { label: "Our Expertise", value: "With over 25 years of experience, our certified plumbers bring expertise in residential and commercial plumbing solutions for homes and businesses." },
    { label: "Our Values", value: "We believe in transparency, integrity, and putting our customers first. Every job is completed with care, professionalism, and attention to detail." },
  ],
  image: "",
};

const quickFormContent = {
  title: "Quick Plumbing Service Book in 60 Seconds.",
  subtitle: "Submit Request",
  showMap: false,
  showForm: true,
  formFields: ["name" as const, "phone" as const],
  phone: "(124) 567 8900",
};

const statsContent = {
  items: [
    { value: "25+", label: "Years of Experience" },
    { value: "98%", label: "Customer Satisfaction Guarantee" },
    { value: "67+", label: "Award-Winning Service" },
    { value: "24/7", label: "Emergency Plumbing Services" },
  ],
};

const servicesContent = {
  title: "Reliable, Fast, and Expert Plumbing Solutions",
  subtitle: "Our Service",
  items: [
    {
      name: "Emergency Plumbing",
      description: "When a plumbing emergency strikes, you need fast and reliable service, and FixFlow is here to help. Our Emergency Plumbing services are available 24/7.",
      ctaText: "Learn More",
      ctaLink: "#contact",
    },
    {
      name: "Pipe Repair",
      description: "From small leaks to burst pipes, our certified plumbers provide quick, reliable pipe repair services to prevent water damage and restore your plumbing system.",
      ctaText: "Learn More",
      ctaLink: "#contact",
    },
    {
      name: "Drain Cleaning",
      description: "Clogged drains can cause significant inconvenience and potential damage to your plumbing system. At FixFlow, our Drain Cleaning services.",
      ctaText: "Learn More",
      ctaLink: "#contact",
    },
    {
      name: "Water Heaters",
      description: "Hot water is essential for daily comfort, and at FixFlow, we provide expert Water Heater services to ensure you always have a reliable supply.",
      ctaText: "Learn More",
      ctaLink: "#contact",
    },
    {
      name: "Leak Detection",
      description: "Hidden leaks can cause extensive damage and increase your water bills. Our advanced Leak Detection services use state-of-the-art technology to pinpoint leaks.",
      ctaText: "Learn More",
      ctaLink: "#contact",
    },
  ],
};

const processContent = {
  title: "Fixing Your Plumbing Issues in Just 5 Steps",
  subtitle: "OUR PROCESS",
  items: [
    {
      name: "Contact Us",
      description: "Getting started with FixFlow is quick and hassle-free. Whether you're dealing with a leak, clogged drain, or any plumbing emergency, reaching out to us is the first step.",
    },
    {
      name: "Inspection & Diagnosis",
      description: "Once you reach out to FixFlow, our expert plumbers arrive promptly to assess your plumbing issue with precision and care. Using advanced diagnostic tools.",
    },
    {
      name: "Service & Repairs",
      description: "At FixFlow, we prioritize efficiency and precision in every plumbing repair. Once our expert plumbers assess the issue, they get right to work.",
    },
    {
      name: "Quality Check & Cleanup",
      description: "After completing the repair, our team conducts a thorough quality check to ensure everything is working perfectly and up to code.",
    },
  ],
};

const whyChooseContent = {
  title: "Why PlumbFlow Is Your Trusted Plumbing Partner",
  subtitle: "WHY CHOOSE US",
  items: [
    {
      name: "Skilled & Certified Plumbers",
      description: "Our team consists of certified, licensed plumbers with extensive experience.",
    },
    {
      name: "Clear & Honest Pricing",
      description: "We believe in honesty and transparency with our customers. When you choose FixFlow.",
    },
    {
      name: "24/7 Emergency Services",
      description: "Plumbing problems don't always happen during business hours, which is why we offer round-the-clock service.",
    },
  ],
};

const testimonialsContent = {
  title: "What Our Customers Say",
  subtitle: "Testimonial",
  items: [
    {
      text: "FixFlow was an absolute lifesaver when my water heater broke down in the middle of winter. I called them in a panic, and within an hour, a technician was at my door, diagnosing the issue. They explained everything clearly.",
      author: "Emily Carter",
      role: "Homeowner",
      rating: 5,
    },
    {
      text: "Running a busy restaurant means plumbing problems can't wait, and FixFlow understands that better than anyone. When our kitchen sink clogged during peak hours, they sent a technician immediately.",
      author: "Michael Thompson",
      role: "Restaurant Owner",
      rating: 5,
    },
    {
      text: "As a property manager, I work with many service providers, and FixFlow is hands down the best plumbing company I've ever partnered with. They handle everything from minor repairs to major pipe replacements.",
      author: "Sophia Ramirez",
      role: "Property Manager",
      rating: 5,
    },
    {
      text: "I had a burst pipe at 2 AM and FixFlow's emergency team was at my house within 30 minutes. Professional, efficient, and they cleaned up everything perfectly. Highly recommend!",
      author: "David Chen",
      role: "Business Owner",
      rating: 5,
    },
  ],
};

const galleryContent = {
  title: "Quality Plumbing Work You Can Trust",
  subtitle: "OUR SERVICE",
  images: [
    { url: "", caption: "Pipe Repair Commercial" },
    { url: "", caption: "Pipe Repair Commercial" },
    { url: "", caption: "Pipe Repair Commercial" },
    { url: "", caption: "Pipe Repair Commercial" },
    { url: "", caption: "Pipe Repair Commercial" },
  ],
};

const ctaContent = {
  title: "Book Expert Plumbing Service Today!",
  subtitle: "CONTACT US",
  ctaText: "Get in Touch with Us",
  ctaType: "link" as const,
  ctaLink: "#contact",
};

const footerContent = {
  copyrightText: "© 2026 PlumbFlow. All Rights Reserved.",
  storeName: "PlumbFlow",
  phone: "(123) 456-7890",
  email: "contact@plumbflow.com",
  address: "123 Main Street, Your City, State, ZIP",
  showSocial: true,
};

const navigation = [
  { label: "About", href: "#about", isExternal: false },
  { label: "Services", href: "#services", isExternal: false },
  { label: "Testimonials", href: "#testimonials", isExternal: false },
  { label: "Contact", href: "#contact", isExternal: false },
];

export const metadata: Metadata = {
  title: "Plumbflow Design Preview",
  robots: { index: false, follow: false },
};

// Plumbflow template sections
import { PlumbflowHeader } from "@/templates/plumbflow/sections/header";
import { PlumbflowHero } from "@/templates/plumbflow/sections/hero";
import { PlumbflowAbout } from "@/templates/plumbflow/sections/about";
import { PlumbflowQuickForm } from "@/templates/plumbflow/sections/quick-form";
import { PlumbflowStats } from "@/templates/plumbflow/sections/stats";
import { PlumbflowServices } from "@/templates/plumbflow/sections/services";
import { PlumbflowProcess } from "@/templates/plumbflow/sections/process";
import { PlumbflowWhyChoose } from "@/templates/plumbflow/sections/why-choose";
import { PlumbflowTestimonials } from "@/templates/plumbflow/sections/testimonials";
import { PlumbflowGallery } from "@/templates/plumbflow/sections/gallery";
import { PlumbflowCta } from "@/templates/plumbflow/sections/cta";
import { PlumbflowFooter } from "@/templates/plumbflow/sections/footer";

export default function PlumbflowPreviewPage() {
  return (
    <DesignTokensProvider tokens={plumbflowTokens}>
      <div style={{ backgroundColor: "var(--pgl-background)", minHeight: "100vh" }}>
        {/* Preview badge */}
        <div className="fixed top-4 right-4 z-[9999] rounded-full bg-black/80 px-4 py-2 text-xs font-medium text-white/80 backdrop-blur">
          Plumbflow Design Preview
        </div>

        {/* Header */}
        <SectionLabel label="header / variant 1 — topbar + nav" />
        <PlumbflowHeader
          content={headerContent}
          tokens={plumbflowTokens}
          navigation={navigation}
        />

        {/* Hero */}
        <SectionLabel label="hero / variant 1 — plumbflow hero" />
        <PlumbflowHero content={heroContent} tokens={plumbflowTokens} />

        {/* Quick Service Request */}
        <SectionLabel label="contact / variant 1 — quick form" />
        <PlumbflowQuickForm content={quickFormContent} tokens={plumbflowTokens} />

        {/* About / Our Mission */}
        <SectionLabel label="about / variant 1 — tabs + checklist" />
        <PlumbflowAbout content={aboutContent} tokens={plumbflowTokens} />

        {/* Counter Stats */}
        <SectionLabel label="stats / variant 1 — counter" />
        <PlumbflowStats content={statsContent} tokens={plumbflowTokens} />

        {/* Our Services */}
        <SectionLabel label="services / variant 1 — tabs + card" />
        <PlumbflowServices content={servicesContent} tokens={plumbflowTokens} />

        {/* Our Process */}
        <SectionLabel label="services / variant 2 — process timeline" />
        <PlumbflowProcess content={processContent} tokens={plumbflowTokens} />

        {/* Why Choose Us */}
        <SectionLabel label="services / variant 3 — why choose us" />
        <PlumbflowWhyChoose content={whyChooseContent} tokens={plumbflowTokens} />

        {/* Testimonials */}
        <SectionLabel label="testimonials / variant 1 — cards dark bg" />
        <PlumbflowTestimonials content={testimonialsContent} tokens={plumbflowTokens} />

        {/* Our Work / Gallery */}
        <SectionLabel label="gallery / variant 1 — bento grid" />
        <PlumbflowGallery content={galleryContent} tokens={plumbflowTokens} />

        {/* CTA */}
        <SectionLabel label="cta / variant 1 — banner + emergency info" />
        <PlumbflowCta content={ctaContent} tokens={plumbflowTokens} />

        {/* Footer */}
        <SectionLabel label="footer / variant 1 — dark 4-column" />
        <PlumbflowFooter
          content={footerContent}
          tokens={plumbflowTokens}
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
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
        {label}
      </div>
    </div>
  );
}

/* All sections implemented — no more placeholders */
