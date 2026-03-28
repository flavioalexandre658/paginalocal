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
    <div
      className="flex min-h-dvh items-center justify-center bg-white px-4 py-12"
      style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
    >
      <div className="w-full max-w-[440px]">
        {children}
      </div>
    </div>
  )
}
