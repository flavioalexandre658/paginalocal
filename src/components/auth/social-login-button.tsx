'use client'

import { useState } from 'react'
import { IconBrandGoogle, IconLoader2 } from '@tabler/icons-react'
import toast from 'react-hot-toast'

import { signIn } from '@/lib/auth-client'

interface SocialLoginButtonProps {
  callbackURL?: string
  label?: string
}

export function SocialLoginButton({ callbackURL = '/painel', label = 'Continuar com Google' }: SocialLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleGoogleLogin() {
    setIsLoading(true)
    const result = await signIn.social({ provider: 'google', callbackURL })

    if (result.error) {
      toast.error(result.error.message || 'Erro ao entrar com Google')
      setIsLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={isLoading}
      className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-black/10 bg-white text-sm font-medium text-black/80 transition-[background,border-color,box-shadow] duration-150 hover:border-black/20 hover:shadow-sm disabled:opacity-50"
    >
      {isLoading ? (
        <IconLoader2 className="size-5 animate-spin text-black/40" />
      ) : (
        <IconBrandGoogle className="size-5" />
      )}
      {label}
    </button>
  )
}
