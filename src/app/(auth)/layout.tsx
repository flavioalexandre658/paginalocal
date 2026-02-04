import { IconMapPin } from '@tabler/icons-react'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <div className="relative z-10 w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20">
            <IconMapPin className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Página Local
          </span>
        </Link>
        {children}
      </div>

      <p className="relative z-10 mt-8 text-center text-sm text-slate-400">
        Mais de <span className="font-semibold text-primary">2.000 negócios</span> já criaram sua presença digital
      </p>
    </div>
  )
}
