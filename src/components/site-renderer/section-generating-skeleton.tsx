"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SectionGeneratingSkeletonProps {
  blockType: string;
}

const SECTION_LABELS: Record<string, string> = {
  hero: "hero",
  about: "sobre nós",
  services: "serviços",
  features: "diferenciais",
  testimonials: "depoimentos",
  faq: "perguntas",
  pricing: "planos",
  cta: "chamada",
  gallery: "galeria",
  team: "equipe",
  contact: "contato",
  footer: "rodapé",
  partners: "parceiros",
  stats: "estatísticas",
  "how-works": "como funciona",
  process: "processo",
  catalog: "catálogo",
  impacts: "impactos",
};

const SECTION_HEIGHTS: Record<string, number> = {
  hero: 480,
  about: 360,
  services: 360,
  features: 360,
  testimonials: 320,
  faq: 320,
  pricing: 320,
  cta: 200,
  gallery: 360,
  team: 320,
  contact: 280,
  footer: 240,
  partners: 140,
  stats: 200,
  "how-works": 360,
  process: 360,
  catalog: 360,
  impacts: 200,
};

function getHeight(blockType: string): number {
  return SECTION_HEIGHTS[blockType] ?? 320;
}

function getLabel(blockType: string): string {
  return SECTION_LABELS[blockType] ?? blockType;
}

export function SectionGeneratingSkeleton({
  blockType,
}: SectionGeneratingSkeletonProps) {
  const height = getHeight(blockType);
  const label = getLabel(blockType);

  return (
    <section
      data-generating={blockType}
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: "#fafaf9" }}
    >
      <div className="mx-auto max-w-7xl px-6 py-10">
        <SkeletonLayout blockType={blockType} height={height} />

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span
            className="rounded-full border border-black/[0.06] bg-white/80 px-3 py-1 text-[12px] font-medium text-black/45 shadow-sm backdrop-blur-sm animate-pulse"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            Gerando seção {label}…
          </span>
        </div>
      </div>
    </section>
  );
}

interface LayoutProps {
  blockType: string;
  height: number;
}

function SkeletonLayout({ blockType, height }: LayoutProps) {
  if (blockType === "hero") {
    return (
      <div
        className="grid grid-cols-1 gap-8 md:grid-cols-2"
        style={{ minHeight: height }}
      >
        <div className="flex flex-col justify-center gap-4">
          <Skeleton className={cn("h-4 w-28 rounded-full", PILL)} />
          <Skeleton className={cn("h-12 w-[80%] rounded-[12px]", BLOCK)} />
          <Skeleton className={cn("h-12 w-[60%] rounded-[12px]", BLOCK)} />
          <Skeleton className={cn("mt-2 h-4 w-[90%] rounded-md", BLOCK)} />
          <Skeleton className={cn("h-4 w-[70%] rounded-md", BLOCK)} />
          <div className="mt-4 flex gap-3">
            <Skeleton className={cn("h-11 w-32 rounded-full", BLOCK)} />
            <Skeleton className={cn("h-11 w-28 rounded-full", BLOCK)} />
          </div>
        </div>
        <Skeleton className={cn("h-full w-full rounded-[16px]", BLOCK)} />
      </div>
    );
  }

  if (blockType === "services" || blockType === "features" || blockType === "process" || blockType === "how-works" || blockType === "catalog") {
    return (
      <div className="space-y-6" style={{ minHeight: height }}>
        <Skeleton className={cn("mx-auto h-8 w-[40%] rounded-[12px]", BLOCK)} />
        <Skeleton className={cn("mx-auto h-4 w-[55%] rounded-md", BLOCK)} />
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton
              key={i}
              className={cn("h-48 w-full rounded-[16px]", BLOCK)}
            />
          ))}
        </div>
      </div>
    );
  }

  if (blockType === "testimonials") {
    return (
      <div className="space-y-6" style={{ minHeight: height }}>
        <Skeleton className={cn("mx-auto h-8 w-[40%] rounded-[12px]", BLOCK)} />
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton
              key={i}
              className={cn("h-40 w-full rounded-[16px]", BLOCK)}
            />
          ))}
        </div>
      </div>
    );
  }

  if (blockType === "pricing") {
    return (
      <div className="space-y-6" style={{ minHeight: height }}>
        <Skeleton className={cn("mx-auto h-8 w-[40%] rounded-[12px]", BLOCK)} />
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton
              key={i}
              className={cn("h-64 w-full rounded-[16px]", BLOCK)}
            />
          ))}
        </div>
      </div>
    );
  }

  if (blockType === "faq") {
    return (
      <div className="space-y-3 mx-auto max-w-2xl" style={{ minHeight: height }}>
        <Skeleton className={cn("h-8 w-[50%] rounded-[12px] mb-6", BLOCK)} />
        {[0, 1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            className={cn("h-14 w-full rounded-[12px]", BLOCK)}
          />
        ))}
      </div>
    );
  }

  if (blockType === "cta") {
    return (
      <div
        className="flex flex-col items-center justify-center gap-4"
        style={{ minHeight: height }}
      >
        <Skeleton className={cn("h-10 w-[55%] rounded-[12px]", BLOCK)} />
        <Skeleton className={cn("h-4 w-[40%] rounded-md", BLOCK)} />
        <Skeleton className={cn("h-11 w-32 rounded-full", BLOCK)} />
      </div>
    );
  }

  if (blockType === "footer") {
    return (
      <div className="space-y-4" style={{ minHeight: height }}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className={cn("h-4 w-24 rounded-md", BLOCK)} />
              <Skeleton className={cn("h-3 w-full rounded-md", BLOCK)} />
              <Skeleton className={cn("h-3 w-3/4 rounded-md", BLOCK)} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (blockType === "stats" || blockType === "impacts") {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4" style={{ minHeight: height }}>
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className={cn("h-24 w-full rounded-[12px]", BLOCK)} />
        ))}
      </div>
    );
  }

  if (blockType === "partners") {
    return (
      <div className="flex items-center justify-around gap-4" style={{ minHeight: height }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className={cn("h-8 w-24 rounded-md", BLOCK)} />
        ))}
      </div>
    );
  }

  if (blockType === "gallery") {
    return (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4" style={{ minHeight: height }}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <Skeleton key={i} className={cn("aspect-square w-full rounded-[12px]", BLOCK)} />
        ))}
      </div>
    );
  }

  if (blockType === "about") {
    return (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2" style={{ minHeight: height }}>
        <Skeleton className={cn("h-full w-full rounded-[16px]", BLOCK)} />
        <div className="flex flex-col justify-center gap-3">
          <Skeleton className={cn("h-8 w-[60%] rounded-[12px]", BLOCK)} />
          <Skeleton className={cn("h-4 w-full rounded-md", BLOCK)} />
          <Skeleton className={cn("h-4 w-[90%] rounded-md", BLOCK)} />
          <Skeleton className={cn("h-4 w-[80%] rounded-md", BLOCK)} />
        </div>
      </div>
    );
  }

  // default: simple block
  return (
    <div className="space-y-3" style={{ minHeight: height }}>
      <Skeleton className={cn("mx-auto h-8 w-[45%] rounded-[12px]", BLOCK)} />
      <Skeleton className={cn("mx-auto h-4 w-[60%] rounded-md", BLOCK)} />
      <Skeleton className={cn("mt-4 h-40 w-full rounded-[16px]", BLOCK)} />
    </div>
  );
}

const BLOCK = "bg-[#f5f5f4]";
const PILL = "bg-[#ececea]";
