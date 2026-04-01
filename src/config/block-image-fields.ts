/**
 * Mapa de campos de imagem por blockType.
 *
 * Define QUAIS campos de cada blockType precisam de imagem
 * e como o sistema de fallback (Unsplash) deve preenche-los.
 *
 * Tipos de campo:
 * - "single": um campo string no content raiz (ex: content.backgroundImage)
 * - "array-items": campo `image` dentro de cada item do array `items` (ex: content.items[].image)
 * - "array-images": array de objetos com campo `url` (ex: content.images[].url)
 */

export interface BlockImageField {
  /** Caminho do campo no content */
  path: string;
  /** Tipo: single string, ou dentro de array de items, ou array de image objects */
  type: "single" | "array-items" | "array-images";
  /** Qual tipo de imagem buscar: "hero" (principal do negocio) ou "gallery" (variadas) */
  imageType: "hero" | "gallery";
  /** Descricao para a IA saber o que colocar */
  description: string;
}

export const BLOCK_IMAGE_FIELDS: Record<string, BlockImageField[]> = {
  hero: [
    {
      path: "backgroundImage",
      type: "single",
      imageType: "hero",
      description: "Imagem de fundo principal do hero — foto do negocio ou ambiente",
    },
  ],
  about: [
    {
      path: "image",
      type: "single",
      imageType: "gallery",
      description: "Foto do negocio, equipe ou espaco fisico",
    },
  ],
  cta: [
    {
      path: "backgroundImage",
      type: "single",
      imageType: "hero",
      description: "Imagem de fundo da secao CTA",
    },
  ],
  services: [
    {
      path: "items",
      type: "array-items",
      imageType: "gallery",
      description: "Foto ilustrativa de cada servico",
    },
  ],
  testimonials: [
    {
      path: "items",
      type: "array-items",
      imageType: "gallery",
      description: "Foto do autor do depoimento ou do caso de sucesso",
    },
  ],
  gallery: [
    {
      path: "images",
      type: "array-images",
      imageType: "gallery",
      description: "Fotos da galeria do negocio",
    },
  ],
  team: [
    {
      path: "items",
      type: "array-items",
      imageType: "gallery",
      description: "Foto de cada membro da equipe",
    },
  ],
  catalog: [
    {
      path: "categories",
      type: "array-items",
      imageType: "gallery",
      description: "Foto de cada categoria de produto",
    },
  ],
  "featured-products": [
    {
      path: "items",
      type: "array-items",
      imageType: "gallery",
      description: "Foto de cada produto em destaque",
    },
  ],
  stats: [
    {
      path: "items",
      type: "array-items",
      imageType: "gallery",
      description: "Logo ou imagem representativa de cada item/integração",
    },
  ],
  menu: [
    // Menu items geralmente nao tem imagem no schema, mas menu-cards-images sim
    // O campo fica dentro de categories[].items[].image — nao suportado ainda
  ],
};

/**
 * Verifica se um blockType tem campos de imagem que precisam ser preenchidos.
 */
export function blockNeedsImages(blockType: string): boolean {
  const fields = BLOCK_IMAGE_FIELDS[blockType];
  return !!fields && fields.length > 0;
}

/**
 * Retorna os campos de imagem de um blockType.
 */
export function getImageFields(blockType: string): BlockImageField[] {
  return BLOCK_IMAGE_FIELDS[blockType] || [];
}
