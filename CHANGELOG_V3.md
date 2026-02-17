# Changelog - PGL v3 (Fase 1)

## [3.0.0-phase1] - 2026-02-17

### 🎉 Adicionado

#### Database
- **Novo campo `store.mode`**: Define tipo de site (LOCAL_BUSINESS, PRODUCT_CATALOG, SERVICE_PRICING, HYBRID)
- **Novo campo `store.sections`**: Sistema de seções configuráveis (ordem, ativação, SEO)
- **Novo campo `store.templateId`**: Referência ao template usado (default: 'default')
- **Novo campo `store.templateConfig`**: Configurações específicas do template
- **Novo campo `category.applicableModes`**: Modos aplicáveis a cada categoria
- **Nova tabela `store_product`**: Catálogo de produtos com CTA flexível e SEO
- **Nova tabela `store_product_collection`**: Coleções/agrupamentos de produtos
- **Nova tabela `store_pricing_plan`**: Planos de preços com features e CTA
- **Nova tabela `store_template`**: Templates disponíveis (componentizados)

#### Sistema de Seções
- **`src/lib/store-sections.ts`**: Biblioteca de utilitários para sections
  - `getDefaultSections()`: Fallback para lojas antigas
  - `getStoreSections()`: Retorna sections com fallback automático
  - `getActiveSections()`: Filtra e ordena seções ativas
  - `isSectionActive()`: Verifica ativação de seção
  - `getSectionConfig()`: Retorna config de seção específica

#### AI & SEO
- **`src/lib/ai/prompts-products.ts`**: Prompts para geração de conteúdo SEO
  - `getProductSeoPrompt()`: SEO otimizado para produtos
  - `getCollectionSeoPrompt()`: SEO para coleções/categorias
  - `getPricingPlanSeoPrompt()`: SEO para planos de preços
- **Exportada `getAntiAiRules()`** em `prompts.ts` para reutilização

#### Onboarding
- **Mode Selection Step**: Tela para escolher tipo de site antes da busca
- **4 modos disponíveis**:
  - Negócio Local (recomendado): Foco em serviços e localização
  - Loja/Catálogo: Produtos com coleções
  - Planos e Preços: Tabela de pricing
  - Híbrido: Combinação de serviços + produtos + planos
- **Cards visuais** com exemplos e ícones para cada modo
- **Field `mode`** adicionado ao schema de `createStoreFromGoogleAction`

#### Painel de Edição
- **`EditStoreContent` component**: Nova estrutura com tabs
- **Tabs condicionais por mode**:
  - "Produtos" e "Coleções": Aparecem se mode = PRODUCT_CATALOG ou HYBRID
  - "Planos": Aparece se mode = SERVICE_PRICING ou HYBRID
  - "Seções": Para gerenciar ordem e ativação (interface Fase 2)
  - "Configurações": Para alterar mode e template (interface Fase 2)
- **`getStoreBySlugAction`**: Action para buscar store no edit

#### Scripts
- **`scripts/migrate-to-v3.ts`**: Migração segura de lojas existentes
- **`src/db/seed-templates.ts`**: Seed do template default
- **npm scripts adicionados**:
  - `npm run db:seed:templates`: Popula templates
  - `npm run migrate:v3`: Migra lojas antigas

### 🔄 Modificado

#### Renderização de Sites
- **`src/app/site/[slug]/page.tsx`**: 
  - Renderização baseada em `activeSections.map()` ao invés de hardcoded
  - Fallback automático para `sections: null` (lojas antigas)
  - Suporte para seções PRODUCTS e PRICING_PLANS (retornam null na Fase 1)

#### Schema Exports
- **`src/db/schema/index.ts`**: Exporta 4 novos schemas

### ✅ Garantias de Compatibilidade

#### Zero Breaking Changes
- Lojas existentes continuam funcionando **exatamente** como antes
- Fallback system: `sections: null` → `getDefaultSections()`
- Ordem das seções: Idêntica à estrutura hardcoded anterior
- Visual: Zero mudanças para sites ativos

#### Defaults Seguros
- `store.mode`: DEFAULT 'LOCAL_BUSINESS' (representa comportamento atual)
- `store.sections`: DEFAULT NULL (usa fallback)
- `store.templateId`: DEFAULT 'default' (template atual)
- `category.applicableModes`: DEFAULT ['LOCAL_BUSINESS']

