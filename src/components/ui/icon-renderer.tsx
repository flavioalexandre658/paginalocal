"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";

import { FaIconResolver } from "./icon-renderer.fa";
import { MdIconResolver } from "./icon-renderer.md";
import { TbIconResolver } from "./icon-renderer.tb";
import { HiIconResolver } from "./icon-renderer.hi";
import { IoIconResolver } from "./icon-renderer.io";
import { BiIconResolver } from "./icon-renderer.bi";

/**
 * IconRenderer — resolves a string token like "lucide:Star" or "fa:FaCheck"
 * into the actual React component from lucide-react or react-icons.
 *
 * Supported prefixes:
 *  - lucide:<PascalName>   → lucide-react
 *  - fa:<FaName>           → react-icons/fa
 *  - md:<MdName>           → react-icons/md
 *  - tb:<TbName>           → react-icons/tb
 *  - hi:<HiName>           → react-icons/hi
 *  - io:<IoName>           → react-icons/io5
 *  - bi:<BiName>           → react-icons/bi
 *
 * If the token can't be resolved, renders a neutral fallback (open square).
 */

export type IconLibrary = "lucide" | "fa" | "md" | "tb" | "hi" | "io" | "bi";

export interface IconRendererProps {
  icon?: string | null;
  size?: number;
  className?: string;
  color?: string;
  strokeWidth?: number;
  ariaLabel?: string;
}

const FallbackIcon = ({
  size = 24,
  color = "currentColor",
  className,
}: {
  size?: number;
  color?: string;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect x="3" y="3" width="18" height="18" rx="3" />
  </svg>
);

export function parseIconToken(
  raw: string
): { library: IconLibrary; name: string } | null {
  if (!raw || typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const colonIdx = trimmed.indexOf(":");
  if (colonIdx === -1) {
    // bare name: assume lucide
    return { library: "lucide", name: trimmed };
  }
  const lib = trimmed.slice(0, colonIdx).toLowerCase() as IconLibrary;
  const name = trimmed.slice(colonIdx + 1).trim();
  if (!name) return null;
  if (!["lucide", "fa", "md", "tb", "hi", "io", "bi"].includes(lib)) {
    return { library: "lucide", name };
  }
  return { library: lib, name };
}

function resolveIconComponent(
  token: string
): React.ComponentType<{ size?: number; color?: string; className?: string; strokeWidth?: number }> | null {
  const parsed = parseIconToken(token);
  if (!parsed) return null;

  switch (parsed.library) {
    case "lucide": {
      const Comp = (LucideIcons as unknown as Record<string, unknown>)[parsed.name];
      if (typeof Comp === "function" || (typeof Comp === "object" && Comp !== null)) {
        return Comp as React.ComponentType<{
          size?: number;
          color?: string;
          className?: string;
          strokeWidth?: number;
        }>;
      }
      return null;
    }
    case "fa":
      return FaIconResolver(parsed.name);
    case "md":
      return MdIconResolver(parsed.name);
    case "tb":
      return TbIconResolver(parsed.name);
    case "hi":
      return HiIconResolver(parsed.name);
    case "io":
      return IoIconResolver(parsed.name);
    case "bi":
      return BiIconResolver(parsed.name);
    default:
      return null;
  }
}

export function IconRenderer({
  icon,
  size = 24,
  className,
  color = "currentColor",
  strokeWidth = 2,
  ariaLabel,
}: IconRendererProps) {
  if (!icon) {
    return <FallbackIcon size={size} color={color} className={className} />;
  }
  const Comp = resolveIconComponent(icon);
  if (!Comp) {
    return <FallbackIcon size={size} color={color} className={className} />;
  }
  return (
    <span
      className={cn("inline-flex items-center justify-center", className)}
      aria-label={ariaLabel}
      role={ariaLabel ? "img" : undefined}
    >
      <Comp size={size} color={color} strokeWidth={strokeWidth} />
    </span>
  );
}

export { FallbackIcon };
