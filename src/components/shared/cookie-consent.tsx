'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { IconCookie, IconX, IconSettings } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'

const COOKIE_CONSENT_KEY = 'pgl-cookie-consent'

type ConsentType = 'all' | 'essential' | 'custom' | null

interface CookiePreferences {
  essential: boolean
  analytics: boolean
  marketing: boolean
}

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
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
    setShowSettings(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="container mx-auto">
            <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-slate-200/60 bg-white/95 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-900/95">
              <button
                onClick={acceptEssential}
                className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                aria-label="Fechar"
              >
                <IconX className="h-5 w-5" />
              </button>

              {!showSettings ? (
                <div className="p-6 md:p-8">
                  <div className="flex flex-col gap-6 md:flex-row md:items-start">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 text-amber-500">
                      <IconCookie className="h-6 w-6" />
                    </div>

                    <div className="flex-1">
                      <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                        Utilizamos cookies
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Usamos cookies para melhorar sua experiência, analisar o tráfego e personalizar conteúdo. 
                        Ao continuar navegando, você concorda com nossa{' '}
                        <Link href="/politica-de-privacidade" className="text-primary hover:underline">
                          Política de Privacidade
                        </Link>
                        .
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row md:flex-col lg:flex-row">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowSettings(true)}
                        className="gap-2"
                      >
                        <IconSettings className="h-4 w-4" />
                        Personalizar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={acceptEssential}
                      >
                        Apenas essenciais
                      </Button>
                      <Button
                        size="sm"
                        onClick={acceptAll}
                        className="shadow-md shadow-primary/20"
                      >
                        Aceitar todos
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 md:p-8">
                  <div className="mb-6">
                    <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                      Configurar preferências de cookies
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Escolha quais tipos de cookies você deseja permitir.
                    </p>
                  </div>

                  <div className="mb-6 space-y-4">
                    <CookieToggle
                      title="Cookies essenciais"
                      description="Necessários para o funcionamento básico do site. Não podem ser desativados."
                      checked={true}
                      disabled={true}
                      onChange={() => {}}
                    />
                    <CookieToggle
                      title="Cookies de análise"
                      description="Nos ajudam a entender como você usa o site para melhorarmos a experiência."
                      checked={preferences.analytics}
                      onChange={(checked) => setPreferences(p => ({ ...p, analytics: checked }))}
                    />
                    <CookieToggle
                      title="Cookies de marketing"
                      description="Usados para personalizar anúncios e medir a eficácia de campanhas."
                      checked={preferences.marketing}
                      onChange={(checked) => setPreferences(p => ({ ...p, marketing: checked }))}
                    />
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSettings(false)}
                    >
                      Voltar
                    </Button>
                    <Button
                      size="sm"
                      onClick={acceptCustom}
                      className="shadow-md shadow-primary/20"
                    >
                      Salvar preferências
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
    <div className="flex items-start gap-4">
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <div className={`
          h-6 w-11 rounded-full bg-slate-200 
          after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 
          after:rounded-full after:border after:border-slate-300 after:bg-white 
          after:transition-all after:content-['']
          peer-checked:bg-primary peer-checked:after:translate-x-full 
          peer-checked:after:border-white peer-focus:ring-2 peer-focus:ring-primary/20
          dark:bg-slate-700 dark:after:border-slate-600
          ${disabled ? 'cursor-not-allowed opacity-60' : ''}
        `} />
      </label>
      <div className="flex-1">
        <h4 className="text-sm font-medium text-slate-900 dark:text-white">
          {title}
          {disabled && (
            <span className="ml-2 text-xs font-normal text-slate-400">(obrigatório)</span>
          )}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
    </div>
  )
}
