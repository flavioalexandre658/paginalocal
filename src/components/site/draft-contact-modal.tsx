'use client'

import { useState } from 'react'
import { IconX, IconRocket, IconBell, IconCheck, IconLoader2 } from '@tabler/icons-react'
import { useAction } from 'next-safe-action/hooks'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { captureBlockedLeadAction } from '@/actions/leads/capture-blocked-lead.action'
import { PatternFormat } from 'react-number-format'

interface DraftContactModalProps {
  isOpen: boolean
  onClose: () => void
  storeName: string
  storeSlug: string
  storeId: string
  isOwner: boolean
  contactType: 'whatsapp' | 'phone'
}

const visitorFormSchema = z.object({
  name: z.string().min(2, 'Digite seu nome'),
  phone: z.string().min(14, 'Digite seu telefone'),
})

type VisitorFormData = z.infer<typeof visitorFormSchema>

export function DraftContactModal({
  isOpen,
  onClose,
  storeName,
  storeSlug,
  storeId,
  isOwner,
  contactType,
}: DraftContactModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { executeAsync: captureLead, isExecuting } = useAction(captureBlockedLeadAction)

  const form = useForm<VisitorFormData>({
    resolver: zodResolver(visitorFormSchema),
    defaultValues: { name: '', phone: '' },
  })

  async function onSubmit(data: VisitorFormData) {
    const phoneClean = data.phone.replace(/\D/g, '')

    const result = await captureLead({
      storeId,
      name: data.name,
      phone: phoneClean,
      source: contactType,
    })

    if (result?.data) {
      setIsSubmitted(true)
      toast.success('Dados enviados! O estabelecimento entrará em contato.')
    } else {
      toast.error('Erro ao enviar dados. Tente novamente.')
    }
  }

  function handleClose() {
    setIsSubmitted(false)
    form.reset()
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      <div
        onClick={handleClose}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in"
      />

      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 px-4">
        <div className={cn(
          'rounded-2xl border border-slate-200/60 bg-white p-6 shadow-2xl dark:border-slate-700/60 dark:bg-slate-900',
          'animate-scale-in'
        )}>
          <div className="mb-4 flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5">
              {isOwner ? (
                <IconRocket className="h-6 w-6 text-amber-600" />
              ) : (
                <IconBell className="h-6 w-6 text-amber-600" />
              )}
            </div>
            <button
              onClick={handleClose}
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
            >
              <IconX className="h-5 w-5" />
            </button>
          </div>

          {isOwner ? (
            <OwnerContent />
          ) : isSubmitted ? (
            <SuccessContent storeName={storeName} onClose={handleClose} />
          ) : (
            <VisitorContent
              storeName={storeName}
              contactType={contactType}
              form={form}
              onSubmit={onSubmit}
              isExecuting={isExecuting}
            />
          )}
        </div>
      </div>
    </>
  )
}

function OwnerContent() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
          Publique seu site!
        </h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Seu site está em modo rascunho. Ative seu plano para liberar os botões de contato e começar a receber clientes.
        </p>
      </div>

      <div className="rounded-xl border border-emerald-200/60 bg-emerald-50/50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
        <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
          Ao publicar você terá:
        </p>
        <ul className="mt-2 space-y-1.5 text-sm text-emerald-700 dark:text-emerald-300">
          <li className="flex items-start gap-2 text-left">
            <IconCheck className="mt-0.5 h-4 w-4 shrink-0" />
            <span>Botões de WhatsApp e Ligar funcionando</span>
          </li>
          <li className="flex items-start gap-2 text-left">
            <IconCheck className="mt-0.5 h-4 w-4 shrink-0" />
            <span>Notificações de tentativas de contato</span>
          </li>
          <li className="flex items-start gap-2 text-left">
            <IconCheck className="mt-0.5 h-4 w-4 shrink-0" />
            <span>Site indexado no Google</span>
          </li>
        </ul>
      </div>

      <div className="pt-2">
        <Button asChild className="w-full gap-2 shadow-lg shadow-primary/20">
          <Link href={`/planos`}>
            <IconRocket className="h-4 w-4" />
            Publicar Agora
          </Link>
        </Button>
      </div>
    </div>
  )
}

function VisitorContent({
  storeName,
  contactType,
  form,
  onSubmit,
  isExecuting,
}: {
  storeName: string
  contactType: 'whatsapp' | 'phone'
  form: ReturnType<typeof useForm<VisitorFormData>>
  onSubmit: (data: VisitorFormData) => void
  isExecuting: boolean
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
          {contactType === 'whatsapp' ? 'Falar no WhatsApp' : 'Ligar'} para {storeName}
        </h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Este negócio ainda está configurando o perfil. Deixe seu contato e avisaremos quando estiver disponível.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 dark:text-slate-300">Seu nome</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Como podemos te chamar?"
                    className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white"
                    {...field}
                  />
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
                <FormLabel className="text-slate-700 dark:text-slate-300">Seu telefone</FormLabel>
                <FormControl>
                  <PatternFormat
                    format="(##) #####-####"
                    mask="_"
                    value={field.value}
                    onValueChange={(values) => field.onChange(values.formattedValue)}
                    customInput={Input}
                    placeholder="(11) 99999-9999"
                    className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isExecuting}
            className="w-full gap-2 shadow-lg shadow-primary/20"
          >
            {isExecuting ? (
              <IconLoader2 className="h-4 w-4 animate-spin" />
            ) : (
              <IconBell className="h-4 w-4" />
            )}
            Me avise quando estiver disponível
          </Button>
        </form>
      </Form>
    </div>
  )
}

function SuccessContent({ storeName, onClose }: { storeName: string; onClose: () => void }) {
  return (
    <div className="space-y-4 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
        <IconCheck className="h-8 w-8 text-emerald-500" />
      </div>
      <div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
          Pronto!
        </h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Seus dados foram enviados para <strong>{storeName}</strong>. Eles entrarão em contato assim que possível.
        </p>
      </div>
      <Button onClick={onClose} className="w-full">
        Fechar
      </Button>
    </div>
  )
}
