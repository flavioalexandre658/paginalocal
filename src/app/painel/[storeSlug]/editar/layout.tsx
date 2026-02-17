import { ReactNode } from 'react'
import { EditNav } from './_components/edit-nav'

interface LayoutProps {
  children: ReactNode
  params: Promise<{ storeSlug: string }>
}

export default async function EditarLayout({ children, params }: LayoutProps) {
  const { storeSlug } = await params

  return (
    <main className="container mx-auto px-4 py-6 sm:py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-3xl">
          Editar Site
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Personalize o conteúdo e aparência do seu site
        </p>
      </div>

      <EditNav storeSlug={storeSlug} />

      <div className="mt-5 rounded-2xl border border-slate-200/40 bg-white/70 p-4 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-900/70 dark:shadow-slate-900/50 sm:p-6">
        {children}
      </div>
    </main>
  )
}
