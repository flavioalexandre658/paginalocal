'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { IconLoader2, IconCheck } from '@tabler/icons-react'
import toast from 'react-hot-toast'

import { requestPasswordReset } from '@/lib/auth-client'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const recoverSchema = z.object({
  email: z.string().email('Email invalido'),
})

type RecoverFormData = z.infer<typeof recoverSchema>

const inputClasses = "h-12 w-full rounded-full border border-black/10 bg-white px-5 text-sm text-black/80 outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-black/30 focus:border-black/30 focus:ring-1 focus:ring-black/10"

export function RecoverForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)

  const form = useForm<RecoverFormData>({
    resolver: zodResolver(recoverSchema),
    defaultValues: { email: '' },
  })

  async function handleSubmit(data: RecoverFormData) {
    setIsLoading(true)
    const result = await requestPasswordReset({
      email: data.email,
      redirectTo: '/redefinir-senha',
    })

    if (result.error) {
      toast.error(result.error.message || 'Erro ao enviar email')
      setIsLoading(false)
      return
    }

    setIsEmailSent(true)
    setIsLoading(false)
  }

  if (isEmailSent) {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-emerald-500/10">
          <IconCheck className="size-6 text-emerald-600" />
        </div>
        <p className="text-sm font-medium text-black/80">Email enviado!</p>
        <p className="text-sm text-black/50">
          Se o email estiver cadastrado, voce recebera um link para redefinir sua senha.
        </p>
      </div>
    )
  }

  return (
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

        <button
          type="submit"
          disabled={isLoading}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-black/80 text-sm font-medium text-white/75 shadow-button-dark transition-[background,color,box-shadow] duration-150 hover:text-white hover:shadow-button-dark disabled:opacity-50"
        >
          {isLoading && <IconLoader2 className="size-4 animate-spin" />}
          Enviar link de recuperacao
        </button>
      </form>
    </Form>
  )
}
