'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import {
  IconMail,
  IconBrandWhatsapp,
  IconClock,
  IconSend,
  IconLoader2,
  IconChevronRight,
} from '@tabler/icons-react'
import { trackWhatsAppClick } from '@/lib/tracking'
import { MarketingHeader } from '../_components/marketing-header'
import { MarketingFooter } from '../_components/marketing-footer'
import { PglButton } from '@/components/ui/pgl-button'

// ─── Schema ─────────────────────────────────────────────────────────────────

const contactFormSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  subject: z.string().min(5, 'Assunto deve ter pelo menos 5 caracteres'),
  message: z.string().min(20, 'Mensagem deve ter pelo menos 20 caracteres'),
})

type ContactFormData = z.infer<typeof contactFormSchema>

// ─── Props ───────────────────────────────────────────────────────────────────

interface ContatoPageClientProps {
  isLoggedIn?: boolean
  hasSubscription?: boolean
}

// ─── Shared input class ──────────────────────────────────────────────────────

const inputClass =
  'h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-black/80 placeholder:text-black/30 outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/15 transition-colors'

// ─── Page ────────────────────────────────────────────────────────────────────

export function ContatoPageClient({
  isLoggedIn = false,
  hasSubscription = false,
}: ContatoPageClientProps) {
  return (
    <main className="min-h-screen bg-white">
      <MarketingHeader isLoggedIn={isLoggedIn} hasSubscription={hasSubscription} />
      <HeroSection />
      <ContactSection />
      <FAQSection />
      <MarketingFooter />
    </main>
  )
}

// ─── Hero ────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-14">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6366f1]/[0.08]">
            <IconMail className="h-7 w-7 text-[#6366f1]" />
          </div>

          <h1
            className="text-3xl font-semibold tracking-tight text-black/80 md:text-4xl lg:text-[2.75rem] lg:leading-tight"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            Fale conosco
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-base text-black/55 md:text-lg">
            Estamos aqui para ajudar. Escolha a forma de contato que preferir ou
            envie uma mensagem pelo formulário.
          </p>
        </div>
      </div>
    </section>
  )
}

// ─── Contact Section ─────────────────────────────────────────────────────────

