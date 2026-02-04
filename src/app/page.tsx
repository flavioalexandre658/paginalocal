import Link from 'next/link'
import {
  IconRocket,
  IconDeviceMobile,
  IconSearch,
  IconBrandWhatsapp,
  IconMapPin,
  IconSparkles,
  IconChartBar,
  IconCheck,
  IconArrowRight,
} from '@tabler/icons-react'

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <header className="sticky top-0 z-50 border-b border-slate-200/40 bg-white/70 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-900/70">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-md shadow-primary/20">
              <IconMapPin className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
              Página Local
            </span>
          </Link>
          <nav className="flex items-center gap-3">
            <Link
              href="/entrar"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30"
            >
              Começar grátis
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <IconSparkles className="h-4 w-4" />
            Presença digital em 5 minutos
          </div>
          <h1 className="mx-auto max-w-4xl text-4xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-5xl lg:text-6xl">
            Seu negócio no Google
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              com zero esforço
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-500 dark:text-slate-400">
            Landing pages de alta conversão para negócios locais. SEO otimizado,
            integração com Google e conversão via WhatsApp.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/cadastro"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/40"
            >
              <IconRocket className="h-5 w-5" />
              Criar minha página
            </Link>
            <Link
              href="#como-funciona"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200/60 bg-white/50 px-8 py-4 text-base font-semibold text-slate-700 backdrop-blur-sm transition-all hover:bg-white hover:shadow-lg dark:border-slate-700/60 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Como funciona
              <IconArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <p className="mt-8 text-sm text-slate-400">
            Mais de <span className="font-semibold text-primary">2.000 negócios</span> já
            criaram sua presença digital
          </p>
        </div>
      </section>

      <section id="como-funciona" className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
              <IconCheck className="h-4 w-4" />
              Diferenciais
            </span>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-3xl lg:text-4xl">
              Por que o Página Local?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-500 dark:text-slate-400">
              Tudo que seu negócio precisa para aparecer no Google e converter clientes
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              icon={<IconSearch className="h-6 w-6" />}
              iconBg="bg-gradient-to-br from-primary/20 to-primary/5"
              iconColor="text-primary"
              title="SEO Local Automático"
              description="Apareça no Google quando alguém buscar pelo seu serviço na sua cidade. Schema LocalBusiness incluído."
            />
            <FeatureCard
              icon={<IconBrandWhatsapp className="h-6 w-6" />}
              iconBg="bg-gradient-to-br from-green-500/20 to-green-500/5"
              iconColor="text-green-500"
              title="Conversão via WhatsApp"
              description="Botão flutuante sempre visível. Transforme visitantes em clientes com um clique."
            />
            <FeatureCard
              icon={<IconDeviceMobile className="h-6 w-6" />}
              iconBg="bg-gradient-to-br from-violet-500/20 to-violet-500/5"
              iconColor="text-violet-500"
              title="Mobile First"
              description="99% do seu tráfego vem do celular. Sua página será ultra-rápida e otimizada."
            />
            <FeatureCard
              icon={<IconSparkles className="h-6 w-6" />}
              iconBg="bg-gradient-to-br from-amber-500/20 to-amber-500/5"
              iconColor="text-amber-500"
              title="Conteúdo com IA"
              description="Textos de marketing gerados automaticamente, otimizados para sua região."
            />
            <FeatureCard
              icon={<IconChartBar className="h-6 w-6" />}
              iconBg="bg-gradient-to-br from-rose-500/20 to-rose-500/5"
              iconColor="text-rose-500"
              title="Analytics de Conversão"
              description="Saiba quantos contatos sua página gerou. Métricas claras de retorno."
            />
            <FeatureCard
              icon={<IconMapPin className="h-6 w-6" />}
              iconBg="bg-gradient-to-br from-cyan-500/20 to-cyan-500/5"
              iconColor="text-cyan-500"
              title="Integração Google"
              description="Importe avaliações, fotos e horários direto do Google Meu Negócio."
            />
          </div>
        </div>
      </section>

      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-slate-200/40 bg-gradient-to-br from-primary/5 via-white to-primary/5 p-8 shadow-2xl shadow-primary/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-primary/10 dark:via-slate-900 dark:to-primary/10 md:p-12">
            <div className="text-center">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-3xl">
                Pronto para começar?
              </h2>
              <p className="mt-4 text-slate-500 dark:text-slate-400">
                Crie sua página em minutos. Sem código, sem complicação.
              </p>
              <Link
                href="/cadastro"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/40"
              >
                <IconRocket className="h-5 w-5" />
                Criar minha página grátis
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative border-t border-slate-200/40 py-8 dark:border-slate-700/40">
        <div className="container mx-auto px-4 text-center text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} Página Local. Todos os direitos reservados.</p>
        </div>
      </footer>
    </main>
  )
}

function FeatureCard({
  icon,
  iconBg,
  iconColor,
  title,
  description,
}: {
  icon: React.ReactNode
  iconBg: string
  iconColor: string
  title: string
  description: string
}) {
  return (
    <div className="group rounded-2xl border border-slate-200/40 bg-white/70 p-6 shadow-lg shadow-slate-200/20 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 dark:border-slate-700/40 dark:bg-slate-900/70 dark:shadow-slate-900/20">
      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl shadow-lg ${iconBg} ${iconColor}`}
      >
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  )
}
