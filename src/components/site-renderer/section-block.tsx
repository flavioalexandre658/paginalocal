"use client";

import { Component, useState, useEffect } from "react";
import type { ComponentType, ReactNode, ErrorInfo } from "react";
import type {
  SectionBlock as SectionBlockType,
  DesignTokens,
} from "@/types/ai-generation";
import { BLOCK_REGISTRY } from "./blocks/registry";
import { TEMPLATE_REGISTRY } from "@/templates/registry";

interface BlockProps {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
  navigation?: { label: string; href: string; isExternal?: boolean }[];
}

interface SectionBlockProps {
  block: SectionBlockType;
  designTokens: DesignTokens;
  isDark?: boolean;
  navigation?: { label: string; href: string; isExternal?: boolean }[];
  templateId?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

class SectionErrorBoundary extends Component<
  { children: ReactNode; blockType: string },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false, message: "" };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : String(error),
    };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        `[SectionBlock] ${this.props.blockType} crashed:`,
        error,
        info
      );
    }
  }

  render() {
    if (this.state.hasError) {
      if (process.env.NODE_ENV === "development") {
        return (
          <div className="p-4 border border-red-300 bg-red-50 text-red-700 text-sm">
            Bloco <strong>{this.props.blockType}</strong> quebrou:{" "}
            {this.state.message}
          </div>
        );
      }
      return null;
    }
    return this.props.children;
  }
}

export function SectionBlock({
  block,
  designTokens,
  isDark,
  navigation,
  templateId,
}: SectionBlockProps) {
  const [LoadedComponent, setLoadedComponent] =
    useState<ComponentType<BlockProps> | null>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let loader: (() => Promise<{ default: any }>) | undefined;

    // 1. Try TEMPLATE_REGISTRY first (if templateId exists)
    if (templateId) {
      const templateSections = TEMPLATE_REGISTRY[templateId];
      if (templateSections) {
        const blockVariants = templateSections[block.blockType];
        if (blockVariants) {
          loader = blockVariants[block.variant] ?? blockVariants[1];
        }
      }
    }

    // 2. Fallback to BLOCK_REGISTRY (legacy/universal blocks)
    if (!loader) {
      const blockVariants = BLOCK_REGISTRY[block.blockType];
      if (blockVariants) {
        loader = blockVariants[block.variant] ?? blockVariants[1];
      }
    }

    if (!loader) return;

    let cancelled = false;
    loader().then((mod) => {
      if (!cancelled && mod.default) {
        setLoadedComponent(() => mod.default as ComponentType<BlockProps>);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [block.blockType, block.variant, templateId]);

  if (!LoadedComponent) {
    return null;
  }

  return (
    <SectionErrorBoundary blockType={block.blockType}>
      <LoadedComponent
        content={block.content}
        tokens={designTokens}
        isDark={isDark}
        navigation={navigation}
      />
    </SectionErrorBoundary>
  );
}
