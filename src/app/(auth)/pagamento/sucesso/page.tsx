import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { IconCircleCheck, IconLock, IconAlertCircle } from '@tabler/icons-react'
import { stripe } from '@/lib/stripe'
import { getOrCreateUserByEmail, createActivationToken } from '@/lib/checkout-helpers'

export const metadata: Metadata = {
  title: 'Pagamento Confirmado',
  robots: { index: false, follow: false },
}

interface PageProps {
  searchParams: Promise<{ session_id?: string }>
}

export default async function PagamentoSucessoPage({ searchParams }: PageProps) {
  const { session_id } = await searchParams

  let redirectUrl: string | null = null
  let errorMessage: string | null = null

  if (session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id)
      const email = session.customer_details?.email
      const name = session.customer_details?.name

      if (session.status !== 'complete') {
        errorMessage = 'O pagamento ainda não foi confirmado. Aguarde um momento e tente novamente.'
      } else if (!email) {
        errorMessage = 'Não foi possível identificar o e-mail. Entre em contato com o suporte.'
      } else {
        await getOrCreateUserByEmail(email, name)
        const raw = await createActivationToken(email)
        redirectUrl = `/ativar-senha?token=${raw}`
      }
    } catch {
      errorMessage = 'Não foi possível verificar o pagamento. Entre em contato com o suporte.'
    }
  }

  if (redirectUrl) {
    redirect(redirectUrl)
  }

  if (errorMessage) {
    return (
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-2xl border border-slate-200/40 bg-white/70 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-900/70 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/50">
            <IconAlertCircle className="h-9 w-9 text-amber-600 dark:text-amber-400" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Atenção
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            {errorMessage}
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-2xl border border-slate-200/40 bg-white/70 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-900/70 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50">
          <IconCircleCheck className="h-9 w-9 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Pagamento confirmado!
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          Sua assinatura foi ativada com sucesso. Em breve você receberá as
          instruções de acesso via WhatsApp.
        </p>
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-left dark:border-slate-800 dark:bg-slate-800/50">
          <IconLock className="h-5 w-5 shrink-0 text-slate-400" />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Fique atento ao WhatsApp — você receberá o link de acesso em
            instantes.
          </p>
        </div>
        <Link
          href="/"
          className="mt-6 inline-flex items-center text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  )
}
