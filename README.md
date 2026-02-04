# Página Local (PGL)

SaaS Multi-tenant de Presença Digital Instantânea para Negócios Locais.

## Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: React 19, Tailwind CSS, shadcn/ui
- **Linguagem**: TypeScript
- **Banco de Dados**: PostgreSQL (Neon DB)
- **ORM**: Drizzle
- **Autenticação**: BetterAuth
- **Server Actions**: Next Safe Action
- **Formulários**: React Hook Form + Zod
- **Uploads**: Uploadthing
- **Ícones**: @tabler/icons-react

## Começando

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais:

- `DATABASE_URL`: Connection string do NeonDB
- `GOOGLE_PLACES_API_KEY`: Chave da API do Google Places
- `UPLOADTHING_TOKEN`: Token do Uploadthing
- `BETTER_AUTH_SECRET`: Secret para BetterAuth

### 3. Criar tabelas no banco

```bash
npm run db:push
```

### 4. Rodar o projeto

```bash
npm run dev
```

## Estrutura de Pastas

```
src/
├── actions/           # Server Actions por entidade
│   ├── analytics/     # Métricas e analytics
│   ├── google/        # Integração Google Places
│   ├── leads/         # Rastreamento de leads
│   ├── services/      # CRUD de serviços
│   ├── stores/        # CRUD de lojas
│   └── testimonials/  # CRUD de depoimentos
├── app/
│   ├── (auth)/        # Fluxos de autenticação
│   ├── (institutional)/ # Páginas institucionais
│   ├── (marketing)/   # Landing page do SaaS
│   ├── api/           # API Routes
│   ├── dashboard/     # Painel do tenant
│   └── site/[slug]/   # Landing pages dos clientes
├── components/
│   ├── site/          # Componentes das LPs
│   └── ui/            # Componentes shadcn/ui
├── db/
│   └── schema/        # Schemas Drizzle
├── lib/               # Utilitários e configs
└── middleware.ts      # Multi-tenancy routing
```

## Multi-tenancy

O sistema suporta:

- **Subdomínios**: `borracharia.paginalocal.com.br`
- **Domínios customizados**: `www.borrachariasalmo23.com.br`

O middleware detecta automaticamente o tenant e faz rewrite para `/site/[slug]`.

## Scripts

```bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run typecheck    # Verificar tipos
npm run db:generate  # Gerar migrations
npm run db:push      # Aplicar schema no banco
npm run db:studio    # Abrir Drizzle Studio
```

## Licença

Proprietary - Todos os direitos reservados.
