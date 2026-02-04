'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { IconLoader2, IconCheck } from '@tabler/icons-react'
import toast from 'react-hot-toast'

import { requestPasswordReset } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const recoverSchema = z.object({
  email: z.string().email('Email inválido'),
})

type RecoverFormData = z.infer<typeof recoverSchema>

export function RecoverForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)

  const form = useForm<RecoverFormData>({
    resolver: zodResolver(recoverSchema),
    defaultValues: {
      email: '',
    },
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
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <IconCheck className="h-6 w-6 text-primary" />
        </div>
        <div className="space-y-2">
          <p className="font-medium">Email enviado!</p>
          <p className="text-sm text-muted-foreground">
            Se o email estiver cadastrado, você receberá um link para redefinir
            sua senha.
          </p>
        </div>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <IconLoader2 className="animate-spin" />}
          Enviar link de recuperação
        </Button>
      </form>
    </Form>
  )
}
