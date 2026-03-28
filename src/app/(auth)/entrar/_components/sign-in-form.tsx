'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { IconLoader2, IconArrowRight } from '@tabler/icons-react'
import toast from 'react-hot-toast'

import { signIn } from '@/lib/auth-client'
import { SocialLoginButton } from '@/components/auth/social-login-button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const signInSchema = z.object({
  email: z.string().email('Email invalido'),
  password: z.string().min(1, 'Senha e obrigatoria'),
})

type SignInFormData = z.infer<typeof signInSchema>

const inputClasses = "h-12 w-full rounded-full border border-black/10 bg-white px-5 text-sm text-black/80 outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-black/30 focus:border-black/30 focus:ring-1 focus:ring-black/10"

export function SignInForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  })

  async function handleSubmit(data: SignInFormData) {
    setIsLoading(true)
    const result = await signIn.email({ email: data.email, password: data.password })

    if (result.error) {
      toast.error(result.error.message || 'Credenciais invalidas')
      setIsLoading(false)
      return
    }

    toast.success('Login realizado com sucesso!')
    router.push('/painel')
  }

  return (
    <div className="space-y-5">
      {/* Google */}
      <SocialLoginButton />

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-black/[0.06]" />
        <span className="text-xs text-black/30">or</span>
        <div className="h-px flex-1 bg-black/[0.06]" />
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Email</FormLabel>
                <FormControl>
                  <input
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    className={inputClasses}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Senha</FormLabel>
                <FormControl>
                  <input
                    type="password"
                    placeholder="Senha"
                    autoComplete="current-password"
                    className={inputClasses}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Forgot password */}
          <div className="flex justify-end">
            <Link
              href="/recuperar-senha"
              className="text-xs font-medium text-black/40 transition-[color] duration-150 hover:text-black/80"
            >
              Esqueceu a senha?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-black/80 text-sm font-medium text-white/75 shadow-button-dark transition-[background,color,box-shadow] duration-150 hover:text-white hover:shadow-button-dark disabled:opacity-50"
          >
            {isLoading ? (
              <IconLoader2 className="size-4 animate-spin" />
            ) : null}
            Continuar
            {!isLoading && <IconArrowRight className="size-4" />}
          </button>
        </form>
      </Form>
    </div>
  )
}
