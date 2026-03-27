import { IconUsers, IconBrandWhatsapp, IconPhone, IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";

interface Props {
  params: Promise<{ storeSlug: string }>;
}

export default async function ContatosPage({ params }: Props) {
  const { storeSlug } = await params;

  return (
    <div className="relative min-h-full">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent" />

      <div className="relative z-10 px-6 py-8 lg:px-10 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Contatos
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Visualize e gerencie os leads e contatos do seu site.
        </p>

        {/* Coming soon card */}
        <div className="mt-8 rounded-2xl border border-slate-200/60 bg-white/70 p-10 shadow-lg shadow-slate-200/20 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/70 dark:shadow-slate-900/20">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 shadow-lg shadow-blue-500/10">
              <IconUsers className="h-8 w-8 text-blue-500" />
            </div>

            <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Em breve
            </h2>
            <p className="mt-3 max-w-sm text-sm text-slate-500 dark:text-slate-400">
              Voce podera visualizar todos os leads que entraram em contato pelo WhatsApp, telefone e formulario do site.
            </p>

            {/* Preview features */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
              <div className="group flex gap-3 rounded-xl border border-transparent bg-white/50 p-4 transition-all hover:border-blue-200/60 hover:bg-white/80 hover:shadow-lg hover:shadow-blue-500/5 dark:bg-slate-900/50 dark:hover:border-blue-800/40 dark:hover:bg-slate-900/80">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 text-emerald-500 transition-transform group-hover:scale-110">
                  <IconBrandWhatsapp className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">WhatsApp</h4>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Leads via WhatsApp</p>
                </div>
              </div>
              <div className="group flex gap-3 rounded-xl border border-transparent bg-white/50 p-4 transition-all hover:border-blue-200/60 hover:bg-white/80 hover:shadow-lg hover:shadow-blue-500/5 dark:bg-slate-900/50 dark:hover:border-blue-800/40 dark:hover:bg-slate-900/80">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 text-blue-500 transition-transform group-hover:scale-110">
                  <IconPhone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Telefone</h4>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Leads via ligacao</p>
                </div>
              </div>
            </div>

            <Link
              href={`/negocio/${storeSlug}`}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/40"
            >
              Voltar ao inicio
              <IconArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
