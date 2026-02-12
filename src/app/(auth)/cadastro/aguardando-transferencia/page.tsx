'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAction } from 'next-safe-action/hooks'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  IconCheck,
  IconLoader2,
  IconRocket,
  IconArrowRight,
  IconBuildingStore,
  IconArrowsExchange,
} from '@tabler/icons-react'

import { checkPendingTransferAction } from '@/actions/stores/check-pending-transfer.action'
import { Button } from '@/components/ui/button'
import { getStoreUrl } from '@/lib/utils'
import { cn } from '@/lib/utils'

type PageState = 'waiting' | 'complete'

export default function AguardandoTransferenciaPage() {
  const { executeAsync } = useAction(checkPendingTransferAction)
  const [state, setState] = useState<PageState>('waiting')
  const [transferData, setTransferData] = useState<{
    storeName: string
    storeSlug: string
    wasActivated: boolean
  } | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  const checkTransfer = useCallback(async () => {
    const result = await executeAsync()
    if (result?.data?.hasTransfer && result.data.transfer) {
      setTransferData({
        storeName: result.data.transfer.storeName,
        storeSlug: result.data.transfer.storeSlug,
        wasActivated: result.data.transfer.wasActivated,
      })
      setState('complete')
      setShowConfetti(true)
      return true
    }
    return false
  }, [executeAsync])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    async function startPolling() {
      const found = await checkTransfer()
      if (found) return

      interval = setInterval(async () => {
        const found = await checkTransfer()
        if (found && interval) {
          clearInterval(interval)
        }
      }, 4000)
    }

    startPolling()

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [checkTransfer])

  return (
    <div className="mx-auto w-full max-w-md">
      {showConfetti && <ConfettiEffect />}

      <AnimatePresence mode="wait">
        {state === 'waiting' && <WaitingStep key="waiting" />}
        {state === 'complete' && transferData && (
          <CompleteStep
            key="complete"
            storeName={transferData.storeName}
            storeSlug={transferData.storeSlug}
            wasActivated={transferData.wasActivated}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function WaitingStep() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="text-center"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg shadow-primary/10"
      >
        <IconArrowsExchange className="h-8 w-8 text-primary" />
      </motion.div>

      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
        Aguardando transferência
      </h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Sua conta foi criada com sucesso! Agora estamos aguardando a transferência da sua loja.
      </p>

      <div className="mt-8 rounded-2xl border border-slate-200/40 bg-white/70 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-900/70 dark:shadow-slate-900/50">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
              <IconBuildingStore className="h-6 w-6 text-slate-400" />
            </div>
            <motion.div
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <IconLoader2 className="h-3 w-3 animate-spin text-white" />
            </motion.div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <PulsingDot />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Verificando a cada instante...
              </span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Assim que sua loja for transferida, você verá aqui automaticamente
            </p>
          </div>

          <div className="mt-2 w-full space-y-2">
            {[
              { label: 'Conta criada', done: true },
              { label: 'Aguardando transferência da loja', done: false, active: true },
              { label: 'Loja pronta para uso', done: false },
            ].map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                  step.done && 'bg-emerald-50/50 dark:bg-emerald-950/20',
                  step.active && 'bg-primary/5 dark:bg-primary/10'
                )}
              >
                <div
                  className={cn(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-md',
                    step.done && 'bg-emerald-500 text-white',
                    step.active && 'bg-primary text-white',
                    !step.done && !step.active && 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                  )}
                >
                  {step.done ? (
                    <IconCheck className="h-3.5 w-3.5" />
                  ) : step.active ? (
                    <IconLoader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <span className="text-xs font-medium">{i + 1}</span>
                  )}
                </div>
                <span
                  className={cn(
                    step.done && 'text-emerald-700 dark:text-emerald-300',
                    step.active && 'font-medium text-slate-800 dark:text-slate-200',
                    !step.done && !step.active && 'text-slate-400 dark:text-slate-500'
                  )}
                >
                  {step.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
        Não feche esta página. A verificação é automática.
      </p>
    </motion.div>
  )
}

function CompleteStep({
  storeName,
  storeSlug,
  wasActivated,
}: {
  storeName: string
  storeSlug: string
  wasActivated: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-xl shadow-emerald-500/30"
      >
        <IconCheck className="h-10 w-10 text-white" />
      </motion.div>

      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-3xl">
        Loja transferida!
      </h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 md:text-base">
        <span className="font-medium text-slate-700 dark:text-slate-300">{storeName}</span> agora é sua
      </p>

      {!wasActivated && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 rounded-lg border border-amber-200/60 bg-amber-50/50 px-4 py-3 text-left dark:border-amber-900/40 dark:bg-amber-950/20"
        >
          <p className="text-xs text-amber-800 dark:text-amber-200">
            <span className="font-medium">Atenção:</span> Sua loja está inativa. Para ativá-la, assine um plano que suporte a quantidade de lojas que você possui.
          </p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 flex flex-col gap-2 md:mt-8 md:gap-3"
      >
        <Link href={getStoreUrl(storeSlug)} target="_blank">
          <Button
            size="lg"
            className="h-11 w-full gap-2 cursor-pointer text-sm shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/30 md:h-12 md:gap-3 md:text-base"
          >
            <IconRocket className="h-5 w-5" />
            Ver página
          </Button>
        </Link>
        <Link href={`/painel/${storeSlug}`}>
          <Button
            variant="outline"
            size="lg"
            className="h-10 w-full gap-2 cursor-pointer border-slate-200/60 text-sm text-slate-600 transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary dark:border-slate-700/60 dark:text-slate-300 dark:hover:border-primary/30 dark:hover:text-primary md:h-11"
          >
            <IconArrowRight className="h-4 w-4 md:h-5 md:w-5" />
            Ir para o painel
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  )
}

function PulsingDot() {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
    </span>
  )
}

function ConfettiEffect() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            opacity: 1,
            x: '50vw',
            y: '50vh',
            scale: 0,
          }}
          animate={{
            opacity: 0,
            x: `${Math.random() * 100}vw`,
            y: `${Math.random() * 100}vh`,
            scale: Math.random() * 2 + 1,
            rotate: Math.random() * 360,
          }}
          transition={{
            duration: Math.random() * 2 + 1,
            ease: 'easeOut',
          }}
          className={cn(
            'absolute h-3 w-3 rounded-sm',
            ['bg-primary/60', 'bg-emerald-500/60', 'bg-amber-500/60', 'bg-rose-500/60'][
              Math.floor(Math.random() * 4)
            ]
          )}
        />
      ))}
    </div>
  )
}
