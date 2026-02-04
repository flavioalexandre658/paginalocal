'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { IconUser, IconMail, IconLock } from '@tabler/icons-react'
import { useSession } from '@/lib/auth-client'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { EnhancedButton } from '@/components/ui/enhanced-button'

const profileFormSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
})

type ProfileFormData = z.infer<typeof profileFormSchema>

export function ProfileTab() {
  const { data: session } = useSession()

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: session?.user?.name || '',
      email: session?.user?.email || '',
    },
  })

  async function onSubmit(data: ProfileFormData) {
    toast.success('Perfil atualizado!')
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Seu Perfil
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Informações da sua conta
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
              <IconUser className="h-8 w-8" />
            </div>
            <div>
              <p className="font-medium text-slate-900 dark:text-white">
                {session?.user?.name || 'Usuário'}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {session?.user?.email}
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <IconUser className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input className="pl-10" placeholder="Seu nome" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <IconMail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input className="pl-10" type="email" placeholder="seu@email.com" {...field} disabled />
                    </div>
                  </FormControl>
                  <FormDescription>
                    O email não pode ser alterado
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end border-t border-slate-200/60 pt-6 dark:border-slate-700/60">
            <EnhancedButton type="submit">
              Salvar Alterações
            </EnhancedButton>
          </div>
        </form>
      </Form>

      <div className="border-t border-slate-200/60 pt-6 dark:border-slate-700/60">
        <h3 className="mb-4 font-medium text-slate-900 dark:text-white">
          Alterar Senha
        </h3>
        <div className="max-w-md space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Senha atual
            </label>
            <div className="relative">
              <IconLock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input type="password" className="pl-10" placeholder="••••••••" />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Nova senha
            </label>
            <div className="relative">
              <IconLock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input type="password" className="pl-10" placeholder="••••••••" />
            </div>
          </div>
          <EnhancedButton variant="outline" size="sm">
            Atualizar Senha
          </EnhancedButton>
        </div>
      </div>
    </div>
  )
}
