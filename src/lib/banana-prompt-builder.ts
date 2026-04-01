import type { ImageSpec } from "@/templates/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PromptBuilderContext {
  businessName: string;
  category: string;
  city: string;
  templateStyle: string;
  palette: { primary: string; accent: string };
}

export interface ImagePromptRequest {
  id: string;
  sectionIndex: number;
  blockType: string;
  fieldPath: string;
  imageSpec: ImageSpec;
  overrideSubject?: string; // from AI imageQueries
}

export interface ImagePromptResult {
  id: string;
  prompt: string;
  width: number;
  height: number;
  sectionIndex: number;
  blockType: string;
  fieldPath: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

import { ASPECT_DIMENSIONS } from "@/lib/banana-nano";

const STYLE_PREFIXES: Record<string, string> = {
  bold: "Dramatic lighting, high contrast, bold composition, vibrant colors, powerful visual impact",
  elegant:
    "Soft natural lighting, refined aesthetic, subtle tones, graceful composition, understated luxury",
  modern:
    "Clean lines, minimalist composition, contemporary aesthetic, even lighting, sleek surfaces",
  warm: "Golden hour lighting, warm color temperature, inviting atmosphere, cozy textures, natural warmth",
  playful:
    "Bright cheerful lighting, dynamic angles, lively colors, energetic composition, fun atmosphere",
  minimal:
    "Ultra-clean composition, negative space, muted palette, precise geometry, quiet elegance",
};

const DEFAULT_PREFIX =
  "Professional high-quality photography, natural lighting, cohesive warm color palette, modern editorial style, sharp focus, 8K resolution";

const TESTIMONIAL_SUFFIX =
  "Professional headshot, shoulders up, eye-level camera angle, soft diffused studio lighting, clean neutral background, natural expression";

// ---------------------------------------------------------------------------
// Builders
// ---------------------------------------------------------------------------

export function buildGlobalStylePrefix(ctx: PromptBuilderContext): string {
  const styleKey = ctx.templateStyle.toLowerCase();
  const styleFragment = STYLE_PREFIXES[styleKey] ?? DEFAULT_PREFIX;

  return `${DEFAULT_PREFIX}, ${styleFragment}`;
}

export function buildImagePrompts(
  ctx: PromptBuilderContext,
  requests: ImagePromptRequest[],
): ImagePromptResult[] {
  const globalPrefix = buildGlobalStylePrefix(ctx);

  return requests.map((req) => {
    const { imageSpec, overrideSubject, blockType } = req;
    const subject = overrideSubject || imageSpec.subject;

    const isTestimonial =
      blockType === "testimonials" ||
      /portrait|headshot/i.test(imageSpec.style) ||
      /portrait|headshot/i.test(subject);

    const parts: string[] = [globalPrefix];

    // Subject
    parts.push(subject);

    // Business context
    parts.push(`Business: ${ctx.category} in ${ctx.city}`);

    // Image style
    if (imageSpec.style) {
      parts.push(`Style: ${imageSpec.style}`);
    }

    // Testimonial-specific additions
    if (isTestimonial) {
      parts.push(TESTIMONIAL_SUFFIX);
    }

    // Negative prompt (avoid list)
    if (imageSpec.avoid.length > 0) {
      parts.push(`--no ${imageSpec.avoid.join(", ")}`);
    }

    // Resolve dimensions from aspect ratio
    const dims = ASPECT_DIMENSIONS[imageSpec.aspectRatio] ?? ASPECT_DIMENSIONS["16:9"];

    return {
      id: req.id,
      prompt: parts.join(". "),
      width: dims.width,
      height: dims.height,
      sectionIndex: req.sectionIndex,
      blockType: req.blockType,
      fieldPath: req.fieldPath,
    };
  });
}
