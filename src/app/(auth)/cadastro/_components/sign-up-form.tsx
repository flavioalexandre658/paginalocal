'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { IconLoader2, IconMail, IconArrowLeft } from '@tabler/icons-react'
import { PatternFormat } from 'react-number-format'
import toast from 'react-hot-toast'

import { signUp } from '@/lib/auth-client'
import { updateUserPhoneAction } from '@/actions/users/update-user-phone.action'
import { SocialLoginButton } from '@/components/auth/social-login-button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const signUpSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email invalido'),
  phone: z.string().min(14, 'Telefone invalido'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
})

type SignUpFormData = z.infer<typeof signUpSchema>

const inputClasses = "h-12 w-full rounded-full border border-black/10 bg-white px-5 text-sm text-black/80 outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-black/30 focus:border-black/30 focus:ring-1 focus:ring-black/10"

export function SignUpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isTransferFlow = searchParams.get('q') === 'transferir'
  const planParam = searchParams.get('p')
  const storeSlugParam = searchParams.get('s')
  const hasTransferPlan = isTransferFlow && !!planParam
  const [isLoading, setIsLoading] = useState(false)
  const [showEmailForm, setShowEmailForm] = useState(false)

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', email: '', phone: '', password: '' },
  })

  async function handleSubmit(data: SignUpFormData) {
    setIsLoading(true)

    const result = await signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
    })

    if (result.error) {
      toast.error(result.error.message || 'Erro ao criar conta')
      setIsLoading(false)
      return
    }

    if (data.phone) {
      await updateUserPhoneAction({ phone: data.phone })
    }

    toast.success('Conta criada com sucesso!')

    const slugQuery = storeSlugParam ? `&s=${storeSlugParam}` : ''
    const redirectUrl = hasTransferPlan
      ? `/cadastro/plano-transferencia?p=${planParam}${slugQuery}`
      : isTransferFlow
        ? '/cadastro/aguardando-transferencia'
        : '/painel'

    router.push(redirectUrl)
  }

  /* ── Initial view: social buttons + email option ── */
  if (!showEmailForm) {
    return (
      <div className="space-y-3">
        <SocialLoginButton label="Cadastrar com Google" />

        <button
          type="button"
          onClick={() => setShowEmailForm(true)}
          className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-black/10 bg-white text-sm font-medium text-black/80 transition-[background,border-color,box-shadow] duration-150 hover:border-black/20 hover:shadow-sm"
        >
          <IconMail className="size-5" />
          Cadastrar com email
        </button>

        {/* Terms */}
        <p className="pt-4 text-xs text-black/40 leading-relaxed">
          Ao se cadastrar, voce concorda com a{' '}
          <Link href="/politica-de-privacidade" className="underline decoration-black/20 underline-offset-2 hover:text-black/80">
            Politica de Privacidade
          </Link>
          {' '}e os{' '}
          <Link href="/termos-de-uso" className="underline decoration-black/20 underline-offset-2 hover:text-black/80">
            Termos de Uso
          </Link>.
        </p>
      </div>
    )
  }

  /* ── Email form view ── */
  return (
    <div className="space-y-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Nome</FormLabel>
                <FormControl>
                  <input placeholder="Nome completo" autoComplete="name" className={inputClasses} {...field} />
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
                <FormLabel className="sr-only">Email</FormLabel>
                <FormControl>
                  <input type="email" placeholder="Email" autoComplete="email" className={inputClasses} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Telefone</FormLabel>
                <FormControl>
                  <PatternFormat
                    format="(##) #####-####"
                    mask="_"
                    value={field.value}
                    onValueChange={(values) => field.onChange(values.formattedValue)}
                    placeholder="WhatsApp (00) 00000-0000"
                    autoComplete="tel"
                    className={inputClasses}
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
                  <input type="password" placeholder="Senha (min. 8 caracteres)" autoComplete="new-password" className={inputClasses} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-black/80 text-sm font-medium text-white/75 shadow-button-dark transition-[background,color,box-shadow] duration-150 hover:text-white hover:shadow-button-dark disabled:opacity-50"
          >
            {isLoading && <IconLoader2 className="size-4 animate-spin" />}
            Cadastrar com email
          </button>
        </form>
      </Form>

      {/* Go back */}
      <button
        type="button"
        onClick={() => setShowEmailForm(false)}
        className="flex w-full items-center justify-center gap-1.5 text-sm font-medium text-black/40 transition-[color] duration-150 hover:text-black/80"
      >
        <IconArrowLeft className="size-3.5" />
        Voltar
      </button>

      {/* Terms */}
      <p className="text-xs text-black/40 leading-relaxed">
        Ao se cadastrar, voce concorda com a{' '}
        <Link href="/politica-de-privacidade" className="underline decoration-black/20 underline-offset-2 hover:text-black/80">
          Politica de Privacidade
        </Link>
        {' '}e os{' '}
        <Link href="/termos-de-uso" className="underline decoration-black/20 underline-offset-2 hover:text-black/80">
          Termos de Uso
        </Link>.
      </p>
    </div>
  )
}
