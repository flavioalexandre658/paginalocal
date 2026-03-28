import Link from 'next/link'
import { Logo } from '@/components/shared/logo'
import { IconArrowRight } from '@tabler/icons-react'

const NAV_COLUMNS = [
  {
    title: "Produto",
    links: [
      { label: "Construtor de sites IA", href: "/#como-funciona" },
      { label: "Precos", href: "/planos" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Sobre nos", href: "/sobre-nos" },
      { label: "Contato", href: "/contato" },
      { label: "Central de ajuda", href: "/contato" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Termos de Uso", href: "/termos-de-uso" },
      { label: "Politica de Privacidade", href: "/politica-de-privacidade" },
      { label: "LGPD", href: "/lgpd" },
    ],
  },
]

export function MarketingFooter() {
  return (
    <footer className="bg-white px-4 pb-6 sm:px-6 lg:px-14">
      <div className="mx-auto max-w-[1200px]">
        {/* Main footer card — rounded, neutral bg, generous padding */}
        <div className="overflow-hidden rounded-3xl bg-black/[0.03] px-8 py-20 sm:px-12 md:py-28 lg:px-16">
          <div className="mx-auto max-w-[1000px]">
            <div className="flex flex-col gap-16 xl:flex-row xl:gap-28">

              {/* Left — logo + description + CTA */}
              <div className="xl:max-w-[320px]">
                <Logo size="sm" href="/" />
                <p className="mt-5 text-sm text-black/55 leading-relaxed">
                  O construtor de sites com IA mais rapido do Brasil. Crie seu site profissional em 30 segundos e comece a atrair clientes pelo Google.
                </p>
                <Link
                  href="/cadastro"
                  className="mt-6 inline-flex items-center gap-1.5 rounded-2xl bg-black/80 px-4 py-2 text-sm font-medium text-white/75 shadow-button-dark transition-[background,color,box-shadow] hover:text-white hover:shadow-button-dark"
                >
                  Ir para o aplicativo
                  <IconArrowRight className="size-4" />
                </Link>
              </div>

              {/* Right — nav columns */}
              <div className="grid flex-1 grid-cols-2 gap-10 sm:grid-cols-3">
                {NAV_COLUMNS.map((col) => (
                  <div key={col.title}>
                    <h4 className="text-sm font-semibold text-black/80">
                      {col.title}
                    </h4>
                    <nav className="mt-5 flex flex-col gap-3.5">
                      {col.links.map((link) => (
                        <Link
                          key={link.label}
                          href={link.href}
                          className="text-sm text-black/55 transition-[color] duration-150 hover:text-black/80"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </nav>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom bar */}
            <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-black/[0.06] pt-8 md:flex-row">
              <p className="text-sm text-black/30">
                &copy; {new Date().getFullYear()} Decolou. Todos os direitos reservados.
              </p>
              <div className="flex items-center gap-6">
                <Link href="/entrar" className="text-sm text-black/40 transition-[color] duration-150 hover:text-black/80">
                  Entrar
                </Link>
                <Link href="/cadastro" className="text-sm text-black/40 transition-[color] duration-150 hover:text-black/80">
                  Criar conta
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
