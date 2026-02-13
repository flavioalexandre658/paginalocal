import {
  IconScissors, IconBarbell, IconToolsKitchen2, IconCar, IconTool, IconDog,
  IconStethoscope, IconHome, IconBolt, IconDroplet, IconPaint, IconCamera,
  IconBook, IconMusic, IconHeart, IconShirt, IconCoffee, IconPizza, IconBread,
  IconFlower, IconDental, IconPill, IconScale, IconCalculator, IconSchool,
  IconBed, IconWash, IconTruck, IconKey, IconDeviceMobile, IconShoppingCart,
  IconDiamond, IconSparkles, IconBrush, IconNeedle, IconBike, IconSwimming,
  IconYoga, IconMassage, IconEye, IconEar, IconBrain, IconBone, IconBurger,
  IconIceCream, IconGlass, IconBottle, IconArmchair, IconHammer, IconShoe,
  IconPaw, IconBabyCarriage, IconBox, IconPlane, IconTree, IconStar, IconUsers,
  IconClock, IconShield, IconMapPin, IconPhone, IconMail, IconWifi, IconPrinter,
  IconMicrophone, IconHeadphones, IconGlobe, IconRocket, IconFlag, IconAward,
  IconCrown, IconTarget, IconChartBar, IconDatabase, IconCode, IconBug,
  IconTestPipe, IconFlask, IconAtom, IconDna, IconLeaf, IconSun, IconMoon,
  IconCloud, IconUmbrella, IconWind, IconSnowflake, IconFish, IconButterfly,
  IconCat, IconHorse, IconApple, IconCarrot, IconCookie, IconCake, IconSoup,
  IconGrill,
} from '@tabler/icons-react'
import type { ComponentType } from 'react'

interface IconProps {
  className?: string
}

const ICON_MAP: Record<string, ComponentType<IconProps>> = {
  IconScissors, IconBarbell, IconToolsKitchen2, IconCar, IconTool, IconDog,
  IconStethoscope, IconHome, IconBolt, IconDroplet, IconPaint, IconCamera,
  IconBook, IconMusic, IconHeart, IconShirt, IconCoffee, IconPizza, IconBread,
  IconFlower, IconDental, IconPill, IconScale, IconCalculator, IconSchool,
  IconBed, IconWash, IconTruck, IconKey, IconDeviceMobile, IconShoppingCart,
  IconDiamond, IconSparkles, IconBrush, IconNeedle, IconBike, IconSwimming,
  IconYoga, IconMassage, IconEye, IconEar, IconBrain, IconBone, IconBurger,
  IconIceCream, IconGlass, IconBottle, IconArmchair, IconHammer, IconShoe,
  IconPaw, IconBabyCarriage, IconBox, IconPlane, IconTree, IconStar, IconUsers,
  IconClock, IconShield, IconMapPin, IconPhone, IconMail, IconWifi, IconPrinter,
  IconMicrophone, IconHeadphones, IconGlobe, IconRocket, IconFlag, IconAward,
  IconCrown, IconTarget, IconChartBar, IconDatabase, IconCode, IconBug,
  IconTestPipe, IconFlask, IconAtom, IconDna, IconLeaf, IconSun, IconMoon,
  IconCloud, IconUmbrella, IconWind, IconSnowflake, IconFish, IconButterfly,
  IconCat, IconHorse, IconApple, IconCarrot, IconCookie, IconCake, IconSoup,
  IconGrill,
}

export function getServiceIcon(iconName?: string | null): ComponentType<IconProps> {
  if (!iconName) return IconSparkles
  return ICON_MAP[iconName] || IconSparkles
}

export const VALID_ICON_NAMES = Object.keys(ICON_MAP)

