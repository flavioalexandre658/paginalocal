-- Migration: Add PGL v3 fields and tables
-- Date: 2026-02-17
-- Description: Adiciona campos mode, sections, templateId aos schemas existentes e cria novas tabelas

-- ====================================
-- 1. Atualizar tabela store
-- ====================================
ALTER TABLE store 
  ADD COLUMN IF NOT EXISTS mode VARCHAR(20) NOT NULL DEFAULT 'LOCAL_BUSINESS',
  ADD COLUMN IF NOT EXISTS sections JSONB,
  ADD COLUMN IF NOT EXISTS template_id VARCHAR(50) NOT NULL DEFAULT 'default',
  ADD COLUMN IF NOT EXISTS template_config JSONB;

-- Indexes para performance
CREATE INDEX IF NOT EXISTS idx_store_mode ON store(mode);
CREATE INDEX IF NOT EXISTS idx_store_template ON store(template_id);

-- ====================================
-- 2. Atualizar tabela category
-- ====================================
ALTER TABLE category 
  ADD COLUMN IF NOT EXISTS applicable_modes JSONB NOT NULL DEFAULT '["LOCAL_BUSINESS"]';

-- ====================================
-- 3. Criar tabela store_template
-- ====================================
CREATE TABLE IF NOT EXISTS store_template (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  supported_modes JSONB NOT NULL,
  available_sections JSONB NOT NULL,
  thumbnail_url TEXT,
  preview_url TEXT,
  is_public BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ====================================
-- 4. Criar tabela store_product_collection
-- ====================================
CREATE TABLE IF NOT EXISTS store_product_collection (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES store(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  description TEXT,
  image_url TEXT,
  seo_title TEXT,
  seo_description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_store_product_collection_store_id ON store_product_collection(store_id);
CREATE INDEX IF NOT EXISTS idx_store_product_collection_slug ON store_product_collection(slug);
CREATE INDEX IF NOT EXISTS idx_store_product_collection_is_active ON store_product_collection(is_active);

-- ====================================
-- 5. Criar tabela store_product
-- ====================================
CREATE TABLE IF NOT EXISTS store_product (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES store(id) ON DELETE CASCADE,
  collection_id UUID REFERENCES store_product_collection(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,
  long_description TEXT,
  price_in_cents INTEGER NOT NULL,
  original_price_in_cents INTEGER,
  images JSONB,
  cta_mode VARCHAR(20) NOT NULL DEFAULT 'WHATSAPP',
  cta_label VARCHAR(80) DEFAULT 'Comprar',
  cta_external_url TEXT,
  cta_whatsapp_message TEXT,
  seo_title TEXT,
  seo_description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_store_product_store_id ON store_product(store_id);
CREATE INDEX IF NOT EXISTS idx_store_product_collection_id ON store_product(collection_id);
CREATE INDEX IF NOT EXISTS idx_store_product_slug ON store_product(slug);
CREATE INDEX IF NOT EXISTS idx_store_product_status ON store_product(status);
CREATE INDEX IF NOT EXISTS idx_store_product_is_featured ON store_product(is_featured);

-- ====================================
-- 6. Criar tabela store_pricing_plan
-- ====================================
CREATE TABLE IF NOT EXISTS store_pricing_plan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES store(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price_in_cents INTEGER NOT NULL,
  interval VARCHAR(20) NOT NULL DEFAULT 'MONTHLY',
  features JSONB,
  is_highlighted BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  cta_mode VARCHAR(20) NOT NULL DEFAULT 'WHATSAPP',
  cta_label VARCHAR(80) DEFAULT 'Assinar',
  cta_external_url TEXT,
  cta_whatsapp_message TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_store_pricing_plan_store_id ON store_pricing_plan(store_id);
CREATE INDEX IF NOT EXISTS idx_store_pricing_plan_is_active ON store_pricing_plan(is_active);
CREATE INDEX IF NOT EXISTS idx_store_pricing_plan_is_highlighted ON store_pricing_plan(is_highlighted);

-- ====================================
-- Comentário final
-- ====================================
COMMENT ON TABLE store_template IS 'Templates disponíveis para os sites';
COMMENT ON TABLE store_product_collection IS 'Coleções/categorias de produtos';
COMMENT ON TABLE store_product IS 'Catálogo de produtos das lojas';
COMMENT ON TABLE store_pricing_plan IS 'Planos de preços/assinaturas das lojas';
COMMENT ON COLUMN store.mode IS 'Modo do site: LOCAL_BUSINESS, PRODUCT_CATALOG, SERVICE_PRICING ou HYBRID';
COMMENT ON COLUMN store.sections IS 'Configuração de seções ativas e ordem de exibição';
COMMENT ON COLUMN store.template_id IS 'ID do template utilizado';
COMMENT ON COLUMN category.applicable_modes IS 'Modos de site aplicáveis a esta categoria';
