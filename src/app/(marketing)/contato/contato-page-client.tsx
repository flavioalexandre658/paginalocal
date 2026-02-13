'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import {
  IconMail,
  IconBrandWhatsapp,
  IconClock,
  IconSend,
  IconMessageCircle,
  IconLoader2,
} from '@tabler/icons-react'
import { MarketingHeader } from '../_components/marketing-header'
import { MarketingFooter } from '../_components/marketing-footer'
import { Breadcrumb } from '@/components/shared/breadcrumb'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

const revealVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } 
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
}

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } 
  }
}

function ScrollReveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={revealVariants}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const contactFormSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  subject: z.string().min(5, 'Assunto deve ter pelo menos 5 caracteres'),
  message: z.string().min(20, 'Mensagem deve ter pelo menos 20 caracteres'),
})

type ContactFormData = z.infer<typeof contactFormSchema>

interface ContatoPageClientProps {
  isLoggedIn?: boolean
  hasSubscription?: boolean
}

export function ContatoPageClient({ isLoggedIn = false, hasSubscription = false }: ContatoPageClientProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <MarketingHeader isLoggedIn={isLoggedIn} hasSubscription={hasSubscription} />
      <Breadcrumb items={[{ label: 'Contato' }]} />
      <HeroSection />
      <ContactSection />
      <FAQSection />
      <MarketingFooter />
    </main>
  )
}

function HeroSection() {
  return (
    <section className="relative py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-lg shadow-primary/10">
            <IconMessageCircle className="h-8 w-8" />
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-4xl lg:text-5xl">
            Fale conosco
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500 dark:text-slate-400">
            Estamos aqui para ajudar. Escolha a forma de contato que preferir.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

function ContactSection() {
  const contactCards = [
    {
      icon: IconBrandWhatsapp,
      title: 'WhatsApp',
      description: 'Atendimento rápido pelo WhatsApp',
      action: 'Iniciar conversa',
      href: `https://wa.me/55${process.env.NEXT_PUBLIC_SUPPORT_NUMBER || '73981269904'}?text=${encodeURIComponent('Olá! Gostaria de tirar uma dúvida.')}`,
      color: 'from-emerald-500/20 to-emerald-500/5',
      iconColor: 'text-emerald-500',
    },
    {
      icon: IconMail,
      title: 'E-mail',
      description: 'contato@paginalocal.com.br',
      action: 'Enviar e-mail',
      href: 'mailto:contato@paginalocal.com.br',
      color: 'from-blue-500/20 to-blue-500/5',
      iconColor: 'text-blue-500',
    },
    {
      icon: IconClock,
      title: 'Horário',
      description: 'Seg a Sex, 9h às 18h',
      action: null,
      href: null,
      color: 'from-amber-500/20 to-amber-500/5',
      iconColor: 'text-amber-500',
    },
  ]

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <section className="relative pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="mx-auto mb-12 grid max-w-4xl gap-6 md:grid-cols-3"
        >
          {contactCards.map((card) => (
            <motion.div
              key={card.title}
              variants={staggerItem}
              className="rounded-2xl border border-slate-200/40 bg-white/70 p-6 shadow-lg shadow-slate-200/20 backdrop-blur-sm dark:border-slate-700/40 dark:bg-slate-900/70"
            >
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${card.color} ${card.iconColor}`}>
                <card.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">
                {card.title}
              </h3>
              <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
                {card.description}
              </p>
              {card.action && card.href && (
                <a
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-primary transition-colors hover:text-primary/80"
                >
                  {card.action}
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              )}
            </motion.div>
          ))}
        </motion.div>

        <ScrollReveal>
          <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200/60 bg-white/70 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-900/70 dark:shadow-slate-900/50 md:p-12">
            <h2 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">
              Envie uma mensagem
            </h2>
            <p className="mb-8 text-slate-500 dark:text-slate-400">
              Preencha o formulário abaixo e retornaremos em até 24 horas.
            </p>
            <ContactForm />
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

function ContactForm() {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  })

  const isSubmitting = form.formState.isSubmitting

  async function onSubmit(data: ContactFormData) {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success('Mensagem enviada com sucesso! Retornaremos em breve.')
      form.reset()
      
      console.log('Form data:', data)
    } catch {
      toast.error('Erro ao enviar mensagem. Tente novamente.')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Seu nome" {...field} />
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
                  <Input type="email" placeholder="seu@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assunto</FormLabel>
              <FormControl>
                <Input placeholder="Sobre o que deseja falar?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mensagem</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Digite sua mensagem..."
                  className="min-h-32 resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full gap-2 py-6 text-base shadow-lg shadow-primary/20"
        >
          {isSubmitting ? (
            <>
              <IconLoader2 className="h-5 w-5 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <IconSend className="h-5 w-5" />
              Enviar mensagem
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}

function FAQSection() {
  const faqs = [
    {
      question: 'Quanto tempo leva para criar minha página?',
      answer: 'Com nossa plataforma, você pode ter sua landing page pronta em menos de 5 minutos. Basta conectar seu Google Meu Negócio ou preencher as informações manualmente.',
    },
    {
      question: 'Preciso de conhecimento técnico?',
      answer: 'Não! O Página Local foi desenvolvido para ser simples e intuitivo. Nossa IA cuida de todo o conteúdo e otimização SEO para você.',
    },
    {
      question: 'Posso usar meu próprio domínio?',
      answer: 'Sim! Nos planos pagos você pode configurar seu domínio personalizado. Fornecemos todas as instruções para configuração.',
    },
    {
      question: 'Como funciona o suporte?',
      answer: 'Oferecemos suporte via WhatsApp e e-mail em horário comercial. Para clientes Pro, também oferecemos suporte prioritário.',
    },
  ]

  return (
    <section className="relative py-16">
      <div className="container mx-auto px-4">
        <ScrollReveal className="mb-12 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-3xl">
            Perguntas frequentes
          </h2>
        </ScrollReveal>

        <ScrollReveal>
          <div className="mx-auto max-w-2xl space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="rounded-xl border border-slate-200/40 bg-white/70 p-6 backdrop-blur-sm dark:border-slate-700/40 dark:bg-slate-900/70"
              >
                <h3 className="mb-2 font-semibold text-slate-900 dark:text-white">
                  {faq.question}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