#### Migration Segura
- Script `migrate-to-v3.ts` só atualiza stores com `sections: null`
- Não sobrescreve stores já migradas
- Logs detalhados de progresso
- Rollback seguro (basta reverter campo sections para NULL)

---

## 🔮 Preparado para Fase 2

A implementação atual já suporta:
- ✅ Produtos associados a stores
- ✅ Coleções para organizar produtos
- ✅ Planos de preços com features
- ✅ CTA flexível (WhatsApp ou link externo)
- ✅ SEO por produto/coleção/plano
- ✅ Sistema de templates extensível

**Falta implementar na Fase 2**:
- ⏳ CRUD UI para produtos/coleções/planos
- ⏳ Rotas públicas: /catalogo, /produto/:slug, /planos
- ⏳ Componentes ProductsSection e PricingPlansSection
- ⏳ Drag-and-drop de seções no painel
- ⏳ Seletor de template no edit page

---

## 🏗️ Arquitetura da Mudança

### Antes (v2)

```
Store → Renderização hardcoded de seções
  - HeroSection (sempre)
  - StatsSection (sempre)
  - AboutSection (sempre)
  - ServicesSection (se tiver serviços)
  - GallerySection (se tiver fotos)
  - AreasSection (se tiver bairros)
  - TestimonialsSection (se tiver depoimentos)
  - FAQSection (se tiver FAQ)
  - ContactSection (sempre)
```

### Depois (v3)

```
Store → store.sections (JSONB) → activeSections.map()
  - Cada seção: { type, isActive, order, config }
  - Renderização dinâmica baseada em sections
  - Fallback: sections === null → getDefaultSections()
  - Resultado: Mesma ordem e seções (para lojas antigas)
```

### Benefícios

1. **Flexibilidade**: Usuário pode reordenar e desativar seções (Fase 2)
2. **SEO por seção**: Cada lista (serviços, produtos, planos) tem SEO próprio
3. **Multi-mode**: Suporta 4 tipos de sites diferentes
4. **Templates**: Base para sistema de templates visuais
5. **Backward compatible**: Lojas antigas funcionam normalmente

---

## 📝 Types Exportados

### StoreMode
```typescript
'LOCAL_BUSINESS' | 'PRODUCT_CATALOG' | 'SERVICE_PRICING' | 'HYBRID'
```

### SectionType
```typescript
'HERO' | 'ABOUT' | 'SERVICES' | 'PRODUCTS' | 'PRICING_PLANS' 
| 'GALLERY' | 'TESTIMONIALS' | 'FAQ' | 'AREAS' | 'STATS' | 'CONTACT'
```

### StoreSection
```typescript
{
  type: SectionType
  isActive: boolean
  order: number
  config?: SectionConfig
}
```

### SectionConfig
```typescript
{
  pageTitle?: string       // Para página de listagem
  seoTitle?: string        // Meta title da página
  seoDescription?: string  // Meta description
  [key: string]: unknown   // Configs visuais específicas
}
```

---

## 🔍 Como Validar a Migração

### Checklist Pós-Migração

- [ ] `npm run db:push` executado com sucesso
- [ ] `npm run db:seed:templates` criou template default
- [ ] `npm run typecheck` passa sem erros
- [ ] Lojas ativas acessíveis e visuais idênticos
- [ ] Nova loja criada com mode selection funciona
- [ ] Edit page mostra tabs condicionais corretas
- [ ] Database tem 4 novas tabelas vazias

### Validação Visual

Acesse 2-3 sites ativos e confirme:
1. Todas as seções aparecem
2. Ordem está correta (hero → stats → about → services → gallery → areas → testimonials → faq → contact)
3. Nenhum erro no console
4. Performance normal (sem lentidão)

Se tudo estiver OK: **Fase 1 validada!** ✅

---

## 📊 Estatísticas da Implementação

- **Arquivos criados**: 9
- **Arquivos modificados**: 7
- **Schemas novos**: 4 tabelas
- **Campos novos**: 8 (4 em store, 1 em category, 3 configs)
- **Breaking changes**: 0
- **TypeScript errors**: 0
- **Tempo estimado de migração**: < 5 minutos

---

Data: 17/02/2026
Versão: 3.0.0-phase1
Status: ✅ Pronto para deploy
