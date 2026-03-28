'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { IconLoader2, IconAlertCircle } from '@tabler/icons-react'
import toast from 'react-hot-toast'

import { resetPassword } from '@/lib/auth-client'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const resetSchema = z
  .object({
    password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
    confirmPassword: z.string().min(1, 'Confirme sua senha'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas nao coincidem',
    path: ['confirmPassword'],
  })

type ResetFormData = z.infer<typeof resetSchema>

const inputClasses = "h-12 w-full rounded-full border border-black/10 bg-white px-5 text-sm text-black/80 outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-black/30 focus:border-black/30 focus:ring-1 focus:ring-black/10"

export function ResetForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  if (!token) {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-red-500/10">
          <IconAlertCircle className="size-6 text-red-500" />
        </div>
        <p className="text-sm font-medium text-black/80">Link invalido</p>
        <p className="text-sm text-black/50">
          Este link de recuperacao e invalido ou expirou. Solicite um novo link.
        </p>
      </div>
    )
  }

  async function handleSubmit(data: ResetFormData) {
    setIsLoading(true)
    const result = await resetPassword({
      newPassword: data.password,
      token: token as string,
    })

    if (result.error) {
      toast.error(result.error.message || 'Erro ao redefinir senha')
      setIsLoading(false)
      return
    }

    toast.success('Senha redefinida com sucesso!')
    router.push('/entrar')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Nova senha</FormLabel>
              <FormControl>
                <input
                  type="password"
                  placeholder="Nova senha"
                  autoComplete="new-password"
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
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Confirmar senha</FormLabel>
              <FormControl>
                <input
                  type="password"
                  placeholder="Confirmar nova senha"
                  autoComplete="new-password"
                  className={inputClasses}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-black/80 text-sm font-medium text-white/75 shadow-button-dark transition-[background,color,box-shadow] duration-150 hover:text-white hover:shadow-button-dark disabled:opacity-50"
        >
          {isLoading && <IconLoader2 className="size-4 animate-spin" />}
          Redefinir senha
        </button>
      </form>
    </Form>
  )
}
