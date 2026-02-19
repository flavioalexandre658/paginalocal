import { Metadata } from 'next'
import Link from 'next/link'
import { IconX } from '@tabler/icons-react'

export const metadata: Metadata = {
  title: 'Pagamento Cancelado',
  robots: { index: false, follow: false },
}

export default function PagamentoCanceladoPage() {
  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-2xl border border-slate-200/40 bg-white/70 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-900/70 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
          <IconX className="h-8 w-8 text-slate-400 dark:text-slate-500" />
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Pagamento não concluído
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          Você saiu antes de finalizar o pagamento. Nenhuma cobrança foi
          realizada. Solicite um novo link ao nosso time quando quiser continuar.
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
