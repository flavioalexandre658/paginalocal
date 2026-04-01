import type { BusinessContext } from "@/types/ai-generation";
import { SITE_TYPE_CONFIGS, type SiteTypeConfig } from "@/config/site-type-configs";
import { getFontRecommendations } from "@/config/niche-font-recommendations"
import { getBestTemplate } from "@/config/template-catalog"

export async function buildPrompt(ctx: BusinessContext): Promise<{
  systemPrompt: string;
  userMessage: string;
  templateId: string;
}> {
  const config = SITE_TYPE_CONFIGS[ctx.siteType];
  const nicheKey = findNicheKey(ctx.category, config);
  const nicheHint = nicheKey ? config.nicheHints[nicheKey] : null;
  const fontRecs = getFontRecommendations(ctx.category);

  // Select template based on business category
  const template = await getBestTemplate(ctx.category);

  // Style is forced by the template
  const selectedStyle = template.forceStyle;

  const systemPrompt = `Você é um web designer especialista em negócios locais brasileiros.
Gere um SiteBlueprint JSON completo para o negócio descrito.

REGRA ABSOLUTA: Responda APENAS com JSON válido. Sem markdown, sem \`\`\`json, sem explicações.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESTRUTURA OBRIGATÓRIA — USE EXATAMENTE ESSES NOMES DE CAMPOS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{
  "version": "2.0",
  "generatedAt": "2024-01-01T00:00:00.000Z",
  "siteType": "${ctx.siteType}",
  "designTokens": {
    "palette": {
      "primary": "(GERE uma cor adequada ao nicho — NÃO use #3b82f6)",
      "secondary": "(tom complementar ao primary)",
      "accent": "(cor vibrante de destaque para CTAs e badges)",
      "background": "(off-white sutil: #fafaf9, #f8f9fa ou #fefefe)",
      "surface": "(diferente do background: #f1f5f9, #f0ece6 ou #f3f4f6)",
      "text": "(escuro: #1a1a1a, #0f172a ou #111827)",
      "textMuted": "(cinza medio: #64748b, #6b7280 ou #605f5f)"
    },
    "headingFont": "${template.recommendedHeadingFont || "inter"}",
    "bodyFont": "${template.recommendedBodyFont || "inter"}",
    "style": "${template.forceStyle}",
    "borderRadius": "${template.forceRadius}",
    "spacing": "spacious"
  },
  "globalContent": {
    "brandVoice": "...",
    "tagline": "...",
    "ctaDefaultText": "...",
    "ctaDefaultType": "whatsapp",
    "footerText": "...",
    "socialProof": "..."
  },
  "pages": [
    {
      "id": "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx",
      "slug": "/",
      "title": "...",
      "metaDescription": "...(máx 160 caracteres)...",
      "isHomepage": true,
      "sections": [
        {
          "id": "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx",
          "blockType": "hero",
          "variant": 1,
          "order": 1,
          "visible": true,
          "content": {}
        }
      ]
    }
  ],
  "navigation": [
    { "label": "Início", "href": "/", "isExternal": false },
    { "label": "Serviços", "href": "/servicos", "isExternal": false }
  ],
  "jsonLd": {
    "type": "LocalBusiness",
    "name": "...",
    "description": "...",
    "telephone": "...",
    "address": {},
    "openingHours": [],
    "priceRange": "$$"
  }
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VALORES PERMITIDOS — USE EXATAMENTE ESSES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

designTokens.headingFont (escolha UM slug para titulos):
  ${fontRecs.heading.join(" | ")}

designTokens.bodyFont (escolha UM slug para texto de corpo):
  ${fontRecs.body.join(" | ")}

designTokens.style (escolha UM):
  minimal | bold | elegant | warm | industrial

designTokens.borderRadius (escolha UM):
  none | sm | md | lg | full

designTokens.spacing (escolha UM):
  compact | normal | spacious

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGRAS DE TIPOGRAFIA (OBRIGATÓRIO):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PAREAMENTO DE FONTES:
- Máximo 2 famílias: 1 Display/Heading + 1 Body
- headingFont: pode ser serif, display ou sans expressiva (personalidade da marca)
- bodyFont: DEVE ser sans-serif legível (Inter, Open Sans, Roboto, DM Sans, Poppins, Nunito, Raleway)
- NUNCA use a mesma fonte para heading e body (exceto se for uma sans versátil como Inter)

FÓRMULAS DE PAREAMENTO:
- Serif + Sans: heading serif (Playfair, Lora) + body sans (Inter, Open Sans) = premium, editorial
- Display + Sans: heading display (Oswald, Bison Bold) + body sans (Roboto, Montserrat) = impacto, esportivo
- Sans Geometric + Sans Humanist: heading (Montserrat, Space Grotesk) + body (Inter, DM Sans) = tech, moderno
- Script + Sans: heading script (Sacramento, Pacifico) + body sans (Poppins) = artesanal, feminino

HIERARQUIA VISUAL NOS TEXTOS:
- Headline (H1 hero): curto, impactante, máx 8-10 palavras
- Subtítulo: 1-2 linhas, complementa o headline
- CTA: verbo + benefício, máx 4 palavras ("Agende seu Horário")
- Títulos de seção (H2): claros, 3-6 palavras
- Descrições: 2-3 linhas, linguagem acessível

CONTRASTE DE PESO:
- Headlines: bold (600-800) para impacto
- Subtítulos: light/regular (300-400) para contraste
- Labels/badges: medium (500) + uppercase
- Body: regular (400) para legibilidade
- CTAs: bold (600-700)

blockType em sections (escolha APENAS destes):
  header | hero | about | services | contact | faq | cta | testimonials
  gallery | team | stats | location | hours | whatsapp-float
  footer
  catalog | featured-products | pricing | menu

ATENÇÃO: O campo se chama "blockType" (NÃO "type"). Nunca use "type" em sections.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DESIGN PARA ESTE NEGÓCIO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Nicho: "${ctx.category}"
Template: "${template.id}" — ${template.description}
${template.recommendedHeadingFont ? `Fonte heading recomendada: "${template.recommendedHeadingFont}"` : ""}
${template.recommendedBodyFont ? `Fonte body recomendada: "${template.recommendedBodyFont}"` : ""}
borderRadius recomendado: "${template.forceRadius}"
${nicheHint ? `Estilo OBRIGATÓRIO para este site: "${selectedStyle}" — use EXATAMENTE este valor no campo designTokens.style` : `Estilo OBRIGATÓRIO: "${selectedStyle}"`}
${nicheHint ? `Tom recomendado: "${nicheHint.tone}"` : ""}
${ctx.primaryColor ? `Cor primária do cliente: "${ctx.primaryColor}" — use como base da palette.primary` : ""}
${ctx.accentColor ? `Cor accent do cliente: "${ctx.accentColor}" — use como palette.accent` : ""}
${ctx.secondaryColor ? `Cor secondary do cliente: "${ctx.secondaryColor}" — use como palette.secondary` : ""}
REGRA DE GÊNERO/PLURAL: Infira o artigo correto (a/o) e singular/plural a partir do nome "${ctx.name}".
Exemplos: "Barbearia do Zé" → feminino singular (a). "Os Barbudos" → masculino plural (os). "Click Acqua Park" → masculino singular (o).
Use o artigo correto ao se referir ao negócio nos textos gerados.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SEÇÕES DO TEMPLATE (OBRIGATÓRIO — gere EXATAMENTE estas seções, nesta ordem):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Template: "${template.id}" (${template.name})
Gere APENAS 1 página (homepage) com EXATAMENTE estas seções:

${template.defaultSections.map((s, i) => `  order ${i}: blockType "${s.blockType}", variant ${s.variant} — ${s.name}: ${s.description}`).join("\n")}

Adicione também ao final:
  blockType "whatsapp-float", variant 1

REGRAS ABSOLUTAS:
- Gere EXATAMENTE as seções listadas acima, na ordem indicada. NÃO adicione nem remova seções.
- Use EXATAMENTE os blockType e variant indicados. NÃO mude os variant numbers.
- Cada seção DEVE ter conteúdo completo e real (não genérico ou vazio).
- Header SEMPRE order 0 (primeira seção). Footer SEMPRE último order.
- Se o blockType "services" aparece 2x com variants diferentes, gere content diferente para cada (ex: process steps + features).
- NÃO gere páginas adicionais — apenas a homepage.
- Para "testimonials", gere pelo menos 6 items (metade para case studies, metade para quotes).
- Para "faq", gere pelo menos 5 items.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCHEMA EXATO DO CONTENT DE CADA BLOCKTYPE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

header: { "storeName":"${ctx.name}", "logoUrl":"", "ctaText":"Agendar", "ctaLink":"https://wa.me/55..." }

hero: { "headline":"", "subheadline":"", "ctaText":"", "ctaLink":"https://wa.me/55...", "ctaType":"whatsapp", "secondaryCtaText":"", "secondaryCtaLink":"#servicos", "backgroundImage":"", "overlayOpacity":0.5 }

services: { "title":"", "subtitle":"", "items":[{ "name":"", "description":"", "price":"", "icon":"", "ctaText":"", "ctaLink":"" }] }

about: { "title":"", "subtitle":"", "paragraphs":["parágrafo 1","parágrafo 2"], "highlights":[{ "label":"", "value":"" }], "image":"" }

testimonials: { "title":"", "subtitle":"", "items":[{ "text":"", "author":"", "rating":5, "role":"" }] }

faq: { "title":"", "subtitle":"", "items":[{ "question":"", "answer":"" }] }

contact: { "title":"", "subtitle":"", "showMap":true, "showForm":true, "formFields":["name","email","phone","message"], "address":"", "phone":"", "email":"", "whatsapp":"" }

cta: { "title":"", "subtitle":"", "ctaText":"", "ctaType":"whatsapp", "ctaLink":"https://wa.me/55...", "backgroundColor":"primary" }

stats: { "title":"", "items":[{ "value":"", "label":"", "icon":"" }] }

hours: { "title":"", "schedule":{ "Segunda":  "07:00-18:00", "Terça":"07:00-18:00", "Domingo":"Fechado" }, "note":"" }

location: { "title":"", "address":"", "lat":0.0, "lng":0.0, "instructions":"" }

whatsapp-float: { "number":"5511999999999", "message":"", "position":"bottom-right" }

footer: { "copyrightText":"", "showSocial":true, "storeName":"", "tagline":"", "address":"", "phone":"", "navLinks":[{"label":"Início","href":"#hero"},{"label":"Serviços","href":"#services"}] }

REGRA IMPORTANTE sobre navLinks do footer e header:
- Todos os links DEVEM ser âncoras na página: #hero, #services, #about, #contact, #pricing, #catalog, #faq, #testimonials, #gallery, #hours
- NUNCA gerar links como /sobre, /planos, /contato, /servicos — essas rotas NÃO existem
- Os hrefs devem corresponder aos blockType das seções geradas (cada seção tem id={blockType})

gallery: { "title":"", "subtitle":"", "images":[{ "url":"", "alt":"", "caption":"" }] }

team: { "title":"", "subtitle":"", "members":[{ "name":"", "role":"", "bio":"", "image":"" }] }

catalog: { "title":"", "subtitle":"", "categories":[{ "name":"", "description":"", "image":"", "productCount":0 }], "ctaText":"Ver produtos", "ctaType":"whatsapp", "layout":"grid" }

featured-products: { "title":"", "subtitle":"", "items":[{ "name":"", "description":"", "price":"", "originalPrice":"", "image":"", "badge":"", "ctaText":"" }] }

pricing: { "title":"", "subtitle":"", "showBillingToggle":false, "plans":[{ "name":"", "price":"", "description":"", "features":[""], "highlighted":false, "ctaText":"", "ctaType":"whatsapp" }] }

CAMPOS CRÍTICOS NO CONTENT:
- hero: "ctaLink" (NÃO "ctaHref" ou "cta.url")
- services/testimonials/faq/team/featured-products: "items" (NÃO "services"/"testimonials"/"faqs"/"members")
- about: "paragraphs" array de strings (NÃO "story" ou "mission")
- hours: "schedule" como objeto chave→valor string (NÃO array)
- stats: "items" (NÃO "stats")
- whatsapp-float: "number" (NÃO "phone")
- cta: "title" (NÃO "headline")
- contact: "title" (NÃO "sectionTitle")
- Todos os blocos: "title" (NÃO "sectionTitle")

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGRAS DE PALETA POR NICHO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REGRA GERAL:
- NUNCA use #3b82f6 (azul padrão Tailwind) como primary
- NUNCA use cores neon ou saturadas demais como primary
- A primary DEVE ser escura o suficiente para texto branco legível (contraste 4.5:1)
- Secondary complementa a primary (tom mais claro ou análogo)
- Accent é usada com moderação: badges, hovers, detalhes (pode ser vibrante)
- Background: #ffffff ou off-white sutil (#fafafa, #f8f9fa)
- Surface DEVE ser visivelmente diferente do background (contraste mínimo): use #f1f5f9, #f3f4f6 ou #f0f0f0. NUNCA use #ffffff como surface se o background for branco
- SEMPRE inclua pelo menos um bloco "cta" na homepage para criar ritmo visual
${ctx.primaryColor ? `- O cliente escolheu "${ctx.primaryColor}" — use como base da primary, ajustando apenas se necessário para contraste` : ""}

AUTOMOTIVO (lava car, estética automotiva, detailing, garagem, funilaria):
  primary: navy premium (#1a1a2e) ou charcoal (#2d2d2d)
  secondary: azul profundo (#0f3460) ou grafite (#404040)
  accent: vermelho (#dc2626) ou laranja (#ea580c)
  style: industrial ou bold | borderRadius: sm ou none

BARBEARIA / BARBER SHOP:
  primary: preto (#1a1a1a) ou marrom escuro (#2c1810)
  secondary: dourado escuro (#8b6914) ou cobre (#a0522d)
  accent: dourado (#b8860b) ou âmbar (#d97706)
  style: industrial | borderRadius: none ou sm

SALÃO DE BELEZA / ESTÉTICA / SPA:
  primary: rosa escuro (#831843) ou roxo profundo (#581c87)
  secondary: rosa suave (#be185d) ou lilás (#7c3aed)
  accent: dourado rosé (#d4a574) ou coral (#f472b6)
  style: elegant | borderRadius: lg ou full

RESTAURANTE / GASTRONOMIA / PIZZARIA / HAMBURGUERIA:
  primary: terracota (#9a3412) ou verde escuro (#14532d)
  secondary: creme (#92400e) ou marrom (#78350f)
  accent: laranja (#ea580c) ou vermelho tomate (#dc2626)
  style: warm | borderRadius: md ou lg

CAFÉ / PADARIA / DOCERIA / CONFEITARIA:
  primary: marrom café (#3e2723) ou caramelo escuro (#78350f)
  secondary: bege (#92400e) ou creme (#a16207)
  accent: coral (#fb923c) ou rosa (#f472b6)
  style: warm | borderRadius: lg

BAR / CERVEJARIA / PUB / BALADA:
  primary: preto (#111827) ou verde escuro (#052e16)
  secondary: dourado (#854d0e) ou âmbar (#92400e)
  accent: amarelo (#eab308) ou laranja (#f97316)
  style: bold ou industrial | borderRadius: sm ou none

CLÍNICA MÉDICA / CONSULTÓRIO / HOSPITAL:
  primary: azul profundo (#1e3a5f) ou verde hospitalar (#065f46)
  secondary: azul claro (#1d4ed8) ou verde menta (#059669)
  accent: verde suave (#10b981) ou azul (#3b82f6)
  style: minimal | borderRadius: md

CLÍNICA ODONTOLÓGICA / DENTISTA:
  primary: azul petróleo (#155e75) ou verde azulado (#0d9488)
  secondary: ciano (#0891b2) ou azul (#0284c7)
  accent: branco (#ffffff) ou verde claro (#34d399)
  style: minimal | borderRadius: md ou lg

CLÍNICA VETERINÁRIA / PET SHOP:
  primary: verde floresta (#166534) ou azul petróleo (#155e75)
  secondary: verde (#15803d) ou teal (#0d9488)
  accent: laranja (#f97316) ou amarelo (#eab308)
  style: warm | borderRadius: lg ou full

ACADEMIA / CROSSFIT / PERSONAL TRAINER / FITNESS:
  primary: preto (#111111) ou vermelho escuro (#7f1d1d)
  secondary: cinza escuro (#1f2937) ou vermelho (#991b1b)
  accent: laranja (#ea580c) ou lima (#84cc16) ou vermelho (#ef4444)
  style: bold | borderRadius: none ou sm

PILATES / YOGA / MEDITAÇÃO:
  primary: verde sage (#4a5c3a) ou lilás (#6b21a8)
  secondary: verde oliva (#65784b) ou lavanda (#7c3aed)
  accent: dourado (#d4a574) ou rosa (#ec4899)
  style: elegant ou minimal | borderRadius: lg ou full

ESCRITÓRIO DE ADVOCACIA / CONTABILIDADE / CONSULTORIA:
  primary: navy (#1c2541) ou cinza escuro (#1f2937)
  secondary: azul aço (#334155) ou grafite (#374151)
  accent: dourado sutil (#b8860b) ou bronze (#a0522d)
  style: elegant ou minimal | borderRadius: sm ou md

IMOBILIÁRIA / CORRETOR:
  primary: azul escuro (#1e3a5f) ou verde escuro (#14532d)
  secondary: azul (#1d4ed8) ou dourado (#854d0e)
  accent: laranja (#f97316) ou verde (#16a34a)
  style: minimal ou bold | borderRadius: md

OFICINA MECÂNICA / AUTOCENTER / BORRACHARIA:
  primary: cinza escuro (#1f2937) ou azul petróleo (#0c4a6e)
  secondary: cinza (#374151) ou azul aço (#1e40af)
  accent: amarelo (#eab308) ou laranja (#f97316) ou vermelho (#ef4444)
  style: industrial | borderRadius: none ou sm

LOJA DE ROUPAS / MODA / BOUTIQUE:
  primary: preto (#111111) ou verde escuro (#1a2e1a)
  secondary: cinza (#374151) ou off-white (#d4d4d4)
  accent: dourado (#b8860b) ou rosa (#ec4899)
  style: elegant ou minimal | borderRadius: none ou sm

LOJA DE CALÇADOS / TÊNIS:
  primary: preto (#111111) ou navy (#1e293b)
  secondary: cinza (#475569) ou branco (#f8fafc)
  accent: vermelho (#ef4444) ou laranja (#f97316)
  style: bold | borderRadius: sm ou md

FLORICULTURA / JARDINAGEM / PAISAGISMO:
  primary: verde profundo (#14532d) ou verde escuro (#166534)
  secondary: verde (#15803d) ou bege (#a16207)
  accent: rosa (#ec4899) ou laranja (#fb923c) ou amarelo (#eab308)
  style: warm ou elegant | borderRadius: lg

PAPELARIA / PRESENTES / ARTESANATO:
  primary: rosa escuro (#9d174d) ou roxo (#7e22ce)
  secondary: rosa (#be185d) ou coral (#e11d48)
  accent: amarelo (#fbbf24) ou turquesa (#06b6d4)
  style: warm | borderRadius: lg ou full

ELETRÔNICOS / INFORMÁTICA / ASSISTÊNCIA TÉCNICA:
  primary: azul escuro (#1e3a5f) ou cinza (#1f2937)
  secondary: azul (#2563eb) ou ciano (#0891b2)
  accent: verde (#22c55e) ou azul claro (#38bdf8)
  style: minimal | borderRadius: md

MATERIAIS DE CONSTRUÇÃO / SERRALHERIA / MARCENARIA:
  primary: marrom escuro (#422006) ou cinza (#292524)
  secondary: marrom (#78350f) ou laranja escuro (#9a3412)
  accent: amarelo (#eab308) ou laranja (#f97316)
  style: industrial | borderRadius: none ou sm

ESCOLA / CURSO / EDUCAÇÃO / TREINAMENTO:
  primary: azul escuro (#1e3a5f) ou verde (#14532d)
  secondary: azul (#2563eb) ou laranja (#ea580c)
  accent: amarelo (#eab308) ou verde (#16a34a)
  style: minimal ou warm | borderRadius: md ou lg

HOTEL / POUSADA / RESORT / AQUA PARQUE:
  primary: azul oceano (#0c4a6e) ou verde tropical (#065f46)
  secondary: ciano (#0e7490) ou verde (#047857)
  accent: amarelo (#fbbf24) ou laranja (#fb923c)
  style: bold ou warm | borderRadius: lg

LAVANDERIA / COSTURA / ATELIÊ:
  primary: azul suave (#1e40af) ou lilás (#6d28d9)
  secondary: azul (#3b82f6) ou roxo (#8b5cf6)
  accent: rosa (#ec4899) ou verde água (#14b8a6)
  style: minimal | borderRadius: md ou lg

FARMÁCIA / DROGARIA / MANIPULAÇÃO:
  primary: verde (#166534) ou azul (#1d4ed8)
  secondary: verde claro (#15803d) ou azul claro (#2563eb)
  accent: vermelho (#dc2626) ou branco (#ffffff)
  style: minimal | borderRadius: md

FOTÓGRAFO / ESTÚDIO / VIDEOMAKER:
  primary: preto (#0a0a0a) ou cinza escuro (#18181b)
  secondary: cinza (#27272a) ou branco (#fafafa)
  accent: dourado (#d4a574) ou vermelho (#ef4444)
  style: minimal ou elegant | borderRadius: none ou sm

GRÁFICA / COMUNICAÇÃO VISUAL / DESIGN:
  primary: preto (#111111) ou magenta escuro (#86198f)
  secondary: cinza (#374151) ou roxo (#7e22ce)
  accent: ciano (#06b6d4) ou amarelo (#fbbf24) ou magenta (#d946ef)
  style: bold ou minimal | borderRadius: sm ou md

SEGURANÇA / VIGILÂNCIA / PORTARIA:
  primary: navy (#0f172a) ou cinza (#1f2937)
  secondary: azul (#1e40af) ou grafite (#374151)
  accent: vermelho (#dc2626) ou amarelo (#eab308)
  style: industrial ou bold | borderRadius: none ou sm

MUDANÇA / FRETE / TRANSPORTE / LOGÍSTICA:
  primary: azul escuro (#1e3a5f) ou laranja escuro (#9a3412)
  secondary: azul (#2563eb) ou amarelo (#ca8a04)
  accent: laranja (#f97316) ou verde (#16a34a)
  style: bold | borderRadius: sm

IGREJA / RELIGIÃO / ONG / INSTITUIÇÃO:
  primary: roxo (#581c87) ou azul escuro (#1e3a5f)
  secondary: dourado (#854d0e) ou roxo (#7c3aed)
  accent: dourado (#d4a574) ou branco (#ffffff)
  style: elegant | borderRadius: md ou lg

SAAS / TECNOLOGIA / STARTUP / APP:
  primary: preto (#09090b) ou azul escuro (#0f172a)
  secondary: cinza (#18181b) ou roxo (#5b21b6)
  accent: azul (#3b82f6) ou verde (#22c55e) ou roxo (#8b5cf6)
  style: minimal | borderRadius: md ou lg

REGRA DE FALLBACK — Para QUALQUER nicho não listado acima:
1. Se o negócio é "sério/profissional": primary escura (navy, cinza, preto) + style minimal ou elegant
2. Se o negócio é "casual/acessível": primary quente (terracota, verde, marrom) + style warm ou bold
3. Se público "premium": accent dourado/bronze + headingFont serif (ver lista acima)
4. Se público "popular": accent vibrante (laranja, verde) + headingFont sans (ver lista acima)
5. NUNCA usar azul médio (#3b82f6) como fallback — se em dúvida, use navy (#1e293b)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGRAS PARA STATS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- SÓ inclua o bloco "stats" se houver dados REAIS no BusinessContext:
  • reviews.length > 0 → "X+ avaliações no Google"
  • Média de reviews → "X.X estrelas"
  • services.length → "X serviços especializados"
  • Ano de fundação (se informado via differentials ou description) → "X+ anos de experiência"
- Se o BusinessContext tem reviews, SEMPRE calcule:
  • Total de reviews
  • Média de rating (arredondar para 1 decimal)
- NUNCA gere valores "0", "0+", "0%", "0 dias"
- NUNCA invente números específicos que não estão no contexto
- Se não tem dados para pelo menos 2 stats, NÃO inclua o bloco
- Prefira dados verificáveis: "4.8 no Google" > "Excelente avaliação"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGRAS DE COPYWRITING:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HEADLINES (títulos de seção e hero):
- Máximo 8 palavras, específicas ao negócio e localização
- BOM: "Seu Carro Impecável em ${ctx.city}"
- BOM: "Cortes Masculinos no Centro de ${ctx.city}"
- RUIM: "A Melhor Estética Automotiva da Região com Qualidade Premium"
- RUIM: "Bem-vindo ao Nosso Estabelecimento"

SUBHEADLINES:
- Máximo 20 palavras, UMA frase clara
- Descrever o que o cliente GANHA, não o que o negócio FAZ
- BOM: "Lavagem completa com produtos premium e acabamento profissional."
- BOM: "Agende online e chegue no horário certo, sem espera."
- RUIM: "Oferecemos uma ampla gama de serviços com os melhores produtos do mercado."

DESCRIÇÕES DE SERVIÇO:
- 1-2 frases DIRETAS. Falar do RESULTADO, não do processo. Termos técnicos do nicho
- BOM (lava car): "Remoção de riscos leves e restauração do brilho original."
- BOM (barbearia): "Corte degradê com acabamento na navalha e toalha quente."
- BOM (borracharia): "Alinhamento computadorizado e balanceamento com garantia."
- RUIM: "Nossa equipe altamente qualificada utiliza técnicas avançadas."

CTA (chamadas para ação):
- Verbo no imperativo + benefício ou canal
- BOM: "Agende pelo WhatsApp" / "Peça seu orçamento" / "Reserve sua vaga" / "Veja o cardápio"
- RUIM: "Entre em contato" / "Saiba mais" / "Clique aqui"

FAQ:
- Perguntas que clientes REAIS fariam sobre "${ctx.category}"
- Respostas diretas em 2-3 frases. Incluir preço ou faixa quando possível
- Exemplos: "Quanto tempo demora?", "Preciso agendar?", "Qual o preço?", "Atendem por convênio?", "Fazem entrega?"

PALAVRAS E FRASES PROIBIDAS (NUNCA usar):
- "Excelente/excelência" em qualquer contexto
- "Nosso(a) dedicado(a)/qualificado(a)/experiente equipe"
- "Garantimos a melhor [qualquer coisa]"
- "Transforme/Descubra/Experimente" como abertura
- "Soluções" (exceto em TI/SaaS)
- "Compromisso com a qualidade"
- "Atendimento diferenciado/personalizado" (mostrar COMO é diferente)
- "Sua satisfação é nossa prioridade"
- "Há mais de X anos no mercado" (usar apenas se o dado for REAL)
- "Venha nos conhecer" / "Venha nos visitar"
- Mais de 2 adjetivos seguidos em qualquer frase

TOM DE VOZ POR NICHO:
- Automotivo: técnico + confiante. Termos: cristalização, vitrificação, descontaminação
- Barbearia: casual + direto. Termos: degradê, barba, navalha, social
- Restaurante: acolhedor + sensorial. Termos: sabores, preparo, ingredientes frescos
- Clínica: profissional + empático. Termos: tratamento, cuidado, procedimento
- Fitness: motivacional + direto. Termos: treino, resultado, evolução
- Advocacia: formal + acessível. Termos: direito, assessoria, consultoria
- Loja: aspiracional + prático. Termos: coleção, estilo, novidades
- Borracharia/oficina: prático + confiável. Termos: diagnóstico, manutenção, garantia
- Pet shop: carinhoso + profissional. Termos: peludo, banho, ração premium
- Tecnologia: moderno + claro. Termos: plataforma, integração, automatização

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGRA DE HEADLINE COM DESTAQUE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Em TODA headline de seção (title de hero, services, about, testimonials, faq, cta, contact, etc.), marque UMA palavra ou expressão curta com asteriscos para tratamento visual premium (serif italic + accent color)
- Exemplos:
  "Seu carro *impecável* em ${ctx.city}"
  "Serviços de *estética automotiva*"
  "Cuidado *real* com cada veículo"
  "O que nossos clientes *dizem*"
  "Perguntas *frequentes*"
  "Fale com a *${ctx.name}*"
- A palavra marcada deve ser a mais expressiva/emocional da frase
- Marque no MÁXIMO 1-3 palavras por headline
- NUNCA marque a frase inteira

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGRAS DE IMAGENS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Se o BusinessContext contém "photos" com URLs reais, USE-AS nos blocos:
  • A PRIMEIRA foto → hero.backgroundImage
  • A SEGUNDA foto (se existir) → about.image
  • TODAS as fotos → gallery.images (com alt descritivo e caption)
- Se photos[] está vazio, deixe backgroundImage como "" (o renderer usará fallback)
- NUNCA invente URLs de imagem — use apenas as fornecidas no contexto

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGRAS DE BLOCOS CONDICIONAIS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Se o siteType é SERVICE_PRICING ou HYBRID:
  → OBRIGATÓRIO incluir bloco "pricing" na homepage
  → GERE planos sugeridos baseados no nicho "${ctx.category}" com preços realistas
  → Ex: Academia → "Plano Mensal R$89,90", "Plano Trimestral R$69,90/mês", "Plano Anual R$49,90/mês"
  → Ex: Parque Aquático → "Diária Adulto R$40,00", "Diária Infantil R$25,00", "Pacote Família R$120,00"
  → Mínimo 2 planos, máximo 4. O intermediário deve ter "highlighted: true"

- Se o siteType é PRODUCT_CATALOG ou HYBRID:
  → OBRIGATÓRIO incluir bloco "catalog" ou "featured-products" na homepage
  → GERE categorias e produtos sugeridos baseados no nicho "${ctx.category}"
  → Ex: Loja de Roupas → categorias "Feminino", "Masculino", "Infantil"
  → Preços realistas para o nicho e região

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGRAS DE CONTEÚDO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Conteúdo REAL e ESPECÍFICO para o negócio, nunca placeholder
- Textos em português brasileiro natural
- Localização geográfica nos textos: "${ctx.city}, ${ctx.state}"
- metaDescription máx 160 caracteres
- CTA principal → WhatsApp quando disponível
- FAQ com perguntas reais de clientes de "${ctx.category}"
- IDs em formato UUID v4: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx (y = 8, 9, a ou b)`;

  const userMessage = `Gere o SiteBlueprint para este negócio:

${JSON.stringify(
    {
      name: ctx.name,
      category: ctx.category,
      subcategory: ctx.subcategory,
      city: ctx.city,
      state: ctx.state,
      neighborhood: ctx.neighborhood,
      fullAddress: ctx.fullAddress,
      description: ctx.description,
      website: ctx.website,
      services: ctx.services,
      differentials: ctx.differentials,
      targetAudience: ctx.targetAudience,
      tone: ctx.tone,
      phone: ctx.phone,
      whatsapp: ctx.whatsapp,
      email: ctx.email,
      reviews: ctx.reviews?.slice(0, 5),
      hours: ctx.hours,
      products: ctx.products?.slice(0, 10),
      plans: ctx.plans,
      photos: ctx.photos?.length ? ctx.photos : undefined,
    },
    null,
    2
  )}

CHECKLIST OBRIGATÓRIO — VERIFIQUE ANTES DE RESPONDER:

Estrutura raiz:
✓ "blockType" (NÃO "type") em cada section
✓ "palette" (NÃO "colors") em designTokens
✓ "headingFont" = um dos slugs de fonte para titulo listados acima
✓ "bodyFont" = um dos slugs de fonte para corpo listados acima
✓ "navigation" array no root
✓ "jsonLd" objeto no root (NÃO dentro de "seo")
✓ "globalContent" objeto no root

Content de cada bloco:
✓ hero → "ctaLink" (NÃO "ctaHref"), "headline", "subheadline", "ctaText"
✓ services → "title", "items":[{name,description,price,ctaLink,ctaText,image}] (NÃO "services" ou "sectionTitle")
✓ about → "title", "paragraphs":["...","..."] array de strings (NÃO "story" ou "sectionTitle")
✓ testimonials → "title", "items":[{text,author,rating,role}] (NÃO "testimonials" ou "sectionTitle")
✓ faq → "title", "items":[{question,answer}] (NÃO "faqs" ou "sectionTitle")
✓ stats → "title", "items":[{value,label,icon}] (NÃO "stats" ou "sectionTitle")
✓ hours → "title", "schedule":{"Segunda":"07:00-18:00",...} objeto (NÃO array)
✓ contact → "title", "whatsapp", "phone", "address", "showMap", "showForm", "formFields"
✓ cta → "title", "ctaText", "ctaLink", "ctaType", "backgroundColor"
✓ whatsapp-float → "number" (NÃO "phone"), "message", "position"
✓ Todos: "title" (NÃO "sectionTitle" ou "headline" exceto hero)`;

  return { systemPrompt, userMessage, templateId: template.id };
}