const CATEGORY_ICON_MAP: Record<string, string> = {
  'Barbearia': 'IconScissors',
  'Salão de Beleza': 'IconSparkles',
  'Restaurante': 'IconToolsKitchen2',
  'Pizzaria': 'IconPizza',
  'Lanchonete': 'IconBurger',
  'Padaria': 'IconBread',
  'Cafeteria': 'IconCoffee',
  'Academia': 'IconBarbell',
  'Pet Shop': 'IconDog',
  'Clínica Veterinária': 'IconPaw',
  'Oficina Mecânica': 'IconTool',
  'Borracharia': 'IconTarget',
  'Auto Center': 'IconCar',
  'Lava Jato': 'IconDroplet',
  'Consultório Odontológico': 'IconDental',
  'Clínica Médica': 'IconStethoscope',
  'Farmácia': 'IconPill',
  'Hospital': 'IconHeart',
  'Imobiliária': 'IconHome',
  'Escritório de Advocacia': 'IconScale',
  'Escritório de Contabilidade': 'IconCalculator',
  'Escola': 'IconSchool',
  'Hotel': 'IconBed',
  'Floricultura': 'IconFlower',
  'Supermercado': 'IconShoppingCart',
  'Loja de Roupas': 'IconShirt',
  'Loja de Calçados': 'IconShoe',
  'Loja de Móveis': 'IconArmchair',
  'Loja de Ferragens': 'IconHammer',
  'Loja de Eletrônicos': 'IconDeviceMobile',
  'Joalheria': 'IconDiamond',
  'Livraria': 'IconBook',
  'Lavanderia': 'IconWash',
  'Chaveiro': 'IconKey',
  'Revendedora de Veículos': 'IconCar',
  'Estacionamento': 'IconMapPin',
  'Sorveteria': 'IconIceCream',
  'Bar': 'IconGlass',
  'Distribuidora de Bebidas': 'IconBottle',
  'Seguradora': 'IconShield',
  'Agência de Viagens': 'IconPlane',
  'Spa': 'IconMassage',
  'Delivery': 'IconTruck',
  'Mercearia': 'IconShoppingCart',
  'Conveniência': 'IconShoppingCart',
  'Encanador': 'IconDroplet',
  'Eletricista': 'IconBolt',
  'Pintor': 'IconPaint',
}

export function getCategoryIcon(category?: string): string {
  if (!category) return 'IconSparkles'
  return CATEGORY_ICON_MAP[category] || 'IconSparkles'
}

