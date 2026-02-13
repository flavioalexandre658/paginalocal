import Link from 'next/link'
import { IconBrandInstagram, IconBrandFacebook, IconBrandGoogle, IconExternalLink } from '@tabler/icons-react'
import Image from 'next/image'
import { getInstitutionalPageUrl, getServicePageUrl } from '@/lib/utils'

interface FooterService {
  name: string
  slug: string
}

interface FooterPage {
  title: string
  slug: string
}

interface SiteFooterProps {
  storeName: string
  city: string
  state: string
  category?: string
  categorySlug?: string
  hasServices?: boolean
  hasFaq?: boolean
  instagramUrl?: string | null
  facebookUrl?: string | null
  googleBusinessUrl?: string | null
  highlightText?: string | null
  storeSlug?: string
  services?: FooterService[]
  institutionalPages?: FooterPage[]
  logoUrl?: string | null
}

export function SiteFooter({
  storeName,
  city,
  state,
  category,
  categorySlug,
  hasServices,
  hasFaq,
  instagramUrl,
  facebookUrl,
  googleBusinessUrl,
  highlightText,
  storeSlug,
  services,
  institutionalPages,
  logoUrl,
}: SiteFooterProps) {
  const currentYear = new Date().getFullYear()

  const navLinks = [
    { href: '#sobre', label: 'Sobre' },
    ...(hasServices ? [{ href: '#servicos', label: 'Serviços' }] : []),
    { href: '#avaliacoes', label: 'Avaliações' },
    ...(hasFaq ? [{ href: '#faq', label: 'Perguntas Frequentes' }] : []),
    { href: '#contato', label: 'Contato' },
  ]

  const socialLinks = [
    { url: instagramUrl, icon: IconBrandInstagram, label: 'Instagram' },
    { url: facebookUrl, icon: IconBrandFacebook, label: 'Facebook' },
    { url: googleBusinessUrl, icon: IconBrandGoogle, label: 'Google Meu Negócio' },
  ].filter((link) => link.url)

  const hasSocialLinks = socialLinks.length > 0
  const hasServiceLinks = services && services.length > 0
  const hasInstitutionalPages = institutionalPages && institutionalPages.length > 0

  return (
    <footer className="bg-white pb-24 pt-16 md:pb-10 dark:bg-slate-950">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* Columns grid */}
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Column 1: Store info */}
            <div className="space-y-4">
              {logoUrl && (
                <Image
                  src={logoUrl}
                  alt={`Logo ${storeName}`}
                  width={120}
                  height={40}
                  className="h-10 w-auto object-contain"
                />
              )}
              <h4 className="text-xl font-bold text-primary">{storeName}</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {category ? `${category} em ${city}, ${state}. Atendimento profissional e de qualidade.` : `${city}, ${state}.`}
              </p>
              {highlightText && (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {highlightText}
                </p>
              )}
              {hasSocialLinks && (
                <div className="flex items-center gap-3 pt-1">
                  {socialLinks.map((link) => {
                    const Icon = link.icon
                    return (
                      <a
                        key={link.label}
                        href={link.url!}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={link.label}
                        className="text-slate-400 transition-colors duration-200 hover:text-primary dark:text-slate-500 dark:hover:text-primary"
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Column 2: Navigation */}
            <div>
              <h4 className="mb-4 text-sm font-bold text-primary">Navegação</h4>
              <ul className="space-y-2.5">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-500 transition-colors hover:text-primary dark:text-slate-400 dark:hover:text-primary"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Services */}
            {hasServiceLinks && (
              <div>
                <h4 className="mb-4 text-sm font-bold text-primary">Serviços</h4>
                <ul className="space-y-2.5">
                  {services!.slice(0, 6).map((svc) => (
                    <li key={svc.slug}>
                      {storeSlug ? (
                        <Link
                          href={getServicePageUrl(storeSlug, svc.slug)}
                          className="text-sm text-slate-500 transition-colors hover:text-primary dark:text-slate-400 dark:hover:text-primary"
                        >
                          {svc.name}
                        </Link>
                      ) : (
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {svc.name}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Column 4: Institutional pages OR placeholder */}
            {hasInstitutionalPages ? (
              <div>
                <h4 className="mb-4 text-sm font-bold text-primary">Páginas</h4>
                <ul className="space-y-2.5">
                  {institutionalPages!.map((page) => (
                    <li key={page.slug}>
                      {storeSlug ? (
                        <Link
                          href={getInstitutionalPageUrl(storeSlug, page.slug)}
                          className="text-sm text-slate-500 transition-colors hover:text-primary dark:text-slate-400 dark:hover:text-primary"
                        >
                          {page.title}
                        </Link>
                      ) : (
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {page.title}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ) : !hasServiceLinks ? (
              /* If no services and no pages, show nav links horizontally instead */
              <div className="sm:col-span-2 lg:col-span-3">
                <nav aria-label="Navegação do site">
                  <ul className="flex flex-wrap gap-x-6 gap-y-2">
                    {navLinks.map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          className="text-sm text-slate-500 transition-colors hover:text-primary dark:text-slate-400 dark:hover:text-primary"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
                {hasSocialLinks && (
                  <div className="mt-4 flex items-center gap-3">
                    {socialLinks.map((link) => {
                      const Icon = link.icon
                      return (
                        <a
                          key={link.label}
                          href={link.url!}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={link.label}
                          className="text-slate-400 transition-colors duration-200 hover:text-primary dark:text-slate-500 dark:hover:text-primary"
                        >
                          <Icon className="h-5 w-5" />
                        </a>
                      )
                    })}
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Separator + bottom bar */}
          <div className="mt-12 border-t border-slate-200 pt-8 dark:border-slate-800">
            <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
              {/* Copyright */}
              <div className="text-center md:text-left">
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  &copy; {currentYear} {storeName}. {city}, {state}. Todos os direitos reservados.
                </p>
                {categorySlug && (
                  <Link
                    href={`https://paginalocal.com.br/${categorySlug}`}
                    target="_blank"
                    rel="noopener"
                    className="mt-1 inline-block text-xs text-slate-400 transition-colors hover:text-primary dark:text-slate-500"
                  >
                    Encontre mais {category?.toLowerCase() || 'negócios'} em {city} e região
                  </Link>
                )}
              </div>

              {/* Criado por badge */}
              <a
                href="https://paginalocal.com.br"
                target="_blank"
                rel="noopener"
                className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-primary/40"
              >
                <span className="text-xs">Criado por</span>
                <Image
                  src="/assets/images/icon/favicon.ico"
                  alt="Página Local - Criação de Sites para Negócios Locais"
                  width={16}
                  height={16}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
                <span className="text-xs font-bold tracking-tight text-slate-800 dark:text-white">
                  Página Local
                </span>
                <IconExternalLink className="h-3 w-3 text-slate-400 transition-all duration-300 group-hover:text-primary" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