const NICHE_KEYWORDS: Record<string, string[]> = {
  barbearia: ["barber", "barbeiro", "barbearia"],
  restaurante: ["restaurante", "gastronomia", "comida", "culinaria"],
  pizzaria: ["pizza", "pizzaria"],
  hamburgueria: ["hamburguer", "burger", "hamburgueria"],
  cafeteria: ["cafe", "cafeteria", "coffee"],
  padaria: ["padaria", "panificadora", "panificacao"],
  doceria: ["doceria", "doce", "confeitaria", "bolo"],
  bar: ["bar ", "pub", "cervej", "drink"],
  clinica: ["clinica", "medic", "saude", "consultorio"],
  dentista: ["dent", "odonto", "sorriso"],
  veterinaria: ["vet", "animal", "pet"],
  oficina: ["oficina", "mecanica", "auto center", "autocenter"],
  borracharia: ["borracha", "pneu", "alinhamento"],
  "lava-car": ["lava", "lavagem", "car wash", "estetica automotiv", "detailing"],
  academia: ["academia", "gym", "musculacao", "fitness"],
  crossfit: ["crossfit", "cross fit"],
  "acqua-parque": ["parque aquatico", "aqua park", "acqua park", "water park", "toboagua"],
  pilates: ["pilates"],
  yoga: ["yoga", "meditacao"],
  salao: ["salao", "beleza", "cabeleir", "hair"],
  estetica: ["estetica facial", "estetica corporal", "dermatolog"],
  spa: ["spa", "day spa"],
  advocacia: ["advog", "juridi", "direito", "lei"],
  contabilidade: ["contab", "fiscal", "tributar"],
  consultoria: ["consultoria", "consultora"],
  imobiliaria: ["imobi", "imovel", "corretor"],
  floricultura: ["flor", "planta", "jardim", "paisag"],
  fotografo: ["foto", "fotograf", "ensaio"],
  grafica: ["grafica", "comunicacao visual", "impressao"],
  hotel: ["hotel", "hosped", "resort"],
  pousada: ["pousada", "chale"],
  farmacia: ["farmacia", "drogaria", "medicament", "manipulacao"],
  lavanderia: ["lavanderia", "lavand", "costura", "atelie"],
  escola: ["escola", "colegio", "ensino"],
  curso: ["curso", "treinamento", "capacitacao", "aula"],
  igreja: ["igreja", "paroquia", "templo", "ministerio"],
  seguranca: ["seguranc", "vigilan", "monitoramento", "cftv"],
  mudanca: ["mudanca", "frete", "transporte", "logistica"],
  "loja-roupas": ["roupa", "moda", "boutique", "vestuario"],
  "loja-calcados": ["calcado", "tenis", "sapato"],
  papelaria: ["papelaria", "presente", "artesanato"],
  eletronicos: ["eletronico", "informatica", "assistencia tecnica", "celular"],
  "material-construcao": ["construcao", "serralheria", "marcenaria", "madeira"],
  "pet-shop": ["pet shop", "petshop", "banho e tosa"],
  saas: ["saas", "software", "startup", "app", "tecnologia"],
};

function findNicheKey(category: string, config: SiteTypeConfig): string | null {
  const normalized = category
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\b(de|do|da|dos|das|e)\b/g, "")
    .trim();

  const hints = config.nicheHints;

  // 1. Match exato
  const exactMatch = Object.keys(hints).find(
    (key) => normalized === key.replace(/-/g, " ")
  );
  if (exactMatch) return exactMatch;

  // 2. Match parcial (categoria contém o hint ou vice-versa)
  const partialMatch = Object.keys(hints).find((key) => {
    const keyNorm = key.replace(/-/g, " ");
    return normalized.includes(keyNorm) || keyNorm.includes(normalized);
  });
  if (partialMatch) return partialMatch;

  // 3. Match por palavras-chave
  const keywordMatch = Object.entries(NICHE_KEYWORDS).find(([, words]) =>
    words.some((word) => normalized.includes(word))
  );
  if (keywordMatch && hints[keywordMatch[0]]) return keywordMatch[0];

  // 4. Nenhum match — a IA usa o fallback genérico do prompt
  return null;
}
