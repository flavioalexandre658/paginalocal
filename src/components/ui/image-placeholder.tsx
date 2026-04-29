"use client";

import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const PENDING = "__pgl_pending_image__";

export function isPendingImage(value: unknown): boolean {
  return value === PENDING;
}

interface ImagePlaceholderProps {
  className?: string;
  rounded?: number | string;
  label?: string;
  showLabel?: boolean;
}

/**
 * Skeleton reusável que substitui um <img> enquanto a imagem está sendo
 * gerada de forma assíncrona pela pipeline de IA. Segue o pattern
 * `pgl-skeleton-loading`: bg-[#f5f5f4], radius reflete o componente final,
 * label sutil ao centro com tipografia system-ui Linear/HIG.
 */
export function ImagePlaceholder({
  className,
  rounded = 12,
  label = "Gerando imagem…",
  showLabel = true,
}: ImagePlaceholderProps) {
  return (
    <div
      data-pgl-image-pending
      className={cn(
        "relative h-full w-full overflow-hidden",
        className
      )}
      style={{
        borderRadius: rounded,
        backgroundColor: "#f5f5f4",
      }}
    >
      <Skeleton
        className="absolute inset-0 bg-[#f5f5f4]"
        style={{ borderRadius: rounded }}
      />

      {showLabel && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span
            className="rounded-full border border-black/[0.06] bg-white/80 px-2.5 py-1 text-[11px] font-medium text-black/45 shadow-sm backdrop-blur-sm animate-pulse"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            {label}
          </span>
        </div>
      )}
    </div>
  );
}

ImagePlaceholder.displayName = "ImagePlaceholder";
