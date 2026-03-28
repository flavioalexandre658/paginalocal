'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Logo } from '@/components/shared/logo'
import { PglButton } from '@/components/ui/pgl-button'
import { IconArrowRight, IconMenu2, IconX } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

interface MarketingHeaderProps {
  isLoggedIn?: boolean
  hasSubscription?: boolean
}

export function MarketingHeader({ isLoggedIn = false, hasSubscription = false }: MarketingHeaderProps) {
  const searchParams = useSearchParams()
  const shouldHideAuthButtons = searchParams.get('wpp') === 'true'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-200",
          scrolled
            ? "border-b border-black/10 bg-white/90 backdrop-blur-md"
            : "border-b border-transparent bg-white",
        )}
      >
        <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-14">
          {/* Logo + nav */}
          <div className="flex items-center gap-10">
            <Logo size="sm" href="/" />
            <nav className="hidden items-center gap-8 lg:flex">
              <Link href="/#como-funciona" className="text-sm font-medium text-black/80 transition-[background,color] duration-150 hover:text-black/55">
                Construtor de sites IA
              </Link>
              <Link href="/planos" className="text-sm font-medium text-black/80 transition-[background,color] duration-150 hover:text-black/55">
                Precos
              </Link>
            </nav>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <>
                <PglButton variant="dark" size="sm" asChild>
                  <Link href="/painel">
                    Ir para o aplicativo
                    <IconArrowRight className="size-4" />
                  </Link>
                </PglButton>
              </>
            ) : (
              <>
                {!shouldHideAuthButtons && (
                  <>
                    <PglButton variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                      <Link href="/entrar">Entrar</Link>
                    </PglButton>
                    <PglButton variant="dark" size="sm" asChild>
                      <Link href="/cadastro">
                        Ir para o aplicativo
                        <IconArrowRight className="size-4" />
                      </Link>
                    </PglButton>
                  </>
                )}
              </>
            )}

            {/* Mobile hamburger */}
            <PglButton
              variant="ghost"
              size="icon-sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden"
            >
              {mobileMenuOpen ? <IconX className="size-5" /> : <IconMenu2 className="size-5" />}
            </PglButton>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed left-0 right-0 top-14 z-50 border-b border-black/[0.06] bg-white px-4 py-6 shadow-xl shadow-black/[0.06] lg:hidden">
            <nav className="flex flex-col gap-1">
              <Link href="/#como-funciona" onClick={() => setMobileMenuOpen(false)} className="rounded-xl px-4 py-3 text-base font-medium text-black/80 transition-[background,color] duration-150 hover:bg-black/5">
                Construtor de sites IA
              </Link>
              <Link href="/planos" onClick={() => setMobileMenuOpen(false)} className="rounded-xl px-4 py-3 text-base font-medium text-black/80 transition-[background,color] duration-150 hover:bg-black/5">
                Precos
              </Link>
              {!isLoggedIn && !shouldHideAuthButtons && (
                <>
                  <div className="my-2 h-px bg-black/[0.06]" />
                  <Link href="/entrar" onClick={() => setMobileMenuOpen(false)} className="rounded-xl px-4 py-3 text-base font-medium text-black/55 transition-[background,color] duration-150 hover:bg-black/5 hover:text-black/80">
                    Entrar
                  </Link>
                  <PglButton variant="dark" size="md" asChild className="mt-1 w-full">
                    <Link href="/cadastro" onClick={() => setMobileMenuOpen(false)}>
                      Comecar agora
                      <IconArrowRight className="size-4" />
                    </Link>
                  </PglButton>
                </>
              )}
            </nav>
          </div>
        </>
      )}
    </>
  )
}
