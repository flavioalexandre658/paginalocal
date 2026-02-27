'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { IconX } from '@tabler/icons-react'

interface DraftInterceptorProps {
  isDraft: boolean
}

const INTERCEPTED_PATTERNS = [
  'wa.me',
  'api.whatsapp.com',
  'whatsapp.com',
  'tel:',
  'maps.google',
  'google.com/maps',
  'maps.apple',
  'waze.com',
]

const MAIN_DOMAIN = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'paginalocal.com.br'

export function DraftInterceptor({ isDraft }: DraftInterceptorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  const isInterceptedHref = (href: string) =>
    INTERCEPTED_PATTERNS.some((p) => href.includes(p))

  const handleDocumentClick = useCallback(
    (e: MouseEvent) => {
      if (!isDraft) return

      let target = e.target as HTMLElement | null
      while (target && target.tagName !== 'A') {
        target = target.parentElement
      }
      if (!target) return

      const href = (target as HTMLAnchorElement).href || ''
      if (isInterceptedHref(href)) {
        e.preventDefault()
        e.stopPropagation()
        setIsOpen(true)
      }
    },
    [isDraft],
  )

  useEffect(() => {
    if (!isDraft) return
    document.addEventListener('click', handleDocumentClick, true)
    return () => document.removeEventListener('click', handleDocumentClick, true)
  }, [isDraft, handleDocumentClick])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const plansUrl = `https://${MAIN_DOMAIN}/planos`
  const signupUrl = `https://${MAIN_DOMAIN}/cadastro`

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center sm:p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) setIsOpen(false)
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Sheet / Modal */}
      <div className="relative z-10 w-full space-y-3 rounded-t-3xl bg-transparent p-4 pb-safe sm:max-w-md sm:rounded-2xl sm:p-0">

        {/* Close button */}
        <div className="flex justify-end sm:hidden">
          <button
            onClick={() => setIsOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
            aria-label="Fechar"
          >
            <IconX className="h-4 w-4" />
          </button>
        </div>

        {/* Draft notice card */}
        <div className="rounded-2xl border border-slate-200/40 bg-white/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-500/5 shadow-lg shadow-amber-400/10">
                <span className="text-2xl leading-none">🚧</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                  Site em fase de publicação
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Este site ainda não está ativo publicamente.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="hidden shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 sm:flex"
              aria-label="Fechar"
            >
              <IconX className="h-4 w-4" />
            </button>
          </div>

          <div className="my-4 rounded-xl border border-slate-100 bg-slate-50/80 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Se você é o proprietário, ative agora para
            </p>
            <ul className="space-y-2">
              {[
                'Liberar acesso público ao site',
                'Começar a aparecer no Google',
                'Remover o selo de prévia',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-slate-600">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-600">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <a
            href={plansUrl}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/40"
          >
            Ativar agora
          </a>
        </div>

        {/* Promo card */}
        <div className="overflow-hidden rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-600 to-emerald-700 p-5 text-center shadow-xl shadow-emerald-600/20">
          <div className="mb-3 flex items-center justify-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/images/icon/favicon.ico"
              alt="Página Local"
              width={24}
              height={24}
              className="rounded-lg"
            />
            <span className="text-sm font-semibold tracking-tight text-white">
              Página Local
            </span>
          </div>
          <h3 className="text-base font-semibold tracking-tight text-white">
            Quer ter seu próprio site profissional?
          </h3>
          <p className="mt-1 text-xs text-emerald-100">
            Crie agora em poucos minutos e comece a divulgar sua empresa online.
          </p>
          <a
            href={signupUrl}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2 text-sm font-semibold text-emerald-700 shadow-md shadow-black/10 transition-all hover:bg-emerald-50 hover:shadow-lg"
          >
            🚀 Criar meu site agora
          </a>
        </div>

        {/* Bottom safe area spacer on mobile */}
        <div className="h-2 sm:hidden" />
      </div>
    </div>
  )
}
