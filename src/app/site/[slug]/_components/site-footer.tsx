import { IconMapPin, IconExternalLink } from '@tabler/icons-react'
import Image from 'next/image'

interface SiteFooterProps {
  storeName: string
  city: string
  state: string
}

export function SiteFooter({ storeName, city, state }: SiteFooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative border-t border-slate-200/60 pb-24 pt-8 md:py-10 dark:border-slate-800/60 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-100 via-white to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-900" />

      <div className="container relative mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Store Name with Icon */}
          <div className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 ring-1 ring-primary/20 transition-all duration-300 group-hover:ring-primary/30 group-hover:shadow-md group-hover:shadow-primary/10">
              <IconMapPin className="h-5 w-5 text-primary" />
            </div>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {storeName}
            </span>
          </div>

          {/* Location & Year */}
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            {city}, {state} · {currentYear}
          </p>

          {/* Powered By Link */}
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
    </footer>
  )
}