function ContactSection() {
  const whatsappHref = `https://wa.me/55${process.env.NEXT_PUBLIC_SUPPORT_NUMBER ?? '73981269904'}?text=${encodeURIComponent('Olá! Gostaria de tirar uma dúvida.')}`

  const cards = [
    {
      icon: IconBrandWhatsapp,
      title: 'WhatsApp',
      description: 'Atendimento rápido pelo WhatsApp',
      action: 'Iniciar conversa',
      href: whatsappHref,
      isWhatsapp: true,
    },
    {
      icon: IconMail,
      title: 'E-mail',
      description: 'contato@decolou.com',
      action: 'Enviar e-mail',
      href: 'mailto:contato@decolou.com',
      isWhatsapp: false,
    },
    {
      icon: IconClock,
      title: 'Horário',
      description: 'Seg a Sex, 9h às 18h',
      action: null,
      href: null,
      isWhatsapp: false,
    },
  ]

  return (
    <section className="pb-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-14">
          {/* Left: contact cards */}
          <div className="flex flex-col gap-4">
            {cards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl bg-black/[0.03] p-6"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#6366f1]/[0.08]">
                  <card.icon className="h-5 w-5 text-[#6366f1]" />
                </div>

                <h3 className="mb-1 text-base font-semibold text-black/80">
                  {card.title}
                </h3>
                <p className="mb-4 text-sm text-black/55">{card.description}</p>

                {card.action && card.href && (
                  <a
                    href={card.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={
                      card.isWhatsapp
                        ? () => trackWhatsAppClick('contato_whatsapp')
                        : undefined
                    }
                    className="inline-flex items-center gap-0.5 text-sm font-medium text-[#6366f1] transition-opacity hover:opacity-70"
                  >
                    {card.action}
                    <IconChevronRight className="h-4 w-4" />
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Right: form */}
          <div className="rounded-2xl border border-black/[0.08] bg-white p-6 md:p-8">
            <h2
              className="mb-1 text-xl font-semibold text-black/80"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              Envie uma mensagem
            </h2>
            <p className="mb-7 text-sm text-black/55">
              Preencha o formulário e retornaremos em até 24 horas.
            </p>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Form ────────────────────────────────────────────────────────────────────

function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: '', email: '', subject: '', message: '' },
  })

  async function onSubmit(data: ContactFormData) {
    try {
      // Replace with real server action when available
      await new Promise<void>((resolve) => setTimeout(resolve, 1500))
      console.log('Form data:', data)
      toast.success('Mensagem enviada com sucesso! Retornaremos em breve.')
      reset()
    } catch {
      toast.error('Erro ao enviar mensagem. Tente novamente.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Name + Email */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-black/55">Nome</label>
          <input
            {...register('name')}
            placeholder="Seu nome"
            className={inputClass}
          />
          {errors.name && (
            <span className="text-xs text-red-500">{errors.name.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-black/55">E-mail</label>
          <input
            {...register('email')}
            type="email"
            placeholder="seu@email.com"
            className={inputClass}
          />
          {errors.email && (
            <span className="text-xs text-red-500">{errors.email.message}</span>
          )}
        </div>
      </div>

      {/* Subject */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-black/55">Assunto</label>
        <input
          {...register('subject')}
          placeholder="Sobre o que deseja falar?"
          className={inputClass}
        />
        {errors.subject && (
          <span className="text-xs text-red-500">{errors.subject.message}</span>
        )}
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-black/55">Mensagem</label>
        <textarea
          {...register('message')}
          placeholder="Digite sua mensagem..."
          rows={5}
          className={[
            inputClass,
            'h-auto resize-none py-3 leading-relaxed',
          ].join(' ')}
        />
        {errors.message && (
          <span className="text-xs text-red-500">
            {errors.message.message}
          </span>
        )}
      </div>

      {/* Submit */}
      <PglButton
        type="submit"
        variant="dark"
        size="lg"
        loading={isSubmitting}
        className="w-full"
      >
        {!isSubmitting && <IconSend className="h-4 w-4" />}
        {isSubmitting ? 'Enviando...' : 'Enviar mensagem'}
      </PglButton>
    </form>
  )
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

function FAQSection() {
  const faqs = [
    {
      question: 'Quanto tempo leva para criar minha página?',
      answer:
        'Com nossa plataforma, você pode ter sua landing page pronta em menos de 5 minutos. Basta conectar seu Google Meu Negócio ou preencher as informações manualmente.',
    },
    {
      question: 'Preciso de conhecimento técnico?',
      answer:
        'Não! O Decolou foi desenvolvido para ser simples e intuitivo. Nossa IA cuida de todo o conteúdo e otimização SEO para você.',
    },
    {
      question: 'Posso usar meu próprio domínio?',
      answer:
        'Sim! Nos planos pagos você pode configurar seu domínio personalizado. Fornecemos todas as instruções para configuração.',
    },
    {
      question: 'Como funciona o suporte?',
      answer:
        'Oferecemos suporte via WhatsApp e e-mail em horário comercial. Para clientes Pro, também oferecemos suporte prioritário.',
    },
  ]

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-14">
        {/* Heading */}
        <div className="mb-10 text-center">
          <h2
            className="text-2xl font-semibold text-black/80 md:text-3xl"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            Perguntas frequentes
          </h2>
          <p className="mt-2 text-sm text-black/40">
            Não encontrou o que procura? Entre em contato diretamente.
          </p>
        </div>

        {/* Items */}
        <div className="mx-auto max-w-2xl space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl border border-black/[0.08] bg-white p-6"
            >
              <h3 className="mb-2 text-sm font-semibold text-black/80">
                {faq.question}
              </h3>
              <p className="text-sm leading-relaxed text-black/55">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
