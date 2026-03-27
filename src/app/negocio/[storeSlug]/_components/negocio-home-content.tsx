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
import { PglStatusBadge } from "@/components/ui/pgl-status-badge";
import {
  PglDashboardCard,
  PglDashboardCardHeader,
  PglDashboardCardHeaderLeft,
  PglDashboardCardHeaderRight,
  PglDashboardCardTitle,
  PglDashboardCardIcon,
  PglDashboardCardBody,
  PglDashboardCardListItem,
  PglDashboardCardEmpty,
  PglDashboardCardSkeleton,
} from "@/components/ui/pgl-dashboard-card";
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
    { label: "Publicar site", done: isActive, href: `/negocio/${storeSlug}/site` },
    { label: "Configurar dominio personalizado", done: !!customDomain, href: `/negocio/${storeSlug}/site` },
    { label: "Adicionar um contato", done: false, href: `/negocio/${storeSlug}/contatos` },
  ];

  return (
    <div className="flex min-w-80 max-w-6xl flex-col gap-8 px-4 py-4 md:mx-auto md:pb-8 md:pt-0 2xl:pt-8">
      {/* Greeting */}
      <div className="flex flex-col items-start gap-4">
        <p className="text-xl font-semibold leading-tight text-black/80 md:text-2xl">
          <span className="block">{getGreeting()},</span>
          <span className="block">bem-vindo ao Pagina Local</span>
        </p>
      </div>

      {/* Main grid — site preview (2 cols) + right sidebar (1 col) with all cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Site preview card — spans 2 columns */}
        <div className="lg:col-span-2">
          <PglDashboardCard className="h-full min-h-72">
            <PglDashboardCardHeader>
              <div className="flex w-full flex-wrap items-center justify-between gap-2">
                <PglDashboardCardHeaderLeft>
                  <PglDashboardCardIcon>
                    <IconWorld />
                  </PglDashboardCardIcon>
                  <PglDashboardCardTitle className="max-w-80 sm:max-w-[400px]">
                    {displayUrl}
                  </PglDashboardCardTitle>
                </PglDashboardCardHeaderLeft>

                <PglDashboardCardHeaderRight className="flex-1 justify-between">
                  <PglStatusBadge status={isActive ? "success" : "warning"}>
                    {isActive ? "Publicado" : "Rascunho"}
                  </PglStatusBadge>
                  <button
                    onClick={() => router.push(`/negocio/${storeSlug}/site`)}
                    className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-black/5 px-3 py-1 text-sm font-medium text-black/55 transition-[background,color] duration-150 hover:bg-black/10 hover:text-black/80"
                  >
                    Editar site
                  </button>
                </PglDashboardCardHeaderRight>
              </div>
            </PglDashboardCardHeader>

            <PglDashboardCardBody>
              <a
                className="block h-full max-h-[552px] overflow-hidden rounded-b-2xl"
                href={`/negocio/${storeSlug}/site`}
              >
                <SitePreviewIframe siteUrl={siteUrl} storeName={storeName} />
              </a>
            </PglDashboardCardBody>
          </PglDashboardCard>
        </div>

        {/* Right column — 3 cards stacked */}
        <div className="flex flex-col gap-4">
          {/* Get Started */}
          <PglDashboardCard>
            <PglDashboardCardHeader className="px-5 pt-5 pb-2">
              <PglDashboardCardHeaderLeft>
                <PglDashboardCardIcon>
                  <IconSparkles />
                </PglDashboardCardIcon>
                <PglDashboardCardTitle>Comecar</PglDashboardCardTitle>
              </PglDashboardCardHeaderLeft>
            </PglDashboardCardHeader>

            <PglDashboardCardBody className="px-3 pb-3">
              {actions.map((action) => (
                <PglDashboardCardListItem
                  key={action.label}
                  onClick={() => router.push(action.href)}
                >
                  {action.done ? (
                    <IconCircleCheck className="size-[18px] shrink-0 text-green-600" />
                  ) : (
                    <IconCircleDashed className="size-[18px] shrink-0 text-black/20" />
                  )}
                  <span className={cn(
                    "flex-1 text-sm font-medium",
                    action.done ? "text-black/30" : "text-black/80",
                  )}>
                    {action.label}
                  </span>
                  {!action.done && (
                    <IconChevronRight className="size-4 shrink-0 text-black/20" />
                  )}
                </PglDashboardCardListItem>
              ))}
            </PglDashboardCardBody>
          </PglDashboardCard>

          {/* Contacts */}
          <PglDashboardCard>
            <PglDashboardCardHeader className="px-5 pt-5 pb-2">
              <PglDashboardCardHeaderLeft>
                <PglDashboardCardIcon>
                  <IconPhone />
                </PglDashboardCardIcon>
                <PglDashboardCardTitle>Ultimos contatos</PglDashboardCardTitle>
              </PglDashboardCardHeaderLeft>
            </PglDashboardCardHeader>
            <PglDashboardCardBody className="px-3 pb-1">
              {!loaded ? (
                <PglDashboardCardSkeleton rows={3} />
              ) : data?.recentLeads && data.recentLeads.length > 0 ? (
                data.recentLeads.slice(0, 5).map((lead: { id: string; name: string | null; source: string; createdAt: Date }) => (
                  <PglDashboardCardListItem key={lead.id}>
                    {lead.source === "whatsapp" ? (
                      <IconBrandWhatsapp className="size-4 shrink-0 text-green-600" />
                    ) : (
                      <IconPhone className="size-4 shrink-0 text-black/40" />
                    )}
                    <span className="flex-1 truncate text-[13px] text-black/80">{lead.name || "Sem nome"}</span>
                    <span className="shrink-0 text-[11px] text-black/30">
                      {new Date(lead.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                    </span>
                  </PglDashboardCardListItem>
                ))
              ) : (
                <PglDashboardCardEmpty
                  icon={<IconPhone />}
                  text="Nenhum contato ainda"
                  ctaLabel="Adicionar contato"
                  onCtaClick={() => router.push(`/negocio/${storeSlug}/contatos`)}
                />
              )}
            </PglDashboardCardBody>
          </PglDashboardCard>

          {/* Pageviews */}
          <PglDashboardCard>
            <PglDashboardCardHeader className="px-5 pt-5 pb-2">
              <PglDashboardCardHeaderLeft>
                <PglDashboardCardIcon>
                  <IconEye />
                </PglDashboardCardIcon>
                <PglDashboardCardTitle>Ultimas visualizacoes</PglDashboardCardTitle>
              </PglDashboardCardHeaderLeft>
            </PglDashboardCardHeader>
            <PglDashboardCardBody className="px-3 pb-1">
              {!loaded ? (
                <PglDashboardCardSkeleton rows={3} />
              ) : data?.recentPageviews && data.recentPageviews.length > 0 ? (
                data.recentPageviews.slice(0, 5).map((pv: { id: string; device: string | null; referrer: string | null; createdAt: Date }) => (
                  <PglDashboardCardListItem key={pv.id}>
                    {pv.device === "mobile" ? (
                      <IconDeviceMobile className="size-4 shrink-0 text-black/40" />
                    ) : (
                      <IconDeviceDesktop className="size-4 shrink-0 text-black/40" />
                    )}
                    <span className="flex-1 truncate text-[13px] text-black/80">{getReferrerLabel(pv.referrer)}</span>
                    <span className="shrink-0 text-[11px] text-black/30">
                      {new Date(pv.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                    </span>
                  </PglDashboardCardListItem>
                ))
              ) : (
                <PglDashboardCardEmpty
                  icon={<IconEye />}
                  text="Nenhuma visualizacao ainda"
                  ctaLabel="Publicar site"
                  onCtaClick={() => router.push(`/negocio/${storeSlug}/site`)}
                />
              )}
            </PglDashboardCardBody>
          </PglDashboardCard>
        </div>
      </div>
    </div>
  );
}

// ─── Site Preview Iframe ────────────────────────────────────────────────────

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
      const renderW = isMobile ? 390 : 1520;
      const sc = cw / renderW;
      setDims({ renderWidth: renderW, scale: sc, height: Math.ceil((isMobile ? 844 : 1400) * sc) });
    }
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none relative h-full w-full overflow-hidden"
      style={{ height: dims?.height ?? 300 }}
    >
      {!frameLoaded && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3">
          <Skeleton className="h-8 w-48 rounded-lg bg-[#f5f5f4]" />
          <Skeleton className="h-4 w-32 rounded-md bg-[#f5f5f4]" />
        </div>
      )}
      {dims && (
        <iframe
          src={siteUrl}
          title={`Preview de ${storeName}`}
          className="pointer-events-none"
          style={{
            width: dims.renderWidth,
            height: dims.renderWidth < 500 ? 844 : 1400,
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

// ─── Utils ──────────────────────────────────────────────────────────────────

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
