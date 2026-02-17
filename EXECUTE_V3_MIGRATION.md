# ⚡ Execução da Migração V3 - Passo a Passo

## 🎯 Ordem de Execução (OBRIGATÓRIA)

Execute os comandos nesta ordem exata:

### 1️⃣ Aplicar schemas ao banco de dados

```bash
npm run db:push
```

**O que faz**:
- Cria 4 novas tabelas: store_product, store_product_collection, store_pricing_plan, store_template
- Adiciona 4 campos à tabela store: mode, sections, template_id, template_config
- Adiciona 1 campo à tabela category: applicable_modes
- Cria indexes de performance

**Resultado esperado**:
```
✓ Pushing schema changes to database...
✓ Done!
```

**Se der erro**:
- Verifique DATABASE_URL no .env
- Confirme que Neon DB está acessível
- Rode novamente (comando é idempotente)

---

### 2️⃣ Popular template default

```bash
npm run db:seed:templates
```

**O que faz**:
- Insere template "default" na tabela store_template
- Template suporta todos os 4 modos
- Define 11 seções disponíveis (HERO, STATS, ABOUT, SERVICES, etc)

**Resultado esperado**:
```
🌱 Seeding templates...
✅ Template "default" criado com sucesso!
🎉 Seed de templates concluído!
```

**Se rodar duas vezes**: Pula template existente (safe)

---

### 3️⃣ (OPCIONAL) Migrar lojas existentes

```bash
npm run migrate:v3
```

**O que faz**:
- Busca todas as stores com sections: null
- Atualiza com:
  - mode: 'LOCAL_BUSINESS'
  - sections: array com estrutura default
  - templateId: 'default'
  - templateConfig: null

**Resultado esperado**:
```
🚀 Iniciando migração para PGL v3...
📊 Encontradas 5 lojas no banco

   Migrando: Borracharia do João (borracharia-joao)
   Migrando: Salão Beleza Pura (salao-beleza-pura)
   ...

✅ 5 lojas migradas com sucesso
⏭️  0 lojas já estavam atualizadas
🎉 Migração concluída!
```

**IMPORTANTE**: 
- Este passo é OPCIONAL
- Lojas antigas funcionam normalmente sem migração (via fallback)
- Rode quando estiver pronto para dar controle de seções ao usuário

---

### 4️⃣ Verificar TypeScript

```bash
npm run typecheck
```

**Resultado esperado**:
```
(nenhuma saída = sucesso)
```

**Se der erro**: Avise imediatamente (não deveria acontecer)

---

## ✅ Validação Pós-Migração

### Teste 1: Site Ativo Continua Igual

1. Acesse uma loja ativa: `http://{slug}.paginalocal.com.br`
2. Navegue por todas as seções
3. Confirme que ordem e visual estão idênticos
4. Abra DevTools → Console → confirme que não há erros

**Status**: ✅ CRÍTICO - Se algo mudar, PARE e avise

### Teste 2: Criar Nova Loja

1. Acesse: `http://localhost:3000/onboarding`
2. Clique "Importar do Google"
3. **NOVO**: Veja tela de seleção de modo
4. Selecione "Negócio Local"
5. Busque uma empresa (ex: "Barbearia do João em São Paulo")
6. Complete o fluxo normalmente

**Status**: ✅ Deve funcionar sem erros

### Teste 3: Edit Page

1. Acesse: `http://localhost:3000/painel/{storeSlug}/editar`
2. Verifique que tabs aparecem (Geral, Galeria, Depoimentos, etc)
3. Se store.mode = LOCAL_BUSINESS: tabs Produtos/Coleções/Planos NÃO aparecem
4. Tabs mostram placeholder "Em desenvolvimento"

**Status**: ✅ Estrutura criada, conteúdo vem na Fase 2

---

## 🐛 Rollback (se necessário)

Se algo der errado, você pode reverter:

### Opção 1: Reverter campos store/category (mantém tabelas novas)

```sql
ALTER TABLE store 
  DROP COLUMN IF EXISTS mode,
  DROP COLUMN IF EXISTS sections,
  DROP COLUMN IF EXISTS template_id,
  DROP COLUMN IF EXISTS template_config;

ALTER TABLE category 
  DROP COLUMN IF EXISTS applicable_modes;
```

### Opção 2: Reverter tudo (remove tabelas)

```sql
DROP TABLE IF EXISTS store_product CASCADE;
DROP TABLE IF EXISTS store_product_collection CASCADE;
DROP TABLE IF EXISTS store_pricing_plan CASCADE;
DROP TABLE IF EXISTS store_template CASCADE;

ALTER TABLE store 
  DROP COLUMN IF EXISTS mode,
  DROP COLUMN IF EXISTS sections,
  DROP COLUMN IF EXISTS template_id,
  DROP COLUMN IF EXISTS template_config;

ALTER TABLE category 
  DROP COLUMN IF EXISTS applicable_modes;
```

**ATENÇÃO**: Só faça rollback se realmente necessário. A implementação é safe.

---

## 📞 Status Check

Após executar os 4 passos, responda:

- [ ] `npm run db:push` executou sem erros?
- [ ] `npm run db:seed:templates` criou template?
- [ ] `npm run typecheck` passou sem erros?
- [ ] Sites ativos estão idênticos ao antes?
- [ ] Nova loja criada com mode selection funcionou?

**Se todos = SIM**: 🎉 **Fase 1 completada com sucesso!**

**Se algum = NÃO**: 🚨 Descreva qual passo falhou e o erro exato.

---

## 🚀 Próximos Comandos (Fase 2)

Quando estiver pronto para Fase 2:

```bash
# 1. Criar actions de produtos
# (arquivos a serem criados na Fase 2)

# 2. Criar rotas públicas
# /catalogo, /produto/:slug, /planos

# 3. Implementar UI de gestão
# products-manager, collections-manager, pricing-plans-manager

# 4. Habilitar edição de seções
# Drag-and-drop, ativação, SEO config
```

---

**Data**: 17/02/2026  
**Versão**: 3.0.0-phase1  
**Breaking Changes**: 0  
**Lojas Afetadas**: 0  
**Ready**: ✅
