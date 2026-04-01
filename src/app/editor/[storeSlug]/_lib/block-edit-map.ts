import type { BlockType } from "@/types/ai-generation";

/**
 * How a field should be edited in the visual editor:
 *
 * - "text"      → inline contentEditable (headings, paragraphs, labels)
 * - "button"    → popup with label + link type + URL
 * - "image"     → popup with upload / search / URL
 * - "component" → edited via the sidebar drawer only
 */
export type EditMode = "text" | "button" | "image" | "nav" | "footer" | "pricing" | "component";

export interface EditableField {
  /** Dot-path to the field. Use `*` for array indices (e.g. "items.*.name") */
  path: string;
  /** How to edit this field */
  mode: EditMode;
  /** Human-readable label for the field */
  label: string;
  /** For buttons: companion field paths */
  linkPath?: string;
  typePath?: string;
}

/**
 * Static map defining every editable field per block type.
 *
 * The editor reads this map to know:
 * 1. Which fields exist in each section's content
 * 2. Whether a field is text (inline edit), button (popup), image (popup), or component (drawer)
 * 3. Related fields for buttons (link URL, link type)
 *
 * This replaces the fragile DOM text-matching approach with explicit knowledge.
 */
export const BLOCK_EDIT_MAP: Record<BlockType, EditableField[]> = {
  hero: [
    { path: "tagline", mode: "text", label: "Tagline" },
    { path: "headline", mode: "text", label: "Título" },
    { path: "subheadline", mode: "text", label: "Subtítulo" },
    { path: "badgeText", mode: "text", label: "Badge" },
    { path: "ctaText", mode: "button", label: "Botão principal", linkPath: "ctaLink", typePath: "ctaType" },
    { path: "secondaryCtaText", mode: "button", label: "Botão secundário", linkPath: "secondaryCtaLink" },
    { path: "backgroundImage", mode: "image", label: "Imagem de fundo" },
  ],

  header: [
    { path: "storeName", mode: "nav", label: "Nome da loja" },
    { path: "logoUrl", mode: "nav", label: "Logo" },
    { path: "ctaText", mode: "nav", label: "Botão CTA", linkPath: "ctaLink" },
  ],

  footer: [
    { path: "copyrightText", mode: "footer", label: "Copyright" },
    { path: "showSocial", mode: "footer", label: "Redes sociais" },
  ],

  services: [
    { path: "title", mode: "text", label: "Título" },
    { path: "subtitle", mode: "text", label: "Subtítulo" },
    { path: "items.*.name", mode: "text", label: "Nome do serviço" },
    { path: "items.*.description", mode: "text", label: "Descrição" },
    { path: "items.*.price", mode: "text", label: "Preço" },
    { path: "items.*.image", mode: "image", label: "Imagem" },
    { path: "items.*.ctaText", mode: "button", label: "Botão", linkPath: "items.*.ctaLink" },
  ],

  about: [
    { path: "title", mode: "text", label: "Título" },
    { path: "subtitle", mode: "text", label: "Subtítulo" },
    { path: "paragraphs.*", mode: "text", label: "Parágrafo" },
    { path: "highlights.*.label", mode: "text", label: "Label do destaque" },
    { path: "highlights.*.value", mode: "text", label: "Valor do destaque" },
    { path: "ctaText", mode: "button", label: "Botão CTA", linkPath: "ctaLink" },
    { path: "image", mode: "image", label: "Imagem" },
  ],

  testimonials: [
    { path: "title", mode: "text", label: "Título" },
    { path: "subtitle", mode: "text", label: "Subtítulo" },
    { path: "items.*.text", mode: "text", label: "Depoimento" },
    { path: "items.*.author", mode: "text", label: "Autor" },
    { path: "items.*.role", mode: "text", label: "Cargo" },
    { path: "items.*.image", mode: "image", label: "Foto" },
    { path: "items.*.rating", mode: "component", label: "Nota" },
  ],

  gallery: [
    { path: "title", mode: "text", label: "Título" },
    { path: "subtitle", mode: "text", label: "Subtítulo" },
    { path: "images.*.url", mode: "image", label: "Imagem" },
    { path: "images.*.caption", mode: "text", label: "Legenda" },
  ],

  faq: [
    { path: "title", mode: "text", label: "Título" },
    { path: "subtitle", mode: "text", label: "Subtítulo" },
    { path: "items.*.question", mode: "text", label: "Pergunta" },
    { path: "items.*.answer", mode: "text", label: "Resposta" },
  ],

  contact: [
    { path: "title", mode: "text", label: "Título" },
    { path: "subtitle", mode: "text", label: "Subtítulo" },
    { path: "address", mode: "text", label: "Endereço" },
    { path: "phone", mode: "text", label: "Telefone" },
    { path: "email", mode: "text", label: "Email" },
    { path: "whatsapp", mode: "text", label: "WhatsApp" },
    { path: "showMap", mode: "component", label: "Mostrar mapa" },
    { path: "showForm", mode: "component", label: "Mostrar formulário" },
    { path: "formFields", mode: "component", label: "Campos do formulário" },
  ],

  cta: [
    { path: "title", mode: "text", label: "Título" },
    { path: "subtitle", mode: "text", label: "Subtítulo" },
    { path: "ctaText", mode: "button", label: "Botão CTA", linkPath: "ctaLink", typePath: "ctaType" },
  ],

  pricing: [
    { path: "title", mode: "text", label: "Título" },
    { path: "subtitle", mode: "text", label: "Subtítulo" },
    { path: "plans", mode: "pricing", label: "Planos" },
  ],

  stats: [
    { path: "title", mode: "text", label: "Título" },
    { path: "items.*.value", mode: "text", label: "Valor" },
    { path: "items.*.label", mode: "text", label: "Label" },
    { path: "items.*.image", mode: "image", label: "Imagem" },
  ],

  team: [
    { path: "title", mode: "text", label: "Título" },
    { path: "subtitle", mode: "text", label: "Subtítulo" },
    { path: "members.*.name", mode: "text", label: "Nome" },
    { path: "members.*.role", mode: "text", label: "Cargo" },
    { path: "members.*.bio", mode: "text", label: "Bio" },
    { path: "members.*.image", mode: "image", label: "Foto" },
  ],

  catalog: [
    { path: "title", mode: "text", label: "Título" },
    { path: "subtitle", mode: "text", label: "Subtítulo" },
    { path: "categories.*.name", mode: "text", label: "Nome da categoria" },
    { path: "categories.*.description", mode: "text", label: "Descrição" },
    { path: "categories.*.image", mode: "image", label: "Imagem" },
    { path: "ctaText", mode: "button", label: "Botão CTA" },
  ],

  "featured-products": [
    { path: "title", mode: "text", label: "Título" },
    { path: "subtitle", mode: "text", label: "Subtítulo" },
    { path: "items.*.name", mode: "text", label: "Nome do produto" },
    { path: "items.*.description", mode: "text", label: "Descrição" },
    { path: "items.*.price", mode: "text", label: "Preço" },
    { path: "items.*.image", mode: "image", label: "Imagem" },
  ],

  menu: [
    { path: "title", mode: "text", label: "Título" },
    { path: "subtitle", mode: "text", label: "Subtítulo" },
    { path: "categories.*.name", mode: "text", label: "Nome da categoria" },
    { path: "categories.*.items.*.name", mode: "text", label: "Nome do item" },
    { path: "categories.*.items.*.description", mode: "text", label: "Descrição" },
    { path: "categories.*.items.*.price", mode: "text", label: "Preço" },
    { path: "categories.*.items.*.image", mode: "image", label: "Imagem" },
  ],

  location: [
    { path: "title", mode: "text", label: "Título" },
    { path: "address", mode: "text", label: "Endereço" },
    { path: "instructions", mode: "text", label: "Instruções" },
  ],

  hours: [
    { path: "title", mode: "text", label: "Título" },
    { path: "schedule", mode: "component", label: "Horários" },
    { path: "note", mode: "text", label: "Observação" },
  ],

  "whatsapp-float": [
    { path: "number", mode: "component", label: "Número" },
    { path: "message", mode: "text", label: "Mensagem padrão" },
  ],
};

