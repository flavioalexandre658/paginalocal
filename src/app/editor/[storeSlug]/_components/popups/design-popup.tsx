"use client";

import { useState, useEffect, useRef, type ComponentType } from "react";
import { IconCheck } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  ModalFooterActions,
} from "@/components/ui/modal-blocks";
import { PglButton } from "@/components/ui/pgl-button";
import { useEditor } from "../../_lib/editor-context";
import { BLOCK_REGISTRY } from "@/components/site-renderer/blocks/registry";
import { DesignTokensProvider } from "@/components/site-renderer/design-tokens-provider";
import { BLOCK_TYPE_LABELS } from "../../_lib/block-type-labels";
import type { SectionBlock, BlockType, DesignTokens } from "@/types/ai-generation";

interface BlockProps {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
  navigation?: { label: string; href: string; isExternal?: boolean }[];
}

interface Props {
  section: SectionBlock;
  open: boolean;
  onClose: () => void;
}

function getVariantKeys(blockType: BlockType): number[] {
  const variants = BLOCK_REGISTRY[blockType];
  if (!variants) return [];
  return Object.keys(variants).map(Number).sort((a, b) => a - b);
}

function VariantThumbnail({
  blockType,
  variant,
  content,
  tokens,
  navigation,
  isActive,
  onClick,
}: {
  blockType: BlockType;
  variant: number;
  content: Record<string, unknown>;
  tokens: DesignTokens;
  navigation?: { label: string; href: string; isExternal?: boolean }[];
  isActive: boolean;
  onClick: () => void;
}) {
  const [Component, setComponent] = useState<ComponentType<BlockProps> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const variants = BLOCK_REGISTRY[blockType];
    if (!variants) return;
    const loader = variants[variant];
    if (!loader) return;

    let cancelled = false;
    loader()
      .then((mod) => {
        if (!cancelled && mod.default) {
          setComponent(() => mod.default as ComponentType<BlockProps>);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    return () => { cancelled = true; };
  }, [blockType, variant]);

  const renderWidth = 1200;
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState<{ scale: number; height: number } | null>(null);

  useEffect(() => {
    if (!containerRef.current || !innerRef.current || loading) return;

    function measure() {
      const cw = containerRef.current!.offsetWidth;
      const ih = innerRef.current!.scrollHeight;
      const s = cw / renderWidth;
      setDims({ scale: s, height: Math.ceil(ih * s) });
    }

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(containerRef.current);
    ro.observe(innerRef.current);
    return () => ro.disconnect();
  }, [loading]);

  if (loading) {
    return <Skeleton className="h-40 w-full rounded-[10px] bg-[#f5f5f4]" />;
  }

  return (
    <button
      onClick={onClick}
      className={`group relative w-full rounded-[10px] overflow-hidden text-left transition-all duration-150 cursor-pointer border-2 ${
        isActive
          ? "border-black/80 ring-1 ring-black/80"
          : "border-black/[0.08] hover:border-black/20"
      }`}
    >
      <div
        ref={containerRef}
        className="pointer-events-none overflow-hidden w-full"
        style={{ height: dims?.height || "auto", position: "relative" }}
      >
        <div
          ref={innerRef}
          style={{
            width: renderWidth,
            transform: `scale(${dims?.scale ?? 0.22})`,
            transformOrigin: "top left",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          {Component && (
            <DesignTokensProvider tokens={tokens}>
              <div style={{ backgroundColor: "var(--pgl-background)", color: "var(--pgl-text)" }}>
                <Component
                  content={content}
                  tokens={tokens}
                  navigation={blockType === "header" ? navigation : undefined}
                />
              </div>
            </DesignTokensProvider>
          )}
        </div>
      </div>

      {isActive && (
        <div className="absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/80 shadow-md">
          <IconCheck className="size-3.5 text-white" />
        </div>
      )}

      {!isActive && (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-150" />
      )}
    </button>
  );
}

export function DesignPopup({ section, open, onClose }: Props) {
  const { state, dispatch } = useEditor();
  const blockType = section.blockType as BlockType;
  const variants = getVariantKeys(blockType);
  const tokens = state.blueprint.designTokens;
  const navigation = state.blueprint.navigation;
  const label = BLOCK_TYPE_LABELS[blockType] ?? blockType;

  function selectVariant(v: number) {
    dispatch({ type: "UPDATE_SECTION_VARIANT", sectionId: section.id, variant: v });
  }

  return (
    <Modal open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <ModalContent size="lg">
        <ModalHeader>
          <ModalTitle>Design — {label}</ModalTitle>
          <ModalDescription>
            Variante {section.variant} de {variants.length} disponivel{variants.length !== 1 && "is"}
          </ModalDescription>
        </ModalHeader>

        <ModalBody>
          {variants.length <= 1 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-black/40">
                Esta secao possui apenas um layout disponivel.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {variants.map((v) => (
                <VariantThumbnail
                  key={v}
                  blockType={blockType}
                  variant={v}
                  content={section.content as Record<string, unknown>}
                  tokens={tokens}
                  navigation={navigation}
                  isActive={section.variant === v}
                  onClick={() => selectVariant(v)}
                />
              ))}
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <div />
          <ModalFooterActions>
            <PglButton variant="ghost" size="sm" onClick={onClose}>
              Fechar
            </PglButton>
          </ModalFooterActions>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
