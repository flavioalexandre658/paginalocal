import type { BlockType } from "@/types/ai-generation";

export type FieldType = "text" | "textarea" | "number" | "boolean" | "select" | "image" | "array" | "record";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  optionLabels?: Record<string, string>;
  min?: number;
  max?: number;
  step?: number;
  arrayItemFields?: FieldDef[];
}

export const FIELD_DEFINITIONS: Record<BlockType, FieldDef[]> = {
  header: [
    { key: "storeName", label: "Nome da loja", type: "text" },
    { key: "logoUrl", label: "URL do logo", type: "image" },
    { key: "ctaText", label: "Texto do botao", type: "text", placeholder: "Agendar" },
    { key: "ctaLink", label: "Link do botao", type: "text", placeholder: "https://wa.me/55..." },
  ],

  hero: [
    { key: "headline", label: "Titulo principal", type: "text", required: true },
    { key: "subheadline", label: "Subtitulo", type: "textarea", required: true },
    { key: "ctaText", label: "Texto do botao principal", type: "text", required: true },
    { key: "ctaType", label: "Tipo do botao", type: "select", options: ["whatsapp", "link", "scroll"], optionLabels: { whatsapp: "WhatsApp", link: "Link externo", scroll: "Rolar para secao" } },
    { key: "ctaLink", label: "Link do botao", type: "text" },
    { key: "secondaryCtaText", label: "Texto do botao secundario", type: "text" },
    { key: "secondaryCtaLink", label: "Link do botao secundario", type: "text" },
    { key: "backgroundImage", label: "Imagem de fundo", type: "image" },
    { key: "overlayOpacity", label: "Opacidade do overlay", type: "number", min: 0, max: 1, step: 0.1 },
  ],

  services: [
    { key: "title", label: "Titulo", type: "text", required: true },
    { key: "subtitle", label: "Subtitulo", type: "textarea" },
    {
      key: "items", label: "Servicos", type: "array",
      arrayItemFields: [
        { key: "name", label: "Nome", type: "text", required: true },
        { key: "description", label: "Descricao", type: "textarea", required: true },
        { key: "price", label: "Preco", type: "text", placeholder: "R$ 50,00" },
        { key: "icon", label: "Icone", type: "text" },
        { key: "image", label: "Imagem", type: "image" },
        { key: "ctaText", label: "Texto do botao", type: "text" },
        { key: "ctaLink", label: "Link do botao", type: "text" },
      ],
    },
  ],

  about: [
    { key: "title", label: "Titulo", type: "text", required: true },
    { key: "subtitle", label: "Subtitulo", type: "textarea" },
    {
      key: "paragraphs", label: "Paragrafos", type: "array",
      arrayItemFields: [
        { key: "_value", label: "Texto", type: "textarea", required: true },
      ],
    },
    {
      key: "highlights", label: "Destaques", type: "array",
      arrayItemFields: [
        { key: "label", label: "Rotulo", type: "text", required: true },
        { key: "value", label: "Valor", type: "text", required: true },
      ],
    },
    { key: "image", label: "Imagem", type: "image" },
  ],

  testimonials: [
    { key: "title", label: "Titulo", type: "text", required: true },
    { key: "subtitle", label: "Subtitulo", type: "textarea" },
    {
      key: "items", label: "Depoimentos", type: "array",
      arrayItemFields: [
        { key: "text", label: "Texto", type: "textarea", required: true },
        { key: "author", label: "Autor", type: "text", required: true },
        { key: "rating", label: "Nota (1-5)", type: "number", min: 1, max: 5 },
        { key: "role", label: "Cargo/Funcao", type: "text" },
      ],
    },
  ],

  gallery: [
    { key: "title", label: "Titulo", type: "text", required: true },
    { key: "subtitle", label: "Subtitulo", type: "textarea" },
    {
      key: "images", label: "Imagens", type: "array",
      arrayItemFields: [
        { key: "url", label: "URL da imagem", type: "image", required: true },
        { key: "alt", label: "Texto alternativo", type: "text", required: true },
        { key: "caption", label: "Legenda", type: "text" },
      ],
    },
  ],

  faq: [
    { key: "title", label: "Titulo", type: "text", required: true },
    { key: "subtitle", label: "Subtitulo", type: "textarea" },
    {
      key: "items", label: "Perguntas e Respostas", type: "array",
      arrayItemFields: [
        { key: "question", label: "Pergunta", type: "text", required: true },
        { key: "answer", label: "Resposta", type: "textarea", required: true },
      ],
    },
  ],

  contact: [
    { key: "title", label: "Titulo", type: "text", required: true },
    { key: "subtitle", label: "Subtitulo", type: "textarea" },
    { key: "address", label: "Endereco", type: "text" },
    { key: "phone", label: "Telefone", type: "text" },
    { key: "email", label: "E-mail", type: "text" },
    { key: "whatsapp", label: "WhatsApp", type: "text" },
    { key: "showMap", label: "Mostrar mapa", type: "boolean" },
    { key: "showForm", label: "Mostrar formulario", type: "boolean" },
  ],

  cta: [
    { key: "title", label: "Titulo", type: "text", required: true },
    { key: "subtitle", label: "Subtitulo", type: "textarea" },
    { key: "ctaText", label: "Texto do botao", type: "text", required: true },
    { key: "ctaType", label: "Tipo do botao", type: "select", options: ["whatsapp", "link", "scroll"], optionLabels: { whatsapp: "WhatsApp", link: "Link externo", scroll: "Rolar para secao" } },
    { key: "ctaLink", label: "Link do botao", type: "text" },
    { key: "backgroundColor", label: "Cor de fundo", type: "select", options: ["primary", "secondary", "accent", "gradient"], optionLabels: { primary: "Primaria", secondary: "Secundaria", accent: "Destaque", gradient: "Gradiente" } },
  ],

  catalog: [
    { key: "title", label: "Titulo", type: "text", required: true },
    { key: "subtitle", label: "Subtitulo", type: "textarea" },
    {
      key: "categories", label: "Categorias", type: "array",
      arrayItemFields: [
        { key: "name", label: "Nome", type: "text", required: true },
        { key: "description", label: "Descricao", type: "textarea" },
        { key: "image", label: "Imagem", type: "image" },
      ],
    },
    { key: "ctaText", label: "Texto do botao", type: "text" },
    { key: "ctaType", label: "Tipo do botao", type: "select", options: ["whatsapp", "link", "page"], optionLabels: { whatsapp: "WhatsApp", link: "Link externo", page: "Pagina interna" } },
    { key: "layout", label: "Layout", type: "select", options: ["grid", "carousel", "list"], optionLabels: { grid: "Grade", carousel: "Carrossel", list: "Lista" } },
  ],

  "featured-products": [
    { key: "title", label: "Titulo", type: "text", required: true },
    { key: "subtitle", label: "Subtitulo", type: "textarea" },
    {
      key: "items", label: "Produtos", type: "array",
      arrayItemFields: [
        { key: "name", label: "Nome", type: "text", required: true },
        { key: "description", label: "Descricao", type: "textarea" },
        { key: "price", label: "Preco", type: "text" },
        { key: "originalPrice", label: "Preco original", type: "text" },
        { key: "image", label: "Imagem", type: "image" },
        { key: "badge", label: "Badge", type: "text", placeholder: "Novo, Promocao..." },
        { key: "ctaText", label: "Texto do botao", type: "text" },
      ],
    },
  ],

  pricing: [
    { key: "title", label: "Titulo", type: "text", required: true },
    { key: "subtitle", label: "Subtitulo", type: "textarea" },
    { key: "showBillingToggle", label: "Mostrar toggle mensal/anual", type: "boolean" },
    {
      key: "plans", label: "Planos", type: "array",
      arrayItemFields: [
        { key: "name", label: "Nome do plano", type: "text", required: true },
        { key: "price", label: "Preco", type: "text", required: true },
        { key: "priceAnnual", label: "Preco anual", type: "text" },
        { key: "description", label: "Descricao", type: "text", required: true },
        {
          key: "features", label: "Recursos", type: "array",
          arrayItemFields: [
            { key: "_value", label: "Recurso", type: "text", required: true },
          ],
        },
        { key: "highlighted", label: "Destacar plano", type: "boolean" },
        { key: "ctaText", label: "Texto do botao", type: "text", required: true },
        { key: "ctaType", label: "Tipo do botao", type: "select", options: ["whatsapp", "link"], optionLabels: { whatsapp: "WhatsApp", link: "Link" } },
      ],
    },
  ],

  menu: [
    { key: "title", label: "Titulo", type: "text", required: true },
    { key: "subtitle", label: "Subtitulo", type: "textarea" },
    {
      key: "categories", label: "Categorias", type: "array",
      arrayItemFields: [
        { key: "name", label: "Nome da categoria", type: "text", required: true },
        {
          key: "items", label: "Itens", type: "array",
          arrayItemFields: [
            { key: "name", label: "Nome", type: "text", required: true },
            { key: "description", label: "Descricao", type: "textarea" },
            { key: "price", label: "Preco", type: "text", required: true },
            { key: "image", label: "Imagem", type: "image" },
            { key: "badge", label: "Badge", type: "text" },
          ],
        },
      ],
    },
  ],

  team: [
    { key: "title", label: "Titulo", type: "text", required: true },
    { key: "subtitle", label: "Subtitulo", type: "textarea" },
    {
      key: "members", label: "Membros", type: "array",
      arrayItemFields: [
        { key: "name", label: "Nome", type: "text", required: true },
        { key: "role", label: "Cargo", type: "text", required: true },
        { key: "bio", label: "Bio", type: "textarea" },
        { key: "image", label: "Foto", type: "image" },
      ],
    },
  ],

  stats: [
    { key: "title", label: "Titulo", type: "text" },
    {
      key: "items", label: "Estatisticas", type: "array",
      arrayItemFields: [
        { key: "value", label: "Valor", type: "text", required: true },
        { key: "label", label: "Rotulo", type: "text", required: true },
        { key: "icon", label: "Icone", type: "text" },
      ],
    },
  ],

  location: [
    { key: "title", label: "Titulo", type: "text", required: true },
    { key: "address", label: "Endereco", type: "text", required: true },
    { key: "lat", label: "Latitude", type: "number" },
    { key: "lng", label: "Longitude", type: "number" },
    { key: "instructions", label: "Instrucoes de como chegar", type: "textarea" },
  ],

  hours: [
    { key: "title", label: "Titulo", type: "text", required: true },
    { key: "schedule", label: "Horarios", type: "record" },
    { key: "note", label: "Observacao", type: "text" },
  ],

  footer: [
    { key: "copyrightText", label: "Texto de copyright", type: "text" },
    { key: "showSocial", label: "Mostrar redes sociais", type: "boolean" },
  ],

  "whatsapp-float": [
    { key: "number", label: "Numero do WhatsApp", type: "text", required: true, placeholder: "5511999999999" },
    { key: "message", label: "Mensagem padrao", type: "textarea" },
    { key: "position", label: "Posicao", type: "select", options: ["bottom-right", "bottom-left"], optionLabels: { "bottom-right": "Inferior direita", "bottom-left": "Inferior esquerda" } },
  ],
};