/**
 * Get the edit mode for a specific field path in a block type.
 * Resolves wildcard paths (e.g. "items.0.name" matches "items.*.name").
 */
export function getFieldEditMode(
  blockType: BlockType,
  fieldPath: string
): EditableField | null {
  const fields = BLOCK_EDIT_MAP[blockType];
  if (!fields) return null;

  for (const field of fields) {
    if (matchPath(field.path, fieldPath)) {
      return field;
    }
  }

  return null;
}

/**
 * Check if a concrete path matches a pattern with wildcards.
 * "items.0.name" matches "items.*.name"
 * "plans.2.features.1" matches "plans.*.features.*"
 */
function matchPath(pattern: string, concrete: string): boolean {
  const patternParts = pattern.split(".");
  const concreteParts = concrete.split(".");

  if (patternParts.length !== concreteParts.length) return false;

  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i] === "*") continue;
    if (patternParts[i] !== concreteParts[i]) return false;
  }

  return true;
}

/**
 * Resolve a wildcard field's companion paths for a specific array index.
 * E.g. field with linkPath "items.*.ctaLink" + concrete "items.2.ctaText"
 * → resolved linkPath = "items.2.ctaLink"
 */
export function resolveCompanionPath(
  fieldPattern: EditableField,
  concretePath: string,
  companionPattern: string
): string {
  const concreteP = concretePath.split(".");
  const companionP = companionPattern.split(".");

  return companionP
    .map((part, i) => (part === "*" ? concreteP[i] ?? part : part))
    .join(".");
}
