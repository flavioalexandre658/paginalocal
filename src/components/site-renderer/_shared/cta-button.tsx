"use client";

import { cn } from "@/lib/utils";

interface Props {
  text: string;
  type: "whatsapp" | "link" | "scroll";
  link?: string;
  whatsappNumber?: string;
  whatsappMessage?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASSES = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

const VARIANT_CLASSES = {
  primary:
    "bg-[--pgl-primary] text-white font-medium rounded-[--pgl-radius] hover:brightness-110 hover:translate-y-[-1px] active:scale-[0.98] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--pgl-primary] focus-visible:ring-offset-2",
  secondary:
    "border border-[--pgl-primary]/20 text-[--pgl-primary] font-medium rounded-[--pgl-radius] hover:bg-[--pgl-primary]/5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--pgl-primary] focus-visible:ring-offset-2",
  ghost:
    "text-current font-medium rounded-[--pgl-radius] hover:opacity-80 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2",
};

export function CtaButton({
  text,
  type,
  link,
  whatsappNumber,
  whatsappMessage = "Olá! Vi seu site e gostaria de mais informações.",
  variant = "primary",
  size = "md",
  className,
}: Props) {
  const baseClass = cn(
    "inline-flex items-center justify-center",
    SIZE_CLASSES[size],
    VARIANT_CLASSES[variant],
    className
  );

  if (type === "whatsapp") {
    const number = (whatsappNumber ?? "").replace(/\D/g, "");
    const href = `https://wa.me/${number}?text=${encodeURIComponent(whatsappMessage)}`;
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClass}
      >
        {text}
      </a>
    );
  }

  if (type === "link") {
    return (
      <a
        href={link ?? "#"}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClass}
      >
        {text}
      </a>
    );
  }

  // scroll
  const handleScroll = () => {
    const targetId = link?.replace("#", "") ?? "";
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <button type="button" onClick={handleScroll} className={baseClass}>
      {text}
    </button>
  );
}
