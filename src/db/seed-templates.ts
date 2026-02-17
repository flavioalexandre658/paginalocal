import 'dotenv/config'
import { db } from '@/db'
import { storeTemplate } from '@/db/schema'

async function seedTemplates() {
  console.log('🌱 Seeding templates...')

  try {
    await db.insert(storeTemplate).values({
      id: 'default',
      name: 'Template Padrão',
      description: 'Template clássico do PGL com todas as seções disponíveis',
      supportedModes: ['LOCAL_BUSINESS', 'PRODUCT_CATALOG', 'SERVICE_PRICING', 'HYBRID'],
      availableSections: [
        {
          type: 'HERO',
          label: 'Hero',
          description: 'Seção principal com título e CTA',
          isRequired: true,
        },
        {
          type: 'STATS',
          label: 'Estatísticas',
          description: 'Números do negócio',
          isRequired: false,
        },
        {
          type: 'ABOUT',
          label: 'Sobre',
          description: 'Descrição do negócio',
          isRequired: false,
        },
        {
          type: 'SERVICES',
          label: 'Serviços',
          description: 'Lista de serviços',
          isRequired: false,
        },
        {
          type: 'PRODUCTS',
          label: 'Produtos',
          description: 'Catálogo de produtos',
          isRequired: false,
        },
        {
          type: 'PRICING_PLANS',
          label: 'Planos',
          description: 'Tabela de preços',
          isRequired: false,
        },
        {
          type: 'GALLERY',
          label: 'Galeria',
          description: 'Fotos do negócio',
          isRequired: false,
        },
        {
          type: 'AREAS',
          label: 'Áreas Atendidas',
          description: 'Bairros/regiões',
          isRequired: false,
        },
        {
          type: 'TESTIMONIALS',
          label: 'Depoimentos',
          description: 'Avaliações de clientes',
          isRequired: false,
        },
        {
          type: 'FAQ',
          label: 'FAQ',
          description: 'Perguntas frequentes',
          isRequired: false,
        },
        {
          type: 'CONTACT',
          label: 'Contato',
          description: 'Informações de contato',
          isRequired: true,
        },
      ],
      thumbnailUrl: null,
      previewUrl: null,
      isPublic: true,
    })

    console.log('✅ Template "default" criado com sucesso!')
  } catch (error) {
    if (error instanceof Error && error.message.includes('duplicate key')) {
      console.log('ℹ️  Template "default" já existe, pulando...')
    } else {
      console.error('❌ Erro ao criar template:', error)
      throw error
    }
  }
}

seedTemplates()
  .then(() => {
    console.log('🎉 Seed de templates concluído!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Erro fatal no seed:', error)
    process.exit(1)
  })
