/**
 * Curated icon catalog used by the IconPicker UI.
 *
 * Each entry uses the same `icon` token format consumed by IconRenderer:
 *   "<library>:<Name>"
 *
 * Categories follow common needs of local businesses (services, healthcare,
 * food, automotive, real-estate, beauty, fitness, finance, retail, tech).
 */

export interface IconCatalogEntry {
  token: string;
  label: string;
  keywords: string[];
}

export interface IconCatalogCategory {
  id: string;
  label: string;
  entries: IconCatalogEntry[];
}

export const ICON_CATALOG: IconCatalogCategory[] = [
  {
    id: "popular",
    label: "Populares",
    entries: [
      { token: "lucide:Star", label: "Estrela", keywords: ["star", "destaque", "favorito"] },
      { token: "lucide:Heart", label: "Coração", keywords: ["love", "coracao"] },
      { token: "lucide:CheckCircle", label: "Check", keywords: ["ok", "concluído", "feito"] },
      { token: "lucide:Sparkles", label: "Brilho", keywords: ["sparkles", "novo", "destaque"] },
      { token: "lucide:Award", label: "Prêmio", keywords: ["medalha", "premio", "reconhecimento"] },
      { token: "lucide:Shield", label: "Escudo", keywords: ["seguranca", "protecao"] },
      { token: "lucide:Zap", label: "Raio", keywords: ["rapido", "velocidade", "energia"] },
      { token: "lucide:Target", label: "Alvo", keywords: ["foco", "meta"] },
      { token: "lucide:Rocket", label: "Foguete", keywords: ["lancamento", "decolar"] },
      { token: "lucide:TrendingUp", label: "Crescimento", keywords: ["grafico", "subir"] },
      { token: "lucide:ThumbsUp", label: "Curtir", keywords: ["like", "aprovar"] },
      { token: "lucide:Users", label: "Equipe", keywords: ["pessoas", "time"] },
    ],
  },
  {
    id: "services",
    label: "Serviços",
    entries: [
      { token: "lucide:Wrench", label: "Ferramenta", keywords: ["ferramenta", "manutencao"] },
      { token: "lucide:Hammer", label: "Martelo", keywords: ["construcao"] },
      { token: "lucide:Settings", label: "Engrenagem", keywords: ["config", "ajustes"] },
      { token: "lucide:Briefcase", label: "Maleta", keywords: ["trabalho", "negocio"] },
      { token: "lucide:Package", label: "Caixa", keywords: ["produto", "entrega"] },
      { token: "lucide:Truck", label: "Caminhão", keywords: ["entrega", "frete"] },
      { token: "lucide:Clock", label: "Relógio", keywords: ["tempo", "agenda"] },
      { token: "lucide:Calendar", label: "Calendário", keywords: ["data", "agenda"] },
      { token: "lucide:HandshakeIcon", label: "Acordo", keywords: ["parceria", "contrato"] },
      { token: "lucide:BadgeCheck", label: "Certificado", keywords: ["verificado", "certificado"] },
      { token: "lucide:HeadphonesIcon", label: "Suporte", keywords: ["atendimento", "suporte"] },
      { token: "lucide:LifeBuoy", label: "Suporte 2", keywords: ["ajuda", "salva-vidas"] },
    ],
  },
  {
    id: "agriculture",
    label: "Agro & Pecuária",
    entries: [
      { token: "lucide:Wheat", label: "Trigo", keywords: ["agricultura", "grao"] },
      { token: "lucide:Sprout", label: "Broto", keywords: ["plantar", "broto"] },
      { token: "lucide:Leaf", label: "Folha", keywords: ["natureza", "verde"] },
      { token: "lucide:TreePine", label: "Árvore", keywords: ["arvore", "natureza"] },
      { token: "lucide:Sun", label: "Sol", keywords: ["clima", "solar"] },
      { token: "lucide:CloudRain", label: "Chuva", keywords: ["clima", "irrigacao"] },
      { token: "fa:FaCow", label: "Vaca", keywords: ["bovino", "gado"] },
      { token: "fa:FaHorse", label: "Cavalo", keywords: ["equino"] },
      { token: "fa:FaTractor", label: "Trator", keywords: ["agricultura", "maquina"] },
      { token: "lucide:Droplets", label: "Gota", keywords: ["agua", "irrigacao"] },
      { token: "lucide:Egg", label: "Ovo", keywords: ["aves", "fazenda"] },
      { token: "lucide:Bird", label: "Ave", keywords: ["aves", "galinha"] },
    ],
  },
  {
    id: "health",
    label: "Saúde",
    entries: [
      { token: "lucide:Stethoscope", label: "Estetoscópio", keywords: ["medico", "saude"] },
      { token: "lucide:Heart", label: "Coração", keywords: ["amor", "saude"] },
      { token: "lucide:Syringe", label: "Seringa", keywords: ["vacina", "injecao"] },
      { token: "lucide:Pill", label: "Pílula", keywords: ["remedio", "medicamento"] },
      { token: "lucide:Cross", label: "Cruz", keywords: ["hospital", "saude"] },
      { token: "lucide:Activity", label: "Pulso", keywords: ["batimento", "saude"] },
      { token: "fa:FaTooth", label: "Dente", keywords: ["dentista", "odonto"] },
      { token: "lucide:Bandage", label: "Curativo", keywords: ["primeiros socorros"] },
      { token: "lucide:Brain", label: "Cérebro", keywords: ["psicologia", "mente"] },
      { token: "lucide:Eye", label: "Olho", keywords: ["visao", "oftalmologia"] },
      { token: "lucide:Smile", label: "Sorriso", keywords: ["feliz", "dentista"] },
      { token: "lucide:Thermometer", label: "Termômetro", keywords: ["febre", "saude"] },
    ],
  },
  {
    id: "automotive",
    label: "Automotivo",
    entries: [
      { token: "lucide:Car", label: "Carro", keywords: ["automovel"] },
      { token: "lucide:CarFront", label: "Carro frente", keywords: ["automovel"] },
      { token: "lucide:Bike", label: "Moto", keywords: ["motocicleta"] },
      { token: "lucide:Fuel", label: "Combustível", keywords: ["gasolina", "posto"] },
      { token: "lucide:Wrench", label: "Chave", keywords: ["mecanica"] },
      { token: "lucide:Cog", label: "Engrenagem", keywords: ["mecanica"] },
      { token: "fa:FaCarBattery", label: "Bateria", keywords: ["bateria"] },
      { token: "fa:FaOilCan", label: "Lata de óleo", keywords: ["oleo", "lubrificacao"] },
      { token: "lucide:Gauge", label: "Velocímetro", keywords: ["velocidade", "performance"] },
      { token: "lucide:Truck", label: "Caminhão", keywords: ["transporte"] },
    ],
  },
  {
    id: "food",
    label: "Alimentação",
    entries: [
      { token: "lucide:UtensilsCrossed", label: "Talheres", keywords: ["restaurante"] },
      { token: "lucide:Coffee", label: "Café", keywords: ["bebida", "cafe"] },
      { token: "lucide:Pizza", label: "Pizza", keywords: ["pizzaria"] },
      { token: "lucide:CakeSlice", label: "Bolo", keywords: ["confeitaria", "doce"] },
      { token: "lucide:Beer", label: "Cerveja", keywords: ["bar"] },
      { token: "lucide:Wine", label: "Vinho", keywords: ["bar"] },
      { token: "lucide:Soup", label: "Sopa", keywords: ["restaurante"] },
      { token: "fa:FaHamburger", label: "Hambúrguer", keywords: ["lanche"] },
      { token: "fa:FaIceCream", label: "Sorvete", keywords: ["sobremesa"] },
      { token: "lucide:Apple", label: "Maçã", keywords: ["fruta", "saudavel"] },
      { token: "lucide:Sandwich", label: "Sanduíche", keywords: ["lanche"] },
      { token: "lucide:ChefHat", label: "Chef", keywords: ["cozinheiro"] },
    ],
  },
  {
    id: "beauty",
    label: "Beleza",
    entries: [
      { token: "lucide:Scissors", label: "Tesoura", keywords: ["barbearia", "salao"] },
      { token: "lucide:Sparkles", label: "Brilho", keywords: ["beleza"] },
      { token: "lucide:Flower2", label: "Flor", keywords: ["floricultura", "natureza"] },
      { token: "lucide:Wand2", label: "Varinha", keywords: ["magica", "estetica"] },
      { token: "fa:FaSpa", label: "Spa", keywords: ["spa", "relaxamento"] },
      { token: "fa:FaLeaf", label: "Folha", keywords: ["natural", "organico"] },
      { token: "fa:FaPaintBrush", label: "Pincel", keywords: ["maquiagem"] },
      { token: "fa:FaCut", label: "Corte", keywords: ["cabelo", "barbearia"] },
      { token: "lucide:Brush", label: "Brocha", keywords: ["pintura", "maquiagem"] },
      { token: "lucide:Gem", label: "Gema", keywords: ["luxo", "joia"] },
    ],
  },
  {
    id: "fitness",
    label: "Fitness",
    entries: [
      { token: "lucide:Dumbbell", label: "Halter", keywords: ["academia", "musculacao"] },
      { token: "lucide:Trophy", label: "Troféu", keywords: ["conquista"] },
      { token: "lucide:Activity", label: "Atividade", keywords: ["treino"] },
      { token: "lucide:Bike", label: "Bicicleta", keywords: ["ciclismo"] },
      { token: "fa:FaRunning", label: "Corrida", keywords: ["corrida"] },
      { token: "fa:FaSwimmer", label: "Natação", keywords: ["nadar"] },
      { token: "lucide:Footprints", label: "Pegadas", keywords: ["caminhada"] },
      { token: "lucide:Timer", label: "Cronômetro", keywords: ["treino", "tempo"] },
    ],
  },
  {
    id: "real-estate",
    label: "Imobiliário",
    entries: [
      { token: "lucide:Home", label: "Casa", keywords: ["lar", "imovel"] },
      { token: "lucide:Building", label: "Edifício", keywords: ["predio"] },
      { token: "lucide:Building2", label: "Empresa", keywords: ["comercial"] },
      { token: "lucide:KeyRound", label: "Chave", keywords: ["acesso", "imovel"] },
      { token: "lucide:MapPin", label: "Localização", keywords: ["endereco"] },
      { token: "lucide:Map", label: "Mapa", keywords: ["regiao"] },
      { token: "lucide:Bed", label: "Cama", keywords: ["quarto", "dormitorio"] },
      { token: "lucide:Bath", label: "Banheiro", keywords: ["banheiro"] },
      { token: "lucide:Sofa", label: "Sofá", keywords: ["sala", "estar"] },
      { token: "lucide:Ruler", label: "Régua", keywords: ["medida", "metragem"] },
    ],
  },
  {
    id: "finance",
    label: "Finanças",
    entries: [
      { token: "lucide:DollarSign", label: "Dólar", keywords: ["dinheiro", "valor"] },
      { token: "lucide:CircleDollarSign", label: "Moeda", keywords: ["dinheiro"] },
      { token: "lucide:CreditCard", label: "Cartão", keywords: ["pagamento"] },
      { token: "lucide:Wallet", label: "Carteira", keywords: ["dinheiro"] },
      { token: "lucide:PiggyBank", label: "Cofrinho", keywords: ["poupanca"] },
      { token: "lucide:BarChart3", label: "Gráfico", keywords: ["analise", "relatorio"] },
      { token: "lucide:TrendingUp", label: "Em alta", keywords: ["crescimento"] },
      { token: "lucide:Calculator", label: "Calculadora", keywords: ["contabilidade"] },
      { token: "lucide:Receipt", label: "Recibo", keywords: ["nota", "fiscal"] },
      { token: "lucide:Banknote", label: "Cédula", keywords: ["dinheiro"] },
    ],
  },
  {
    id: "tech",
    label: "Tecnologia",
    entries: [
      { token: "lucide:Cpu", label: "Processador", keywords: ["chip", "tecnologia"] },
      { token: "lucide:Monitor", label: "Monitor", keywords: ["computador"] },
      { token: "lucide:Smartphone", label: "Celular", keywords: ["mobile"] },
      { token: "lucide:Cloud", label: "Nuvem", keywords: ["cloud"] },
      { token: "lucide:Database", label: "Banco de dados", keywords: ["dados"] },
      { token: "lucide:Code", label: "Código", keywords: ["programacao"] },
      { token: "lucide:Globe", label: "Globo", keywords: ["web", "internet"] },
      { token: "lucide:Wifi", label: "Wifi", keywords: ["conexao"] },
      { token: "lucide:Lock", label: "Cadeado", keywords: ["seguranca"] },
      { token: "lucide:KeyRound", label: "Chave", keywords: ["acesso", "seguranca"] },
    ],
  },
  {
    id: "communication",
    label: "Comunicação",
    entries: [
      { token: "lucide:Phone", label: "Telefone", keywords: ["ligacao"] },
      { token: "lucide:MessageCircle", label: "Mensagem", keywords: ["chat"] },
      { token: "lucide:Mail", label: "E-mail", keywords: ["email"] },
      { token: "fa:FaWhatsapp", label: "WhatsApp", keywords: ["whatsapp"] },
      { token: "fa:FaInstagram", label: "Instagram", keywords: ["instagram"] },
      { token: "fa:FaFacebookF", label: "Facebook", keywords: ["facebook"] },
      { token: "fa:FaLinkedinIn", label: "LinkedIn", keywords: ["linkedin"] },
      { token: "fa:FaYoutube", label: "YouTube", keywords: ["youtube"] },
      { token: "lucide:Send", label: "Enviar", keywords: ["enviar"] },
      { token: "lucide:Bell", label: "Sino", keywords: ["notificacao"] },
    ],
  },
  {
    id: "shopping",
    label: "Loja & E-commerce",
    entries: [
      { token: "lucide:ShoppingBag", label: "Sacola", keywords: ["compra", "loja"] },
      { token: "lucide:ShoppingCart", label: "Carrinho", keywords: ["compras"] },
      { token: "lucide:Tag", label: "Etiqueta", keywords: ["preco", "promocao"] },
      { token: "lucide:Percent", label: "Desconto", keywords: ["promocao"] },
      { token: "lucide:Gift", label: "Presente", keywords: ["brinde"] },
      { token: "lucide:Store", label: "Loja", keywords: ["comercio"] },
      { token: "lucide:Boxes", label: "Caixas", keywords: ["estoque"] },
      { token: "lucide:Barcode", label: "Código de barras", keywords: ["produto"] },
    ],
  },
];

export function findIconByToken(token: string): IconCatalogEntry | null {
  for (const cat of ICON_CATALOG) {
    const e = cat.entries.find((x) => x.token === token);
    if (e) return e;
  }
  return null;
}

export function searchIcons(query: string): IconCatalogEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const out: IconCatalogEntry[] = [];
  for (const cat of ICON_CATALOG) {
    for (const e of cat.entries) {
      if (
        e.label.toLowerCase().includes(q) ||
        e.token.toLowerCase().includes(q) ||
        e.keywords.some((k) => k.toLowerCase().includes(q))
      ) {
        out.push(e);
      }
    }
  }
  return out;
}
