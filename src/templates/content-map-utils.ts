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
    prompt += `\n    REGRA DE ÍCONE: cada item TEM o campo "icon" preenchido com um token Lucide (formato "lucide:Nome", ex: "lucide:Star", "lucide:Shield", "lucide:Award", "lucide:Heart", "lucide:Home", "lucide:Truck", "lucide:Wrench"). NUNCA gere o campo "image" para esta seção. Use também tokens "fa:Nome" para react-icons/fa quando precisar (ex: "fa:FaTooth", "fa:FaCow"). Escolha ícones semanticamente conectados ao texto do item.`;
  }

  if (map.exampleOutput) {
    prompt += `\n    Exemplo: ${JSON.stringify(map.exampleOutput)}`;
  }

  return prompt;
}
