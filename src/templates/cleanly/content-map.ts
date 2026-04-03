import type { SectionContentMap } from "../types";

export const CLEANLY_CONTENT_MAP: SectionContentMap[] = [
  { blockType: "header", variant: 1, fields: [
    { key: "storeName", type: "string", maxLength: 30, description: "Nome da empresa" },
    { key: "ctaText", type: "string", maxLength: 25, description: "CTA button (ex: 'Agendar limpeza')" },
    { key: "ctaLink", type: "string", maxLength: 100, description: "Link do CTA" },
    { key: "phone", type: "string", maxLength: 20, description: "Telefone" },
    { key: "email", type: "string", maxLength: 40, description: "Email" },
  ], contentGuidance: "Nav escura com barra superior (telefone+email) + logo + links brancos + CTA yellow pill." },

  { blockType: "hero", variant: 1, fields: [
    { key: "headline", type: "string", maxLength: 80, description: "Titulo grande. Use *asteriscos* para accent." },
    { key: "subheadline", type: "string", maxLength: 160, description: "Subtitulo" },
    { key: "tagline", type: "string", maxLength: 40, description: "Texto junto ao rating (ex: 'Avaliacao 4.9/5')" },
    { key: "ctaText", type: "string", maxLength: 25, description: "CTA button" },
    { key: "ctaLink", type: "string", maxLength: 100, description: "Link" },
  ], contentGuidance: "Hero ESCURO com avatars + rating + H1 grande + subtitulo + CTA yellow + imagem right.",
    imageSpec: { aspectRatio: "4:3", style: "professional cleaning service", subject: "Equipe de limpeza profissional trabalhando", avoid: ["texto", "logos"] },
    exampleOutput: { headline: "Experimente o melhor em *limpeza* profissional!", subheadline: "Servicos de limpeza residencial e comercial com produtos ecologicos e equipe treinada.", tagline: "Avaliacao 4.9/5", ctaText: "Agendar limpeza", ctaLink: "#contato" },
  },

  { blockType: "stats", variant: 1, fields: [
    { key: "title", type: "string", maxLength: 30, description: "Titulo (ex: 'Parceiros:')" },
    { key: "items", type: "array", count: { min: 4, max: 6 }, children: [
      { key: "value", type: "string", maxLength: 30, description: "Nome do parceiro" },
      { key: "label", type: "string", maxLength: 20, description: "Tipo" },
    ], description: "Logos de parceiros em marquee" },
  ], contentGuidance: "Barra de logos com scroll infinito e grayscale." },

  { blockType: "services", variant: 1, fields: [
    { key: "title", type: "string", maxLength: 60, description: "Titulo com *accent*" },
    { key: "subtitle", type: "string", maxLength: 30, description: "Tag" },
    { key: "items", type: "array", count: { min: 3, max: 6 }, children: [
      { key: "name", type: "string", maxLength: 40, description: "Nome do servico" },
      { key: "description", type: "string", maxLength: 120, description: "Descricao" },
    ], description: "Cards de servico com imagem + titulo + descricao" },
  ], contentGuidance: "Grid 3x de cards com imagem decorativa + titulo + descricao.",
    imageSpec: { aspectRatio: "4:3", style: "clean professional service", subject: "Servico de limpeza em acao", avoid: ["texto"], count: 6 },
    exampleOutput: { title: "Limpeza *Ecologica*", subtitle: "Servicos", items: [
      { name: "Limpeza Residencial", description: "Limpeza completa para casas e apartamentos com produtos seguros." },
      { name: "Limpeza Comercial", description: "Solucoes profissionais para escritorios e espacos comerciais." },
      { name: "Limpeza Pos-Obra", description: "Remocao de residuos e limpeza profunda apos reformas." },
    ] },
  },

  { blockType: "about", variant: 1, fields: [
    { key: "title", type: "string", maxLength: 60, description: "Titulo com *accent*" },
    { key: "subtitle", type: "string", maxLength: 30, description: "Tag (ex: 'Por que nos escolher')" },
    { key: "items", type: "array", count: { min: 3, max: 5 }, children: [
      { key: "name", type: "string", maxLength: 40, description: "Nome do diferencial" },
      { key: "description", type: "string", maxLength: 100, description: "Descricao" },
    ], description: "Features/diferenciais com check icons" },
  ], contentGuidance: "Split: imagem left + features right com check accent.",
    imageSpec: { aspectRatio: "4:3", style: "professional cleaning team", subject: "Equipe profissional de limpeza", avoid: ["texto"] },
  },

  { blockType: "services", variant: 2, fields: [
    { key: "title", type: "string", maxLength: 60, description: "Titulo com *accent*" },
    { key: "subtitle", type: "string", maxLength: 30, description: "Tag (ex: 'Como funciona')" },
    { key: "items", type: "array", count: { min: 3, max: 3 }, children: [
      { key: "name", type: "string", maxLength: 40, description: "Titulo da etapa" },
      { key: "description", type: "string", maxLength: 120, description: "Descricao" },
    ], description: "3 steps numerados" },
  ], contentGuidance: "3 steps numerados horizontais com linhas conectoras." },

  { blockType: "stats", variant: 2, fields: [
    { key: "title", type: "string", maxLength: 60, description: "Titulo" },
    { key: "items", type: "array", count: { min: 3, max: 4 }, children: [
      { key: "value", type: "string", maxLength: 10, description: "Numero grande" },
      { key: "label", type: "string", maxLength: 30, description: "Descricao" },
    ], description: "Stats com numeros grandes" },
  ], contentGuidance: "Grid de stats com numeros grandes e labels." },

  { blockType: "services", variant: 3, fields: [
    { key: "title", type: "string", maxLength: 60, description: "Titulo com *accent*" },
    { key: "subtitle", type: "string", maxLength: 30, description: "Tag" },
    { key: "items", type: "array", count: { min: 3, max: 5 }, children: [
      { key: "name", type: "string", maxLength: 40, description: "Titulo do beneficio" },
      { key: "description", type: "string", maxLength: 150, description: "Descricao do beneficio" },
    ], description: "Accordion de beneficios" },
  ], contentGuidance: "Accordion de beneficios com icones e expand/collapse." },

  { blockType: "testimonials", variant: 1, fields: [
    { key: "title", type: "string", maxLength: 60, description: "Titulo com *accent*" },
    { key: "subtitle", type: "string", maxLength: 30, description: "Tag" },
    { key: "items", type: "array", count: { min: 3, max: 5 }, children: [
      { key: "text", type: "string", maxLength: 200, description: "Depoimento" },
      { key: "author", type: "string", maxLength: 40, description: "Nome" },
      { key: "role", type: "string", maxLength: 40, description: "Cargo" },
      { key: "rating", type: "string", maxLength: 3, description: "Nota 1-5" },
    ], description: "Carousel de depoimentos com stars" },
  ], contentGuidance: "Carousel horizontal de cards com stars yellow + quote + avatar + nome/cargo.",
    imageSpecs: { "items.*.image": { aspectRatio: "1:1", style: "headshot portrait", subject: "Retrato profissional", avoid: ["casual"], count: 5 } },
  },

  { blockType: "faq", variant: 1, fields: [
    { key: "title", type: "string", maxLength: 60, description: "Titulo com *accent*" },
    { key: "subtitle", type: "string", maxLength: 30, description: "Tag" },
    { key: "items", type: "array", count: { min: 4, max: 6 }, children: [
      { key: "question", type: "string", maxLength: 80, description: "Pergunta" },
      { key: "answer", type: "string", maxLength: 250, description: "Resposta" },
    ], description: "Perguntas frequentes em accordion" },
  ], contentGuidance: "Accordion simples com chevron." },

  { blockType: "cta", variant: 1, fields: [
    { key: "title", type: "string", maxLength: 70, description: "Titulo" },
    { key: "subtitle", type: "string", maxLength: 40, description: "Subtitulo" },
    { key: "ctaText", type: "string", maxLength: 25, description: "Botao" },
    { key: "ctaLink", type: "string", maxLength: 100, description: "Link" },
  ], contentGuidance: "CTA com bg escuro e botao yellow pill." },

  { blockType: "footer", variant: 1, fields: [
    { key: "storeName", type: "string", maxLength: 30, description: "Nome" },
    { key: "tagline", type: "string", maxLength: 80, description: "Descricao" },
    { key: "copyrightText", type: "string", maxLength: 60, description: "Copyright" },
  ], contentGuidance: "Footer escuro com logo + 3 link columns + copyright." },
];
