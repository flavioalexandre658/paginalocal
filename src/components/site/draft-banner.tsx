'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconAlertTriangle, IconX, IconRocket } from '@tabler/icons-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface DraftBannerProps {
  isOwner: boolean
}

export function DraftBanner({ isOwner }: DraftBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className={cn(
          'fixed left-0 right-0 top-0 z-50',
          'bg-gradient-to-r from-amber-500 to-amber-600',
          'shadow-lg shadow-amber-500/20'
        )}
      >
        <div className="container mx-auto flex items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-4 sm:py-3">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <div className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 sm:flex">
              <IconAlertTriangle className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0 flex-1 text-xs text-white sm:text-sm">
              {isOwner ? (
                <span>
                  <strong className="block sm:inline">Modo Rascunho:</strong>{' '}
                  <span className="hidden sm:inline">Seu site está visível, mas os botões de contato estão bloqueados.</span>
                  <span className="sm:hidden">Botões de contato bloqueados.</span>
                </span>
              ) : (
                <span>
                  <strong className="block sm:inline">Prévia:</strong>{' '}
                  <span className="hidden sm:inline">Este negócio ainda não ativou o perfil completo.</span>
                  <span className="sm:hidden">Perfil não ativado.</span>
                </span>
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            {isOwner && (
              <Link
                href={`/planos`}
                className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-amber-600 shadow-sm transition-all hover:bg-amber-50 hover:shadow-md sm:gap-2 sm:px-4 sm:text-sm"
              >
                <IconRocket className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Publicar Site</span>
                <span className="sm:hidden">Publicar</span>
              </Link>
            )}
            <button
              onClick={() => setIsVisible(false)}
              className="rounded-full p-1 text-white/80 transition-colors hover:bg-white/10 hover:text-white sm:p-1.5"
              aria-label="Fechar banner"
            >
              <IconX className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
