import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const LIMIT_ERROR_MESSAGES = [
  'Limite de lojas atingido',
  'Você já possui',
  'plano gratuito',
  'disponível apenas para assinantes',
  'Assine um plano',
  'Limite de fotos',
  'reescrita com IA está disponível apenas',
  'Sincronização com Google',
]

export function usePlanLimitRedirect() {
  const router = useRouter()

  function handleActionError(error: string | undefined | null): boolean {
    if (!error) return false

    const isLimitError = LIMIT_ERROR_MESSAGES.some(msg =>
      error.toLowerCase().includes(msg.toLowerCase())
    )

    if (isLimitError) {
      toast.error(error)
      setTimeout(() => {
        router.push('/planos?limite=1')
      }, 1500)
      return true
    }

    return false
  }

  function redirectToPlans(message?: string) {
    if (message) {
      toast.error(message)
    }
    setTimeout(() => {
      router.push('/planos?limite=1')
    }, message ? 1500 : 0)
  }

  return {
    handleActionError,
    redirectToPlans,
  }
}
