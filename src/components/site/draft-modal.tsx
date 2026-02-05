'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconRocket, IconEye, IconAlertTriangle, IconX } from '@tabler/icons-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface DraftModalProps {
  storeName: string
  isOwner: boolean
}

export function DraftModal({ storeName, isOwner }: DraftModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Small delay to let the page render first
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className={cn(
            'relative z-10 w-full max-w-md overflow-hidden rounded-3xl',
            'bg-white shadow-2xl dark:bg-slate-900',
            'border border-slate-200/60 dark:border-slate-700/60'
          )}
        >
          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            aria-label="Fechar"
          >
            <IconX className="h-5 w-5" />
          </button>

          {/* Header with gradient */}
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 px-6 pb-8 pt-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <IconAlertTriangle className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white sm:text-2xl">
              Modo Prévia
            </h2>
            <p className="mt-2 text-sm text-white/90">
              {isOwner 
                ? 'Você está visualizando seu site em modo rascunho'
                : 'Este perfil ainda não foi publicado'
              }
            </p>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <div className="mb-6 space-y-3 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {isOwner ? (
                  <>
                    <strong className="text-slate-900 dark:text-white">{storeName}</strong> está em modo de prévia. 
                    Os botões de contato estão desativados para visitantes.
                  </>
                ) : (
                  <>
                    <strong className="text-slate-900 dark:text-white">{storeName}</strong> ainda não ativou 
                    seu perfil completo. Algumas funcionalidades podem estar indisponíveis.
                  </>
                )}
              </p>
              
              {isOwner && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Publique seu site para começar a receber contatos de clientes.
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link
                href="/planos"
                className={cn(
                  'flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3',
                  'bg-gradient-to-r from-amber-500 to-amber-600 text-white',
                  'font-semibold shadow-lg shadow-amber-500/30',
                  'transition-all hover:shadow-xl hover:shadow-amber-500/40'
                )}
              >
                <IconRocket className="h-5 w-5" />
                Publicar Site Agora
              </Link>

              <button
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3',
                  'border border-slate-200 bg-slate-50 text-slate-700',
                  'font-medium transition-all hover:bg-slate-100',
                  'dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                )}
              >
                <IconEye className="h-5 w-5" />
                Ver prévia primeiro
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
