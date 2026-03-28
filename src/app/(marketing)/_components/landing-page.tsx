"use client";

import { useSearchParams } from "next/navigation";
import { MarketingHeader } from "./marketing-header";
import { MarketingFooter } from "./marketing-footer";
import { HeroSection } from "./sections/hero-section";
import { StepsSection } from "./sections/steps-section";
import { FeaturesPlatformSection } from "./sections/features-platform-section";
import { ToolsSection } from "./sections/tools-section";
import { ComparisonSection } from "./sections/comparison-section";
import { TestimonialsSection } from "./sections/testimonials-section";
import { NichesSection } from "./sections/niches-section";
import { FAQSection } from "./sections/faq-section";
import { CTASection } from "./sections/cta-section";

interface LandingPageProps {
  isLoggedIn?: boolean;
  hasSubscription?: boolean;
}

export function LandingPage({
  isLoggedIn = false,
  hasSubscription = false,
}: LandingPageProps) {
  const searchParams = useSearchParams();
  const shouldRedirectToWhatsApp = searchParams.get("wpp") === "true";

  return (
    <main
      className="min-h-screen bg-white"
      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      <MarketingHeader
        isLoggedIn={isLoggedIn}
        hasSubscription={hasSubscription}
      />
      <HeroSection shouldRedirectToWhatsApp={shouldRedirectToWhatsApp} />
      <StepsSection />
      <FeaturesPlatformSection />
      <ToolsSection />
      <ComparisonSection />
      <TestimonialsSection />
      <NichesSection />
      <FAQSection />
      <CTASection shouldRedirectToWhatsApp={shouldRedirectToWhatsApp} />
      <MarketingFooter />
    </main>
  );
}
