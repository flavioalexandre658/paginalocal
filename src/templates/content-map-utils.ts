import type { FieldSpec, SectionContentMap } from "./types";

export function fieldSpecToPrompt(fields: FieldSpec[], indent = "    "): string {
  return fields
    .map((f) => {
      if (f.type === "array" && f.children) {
        const childStr = f.children
          .map((c) => (c.key ? `${c.key}: ${c.description}` : c.description))
          .join(", ");
        const range = f.count ? `[${f.count.min}-${f.count.max}]` : "[]";
        return `${indent}${f.key}${range}: {${childStr}} — ${f.description}`;
      }
      const maxLen = f.maxLength ? ` (max ${f.maxLength} chars)` : "";
      return `${indent}${f.key}${maxLen}: ${f.description}`;
    })
    .join("\n");
}

export function buildSectionPrompt(
  map: SectionContentMap,
  index: number
): string {
  const label = map.variant > 1
    ? `${map.blockType.toUpperCase()} v${map.variant}`
    : map.blockType.toUpperCase();

  const header = `[${index}] ${label}:`;
  const fields = fieldSpecToPrompt(map.fields);
  const guidance = `    VISUAL: ${map.contentGuidance}`;

  let prompt = `${header}\n${fields}\n${guidance}`;

  if (map.iconOnly) {
    prompt += `\n    REGRA DE ÍCONE (OBRIGATÓRIO): cada item DEVE ter o campo "icon" preenchido com um token Lucide ou react-icons válido — NUNCA deixe vazio, NUNCA use "image" aqui.

    Formato: "lucide:Nome" (preferido, lucide-react) ou "fa:Nome" (react-icons/fa) ou "tb:Nome" (react-icons/tb).

    TOKENS DISPONÍVEIS (escolha um por item, semanticamente ligado ao tema):
      Genéricos:    lucide:Star, lucide:Heart, lucide:CheckCircle, lucide:Sparkles, lucide:Award, lucide:Shield, lucide:Zap, lucide:Target, lucide:Rocket, lucide:TrendingUp, lucide:ThumbsUp, lucide:Users, lucide:Briefcase, lucide:Clock, lucide:Calendar, lucide:HandshakeIcon, lucide:BadgeCheck, lucide:LifeBuoy, lucide:Search, lucide:Compass, lucide:Lightbulb, lucide:BarChart3, lucide:CalendarCheck
      Serviços:     lucide:Wrench, lucide:Hammer, lucide:Settings, lucide:Package, lucide:Truck, lucide:HeadphonesIcon, lucide:Cog, lucide:FileText, lucide:Ruler
      Saúde:        lucide:Stethoscope, lucide:Syringe, lucide:Pill, lucide:Cross, lucide:Activity, fa:FaTooth, lucide:Bandage, lucide:Brain, lucide:Eye, lucide:Smile, lucide:Thermometer, lucide:HeartPulse
      Beleza:       lucide:Scissors, lucide:Flower2, lucide:Wand2, lucide:Brush, lucide:Gem, fa:FaSpa, fa:FaLeaf, fa:FaPaintBrush, fa:FaCut
      Alimentação:  lucide:UtensilsCrossed, lucide:Coffee, lucide:Pizza, lucide:CakeSlice, lucide:Beer, lucide:Wine, lucide:Soup, lucide:Apple, lucide:Sandwich, lucide:ChefHat, fa:FaHamburger, fa:FaIceCream
      Auto:         lucide:Car, lucide:Bike, lucide:Fuel, lucide:Gauge, fa:FaCarBattery, fa:FaOilCan
      Casa/Imóveis: lucide:Home, lucide:Building, lucide:Building2, lucide:KeyRound, lucide:MapPin, lucide:Bed, lucide:Bath, lucide:Sofa
      Agro/Pet:     lucide:Wheat, lucide:Sprout, lucide:Leaf, lucide:TreePine, lucide:Sun, lucide:Droplets, lucide:Egg, lucide:Bird, fa:FaCow, fa:FaHorse, fa:FaTractor
      Finanças:     lucide:DollarSign, lucide:CircleDollarSign, lucide:CreditCard, lucide:Wallet, lucide:PiggyBank, lucide:Calculator, lucide:Receipt, lucide:Banknote
      Tech:         lucide:Cpu, lucide:Monitor, lucide:Smartphone, lucide:Cloud, lucide:Database, lucide:Code, lucide:Globe, lucide:Wifi, lucide:Lock
      Comunicação:  lucide:Phone, lucide:MessageCircle, lucide:Mail, lucide:Send, lucide:Bell, fa:FaWhatsapp, fa:FaInstagram
      Loja:         lucide:ShoppingBag, lucide:ShoppingCart, lucide:Tag, lucide:Percent, lucide:Gift, lucide:Store, lucide:Boxes
      Fitness:      lucide:Dumbbell, lucide:Trophy, fa:FaRunning, fa:FaSwimmer, lucide:Footprints, lucide:Timer

    DICA: prefira ícones do mesmo "estilo visual" para todos os items da seção. Não misture muitos da fa: com lucide: no mesmo bloco — fica inconsistente.`;
  }

  if (map.exampleOutput) {
    prompt += `\n    Exemplo: ${JSON.stringify(map.exampleOutput)}`;
  }

  return prompt;
}