const KEYWORD_ICON_MAP: [string[], string][] = [
  [['corte', 'cabelo', 'barba', 'barbeiro', 'cabeleireiro', 'escova', 'penteado', 'platinado', 'degrade', 'degradê', 'hidratação capilar', 'tratamento capilar', 'progressiva', 'alisamento', 'tintura', 'coloração', 'luzes', 'mechas'], 'IconScissors'],
  [['musculação', 'personal', 'treino', 'funcional', 'fitness', 'avaliação física', 'spinning', 'crossfit', 'aeróbica', 'ginástica'], 'IconBarbell'],
  [['cozinha', 'refeição', 'almoço', 'jantar', 'self-service', 'marmitex', 'rodízio', 'café da manhã', 'buffet', 'cardápio', 'prato', 'gastronomia'], 'IconToolsKitchen2'],
  [['carro', 'veículo', 'automotivo', 'revisão', 'suspensão', 'freio', 'elétrica automotiva', 'embreagem', 'câmbio', 'motor', 'escapamento', 'polimento', 'cristalização', 'blindagem'], 'IconCar'],
  [['mecânico', 'reparo', 'manutenção', 'conserto', 'troca de óleo', 'injeção eletrônica', 'revisão completa', 'diagnóstico', 'retífica'], 'IconTool'],
  [['pet', 'tosa', 'animal', 'cachorro', 'gato', 'adestramento', 'hotel para pets', 'vacinação', 'ração', 'acessórios pet'], 'IconDog'],
  [['médico', 'consulta', 'clínico', 'exame', 'check-up', 'veterinário', 'diagnóstico médico', 'ultrassom', 'raio-x', 'laborat'], 'IconStethoscope'],
  [['casa', 'residencial', 'imóvel', 'reforma', 'construção', 'aluguel de imóvel', 'venda de imóvel', 'avaliação de imóvel'], 'IconHome'],
  [['elétrica', 'eletricista', 'instalação elétrica', 'energia', 'iluminação', 'quadro elétrico', 'fiação', 'disjuntor', 'tomada'], 'IconBolt'],
  [['hidráulica', 'encanador', 'lavagem', 'água', 'esgoto', 'tubulação', 'caixa d'], 'IconDroplet'],
  [['pintura', 'pintor', 'tinta', 'pintura facial', 'textura', 'verniz', 'acabamento'], 'IconPaint'],
  [['foto', 'fotografia', 'filmagem', 'vídeo', 'ensaio', 'estúdio fotográfico'], 'IconCamera'],
  [['aula', 'curso', 'educação', 'treinamento', 'capacitação', 'reforço', 'tutoria', 'orientação'], 'IconBook'],
  [['música', 'instrumento', 'som', 'dj', 'karaokê', 'show', 'banda', 'animação musical'], 'IconMusic'],
  [['saúde', 'bem-estar', 'cuidado', 'tratamento', 'terapia', 'reabilitação', 'ambulância', 'emergência', 'socorrista', 'primeiros socorros', 'plano de saúde'], 'IconHeart'],
  [['roupa', 'moda', 'costura', 'alfaiate', 'customização', 'uniforme', 'camiseta', 'vestido', 'fantasia', 'figurino', 'feminina', 'masculina', 'infantil'], 'IconShirt'],
  [['café', 'cafeteria', 'cappuccino', 'expresso'], 'IconCoffee'],
  [['pizza', 'massa', 'forno', 'pizzaiolo'], 'IconPizza'],
  [['pão', 'padaria', 'confeitaria', 'bolo', 'doce', 'biscoito', 'torta', 'salgado'], 'IconBread'],
  [['flor', 'arranjo', 'buquê', 'jardim', 'paisagismo', 'jardinagem'], 'IconFlower'],
  [['dente', 'dental', 'odonto', 'clareamento', 'ortodontia', 'implante', 'prótese', 'canal', 'extração', 'limpeza dental', 'gengiva', 'aparelho'], 'IconDental'],
  [['remédio', 'medicamento', 'farmácia', 'droga', 'receita'], 'IconPill'],
  [['jurídico', 'advocacia', 'direito', 'contrato', 'processo', 'habeas', 'defesa', 'criminal', 'penal', 'trabalhist', 'recurso', 'apelação', 'inquérito'], 'IconScale'],
  [['contábil', 'contabilidade', 'imposto', 'fiscal', 'declaração', 'balanço', 'folha de pagamento'], 'IconCalculator'],
  [['escola', 'ensino', 'matrícula', 'creche', 'berçário'], 'IconSchool'],
  [['hotel', 'hospedagem', 'pousada', 'quarto', 'diária', 'hóspede'], 'IconBed'],
  [['lavanderia', 'lavar', 'passar', 'roupa suja', 'tinturaria'], 'IconWash'],
  [['frete', 'mudança', 'transporte', 'entrega', 'delivery', 'logística', 'carreto'], 'IconTruck'],
  [['chave', 'fechadura', 'chaveiro', 'tranca', 'cofre'], 'IconKey'],
  [['celular', 'smartphone', 'tela', 'assistência técnica', 'computador', 'notebook', 'informática'], 'IconDeviceMobile'],
  [['compra', 'venda', 'produto', 'loja', 'mercado', 'varejo', 'atacado', 'distribuição', 'distribuidor'], 'IconShoppingCart'],
  [['joia', 'anel', 'brinco', 'relógio', 'ouro', 'prata', 'aliança'], 'IconDiamond'],
  [['estética', 'beleza', 'unha', 'manicure', 'pedicure', 'sobrancelha', 'cílio', 'micropigmentação', 'lash', 'nail'], 'IconSparkles'],
  [['depilação', 'cera', 'laser', 'design de sobrancelha', 'epilação'], 'IconBrush'],
  [['acupuntura', 'piercing', 'tatuagem', 'tattoo', 'body'], 'IconNeedle'],
  [['bicicleta', 'bike', 'ciclismo', 'pedal'], 'IconBike'],
  [['natação', 'piscina', 'aquático', 'hidroginástica'], 'IconSwimming'],
  [['yoga', 'pilates', 'alongamento', 'meditação'], 'IconYoga'],
  [['massagem', 'relaxamento', 'spa', 'drenagem', 'shiatsu', 'reflexologia'], 'IconMassage'],
  [['olho', 'visão', 'óculos', 'oftalmologia', 'optometria', 'lente'], 'IconEye'],
  [['ouvido', 'audiologia', 'aparelho auditivo', 'fono'], 'IconEar'],
  [['psicologia', 'terapia', 'psiquiatria', 'mental', 'ansiedade', 'depressão', 'coaching'], 'IconBrain'],
  [['ortopedia', 'fisioterapia', 'coluna', 'articulação', 'rpg', 'quiropraxia', 'postura'], 'IconBone'],
  [['lanche', 'hambúrguer', 'sanduíche', 'fast food', 'hot dog', 'açaí', 'wrap', 'pastel', 'coxinha', 'salgado frito'], 'IconBurger'],
  [['sorvete', 'gelato', 'picolé', 'frozen'], 'IconIceCream'],
  [['bebida', 'bar', 'drink', 'coquetel', 'cerveja', 'chopp', 'vinho'], 'IconGlass'],
  [['garrafa', 'distribuidora', 'adega', 'empório'], 'IconBottle'],
  [['móvel', 'sofá', 'decoração', 'estofado', 'colchão', 'cortina', 'tapete'], 'IconArmchair'],
  [['ferramenta', 'ferragem', 'material de construção', 'cimento', 'tijolo', 'argamassa'], 'IconHammer'],
  [['calçado', 'sapato', 'tênis', 'chinelo', 'bota', 'sandália'], 'IconShoe'],
  [['pneu', 'alinhamento', 'balanceamento', 'calibragem', 'borracharia', 'socorro', 'rodovia'], 'IconTarget'],
  [['segurança', 'vigilância', 'portaria', 'monitoramento', 'cftv', 'alarme', 'bombeiro', 'brigadista', 'acesso', 'controlador', 'recepcionista'], 'IconShield'],
  [['limpeza', 'higienização', 'faxina', 'desinfecção', 'sanitização', 'dedetização', 'controle de pragas'], 'IconDroplet'],
  [['evento', 'festa', 'decoração de festa', 'casamento', 'aniversário', 'formatura', 'confraternização', 'animação', 'recreação', 'brincadeira', 'mágica', 'personagem'], 'IconStar'],
  [['seguros', 'seguro', 'consórcio', 'financiamento', 'crédito', 'investimento', 'previdência'], 'IconShield'],
  [['aluguel', 'locação', 'rental', 'fantasia', 'equipamento'], 'IconBox'],
  [['valet', 'manobrista', 'estacionamento'], 'IconCar'],
  [['banho', 'grooming'], 'IconDog'],
  [['queijo', 'laticínio', 'leite', 'iogurte', 'manteiga', 'ricota'], 'IconApple'],
  [['churrasco', 'espeto', 'assado', 'defumado', 'grelhado'], 'IconGrill'],
  [['bolo', 'confeitaria', 'doce', 'brigadeiro', 'trufa', 'cookie'], 'IconCake'],
  [['sopa', 'caldo', 'ensopado'], 'IconSoup'],
  [['orçamento', 'consultoria', 'assessoria', 'planejamento'], 'IconChartBar'],
  [['carregador', 'bateria', 'recarga'], 'IconBolt'],
  [['promoção', 'desconto', 'oferta', 'liquidação'], 'IconAward'],
  [['premium', 'vip', 'exclusivo', 'especial', 'pacote'], 'IconCrown'],
  [['rápido', 'expresso', 'urgente', 'imediato', 'emergência'], 'IconRocket'],
  [['ambiente', 'espaço', 'salão', 'conforto', 'aconchegante', 'climatizado'], 'IconSun'],
  [['pata', 'patinha', 'pet sitting', 'passeio com pet', 'dog walker'], 'IconPaw'],
]

export function guessIconByServiceName(serviceName: string, category?: string): string {
  const lower = serviceName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  for (const [keywords, iconName] of KEYWORD_ICON_MAP) {
    for (const keyword of keywords) {
      const normalizedKeyword = keyword
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
      if (lower.includes(normalizedKeyword)) {
        return iconName
      }
    }
  }

  return getCategoryIcon(category)
}
