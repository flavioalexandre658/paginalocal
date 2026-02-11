'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { IconCookie, IconSettings, IconChevronUp } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const COOKIE_CONSENT_KEY = 'pgl-cookie-consent'

type ConsentType = 'all' | 'essential' | 'custom' | null

interface CookiePreferences {
  essential: boolean
  analytics: boolean
  marketing: boolean
}

export function CookieConsent() {
  const pathname = usePathname()
  const isStorePage = pathname?.startsWith('/site/')

  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const saveConsent = (type: ConsentType, prefs?: CookiePreferences) => {
    const data = {
      type,
      preferences: prefs || preferences,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(data))
    setIsVisible(false)
  }

  const acceptAll = () => {
    saveConsent('all', { essential: true, analytics: true, marketing: true })
  }

  const acceptEssential = () => {
    saveConsent('essential', { essential: true, analytics: false, marketing: false })
  }

  const acceptCustom = () => {
    saveConsent('custom', preferences)
    setIsExpanded(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: isStorePage ? -100 : 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: isStorePage ? -100 : 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'fixed left-0 right-0 z-50 p-2 sm:p-4',
            isStorePage ? 'top-0' : 'bottom-0'
          )}
        >
          <div className="mx-auto max-w-2xl">
            <div className="overflow-hidden rounded-xl border border-slate-200/60 bg-white/98 shadow-lg backdrop-blur-xl sm:rounded-2xl dark:border-slate-700/60 dark:bg-slate-900/98">
              {/* Compact Mobile View */}
              {!isExpanded ? (
                <div className="flex items-center gap-3 p-3 sm:p-4">
                  <IconCookie className="h-5 w-5 shrink-0 text-amber-500" />
                  
                  <p className="flex-1 text-xs text-slate-600 sm:text-sm dark:text-slate-300">
                    <span className="hidden sm:inline">
                      Usamos cookies para melhorar sua experiência.{' '}
                      <Link href="https://paginalocal.com.br/politica-de-privacidade" className="text-primary hover:underline">
                        Saiba mais
                      </Link>
                    </span>
                    <span className="sm:hidden">
                      Usamos cookies.{' '}
                      <Link href="https://paginalocal.com.br/politica-de-privacidade" className="text-primary hover:underline">
                        Saiba mais
                      </Link>
                    </span>
                  </p>

                  <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                    <button
                      onClick={() => setIsExpanded(true)}
                      className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 sm:p-2 dark:hover:bg-slate-800"
                      aria-label="Configurar"
                    >
                      <IconSettings className="h-4 w-4" />
                    </button>
                    <Button
                      size="sm"
                      onClick={acceptAll}
                      className="h-8 bg-slate-900 px-3 text-xs text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                    >
                      Aceitar
                    </Button>
                  </div>
                </div>
              ) : (
                /* Expanded Settings View */
                <div className="p-4 sm:p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconCookie className="h-5 w-5 text-amber-500" />
                      <h3 className="text-sm font-semibold text-slate-900 sm:text-base dark:text-white">
                        Preferências de Cookies
                      </h3>
                    </div>
                    <button
                      onClick={() => setIsExpanded(false)}
                      className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                      aria-label="Minimizar"
                    >
                      <IconChevronUp className="h-4 w-4 rotate-180" />
                    </button>
                  </div>

                  <div className="mb-4 space-y-3">
                    <CookieToggle
                      title="Essenciais"
                      description="Necessários para o site funcionar"
                      checked={true}
                      disabled={true}
                      onChange={() => { }}
                    />
                    <CookieToggle
                      title="Análise"
                      description="Melhorar sua experiência"
                      checked={preferences.analytics}
                      onChange={(checked) => setPreferences(p => ({ ...p, analytics: checked }))}
                    />
                    <CookieToggle
                      title="Marketing"
                      description="Anúncios personalizados"
                      checked={preferences.marketing}
                      onChange={(checked) => setPreferences(p => ({ ...p, marketing: checked }))}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={acceptEssential}
                      className="flex-1 text-xs sm:text-sm"
                    >
                      Apenas essenciais
                    </Button>
                    <Button
                      size="sm"
                      onClick={acceptCustom}
                      className="flex-1 bg-slate-900 text-xs text-white hover:bg-slate-800 sm:text-sm dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                    >
                      Salvar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface CookieToggleProps {
  title: string
  description: string
  checked: boolean
  disabled?: boolean
  onChange: (checked: boolean) => void
}

function CookieToggle({ title, description, checked, disabled, onChange }: CookieToggleProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800/50">
      <div className="min-w-0 flex-1">
        <h4 className="text-xs font-medium text-slate-900 sm:text-sm dark:text-white">
          {title}
          {disabled && (
            <span className="ml-1 text-[10px] font-normal text-slate-400 sm:text-xs">(obrigatório)</span>
          )}
        </h4>
        <p className="truncate text-[10px] text-slate-500 sm:text-xs dark:text-slate-400">
          {description}
        </p>
      </div>
      <label className="relative inline-flex shrink-0 cursor-pointer items-center">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <div className={`
          h-5 w-9 rounded-full bg-slate-300 
          after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 
          after:rounded-full after:bg-white after:shadow-sm
          after:transition-all after:content-['']
          peer-checked:bg-primary peer-checked:after:translate-x-4
          dark:bg-slate-600
          ${disabled ? 'cursor-not-allowed opacity-60' : ''}
        `} />
      </label>
    </div>
  )
}
