'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IconCookie, IconSettings, IconChevronUp } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'

const COOKIE_CONSENT_KEY = 'pgl-cookie-consent'

type ConsentType = 'all' | 'essential' | 'custom' | null

interface CookiePreferences {
  essential: boolean
  analytics: boolean
  marketing: boolean
}

function useStoreColors() {
  const pathname = usePathname()
  const [colors, setColors] = useState<{
    bg: string; surface: string; text: string; textMuted: string; accent: string; radius: string
  } | null>(null)

  useEffect(() => {
    const root = document.documentElement
    const style = getComputedStyle(root)

    const pglPrimary = style.getPropertyValue('--pgl-primary').trim()
    const v1Primary = style.getPropertyValue('--primary').trim()

    if (pglPrimary) {
      setColors({
        bg: style.getPropertyValue('--pgl-background').trim() || '#ffffff',
        surface: style.getPropertyValue('--pgl-surface').trim() || '#f5f5f4',
        text: style.getPropertyValue('--pgl-text').trim() || '#1a1a1a',
        textMuted: style.getPropertyValue('--pgl-text-muted').trim() || '#737373',
        accent: style.getPropertyValue('--pgl-accent').trim() || '#3b82f6',
        radius: style.getPropertyValue('--pgl-radius').trim() || '8px',
      })
    } else if (v1Primary && (pathname?.startsWith('/site/') || !pathname?.startsWith('/'))) {
      const btnColor = style.getPropertyValue('--store-button-color').trim() || v1Primary
      setColors({
        bg: '#ffffff',
        surface: '#f5f5f4',
        text: '#1a1a1a',
        textMuted: '#737373',
        accent: btnColor || v1Primary,
        radius: '8px',
      })
    }
  }, [pathname])

  return colors
}

