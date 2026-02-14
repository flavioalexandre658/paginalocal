import { Metadata } from 'next'
import { Logo } from '@/components/shared/logo'

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

      <div className="relative z-10 w-full">
        <div className="mb-8 flex justify-center">
          <Logo size="lg" href="/" />
        </div>
        <div style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>{children}</div>
      </div>


    </div>
  )
}
