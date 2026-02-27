'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { IconLoader2 } from '@tabler/icons-react'
import toast from 'react-hot-toast'

import { signIn } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const signInSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

type SignInFormData = z.infer<typeof signInSchema>

export function SignInForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function handleSubmit(data: SignInFormData) {
    setIsLoading(true)

    const result = await signIn.email({
      email: data.email,
      password: data.password,
    })

    if (result.error) {
      toast.error(result.error.message || 'Credenciais inválidas')
      setIsLoading(false)
      return
    }

    toast.success('Login realizado com sucesso!')
    router.push('/painel')
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 dark:text-slate-300">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    autoComplete="email"
                    className="h-11 border-slate-200/60 bg-white/50 transition-all placeholder:text-slate-400 focus:border-primary/30 focus:bg-white focus:ring-2 focus:ring-primary/10 dark:border-slate-700/60 dark:bg-slate-800/50"
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
                <div className="flex items-center justify-between">
                  <FormLabel className="text-slate-700 dark:text-slate-300">
                    Senha
                  </FormLabel>
                  <Link
                    href="/recuperar-senha"
                    className="text-sm text-slate-500 transition-colors hover:text-primary dark:text-slate-400"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
                <FormControl>
                  <PasswordInput
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="h-11 border-slate-200/60 bg-white/50 transition-all placeholder:text-slate-400 focus:border-primary/30 focus:bg-white focus:ring-2 focus:ring-primary/10 dark:border-slate-700/60 dark:bg-slate-800/50"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="h-11 w-full gap-2 shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
            disabled={isLoading}
          >
            {isLoading && <IconLoader2 className="h-4 w-4 animate-spin" />}
            Entrar
          </Button>
        </form>
      </Form>
    </div>
  )
}
