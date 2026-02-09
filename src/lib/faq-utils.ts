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

function isOpeningHoursQuestion(question: string): boolean {
  const lower = question.toLowerCase()
  return (
    lower.includes('horário') ||
    lower.includes('horario') ||
    lower.includes('funcionamento') ||
    lower.includes('abre') ||
    lower.includes('fecha')
  )
}

/**
 * Post-processes FAQ items to ensure opening hours questions have correct answers
 * from actual Google data, removes duplicates, and filters useless answers.
 */
export function fixOpeningHoursInFAQ(
  faq: FAQItem[],
  openingHours?: Record<string, string>,
  storeName?: string
): FAQItem[] {
  const hoursAnswer = formatOpeningHoursForFAQ(openingHours)
  let hoursQuestionHandled = false

  const processed = faq
    .map(item => {
      if (isOpeningHoursQuestion(item.question)) {
        if (hoursQuestionHandled) {
          return null
        }
        hoursQuestionHandled = true
        return {
          question: storeName
            ? `Qual o horário de funcionamento da ${storeName}?`
            : item.question,
          answer: hoursAnswer,
        }
      }
      return item
    })
    .filter((item): item is FAQItem => item !== null)
    .filter(item => {
      const answerLower = item.answer.toLowerCase()
      return !(
        answerLower.includes('não tenho informaç') ||
        answerLower.includes('nao tenho informaç') ||
        answerLower.includes('não possuo informaç') ||
        answerLower.includes('recomendo verificar diretamente') ||
        answerLower.includes('consulte diretamente') ||
        answerLower.includes('é melhor confirmar diretamente')
      )
    })

  const seen = new Set<string>()
  return processed.filter(item => {
    const key = item.question.toLowerCase().trim()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
