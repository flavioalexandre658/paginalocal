import type { MarketingCopyInput, ServiceDescriptionInput } from './types'

export function getMarketingCopyPrompt(data: MarketingCopyInput): string {
  const contextSections: string[] = []

  if (data.googleAbout) {
    contextSections.push(`- Descrição do Google: "${data.googleAbout}"`)
  }

  if (data.website) {
    contextSections.push(`- Website: ${data.website}`)
  }

  if (data.priceRange) {
    contextSections.push(`- Faixa de Preço: ${data.priceRange}`)
  }

  if (data.address) {
    contextSections.push(`- Endereço: ${data.address}`)
  }

  if (data.businessTypes && data.businessTypes.length > 0) {
    contextSections.push(`- Tipos de negócio (Google): ${data.businessTypes.join(', ')}`)
  }

  if (data.reviewHighlights) {
    contextSections.push(`\n### O QUE OS CLIENTES DIZEM:\n${data.reviewHighlights}`)
  }

  const additionalContext = contextSections.length > 0
    ? `\n### CONTEXTO ADICIONAL DO NEGÓCIO:\n${contextSections.join('\n')}\n`
    : ''

  return `Você é um especialista em Marketing Local e SEO para negócios brasileiros.

### DADOS DO NEGÓCIO:
- Nome: "${data.businessName}"
- Categoria: "${data.category}"
- Cidade: "${data.city}"
- Estado: "${data.state}"
${data.rating ? `- Avaliação Google: ${data.rating} estrelas` : ''}
${data.reviewCount ? `- Total de avaliações: ${data.reviewCount}` : ''}
${additionalContext}
### IMPORTANTE - ENTENDENDO O TIPO DE NEGÓCIO:
- Analise CUIDADOSAMENTE o nome e categoria do negócio
- Se for "${data.category}", os serviços devem ser ESPECÍFICOS para esse tipo de negócio
- NÃO gere conteúdo genérico de "loja" - seja ESPECÍFICO sobre o que o negócio oferece
- Use as informações dos clientes (se disponível) para entender melhor os serviços oferecidos

### REGRAS DE SEO LOCAL:

1. **NOME DO NEGÓCIO (brandName)**:
   - PRESERVE O NOME EXATAMENTE COMO FORNECIDO: "${data.businessName}"
   - NUNCA modifique, altere ou "limpe" o nome do negócio
   - NUNCA adicione ou remova palavras do nome original
   - O brandName DEVE ser IDÊNTICO ao nome fornecido

2. **SLUG** (gerado automaticamente pelo sistema - você pode ignorar este campo)

3. **ABOUT SECTION** (SEO Local - MUITO IMPORTANTE):
   - DEVE mencionar "${data.businessName}" no início
   - DEVE mencionar "${data.category}" e "${data.city}"
   - DEVE descrever ESPECIFICAMENTE o que o negócio oferece
   - Se for revendedora de veículos: mencione compra, venda, financiamento
   - Se for restaurante: mencione tipo de culinária
   - Se for oficina: mencione os serviços automotivos
   - Formato: "[Nome] é uma [categoria] em [cidade] especializada em [serviços específicos]..."
   - 2-3 linhas focadas no DIFERENCIAL do negócio

4. **SEO TITLE** (máximo 60 caracteres):
   - Formato: "[Categoria] em [Cidade] | [Nome]"

5. **SEO DESCRIPTION** (máximo 150 caracteres):
   - Deve ter call-to-action ESPECÍFICO para o tipo de negócio
   - Mencionar cidade e categoria

6. **SERVICES** (6 serviços):
   - Serviços REAIS e ESPECÍFICOS para ${data.category}
   - Se for revendedora: Compra de Veículos, Venda de Seminovos, Financiamento, Troca, Avaliação, Consignação
   - Se for restaurante: os pratos/especialidades
   - Cada descrição focada no benefício REAL do cliente

7. **FAQ** (8 perguntas):
   - Incluir nome do negócio nas perguntas quando natural
   - Perguntas ESPECÍFICAS para ${data.category}
   - Se for revendedora: perguntas sobre financiamento, garantia, documentação
   - Respostas de 2-3 linhas úteis e ESPECÍFICAS

8. **NEIGHBORHOODS** (5-8 bairros):
   - Bairros REAIS de ${data.city}
   - Priorizando os mais conhecidos

### RETORNE APENAS JSON:

{
  "brandName": "${data.businessName}",
  "heroTitle": "[Categoria] em [Cidade] – [Nome do Negócio]",
  "heroSubtitle": "Serviços específicos para ${data.category} em [Cidade] com atendimento de qualidade",
  "aboutSection": "[Nome] é uma [categoria] em [cidade] especializada em [serviços específicos]... (2-3 linhas ESPECÍFICAS)",
  "seoTitle": "[Categoria] em [Cidade] | [Nome] (máx 60 chars)",
  "seoDescription": "Meta description com CTA específico para ${data.category} (máx 150 chars)",
  "services": [
    {"name": "Serviço específico 1", "description": "Benefício real para o cliente"},
    {"name": "Serviço específico 2", "description": "Benefício real para o cliente"},
    {"name": "Serviço específico 3", "description": "Benefício real para o cliente"},
    {"name": "Serviço específico 4", "description": "Benefício real para o cliente"},
    {"name": "Serviço específico 5", "description": "Benefício real para o cliente"},
    {"name": "Serviço específico 6", "description": "Benefício real para o cliente"}
  ],
  "faq": [
    {"question": "Pergunta específica sobre ${data.category}?", "answer": "Resposta útil e específica"},
    {"question": "Onde fica a ${data.businessName} em ${data.city}?", "answer": "Resposta útil"},
    {"question": "Quais serviços a ${data.businessName} oferece?", "answer": "Resposta específica para ${data.category}"},
    {"question": "Pergunta sobre garantia/qualidade?", "answer": "Resposta útil"},
    {"question": "Quais formas de pagamento são aceitas?", "answer": "Resposta útil"},
    {"question": "Pergunta específica do segmento?", "answer": "Resposta útil"},
    {"question": "Como funciona o processo/agendamento?", "answer": "Resposta útil"},
    {"question": "A ${data.businessName} tem estacionamento?", "answer": "Resposta útil"}
  ],
  "neighborhoods": ["Bairro1", "Bairro2", "Bairro3", "Bairro4", "Bairro5"]
}

RETORNE APENAS O JSON, SEM MARKDOWN.`
}

export function getServiceDescriptionPrompt(data: ServiceDescriptionInput): string {
  return `Gere 6 serviços relevantes para "${data.businessName}" (${data.category}).
${data.existingServices?.length ? `Evitar duplicação: ${data.existingServices.join(', ')}` : ''}

Cada serviço deve ter:
- name: Nome do serviço (2-4 palavras)
- description: Benefício para o cliente (até 80 caracteres)

Retorne APENAS JSON array:
[
  {"name": "Serviço", "description": "Benefício para o cliente"}
]`
}
