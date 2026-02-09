import { type FAQItem } from '@/lib/ai/types'

export function formatOpeningHoursForFAQ(hours?: Record<string, string>): string {
  if (!hours || Object.keys(hours).length === 0) {
    return 'Consulte nosso horário de funcionamento pelo telefone ou WhatsApp.'
  }

  const DAYS_ORDER = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom']
  const DAYS_NAMES: Record<string, string> = {
    seg: 'segunda',
    ter: 'terça',
    qua: 'quarta',
    qui: 'quinta',
    sex: 'sexta',
    sab: 'sábado',
    dom: 'domingo',
  }

  const sortedEntries = Object.entries(hours).sort((a, b) => {
    return DAYS_ORDER.indexOf(a[0]) - DAYS_ORDER.indexOf(b[0])
  })

  if (sortedEntries.length === 0) return 'Consulte nosso horário pelo telefone.'

  const formatted = sortedEntries
    .map(([day, time]) => `${DAYS_NAMES[day] || day}: ${time}`)
    .join(', ')

  return `Nosso horário de funcionamento é: ${formatted}.`
}

/**
 * Post-processes FAQ items to ensure opening hours questions have correct answers
 * from actual Google data, and removes any FAQ items with "no information" answers.
 */
export function fixOpeningHoursInFAQ(
  faq: FAQItem[],
  openingHours?: Record<string, string>,
  storeName?: string
): FAQItem[] {
  const hoursAnswer = formatOpeningHoursForFAQ(openingHours)

  return faq
    .map(item => {
      const questionLower = item.question.toLowerCase()
      if (
        questionLower.includes('horário') ||
        questionLower.includes('horario') ||
        questionLower.includes('funcionamento') ||
        questionLower.includes('abre') ||
        questionLower.includes('fecha') ||
        questionLower.includes('sábado') ||
        questionLower.includes('sabado') ||
        questionLower.includes('domingo')
      ) {
        return {
          question: storeName
            ? `Qual o horário de funcionamento da ${storeName}?`
            : item.question,
          answer: hoursAnswer,
        }
      }
      return item
    })
    .filter(item => {
      const answerLower = item.answer.toLowerCase()
      // Remove FAQ items with useless "I don't know" answers
      return !(
        answerLower.includes('não tenho informaç') ||
        answerLower.includes('nao tenho informaç') ||
        answerLower.includes('não possuo informaç') ||
        answerLower.includes('recomendo verificar diretamente') ||
        answerLower.includes('entre em contato para') ||
        answerLower.includes('consulte diretamente') ||
        answerLower.includes('é melhor confirmar diretamente')
      )
    })
}
