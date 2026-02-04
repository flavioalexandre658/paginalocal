'use client'

import { useState } from 'react'
import { IconBrandGoogle, IconLoader2 } from '@tabler/icons-react'
import toast from 'react-hot-toast'

import { signIn } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'

export function SocialLoginButton() {
  const [isLoading, setIsLoading] = useState(false)

  async function handleGoogleLogin() {
    setIsLoading(true)

    const result = await signIn.social({
      provider: 'google',
      callbackURL: '/painel',
    })

    if (result.error) {
      toast.error(result.error.message || 'Erro ao entrar com Google')
      setIsLoading(false)
      return
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="h-12 w-full gap-3 border-slate-200/60 bg-white/50 text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md dark:border-slate-700/60 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:bg-slate-800"
      onClick={handleGoogleLogin}
      disabled={isLoading}
    >
      {isLoading ? (
        <IconLoader2 className="h-5 w-5 animate-spin" />
      ) : (
        <IconBrandGoogle className="h-5 w-5" />
      )}
      Continuar com Google
    </Button>
  )
}
