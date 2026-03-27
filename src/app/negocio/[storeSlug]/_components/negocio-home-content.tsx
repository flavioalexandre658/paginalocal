"use client";

import { useEffect, useState } from "react";
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
  IconExternalLink,
  IconCircleCheck,
  IconCircleDashed,
} from "@tabler/icons-react";
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
  const [iframeLoaded, setIframeLoaded] = useState(false);

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
    <div className="px-6 py-8 lg:px-10 max-w-[1100px] mx-auto">
      {/* Greeting */}
      <h1 className="text-[22px] lg:text-[26px] font-semibold leading-tight" style={{ color: "#1a1a1a" }}>
        {getGreeting()},
        <br />
        bem-vindo ao Pagina Local
      </h1>

      {/* Main grid: Preview card + Get Started */}
      <div className="mt-7 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
        {/* Site preview card */}
        <div
          className="rounded-[14px] overflow-hidden"
          style={{ border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
        >
          {/* URL bar */}
          <div
            className="flex items-center justify-between gap-3 px-4 py-2.5"
            style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <IconWorld style={{ width: 16, height: 16, color: "#a3a3a3", flexShrink: 0 }} />
              <span className="text-[13px] truncate" style={{ color: "#525252" }}>{displayUrl}</span>
              <span
                className="flex items-center gap-1 shrink-0 rounded-full px-2 py-[2px] text-[10px] font-semibold uppercase tracking-wider"
                style={{
                  backgroundColor: isActive ? "#dcfce7" : "#fef3c7",
                  color: isActive ? "#15803d" : "#a16207",
                }}
              >
                <span className="h-1 w-1 rounded-full" style={{ backgroundColor: isActive ? "#22c55e" : "#f59e0b" }} />
                {isActive ? "Publicado" : "Rascunho"}
              </span>
            </div>
            <button
              onClick={() => router.push(`/negocio/${storeSlug}/site`)}
              className="shrink-0 rounded-[8px] px-3.5 py-1.5 text-[12px] font-medium transition-all duration-150"
              style={{ border: "1px solid rgba(0,0,0,0.12)", color: "#1a1a1a" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f5f5f4"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
            >
              Editar site
            </button>
          </div>

          {/* Live site preview via iframe */}
          <div className="relative overflow-hidden" style={{ height: 420, backgroundColor: "#f0f0ee" }}>
            {!iframeLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
                <Skeleton className="h-8 w-48 rounded-[8px] bg-[#e5e5e5]" />
                <Skeleton className="h-4 w-32 rounded-[6px] bg-[#e5e5e5]" />
              </div>
            )}
            <iframe
              src={siteUrl}
              title={`Preview de ${storeName}`}
              className="pointer-events-none"
              style={{
                width: 1440,
                height: 900,
                transform: "scale(0.46)",
                transformOrigin: "top left",
                border: "none",
                display: "block",
                opacity: iframeLoaded ? 1 : 0,
                transition: "opacity 300ms ease",
              }}
              onLoad={() => setIframeLoaded(true)}
              sandbox="allow-scripts allow-same-origin"
              loading="lazy"
            />
          </div>
        </div>

        {/* Get Started card */}
        <div
          className="rounded-[14px] self-start"
          style={{ border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
        >
          <div className="flex items-center gap-2 px-5 pt-5 pb-3">
            <IconSparkles style={{ width: 17, height: 17, color: "#a3a3a3" }} />
            <span className="text-[15px] font-semibold" style={{ color: "#1a1a1a" }}>Comecar</span>
          </div>

          <div className="px-2 pb-2">
            {actions.map((action) => (
              <button
                key={action.label}
                onClick={() => router.push(action.href)}
                className="flex w-full items-center gap-3 rounded-[10px] px-3 py-3 transition-colors text-left"
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#fafaf9"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                {action.done ? (
                  <IconCircleCheck style={{ width: 18, height: 18, color: "#22c55e", flexShrink: 0 }} />
                ) : (
                  <IconCircleDashed style={{ width: 18, height: 18, color: "#d4d4d4", flexShrink: 0 }} />
                )}
                <span
                  className="flex-1 text-[14px] font-medium"
                  style={{ color: action.done ? "#a3a3a3" : "#1a1a1a" }}
                >
                  {action.label}
                </span>
                <IconChevronRight style={{ width: 15, height: 15, color: "#d4d4d4", flexShrink: 0 }} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row: Data cards */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Recent contacts */}
        <DataCard
          icon={<IconPhone style={{ width: 15, height: 15 }} />}
          title="Ultimos contatos"
          loaded={loaded}
        >
          {data?.recentLeads && data.recentLeads.length > 0 ? (
            data.recentLeads.slice(0, 5).map((lead: { id: string; name: string | null; source: string; createdAt: Date }) => (
              <DataRow key={lead.id}>
                {lead.source === "whatsapp" ? (
                  <IconBrandWhatsapp style={{ width: 14, height: 14, color: "#22c55e", flexShrink: 0 }} />
                ) : (
                  <IconPhone style={{ width: 14, height: 14, color: "#3b82f6", flexShrink: 0 }} />
                )}
                <span className="flex-1 truncate text-[13px]" style={{ color: "#1a1a1a" }}>
                  {lead.name || "Sem nome"}
                </span>
                <span className="text-[11px] shrink-0" style={{ color: "#a3a3a3" }}>
                  {new Date(lead.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                </span>
              </DataRow>
            ))
          ) : (
            <EmptyState text="Nenhum contato ainda" />
          )}
        </DataCard>

        {/* Recent pageviews */}
        <DataCard
          icon={<IconWorld style={{ width: 15, height: 15 }} />}
          title="Ultimas visualizacoes"
          loaded={loaded}
        >
          {data?.recentPageviews && data.recentPageviews.length > 0 ? (
            data.recentPageviews.slice(0, 5).map((pv: { id: string; device: string | null; referrer: string | null; createdAt: Date }) => (
              <DataRow key={pv.id}>
                {pv.device === "mobile" ? (
                  <IconDeviceMobile style={{ width: 14, height: 14, color: "#737373", flexShrink: 0 }} />
                ) : (
                  <IconDeviceDesktop style={{ width: 14, height: 14, color: "#737373", flexShrink: 0 }} />
                )}
                <span className="flex-1 truncate text-[13px]" style={{ color: "#1a1a1a" }}>
                  {getReferrerLabel(pv.referrer)}
                </span>
                <span className="text-[11px] shrink-0" style={{ color: "#a3a3a3" }}>
                  {new Date(pv.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                </span>
              </DataRow>
            ))
          ) : (
            <EmptyState text="Nenhuma visualizacao ainda" />
          )}
        </DataCard>

        {/* Tips */}
        <DataCard
          icon={<IconSparkles style={{ width: 15, height: 15 }} />}
          title="Dicas"
          loaded={loaded}
        >
          {data?.dynamicTips && data.dynamicTips.length > 0 ? (
            data.dynamicTips.slice(0, 3).map((tip: { id: string; title: string; actionUrl?: string | null }) => (
              <button
                key={tip.id}
                onClick={() => tip.actionUrl && router.push(tip.actionUrl)}
                className="flex w-full items-center justify-between rounded-[8px] px-2 py-2.5 text-left transition-colors"
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#fafaf9"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                <span className="text-[13px]" style={{ color: "#1a1a1a" }}>{tip.title}</span>
                <IconChevronRight style={{ width: 14, height: 14, color: "#d4d4d4", flexShrink: 0 }} />
              </button>
            ))
          ) : (
            <EmptyState text="Tudo certo por aqui!" />
          )}
        </DataCard>
      </div>
    </div>
  );
}

function DataCard({ icon, title, loaded, children }: { icon: React.ReactNode; title: string; loaded: boolean; children: React.ReactNode }) {
  return (
    <div
      className="rounded-[14px] overflow-hidden"
      style={{ border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
    >
      <div className="flex items-center gap-2 px-5 pt-4 pb-2" style={{ color: "#a3a3a3" }}>
        {icon}
        <span className="text-[13px] font-semibold" style={{ color: "#1a1a1a" }}>{title}</span>
      </div>
      <div className="px-3 pb-3">
        {!loaded ? (
          <div className="space-y-2 px-2 py-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full rounded-[6px] bg-[#f5f5f4]" />
            ))}
          </div>
        ) : children}
      </div>
    </div>
  );
}

function DataRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 rounded-[8px] px-2 py-2">
      {children}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <p className="text-[13px] py-6 text-center" style={{ color: "#a3a3a3" }}>
      {text}
    </p>
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
