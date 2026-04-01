/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { ComponentType } from "react";
import type { BlockType } from "@/types/ai-generation";

type LazyImport = () => Promise<{ default: ComponentType<unknown> }>;

function lazyBlock(loader: () => Promise<unknown>): LazyImport {
  return () =>
    (loader() as Promise<{ default: ComponentType<unknown> }>).catch(() => ({
      default: (() => null) as unknown as ComponentType<unknown>,
    }));
}

/**
 * BLOCK_REGISTRY (Legacy) — fallback para blocos universais usados por templates.
 * Os templates resolvem suas proprias secoes via TEMPLATE_REGISTRY.
 * Este registry so e usado como fallback para blockTypes nao cobertos pelo template.
 */
export const BLOCK_REGISTRY: Record<string, Record<number, LazyImport>> = {
  about: {
    // @ts-ignore
    1: lazyBlock(() => import("./about/about-story-block").then((m) => ({ default: m.AboutStoryBlock }))),
  },
  contact: {
    // @ts-ignore
    1: lazyBlock(() => import("./contact/contact-minimal-card").then((m) => ({ default: m.ContactMinimalCard }))),
  },
  cta: {
    // @ts-ignore
    1: lazyBlock(() => import("./cta/cta-card-floating").then((m) => ({ default: m.CtaCardFloating }))),
  },
  "whatsapp-float": {
    1: lazyBlock(() => import("./whatsapp-float/whatsapp-pill").then((m) => ({ default: m.WhatsappPill }))),
  },
};

export async function resolveBlock(
  blockType: BlockType,
  variant: number
): Promise<ComponentType<unknown> | null> {
  const blockVariants = BLOCK_REGISTRY[blockType as string];
  if (!blockVariants) return null;
  const loader = blockVariants[variant] ?? blockVariants[1];
  if (!loader) return null;
  try {
    const blockModule = await loader();
    return blockModule.default;
  } catch {
    return null;
  }
}
