import Link from 'next/link'
import { IconMapPin, IconExternalLink, IconBrandInstagram, IconBrandFacebook, IconBrandGoogle } from '@tabler/icons-react'
import Image from 'next/image'

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
    { url: instagramUrl, icon: IconBrandInstagram, label: 'Instagram', hoverColor: 'hover:text-pink-500 hover:border-pink-500/30 hover:bg-pink-500/10 hover:shadow-pink-500/10' },
    { url: facebookUrl, icon: IconBrandFacebook, label: 'Facebook', hoverColor: 'hover:text-blue-600 hover:border-blue-600/30 hover:bg-blue-600/10 hover:shadow-blue-600/10' },
    { url: googleBusinessUrl, icon: IconBrandGoogle, label: 'Google Meu Negócio', hoverColor: 'hover:text-emerald-500 hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:shadow-emerald-500/10' },
  ].filter((link) => link.url)

  const hasSocialLinks = socialLinks.length > 0
  const hasServiceLinks = services && services.length > 0
  const hasInstitutionalPages = institutionalPages && institutionalPages.length > 0
  const hasMultiColumn = hasServiceLinks || hasInstitutionalPages

  return (
    <footer className="relative border-t border-slate-200/60 pb-24 pt-10 md:pb-10 md:pt-12 dark:border-slate-800/60 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-slate-100 via-white to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-900" />

      <div className="container relative mx-auto px-4">
        {hasMultiColumn ? (
          <div className="mb-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 ring-1 ring-primary/20">
                  <IconMapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {storeName}
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {category && `${category} em `}{city}, {state}
                  </p>
                </div>
              </div>

              {highlightText && (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {highlightText}
                </p>
              )}

              {hasSocialLinks && (
                <div className="flex items-center gap-2 pt-1">
                  {socialLinks.map((link) => {
                    const Icon = link.icon
                    return (
                      <a
                        key={link.label}
                        href={link.url!}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={link.label}
                        className={`flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/60 bg-white/70 text-slate-500 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md dark:border-slate-700/40 dark:bg-slate-900/70 dark:text-slate-400 ${link.hoverColor}`}
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    )
                  })}
                </div>
              )}
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
                Navegação
              </h4>
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

            {hasServiceLinks && (
              <div>
                <h4 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
                  Serviços
                </h4>
                <ul className="space-y-2.5">
                  {services!.slice(0, 6).map((svc) => (
                    <li key={svc.slug}>
                      {storeSlug ? (
                        <Link
                          href={`/site/${storeSlug}/servicos/${svc.slug}`}
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

            {hasInstitutionalPages && (
              <div>
                <h4 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
                  Páginas
                </h4>
                <ul className="space-y-2.5">
                  {institutionalPages!.map((page) => (
                    <li key={page.slug}>
                      {storeSlug ? (
                        <Link
                          href={`/site/${storeSlug}/${page.slug}`}
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
            )}
          </div>
        ) : (
          <div className="mb-8 flex flex-col items-center gap-6 md:flex-row md:justify-between">
            <div className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 ring-1 ring-primary/20 transition-all duration-300 group-hover:ring-primary/30 group-hover:shadow-md group-hover:shadow-primary/10">
                <IconMapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {storeName}
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {category && `${category} em `}{city}, {state}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 md:items-end">
              <nav aria-label="Navegação do site">
                <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
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
                <div className="flex items-center gap-2">
                  {socialLinks.map((link) => {
                    const Icon = link.icon
                    return (
                      <a
                        key={link.label}
                        href={link.url!}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={link.label}
                        className={`flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/60 bg-white/70 text-slate-500 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md dark:border-slate-700/40 dark:bg-slate-900/70 dark:text-slate-400 ${link.hoverColor}`}
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200/40 pt-6 md:flex-row dark:border-slate-700/40">
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            &copy; {currentYear} {storeName}. {city}, {state}.
          </p>

          <div className="flex flex-col items-center gap-3 md:flex-row md:gap-4">
            {categorySlug && (
              <Link
                href={`https://paginalocal.com.br/${categorySlug}`}
                target="_blank"
                rel="noopener"
                className="text-xs text-slate-400 transition-colors hover:text-primary dark:text-slate-500"
              >
                Mais {category?.toLowerCase() || 'negócios'} na região
              </Link>
            )}

            <a
              href="https://paginalocal.com.br"
              target="_blank"
              rel="noopener"
              className="group inline-flex items-center gap-2 rounded-full border border-slate-200/60 bg-white/70 px-4 py-2 text-sm text-slate-500 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-white hover:shadow-md hover:shadow-primary/5 dark:border-slate-700/40 dark:bg-slate-900/70 dark:hover:border-primary/40"
            >
              <span>Criado por</span>
              <Image
                src="/assets/images/icon/favicon.ico"
                alt="Página Local - Criação de Sites para Negócios Locais"
                width={16}
                height={16}
                className="transition-transform duration-300 group-hover:scale-110"
              />
              <span className="font-semibold tracking-tight text-slate-900 dark:text-white">
                Página Local
              </span>
              <IconExternalLink className="h-3.5 w-3.5 text-slate-400 transition-all duration-300 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
