import type { ComponentType } from "react";
import type { DesignTokens } from "@/types/ai-generation";

/**
 * Props padrao que TODA secao de template recebe.
 * Identico ao antigo BlockProps — mantem compatibilidade com o editor.
 */
export interface TemplateSectionProps {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
  navigation?: { label: string; href: string; isExternal?: boolean }[];
}

/**
 * Definicao de uma secao dentro de um template.
 */
export interface TemplateSectionDef {
  /** blockType usado no blueprint (hero, services, faq, etc.) */
  blockType: string;
  /** Numero da variante INTERNA ao template (1, 2, 3...) */
  variant: number;
  /** Nome legivel da secao */
  name: string;
  /** Descricao curta */
  description: string;
}

/**
 * Configuracao completa de um template.
 */
export interface TemplateConfig {
  /** ID unico do template */
  id: string;
  /** Nome legivel */
  name: string;
  /** Descricao do estilo visual */
  description: string;
  /** URL do thumbnail para preview */
  thumbnail: string;
  /** Nichos de negocio ideais */
  bestFor: string[];

  /** Estilo forcado (nao deixa a IA escolher outro) */
  forceStyle: DesignTokens["style"];
  /** Border radius forcado */
  forceRadius: DesignTokens["borderRadius"];
  /** Fonte heading recomendada (slug) */
  recommendedHeadingFont?: string;
  /** Fonte body recomendada (slug) */
  recommendedBodyFont?: string;

  /** Secoes na ordem padrao (a IA gera content para estas) */
  defaultSections: TemplateSectionDef[];

  /** Variantes disponiveis por blockType (futuro: hero-1, hero-2) */
  availableVariants: Record<string, number[]>;
}

/**
 * Especificacao de um campo para o content map.
 * Usado para instruir a IA sobre o que gerar em cada secao.
 */
export interface FieldSpec {
  key: string;
  type: "string" | "array" | "object";
  maxLength?: number;
  count?: { min: number; max: number };
  children?: FieldSpec[];
  description: string;
}

/**
 * Especificacao de uma imagem para geracao AI (Banana Nano 2).
 */
export interface ImageSpec {
  aspectRatio: "16:9" | "1:1" | "4:3" | "3:4";
  style: string;
  subject: string;
  avoid: string[];
  count?: number;
}

/**
 * Mapa de conteudo de uma secao — diz a IA exatamente
 * quais campos gerar, com que formato e tom.
 */
export interface SectionContentMap {
  blockType: string;
  variant: number;
  fields: FieldSpec[];
  contentGuidance: string;
  imageQueryHint?: string;
  exampleOutput?: Record<string, unknown>;
  imageSpec?: ImageSpec;
  imageSpecs?: Record<string, ImageSpec>;
  /**
   * Quando true, esta seção usa ÍCONES (renderizados via IconRenderer) em vez
   * de imagens. O pipeline de geração de imagens pula a seção e a IA é
   * instruída a preencher `items[].icon` com tokens (ex: "lucide:Star").
   */
  iconOnly?: boolean;
}

/**
 * Lazy import de um componente de secao.
 */
export type TemplateLazyImport = () => Promise<{
  default: ComponentType<TemplateSectionProps>;
}>;

/**
 * Mapa de secoes de um template: blockType → variant → lazy import
 */
export type TemplateSectionMap = Record<string, Record<number, TemplateLazyImport>>;
