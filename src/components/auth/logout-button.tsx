'use client'

import { useRouter } from 'next/navigation'
import { IconLogout, IconLoader2 } from '@tabler/icons-react'
import { signOut } from '@/lib/auth-client'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface LogoutButtonProps {
  showLabel?: boolean
  className?: string
}

export function LogoutButton({ showLabel = true, className }: LogoutButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleLogout() {
    setIsLoading(true)
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push('/entrar')
            router.refresh()
          },
        },
      })
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={cn(
        'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-slate-300 dark:hover:bg-red-950 dark:hover:text-red-400 disabled:opacity-50',
        className
      )}
    >
      {isLoading ? (
        <IconLoader2 className="h-4 w-4 animate-spin" />
      ) : (
        <IconLogout className="h-4 w-4" />
      )}
      {showLabel && <span className="hidden sm:inline">Sair</span>}
    </button>
  )
}
