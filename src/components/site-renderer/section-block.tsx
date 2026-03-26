"use client";

import { Component, useState, useEffect } from "react";
import type { ComponentType, ReactNode, ErrorInfo } from "react";
import type {
  SectionBlock as SectionBlockType,
  DesignTokens,
} from "@/types/ai-generation";
import { BLOCK_REGISTRY } from "./blocks/registry";

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
}: SectionBlockProps) {
  const [LoadedComponent, setLoadedComponent] =
    useState<ComponentType<BlockProps> | null>(null);

  useEffect(() => {
    const variants = BLOCK_REGISTRY[block.blockType];
    if (!variants) return;
    const loader = variants[block.variant] ?? variants[1];
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
  }, [block.blockType, block.variant]);

  if (!LoadedComponent) {
    return <div className="h-32" />;
  }

  return (
    <SectionErrorBoundary blockType={block.blockType}>
      <section id={block.blockType}>
        <LoadedComponent
          content={block.content}
          tokens={designTokens}
          isDark={isDark}
          navigation={navigation}
        />
      </section>
    </SectionErrorBoundary>
  );
}
