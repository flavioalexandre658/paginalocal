"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ImagePlaceholder, isPendingImage } from "./image-placeholder";

interface TemplateImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src?: string | null;
  /** Border radius applied to the placeholder (in px). Match the final image's rounding. */
  rounded?: number | string;
  /** Custom fallback shown when src is empty/null. Default: nothing (caller's existing layout shows). */
  fallback?: React.ReactNode;
  /** Whether to show the "Gerando imagem…" label inside the skeleton. Default: true. */
  showPendingLabel?: boolean;
}

/**
 * Drop-in replacement for <img> in template sections.
 *
 *  - src === IMAGE_PENDING_TOKEN → renders <ImagePlaceholder> (skeleton)
 *  - src is an empty/undefined value → renders the optional `fallback`
 *    (caller can keep the inline SVG fallback they already had)
 *  - src is a real URL → renders a regular <img>
 *
 * The placeholder/img share the same className + style so they occupy the
 * same box in the layout — no jumps.
 */
export function TemplateImage({
  src,
  rounded,
  fallback = null,
  showPendingLabel = true,
  className,
  style,
  alt,
  ...rest
}: TemplateImageProps) {
  if (isPendingImage(src)) {
    return (
      <div className={cn(className)} style={style}>
        <ImagePlaceholder
          rounded={rounded ?? 0}
          showLabel={showPendingLabel}
        />
      </div>
    );
  }

  if (!src) {
    return <>{fallback}</>;
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt ?? ""} className={className} style={style} {...rest} />;
}

TemplateImage.displayName = "TemplateImage";
export { isPendingImage };