export function CookieConsent() {
  const storeColors = useStoreColors()

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

  if (!isVisible) return null

  if (storeColors) {
    return (
      <StoreCookieConsent
        colors={storeColors}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        preferences={preferences}
        setPreferences={setPreferences}
        acceptAll={acceptAll}
        acceptEssential={acceptEssential}
        acceptCustom={acceptCustom}
      />
    )
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-2 sm:p-4">
      <div className="mx-auto max-w-2xl">
        <div className="overflow-hidden rounded-xl border border-slate-200/60 bg-white/98 shadow-lg backdrop-blur-xl sm:rounded-2xl dark:border-slate-700/60 dark:bg-slate-900/98">
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
                <DefaultCookieToggle title="Essenciais" description="Necessários para o site funcionar" checked disabled onChange={() => {}} />
                <DefaultCookieToggle title="Análise" description="Melhorar sua experiência" checked={preferences.analytics} onChange={(c) => setPreferences(p => ({ ...p, analytics: c }))} />
                <DefaultCookieToggle title="Marketing" description="Anúncios personalizados" checked={preferences.marketing} onChange={(c) => setPreferences(p => ({ ...p, marketing: c }))} />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={acceptEssential} className="flex-1 text-xs sm:text-sm">
                  Apenas essenciais
                </Button>
                <Button size="sm" onClick={acceptCustom} className="flex-1 bg-slate-900 text-xs text-white hover:bg-slate-800 sm:text-sm dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
                  Salvar
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

type StoreColors = { bg: string; surface: string; text: string; textMuted: string; accent: string; radius: string }

function StoreCookieConsent({
  colors,
  isExpanded,
  setIsExpanded,
  preferences,
  setPreferences,
  acceptAll,
  acceptEssential,
  acceptCustom,
}: {
  colors: StoreColors
  isExpanded: boolean
  setIsExpanded: (v: boolean) => void
  preferences: CookiePreferences
  setPreferences: (fn: (p: CookiePreferences) => CookiePreferences) => void
  acceptAll: () => void
  acceptEssential: () => void
  acceptCustom: () => void
}) {
  const c = colors
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-2 sm:p-4">
      <div className="mx-auto max-w-2xl">
        <div
          className="overflow-hidden shadow-lg backdrop-blur-xl"
          style={{
            backgroundColor: c.surface,
            border: `1px solid ${c.text}15`,
            borderRadius: c.radius,
          }}
        >
          {!isExpanded ? (
            <div className="flex items-center gap-3 p-3 sm:p-4">
              <IconCookie className="h-5 w-5 shrink-0" style={{ color: c.accent }} />
              <p className="flex-1 text-xs sm:text-sm" style={{ color: c.textMuted }}>
                <span className="hidden sm:inline">
                  Usamos cookies para melhorar sua experiência.{' '}
                  <Link href="https://paginalocal.com.br/politica-de-privacidade" className="underline underline-offset-2 hover:no-underline" style={{ color: c.accent }}>
                    Saiba mais
                  </Link>
                </span>
                <span className="sm:hidden">
                  Usamos cookies.{' '}
                  <Link href="https://paginalocal.com.br/politica-de-privacidade" className="underline underline-offset-2 hover:no-underline" style={{ color: c.accent }}>
                    Saiba mais
                  </Link>
                </span>
              </p>
              <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => setIsExpanded(true)}
                  className="rounded-lg p-1.5 transition-opacity hover:opacity-70 sm:p-2"
                  style={{ color: c.textMuted }}
                  aria-label="Configurar"
                >
                  <IconSettings className="h-4 w-4" />
                </button>
                <button
                  onClick={acceptAll}
                  className="h-8 px-3 text-xs font-medium transition-opacity hover:opacity-90 sm:text-sm"
                  style={{ backgroundColor: c.text, color: c.bg, borderRadius: c.radius }}
                >
                  Aceitar
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IconCookie className="h-5 w-5" style={{ color: c.accent }} />
                  <h3 className="text-sm font-semibold sm:text-base" style={{ color: c.text }}>
                    Preferências de Cookies
                  </h3>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="rounded-lg p-1.5 transition-opacity hover:opacity-70"
                  style={{ color: c.textMuted }}
                  aria-label="Minimizar"
                >
                  <IconChevronUp className="h-4 w-4 rotate-180" />
                </button>
              </div>
              <div className="mb-4 space-y-3">
                <StoreCookieToggle colors={c} title="Essenciais" description="Necessários para o site funcionar" checked disabled onChange={() => {}} />
                <StoreCookieToggle colors={c} title="Análise" description="Melhorar sua experiência" checked={preferences.analytics} onChange={(ch) => setPreferences(p => ({ ...p, analytics: ch }))} />
                <StoreCookieToggle colors={c} title="Marketing" description="Anúncios personalizados" checked={preferences.marketing} onChange={(ch) => setPreferences(p => ({ ...p, marketing: ch }))} />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={acceptEssential}
                  className="flex-1 px-3 py-2 text-xs font-medium transition-opacity hover:opacity-80 sm:text-sm"
                  style={{ border: `1px solid ${c.text}20`, color: c.text, borderRadius: c.radius, backgroundColor: 'transparent' }}
                >
                  Apenas essenciais
                </button>
                <button
                  onClick={acceptCustom}
                  className="flex-1 px-3 py-2 text-xs font-medium transition-opacity hover:opacity-90 sm:text-sm"
                  style={{ backgroundColor: c.text, color: c.bg, borderRadius: c.radius }}
                >
                  Salvar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StoreCookieToggle({ colors, title, description, checked, disabled, onChange }: {
  colors: StoreColors; title: string; description: string; checked: boolean; disabled?: boolean; onChange: (c: boolean) => void
}) {
  return (
    <div
      className="flex items-center justify-between gap-3 p-2.5"
      style={{ backgroundColor: colors.bg, borderRadius: colors.radius }}
    >
      <div className="min-w-0 flex-1">
        <h4 className="text-xs font-medium sm:text-sm" style={{ color: colors.text }}>
          {title}
          {disabled && (
            <span className="ml-1 text-[10px] font-normal sm:text-xs" style={{ color: colors.textMuted }}>(obrigatório)</span>
          )}
        </h4>
        <p className="truncate text-[10px] sm:text-xs" style={{ color: colors.textMuted }}>{description}</p>
      </div>
      <label className="relative inline-flex shrink-0 items-center">
        <input type="checkbox" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
        <div
          className="h-5 w-9 rounded-full"
          style={{ backgroundColor: checked ? colors.accent : colors.textMuted, opacity: disabled ? 0.6 : 1 }}
        >
          <span className="absolute left-[2px] top-[2px] h-4 w-4 rounded-full bg-white shadow-sm transition-transform" style={{ transform: checked ? 'translateX(16px)' : 'translateX(0)' }} />
        </div>
      </label>
    </div>
  )
}

function DefaultCookieToggle({ title, description, checked, disabled, onChange }: {
  title: string; description: string; checked: boolean; disabled?: boolean; onChange: (c: boolean) => void
}) {
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
      <label className="relative inline-flex shrink-0 items-center">
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
          ${disabled ? 'opacity-60' : ''}
        `} />
      </label>
    </div>
  )
}
