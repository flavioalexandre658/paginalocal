'use client'

import { IconAlertTriangle, IconRocket } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

interface DraftBannerProps {
  isOwner: boolean
}

const MAIN_DOMAIN = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'paginalocal.com.br'

export function DraftBanner({ isOwner }: DraftBannerProps) {
  const plansUrl = `https://${MAIN_DOMAIN}/planos`

  return (
    <div
      className={cn(
        'fixed left-0 right-0 top-0 z-50',
        'bg-gradient-to-r from-amber-500 to-amber-600',
        'shadow-lg shadow-amber-500/20',
        'animate-fade-in-up'
      )}
    >
      <div className="container mx-auto flex items-center justify-between gap-2 px-3 py-2.5 sm:gap-4 sm:px-4 sm:py-3">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <div className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 sm:flex">
            <IconAlertTriangle className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0 flex-1 text-xs text-white sm:text-sm">
            {isOwner ? (
              <span>
                <strong className="block sm:inline">Prévia:</strong>{' '}
                <span className="hidden sm:inline">Seu site está em modo rascunho. Ative por R$59,90.</span>
                <span className="sm:hidden">Site em rascunho</span>
              </span>
            ) : (
              <span>
                <strong className="block sm:inline">Prévia:</strong>{' '}
                <span className="hidden sm:inline">Este site ainda não foi ativado. Ative por R$59,90.</span>
                <span className="sm:hidden">Site não ativado</span>
              </span>
            )}
          </div>
        </div>

        <a
          href={plansUrl}
          className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-amber-600 shadow-sm transition-all hover:bg-amber-50 hover:shadow-md sm:gap-2 sm:px-4 sm:text-sm"
        >
          <IconRocket className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Ativar por R$59,90</span>
          <span className="sm:hidden">Ativar por R$59,90</span>
        </a>
      </div>
    </div>
  )
}
