'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { IconLoader2, IconAlertCircle, IconCircleCheck } from '@tabler/icons-react'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { PasswordInput } from '@/components/ui/password-input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const activateSchema = z
  .object({
    password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
    confirmPassword: z.string().min(1, 'Confirme sua senha'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

type ActivateFormData = z.infer<typeof activateSchema>

export function ActivateForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const form = useForm<ActivateFormData>({
    resolver: zodResolver(activateSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  if (!token) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <IconAlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <div className="space-y-2">
          <p className="font-medium">Link inválido</p>
          <p className="text-sm text-muted-foreground">
            Este link de ativação é inválido ou expirou. Entre em contato com
            o suporte.
          </p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <IconCircleCheck className="h-6 w-6 text-green-600" />
        </div>
        <div className="space-y-2">
          <p className="font-semibold text-slate-900">Senha criada com sucesso!</p>
          <p className="text-sm text-muted-foreground">
            Sua conta está ativa. Faça login para acessar o painel.
          </p>
        </div>
        <Button className="mt-2 w-full" onClick={() => router.push('/entrar')}>
          Ir para o login
        </Button>
      </div>
    )
  }

  async function handleSubmit(data: ActivateFormData) {
    setIsLoading(true)

    const res = await fetch('/api/auth/ativar-senha', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password: data.password }),
    })

    const json = await res.json()

    if (!res.ok) {
      toast.error(json.error || 'Erro ao ativar conta')
      setIsLoading(false)
      return
    }

    setSuccess(true)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Criar senha</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="••••••••"
                  autoComplete="new-password"
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
              <FormLabel>Confirmar senha</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <IconLoader2 className="animate-spin" />}
          Ativar minha conta
        </Button>
      </form>
    </Form>
  )
}
