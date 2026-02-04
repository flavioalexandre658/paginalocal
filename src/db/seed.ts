import 'dotenv/config'
import { db } from './index'
import { category } from './schema'

const CATEGORIES_SEED = [
  {
    name: 'Borracharia',
    slug: 'borracharia',
    icon: 'IconTire',
    description: 'Serviços de pneus, alinhamento e balanceamento',
    suggestedServices: ['Troca de Pneus', 'Reparo de Pneus', 'Alinhamento', 'Balanceamento', 'Calibragem', 'Socorro 24h'],
  },
  {
    name: 'Oficina Mecânica',
    slug: 'oficina-mecanica',
    icon: 'IconTool',
    description: 'Manutenção e reparo de veículos',
    suggestedServices: ['Troca de Óleo', 'Revisão Completa', 'Freios', 'Suspensão', 'Motor', 'Diagnóstico'],
  },
  {
    name: 'Auto Center',
    slug: 'auto-center',
    icon: 'IconCar',
    description: 'Centro automotivo completo',
    suggestedServices: ['Manutenção Preventiva', 'Ar Condicionado', 'Elétrica', 'Injeção Eletrônica', 'Escapamento', 'Embreagem'],
  },
  {
    name: 'Revendedora de Veículos',
    slug: 'revendedora-veiculos',
    icon: 'IconCarGarage',
    description: 'Compra e venda de veículos novos e seminovos',
    suggestedServices: ['Compra de Veículos', 'Venda de Seminovos', 'Financiamento', 'Consignação', 'Avaliação', 'Troca'],
  },
  {
    name: 'Lava Jato',
    slug: 'lava-jato',
    icon: 'IconDroplet',
    description: 'Lavagem e estética automotiva',
    suggestedServices: ['Lavagem Simples', 'Lavagem Completa', 'Polimento', 'Higienização', 'Cristalização', 'Enceramento'],
  },
  {
    name: 'Estacionamento',
    slug: 'estacionamento',
    icon: 'IconParking',
    description: 'Vagas de estacionamento',
    suggestedServices: ['Vaga Rotativa', 'Mensalista', 'Lavagem', 'Manobrista', 'Segurança 24h'],
  },
  {
    name: 'Barbearia',
    slug: 'barbearia',
    icon: 'IconScissors',
    description: 'Cortes masculinos e barba',
    suggestedServices: ['Corte de Cabelo', 'Barba', 'Sobrancelha', 'Hidratação', 'Pigmentação', 'Combo Completo'],
  },
  {
    name: 'Salão de Beleza',
    slug: 'salao-beleza',
    icon: 'IconSparkles',
    description: 'Serviços de beleza e estética',
    suggestedServices: ['Corte Feminino', 'Coloração', 'Escova', 'Manicure', 'Pedicure', 'Design de Sobrancelha'],
  },
  {
    name: 'Restaurante',
    slug: 'restaurante',
    icon: 'IconToolsKitchen2',
    description: 'Gastronomia e alimentação',
    suggestedServices: ['Almoço Executivo', 'Self-Service', 'À la Carte', 'Delivery', 'Eventos', 'Marmitex'],
  },
  {
    name: 'Pizzaria',
    slug: 'pizzaria',
    icon: 'IconPizza',
    description: 'Pizzas artesanais e delivery',
    suggestedServices: ['Pizzas Tradicionais', 'Pizzas Especiais', 'Rodízio', 'Delivery', 'Calzones', 'Esfihas'],
  },
  {
    name: 'Lanchonete',
    slug: 'lanchonete',
    icon: 'IconBurger',
    description: 'Lanches rápidos e sanduíches',
    suggestedServices: ['Lanches', 'Sanduíches', 'Porções', 'Sucos', 'Açaí', 'Combos'],
  },
  {
    name: 'Padaria',
    slug: 'padaria',
    icon: 'IconBread',
    description: 'Pães artesanais e confeitaria',
    suggestedServices: ['Pães Artesanais', 'Bolos', 'Salgados', 'Café da Manhã', 'Encomendas', 'Frios'],
  },
  {
    name: 'Pet Shop',
    slug: 'pet-shop',
    icon: 'IconDog',
    description: 'Produtos e serviços para pets',
    suggestedServices: ['Banho', 'Tosa', 'Ração', 'Acessórios', 'Veterinário', 'Hotel Pet'],
  },
  {
    name: 'Clínica Veterinária',
    slug: 'clinica-veterinaria',
    icon: 'IconStethoscope',
    description: 'Atendimento veterinário',
    suggestedServices: ['Consultas', 'Vacinas', 'Exames', 'Cirurgias', 'Emergência', 'Internação'],
  },
  {
    name: 'Clínica Médica',
    slug: 'clinica-medica',
    icon: 'IconHeartbeat',
    description: 'Atendimento médico especializado',
    suggestedServices: ['Consultas', 'Exames', 'Check-up', 'Especialidades', 'Procedimentos', 'Telemedicina'],
  },
  {
    name: 'Consultório Odontológico',
    slug: 'consultorio-odontologico',
    icon: 'IconDental',
    description: 'Serviços odontológicos',
    suggestedServices: ['Limpeza', 'Restauração', 'Canal', 'Clareamento', 'Implantes', 'Ortodontia'],
  },
  {
    name: 'Academia',
    slug: 'academia',
    icon: 'IconBarbell',
    description: 'Musculação e atividades físicas',
    suggestedServices: ['Musculação', 'Aeróbico', 'Personal Trainer', 'Spinning', 'Funcional', 'Crossfit'],
  },
  {
    name: 'Farmácia',
    slug: 'farmacia',
    icon: 'IconPill',
    description: 'Medicamentos e produtos de saúde',
    suggestedServices: ['Medicamentos', 'Perfumaria', 'Dermocosméticos', 'Manipulados', 'Delivery', 'Aferição'],
  },
  {
    name: 'Supermercado',
    slug: 'supermercado',
    icon: 'IconShoppingCart',
    description: 'Produtos alimentícios e de limpeza',
    suggestedServices: ['Hortifruti', 'Açougue', 'Padaria', 'Frios', 'Delivery', 'Atacado'],
  },
  {
    name: 'Imobiliária',
    slug: 'imobiliaria',
    icon: 'IconHome',
    description: 'Compra, venda e aluguel de imóveis',
    suggestedServices: ['Venda de Imóveis', 'Aluguel', 'Administração', 'Avaliação', 'Documentação', 'Financiamento'],
  },
  {
    name: 'Escritório de Advocacia',
    slug: 'escritorio-advocacia',
    icon: 'IconScale',
    description: 'Serviços jurídicos',
    suggestedServices: ['Consultoria', 'Trabalhista', 'Cível', 'Criminal', 'Empresarial', 'Família'],
  },
  {
    name: 'Escritório de Contabilidade',
    slug: 'escritorio-contabilidade',
    icon: 'IconCalculator',
    description: 'Serviços contábeis e fiscais',
    suggestedServices: ['Abertura de Empresa', 'Contabilidade', 'Folha de Pagamento', 'Impostos', 'Consultoria', 'BPO'],
  },
  {
    name: 'Escola',
    slug: 'escola',
    icon: 'IconSchool',
    description: 'Instituição de ensino',
    suggestedServices: ['Educação Infantil', 'Ensino Fundamental', 'Ensino Médio', 'Reforço', 'Cursos', 'Atividades'],
  },
  {
    name: 'Hotel',
    slug: 'hotel',
    icon: 'IconBed',
    description: 'Hospedagem e eventos',
    suggestedServices: ['Hospedagem', 'Eventos', 'Restaurante', 'Day Use', 'Transfer', 'Estacionamento'],
  },
  {
    name: 'Floricultura',
    slug: 'floricultura',
    icon: 'IconFlower',
    description: 'Flores e arranjos',
    suggestedServices: ['Buquês', 'Arranjos', 'Coroas', 'Plantas', 'Decoração', 'Delivery'],
  },
  {
    name: 'Outro',
    slug: 'outro',
    icon: 'IconBuildingStore',
    description: 'Outros tipos de negócio',
    suggestedServices: ['Atendimento Especializado', 'Orçamento Gratuito', 'Atendimento Rápido', 'Garantia de Satisfação'],
  },
]

async function seed() {
  console.log('🌱 Iniciando seed de categorias...')

  for (const cat of CATEGORIES_SEED) {
    await db
      .insert(category)
      .values(cat)
      .onConflictDoUpdate({
        target: category.slug,
        set: {
          name: cat.name,
          icon: cat.icon,
          description: cat.description,
          suggestedServices: cat.suggestedServices,
        },
      })
    console.log(`✅ Categoria "${cat.name}" inserida/atualizada`)
  }

  console.log('🎉 Seed de categorias concluído!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Erro no seed:', err)
  process.exit(1)
})
