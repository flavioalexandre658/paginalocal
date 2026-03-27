"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import {
  IconWorld,
  IconChevronRight,
  IconSparkles,
  IconDeviceMobile,
  IconDeviceDesktop,
  IconBrandWhatsapp,
  IconPhone,
  IconCircleCheck,
  IconCircleDashed,
  IconEye,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { getStoreDashboardAction } from "@/actions/stores/get-store-dashboard.action";

interface Props {
  storeId: string;
  storeName: string;
  storeSlug: string;
  isActive: boolean;
  customDomain: string | null;
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

const DOMAIN = process.env.NEXT_PUBLIC_MAIN_DOMAIN ?? "paginalocal.com.br";

export function NegocioHomeContent({ storeId, storeName, storeSlug, isActive, customDomain }: Props) {
  const router = useRouter();
  const { executeAsync, result } = useAction(getStoreDashboardAction);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    executeAsync({ storeSlug }).then(() => setLoaded(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeSlug]);

  const data = result?.data;
  const siteUrl = customDomain ? `https://${customDomain}` : `https://${storeSlug}.${DOMAIN}`;
  const displayUrl = customDomain || `${storeSlug}.${DOMAIN}`;

  const actions = [
    { label: "Configurar dominio personalizado", done: !!customDomain, href: `/negocio/${storeSlug}/site` },
    { label: "Adicionar um contato", done: false, href: `/negocio/${storeSlug}/contatos` },
    { label: "Publicar site", done: isActive, href: `/negocio/${storeSlug}/site` },
  ];

  return (
    <div className="relative min-h-full">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <div className="relative z-10 px-6 py-8 lg:px-10 max-w-[1100px] mx-auto">
        {/* Greeting */}
        <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white leading-tight">
          {getGreeting()},
          <br />
          <span className="font-normal">bem-vindo ao </span>
          <span className="text-primary font-bold">Pagina Local</span>
        </h1>

        {/* Main grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* Site preview card */}
          <div className="rounded-2xl border border-slate-200/60 bg-white/70 shadow-lg shadow-slate-200/20 backdrop-blur-sm overflow-hidden dark:border-slate-700/60 dark:bg-slate-900/70 dark:shadow-slate-900/20 transition-all duration-500 hover:shadow-xl hover:shadow-slate-200/30 dark:hover:shadow-slate-900/30">
            {/* URL bar */}
            <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-slate-200/40 dark:border-slate-700/40">
              <div className="flex items-center gap-2.5 min-w-0">
                <IconWorld className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="text-[13px] truncate text-slate-500 dark:text-slate-400">{displayUrl}</span>
                <span className={cn(
                  "flex items-center gap-1.5 shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                  isActive
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400",
                )}>
                  <span className={cn("h-1.5 w-1.5 rounded-full", isActive ? "bg-emerald-500 animate-pulse" : "bg-amber-500")} />
                  {isActive ? "Publicado" : "Rascunho"}
                </span>
              </div>
              <button
                onClick={() => router.push(`/negocio/${storeSlug}/site`)}
                className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-slate-200/60 bg-white/50 px-3.5 py-1.5 text-[12px] font-semibold text-slate-700 backdrop-blur-sm transition-all hover:bg-white hover:shadow-md dark:border-slate-700/60 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Editar site
              </button>
            </div>

            <SitePreviewIframe siteUrl={siteUrl} storeName={storeName} />
          </div>

          {/* Get Started card */}
          <div className="rounded-2xl border border-slate-200/60 bg-white/70 shadow-lg shadow-slate-200/20 backdrop-blur-sm self-start dark:border-slate-700/60 dark:bg-slate-900/70 dark:shadow-slate-900/20 transition-all duration-500 hover:shadow-xl">
            <div className="flex items-center gap-2.5 px-5 pt-5 pb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 text-amber-500 shadow-lg shadow-amber-500/10">
                <IconSparkles className="h-4 w-4" />
              </div>
              <span className="text-[15px] font-semibold text-slate-900 dark:text-white">Comecar</span>
            </div>

            <div className="px-3 pb-3">
              {actions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => router.push(action.href)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/60"
                >
                  {action.done ? (
                    <IconCircleCheck className="h-[18px] w-[18px] text-emerald-500 shrink-0" />
                  ) : (
                    <IconCircleDashed className="h-[18px] w-[18px] text-slate-300 dark:text-slate-600 shrink-0" />
                  )}
                  <span className={cn(
                    "flex-1 text-[14px] font-medium",
                    action.done ? "text-slate-400 dark:text-slate-500" : "text-slate-700 dark:text-slate-200",
                  )}>
                    {action.label}
                  </span>
                  <IconChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-600 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Data cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DataCard icon={<IconPhone className="h-4 w-4" />} iconColor="blue" title="Ultimos contatos" loaded={loaded}>
            {data?.recentLeads && data.recentLeads.length > 0 ? (
              data.recentLeads.slice(0, 5).map((lead: { id: string; name: string | null; source: string; createdAt: Date }) => (
                <DataRow key={lead.id}>
                  {lead.source === "whatsapp" ? (
                    <IconBrandWhatsapp className="h-4 w-4 text-emerald-500 shrink-0" />
                  ) : (
                    <IconPhone className="h-4 w-4 text-blue-500 shrink-0" />
                  )}
                  <span className="flex-1 truncate text-[13px] text-slate-700 dark:text-slate-300">{lead.name || "Sem nome"}</span>
                  <span className="text-[11px] text-slate-400 shrink-0">
                    {new Date(lead.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                  </span>
                </DataRow>
              ))
            ) : (
              <EmptyState icon={<IconPhone className="h-5 w-5" />} text="Nenhum contato ainda" />
            )}
          </DataCard>

          <DataCard icon={<IconEye className="h-4 w-4" />} iconColor="purple" title="Ultimas visualizacoes" loaded={loaded}>
            {data?.recentPageviews && data.recentPageviews.length > 0 ? (
              data.recentPageviews.slice(0, 5).map((pv: { id: string; device: string | null; referrer: string | null; createdAt: Date }) => (
                <DataRow key={pv.id}>
                  {pv.device === "mobile" ? (
                    <IconDeviceMobile className="h-4 w-4 text-slate-400 shrink-0" />
                  ) : (
                    <IconDeviceDesktop className="h-4 w-4 text-slate-400 shrink-0" />
                  )}
                  <span className="flex-1 truncate text-[13px] text-slate-700 dark:text-slate-300">{getReferrerLabel(pv.referrer)}</span>
                  <span className="text-[11px] text-slate-400 shrink-0">
                    {new Date(pv.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                  </span>
                </DataRow>
              ))
            ) : (
              <EmptyState icon={<IconEye className="h-5 w-5" />} text="Nenhuma visualizacao ainda" />
            )}
          </DataCard>

          <DataCard icon={<IconSparkles className="h-4 w-4" />} iconColor="amber" title="Dicas" loaded={loaded}>
            {data?.dynamicTips && data.dynamicTips.length > 0 ? (
              data.dynamicTips.slice(0, 3).map((tip: { id: string; title: string; actionUrl?: string | null }) => (
                <button
                  key={tip.id}
                  onClick={() => tip.actionUrl && router.push(tip.actionUrl)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-all hover:bg-slate-100/60 dark:hover:bg-slate-800/60"
                >
                  <span className="text-[13px] text-slate-700 dark:text-slate-300">{tip.title}</span>
                  <IconChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-600 shrink-0" />
                </button>
              ))
            ) : (
              <EmptyState icon={<IconSparkles className="h-5 w-5" />} text="Tudo certo por aqui!" />
            )}
          </DataCard>
        </div>
      </div>
    </div>
  );
}

function SitePreviewIframe({ siteUrl, storeName }: { siteUrl: string; storeName: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState<{ renderWidth: number; scale: number; height: number } | null>(null);
  const [frameLoaded, setFrameLoaded] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    function calc() {
      const cw = el!.offsetWidth;
      const isMobile = cw < 500;
      const renderW = isMobile ? 390 : 1440;
      const sc = cw / renderW;
      setDims({ renderWidth: renderW, scale: sc, height: Math.ceil((isMobile ? 844 : 900) * sc) });
    }
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900"
      style={{ height: dims?.height ?? 300 }}
    >
      {!frameLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
          <Skeleton className="h-8 w-48 rounded-lg" />
          <Skeleton className="h-4 w-32 rounded-md" />
        </div>
      )}
      {dims && (
        <iframe
          src={siteUrl}
          title={`Preview de ${storeName}`}
          className="pointer-events-none"
          style={{
            width: dims.renderWidth,
            height: dims.renderWidth < 500 ? 844 : 900,
            transform: `scale(${dims.scale})`,
            transformOrigin: "top left",
            border: "none",
            display: "block",
            opacity: frameLoaded ? 1 : 0,
            transition: "opacity 300ms ease",
          }}
          onLoad={() => setFrameLoaded(true)}
          sandbox="allow-scripts allow-same-origin"
          loading="lazy"
        />
      )}
    </div>
  );
}

const ICON_COLORS = {
  blue: "from-blue-500/20 to-blue-500/5 text-blue-500",
  purple: "from-purple-500/20 to-purple-500/5 text-purple-500",
  amber: "from-amber-500/20 to-amber-500/5 text-amber-500",
  emerald: "from-emerald-500/20 to-emerald-500/5 text-emerald-500",
};

function DataCard({ icon, iconColor, title, loaded, children }: {
  icon: React.ReactNode; iconColor: keyof typeof ICON_COLORS; title: string; loaded: boolean; children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white/70 shadow-lg shadow-slate-200/20 backdrop-blur-sm transition-all duration-500 hover:shadow-xl hover:shadow-slate-200/30 dark:border-slate-700/60 dark:bg-slate-900/70 dark:shadow-slate-900/20 dark:hover:shadow-slate-900/30">
      <div className="flex items-center gap-2.5 px-5 pt-5 pb-2">
        <div className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${ICON_COLORS[iconColor]}`}>
          {icon}
        </div>
        <span className="text-[13px] font-semibold text-slate-900 dark:text-white">{title}</span>
      </div>
      <div className="px-3 pb-3">
        {!loaded ? (
          <div className="space-y-2 px-2 py-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-full rounded-lg" />
            ))}
          </div>
        ) : children}
      </div>
    </div>
  );
}

function DataRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg px-3 py-2">{children}</div>
  );
}

function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-8 text-slate-400 dark:text-slate-500">
      {icon}
      <p className="text-[13px]">{text}</p>
    </div>
  );
}

function getReferrerLabel(referrer: string | null): string {
  if (!referrer) return "Acesso direto";
  const r = referrer.toLowerCase();
  if (r.includes("google")) return "Google";
  if (r.includes("instagram")) return "Instagram";
  if (r.includes("facebook")) return "Facebook";
  if (r.includes("whatsapp")) return "WhatsApp";
  if (r === "direct") return "Acesso direto";
  if (r === "other") return "Outro";
  return referrer;
}
