import { IconMapPin } from '@tabler/icons-react'

interface SiteFooterProps {
  storeName: string
  city: string
  state: string
}

export function SiteFooter({ storeName, city, state }: SiteFooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-200 bg-white pb-24 pt-8 md:py-8 dark:border-slate-800 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
              <IconMapPin className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            </div>
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {storeName}
            </span>
          </div>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            {city}, {state} · {currentYear}
          </p>

          <a
            href="https://paginalocal.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            Criado com Página Local
          </a>
        </div>
      </div>
    </footer>
  )
}
