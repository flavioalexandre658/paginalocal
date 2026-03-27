"use client";

import { useState, useEffect } from "react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  IconWorld,
  IconSettings2,
  IconLoader2,
  IconTrash,
  IconPlus,
  IconCopy,
  IconPencil,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { PglButton } from "@/components/ui/pgl-button";
import {
  SettingsModal,
  SettingsModalContent,
  SettingsModalSidebar,
  SettingsModalSidebarTitle,
  SettingsModalSidebarItem,
  SettingsModalMobileTabs,
  SettingsModalMobileTab,
  SettingsModalBody,
  SettingsModalTabPanel,
} from "@/components/ui/pgl-settings-modal";
import { updateStoreAction } from "@/actions/stores/update-store.action";
import { getStoreBySlugAuthAction } from "@/actions/stores/get-store-by-slug-auth.action";
import {
  addDomainToVercel,
  getDomainConfigFromVercel,
  removeDomainFromVercel,
  verifyDomainOnVercel,
} from "@/actions/vercel/add-domain";
import { getTrackingAction } from "@/actions/tracking/get-tracking.action";
import { upsertTrackingAction } from "@/actions/tracking/upsert-tracking.action";
import { deleteTrackingAction } from "@/actions/tracking/delete-tracking.action";
import { toggleTrackingAction } from "@/actions/tracking/toggle-tracking.action";
import { usePlanRestrictions } from "@/hooks/use-plan-restrictions";

type Tab = "general" | "domains" | "integrations" | "tracking";

interface Props {
  open: boolean;
  onClose: () => void;
  storeId: string;
  storeSlug: string;
  storeName: string;
  initialTab?: Tab;
  onOpenUpgrade?: () => void;
  onPublishChange?: (isActive: boolean) => void;
}

const TABS: { id: Tab; label: string }[] = [
  { id: "general", label: "Geral" },
  { id: "domains", label: "Dominios" },
  { id: "integrations", label: "Integracoes" },
  { id: "tracking", label: "Rastreamento" },
];

export function SiteSettingsModal({ open, onClose, storeId, storeSlug, storeName, initialTab, onOpenUpgrade, onPublishChange }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab ?? "general");

  useEffect(() => {
    if (open && initialTab) setActiveTab(initialTab);
  }, [open, initialTab]);

  return (
    <SettingsModal open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <SettingsModalContent defaultTab={activeTab}>
        <SettingsModalSidebar>
          <SettingsModalSidebarTitle>Configuracoes</SettingsModalSidebarTitle>
          {TABS.map((tab) => (
            <SettingsModalSidebarItem key={tab.id} value={tab.id}>
              {tab.label}
            </SettingsModalSidebarItem>
          ))}
        </SettingsModalSidebar>

        <div className="flex flex-1 flex-col overflow-hidden">
          <SettingsModalMobileTabs>
            {TABS.map((tab) => (
              <SettingsModalMobileTab key={tab.id} value={tab.id}>
                {tab.label}
              </SettingsModalMobileTab>
            ))}
          </SettingsModalMobileTabs>

          <SettingsModalBody>
            <SettingsModalTabPanel value="general">
              <GeneralTab storeId={storeId} storeSlug={storeSlug} storeName={storeName} onPublishChange={onPublishChange} />
            </SettingsModalTabPanel>
            <SettingsModalTabPanel value="domains">
              <DomainsTab storeId={storeId} storeSlug={storeSlug} onOpenUpgrade={() => { onClose(); onOpenUpgrade?.(); }} />
            </SettingsModalTabPanel>
            <SettingsModalTabPanel value="integrations">
              <IntegrationsTab />
            </SettingsModalTabPanel>
            <SettingsModalTabPanel value="tracking">
              <TrackingTab storeSlug={storeSlug} />
            </SettingsModalTabPanel>
          </SettingsModalBody>
        </div>
      </SettingsModalContent>
    </SettingsModal>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-6 text-xl md:text-2xl font-semibold text-black/80">{children}</h2>;
}

function SectionBlock({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-semibold text-black/80">{title}</h3>
      {description && <p className="mt-0.5 text-sm text-black/55">{description}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
}

function OptionCard({
  icon,
  title,
  description,
  selected,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all",
        selected
          ? "border-black/80 ring-1 ring-black/80 bg-black/[0.02]"
          : "border-black/10 hover:border-black/20 hover:bg-black/[0.01]",
      )}
    >
      <div className={cn("shrink-0 [&>svg]:size-5", selected ? "text-black/80" : "text-black/40")}>{icon}</div>
      <div className="flex-1">
        <p className={cn("text-sm font-medium", selected ? "text-black/80" : "text-black/55")}>{title}</p>
        <p className="text-sm text-black/40">{description}</p>
      </div>
    </button>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors",
        checked ? "bg-black/80" : "bg-black/10",
      )}
    >
      <span
        className={cn(
          "block h-5 w-5 rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-5" : "translate-x-0",
        )}
      />
    </button>
  );
}

function GeneralTab({ storeId, storeSlug, onPublishChange }: { storeId: string; storeSlug: string; storeName: string; onPublishChange?: (isActive: boolean) => void }) {
  const { executeAsync: updateStore } = useAction(updateStoreAction);
  const [isPublished, setIsPublished] = useState(false);
  const [seoIndexable, setSeoIndexable] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStoreBySlugAuthAction({ slug: storeSlug }).then((r) => {
      if (r?.data) {
        setIsPublished(r.data?.isActive ?? false);
      }
      setLoading(false);
    });
  }, [storeSlug]);

  async function handlePublishChange(published: boolean) {
    setIsPublished(published);
    const result = await updateStore({ storeId, isActive: published });
    if (result?.data) {
      toast.success(published ? "Site publicado" : "Site despublicado");
      onPublishChange?.(published);
    } else {
      setIsPublished(!published);
      toast.error("Erro ao atualizar status");
    }
  }

  function handleSeoChange(indexable: boolean) {
    setSeoIndexable(indexable);
    toast.success(indexable ? "Site visivel nos buscadores" : "Site oculto dos buscadores");
  }

  if (loading) {
    return (
      <div className="max-w-2xl space-y-6">
        <Skeleton className="h-7 w-24 bg-[#f5f5f4]" />
        <div className="space-y-3">
          <Skeleton className="h-5 w-32 bg-[#f5f5f4]" />
          <Skeleton className="h-4 w-64 bg-[#f5f5f4]" />
          <Skeleton className="h-[72px] w-full rounded-[12px] bg-[#f5f5f4]" />
          <Skeleton className="h-[72px] w-full rounded-[12px] bg-[#f5f5f4]" />
        </div>
        <Skeleton className="h-px w-full bg-[#f5f5f4]" />
        <div className="space-y-3">
          <Skeleton className="h-5 w-48 bg-[#f5f5f4]" />
          <Skeleton className="h-4 w-72 bg-[#f5f5f4]" />
          <Skeleton className="h-10 w-full rounded-[10px] bg-[#f5f5f4]" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <SectionTitle>Geral</SectionTitle>

      <SectionBlock title="Status do site" description="A visibilidade do seu site para outras pessoas">
        <div className="space-y-3">
          <OptionCard
            icon={<IconWorld style={{ width: 20, height: 20 }} />}
            title="Publicado"
            description="Seu site esta publicado e visivel para todos"
            selected={isPublished}
            onClick={() => handlePublishChange(true)}
          />
          <OptionCard
            icon={<IconSettings2 style={{ width: 20, height: 20 }} />}
            title="Nao publicado"
            description="Somente voce pode ver seu site"
            selected={!isPublished}
            onClick={() => handlePublishChange(false)}
          />
        </div>
      </SectionBlock>

      <div className="my-6" style={{ height: 1, backgroundColor: "rgba(0,0,0,0.06)" }} />

      <SectionBlock title="Visibilidade nos buscadores" description="Controle se seu site pode aparecer no Google e outros buscadores">
        <div className="flex items-center justify-between">
          <span className="text-[14px]" style={{ color: "#1a1a1a" }}>Mostrar meu site nos resultados de busca</span>
          <Toggle checked={seoIndexable} onChange={handleSeoChange} />
        </div>
      </SectionBlock>
    </div>
  );
}

interface DnsRecord { type: string; host: string; value: string }
interface DomainConfig { name: string; verified: boolean; misconfigured: boolean; intendedRecords: DnsRecord[] }

function DomainsTab({ storeId, storeSlug, onOpenUpgrade }: { storeId: string; storeSlug: string; onOpenUpgrade?: () => void }) {
  const router = useRouter();
  const { executeAsync: updateStore } = useAction(updateStoreAction);
  const { canUseCustomDomain } = usePlanRestrictions();
  const [editingSubdomain, setEditingSubdomain] = useState(false);
  const [subdomain, setSubdomain] = useState(storeSlug);
  const [savingSlug, setSavingSlug] = useState(false);
  const [domainInput, setDomainInput] = useState("");
  const [domainConfig, setDomainConfig] = useState<DomainConfig | null>(null);
  const [addingDomain, setAddingDomain] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStoreBySlugAuthAction({ slug: storeSlug }).then(async (r) => {
      if (r?.data) {
        const data = r.data as { customDomain?: string | null };
        if (data.customDomain) {
          const cfg = await getDomainConfigFromVercel(data.customDomain);
          if (cfg.success && cfg.data) {
            setDomainConfig({
              name: cfg.data.name,
              verified: cfg.data.verified,
              misconfigured: cfg.data.misconfigured,
              intendedRecords: cfg.data.intendedRecords || [{ type: "A", host: "@", value: "76.76.21.21" }],
            });
          } else {
            setDomainConfig({
              name: data.customDomain,
              verified: false,
              misconfigured: true,
              intendedRecords: [{ type: "A", host: "@", value: "76.76.21.21" }],
            });
          }
        }
      }
      setLoading(false);
    });
  }, [storeSlug]);

  async function handleAddDomain() {
    if (!domainInput.trim()) return;
    setAddingDomain(true);
    const result = await addDomainToVercel(domainInput.trim());
    if (result.success) {
      await updateStore({ storeId, customDomain: domainInput.trim() });
      const cfg = await getDomainConfigFromVercel(domainInput.trim());
      if (cfg.success && cfg.data) {
        setDomainConfig({ name: cfg.data.name, verified: cfg.data.verified, misconfigured: cfg.data.misconfigured, intendedRecords: cfg.data.intendedRecords || [{ type: "A", host: "@", value: "76.76.21.21" }] });
      } else {
        setDomainConfig({ name: domainInput.trim(), verified: false, misconfigured: true, intendedRecords: [{ type: "A", host: "@", value: "76.76.21.21" }] });
      }
      setDomainInput("");
      toast.success("Dominio adicionado! Configure o DNS abaixo.");
    } else {
      toast.error((result as { error?: string }).error || "Erro ao adicionar dominio");
    }
    setAddingDomain(false);
  }

  async function handleVerify() {
    if (!domainConfig) return;
    setVerifying(true);
    const result = await verifyDomainOnVercel(domainConfig.name);
    if (result.success) {
      setDomainConfig((prev) => prev ? { ...prev, verified: result.verified, misconfigured: result.misconfigured } : null);
      if (result.verified && !result.misconfigured) toast.success("Dominio verificado!");
      else toast.error("DNS ainda nao configurado corretamente");
    }
    setVerifying(false);
  }

  async function handleRemove() {
    if (!domainConfig) return;
    if (!window.confirm(`Remover o dominio ${domainConfig.name}?`)) return;
    setRemoving(true);
    const result = await removeDomainFromVercel(domainConfig.name);
    if (result.success) {
      await updateStore({ storeId, customDomain: null });
      setDomainConfig(null);
      toast.success("Dominio removido");
    }
    setRemoving(false);
  }

  async function handleSaveSubdomain() {
    if (!subdomain.trim()) return;
    setSavingSlug(true);
    const newSlug = subdomain.trim();
    const result = await updateStore({ storeId, slug: newSlug });
    if (result?.data) {
      toast.success("Subdominio atualizado — redirecionando...");
      setEditingSubdomain(false);
      router.push(`/negocio/${newSlug}/site`);
    } else {
      toast.error("Erro ao atualizar subdominio");
    }
    setSavingSlug(false);
  }

  if (loading) {
    return (
      <div className="max-w-xl space-y-6">
        <Skeleton className="h-7 w-28 bg-[#f5f5f4]" />
        <div className="space-y-3">
          <Skeleton className="h-5 w-44 bg-[#f5f5f4]" />
          <Skeleton className="h-4 w-64 bg-[#f5f5f4]" />
          <Skeleton className="h-12 w-full rounded-[10px] bg-[#f5f5f4]" />
        </div>
        <Skeleton className="h-px w-full bg-[#f5f5f4]" />
        <div className="space-y-3">
          <Skeleton className="h-5 w-32 bg-[#f5f5f4]" />
          <Skeleton className="h-[64px] w-full rounded-[12px] bg-[#f5f5f4]" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <SectionTitle>Dominios</SectionTitle>

      <SectionBlock title="Dominio personalizado" description="Conecte seu proprio dominio ao site">
        {!domainConfig ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value.toLowerCase())}
                placeholder="seunegocio.com.br"
                className="flex-1 h-9 rounded-xl border border-black/10 bg-white px-3.5 text-sm text-black/80 outline-none placeholder:text-black/30 focus:border-black/30 focus:ring-1 focus:ring-black/10"
              />
              <PglButton
                variant="dark"
                size="sm"
                onClick={() => {
                  if (!canUseCustomDomain()) {
                    onOpenUpgrade?.();
                    return;
                  }
                  handleAddDomain();
                }}
                disabled={addingDomain || !domainInput.trim()}
                loading={addingDomain}
              >
                {!addingDomain && "Adicionar"}
              </PglButton>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div
              className="rounded-[12px] p-4"
              style={{ border: `1px solid ${domainConfig.verified && !domainConfig.misconfigured ? "#22c55e" : "#ef4444"}20`, backgroundColor: domainConfig.verified && !domainConfig.misconfigured ? "#f0fdf4" : "#fef2f2" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-medium" style={{ color: "#1a1a1a" }}>{domainConfig.name}</p>
                  <p className="mt-0.5 text-[13px]" style={{ color: domainConfig.verified && !domainConfig.misconfigured ? "#16a34a" : "#ef4444" }}>
                    {domainConfig.verified && !domainConfig.misconfigured ? "DNS configurado" : "DNS nao configurado"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handleVerify} disabled={verifying} className="rounded-[8px] p-2 transition-colors" style={{ color: "#737373" }} title="Verificar DNS">
                    <IconLoader2 className={cn("h-4 w-4", verifying && "animate-spin")} />
                  </button>
                  <button onClick={handleRemove} disabled={removing} className="rounded-[8px] p-2 transition-colors" style={{ color: "#a3a3a3" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#ef4444"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "#a3a3a3"; }}
                  >
                    <IconTrash style={{ width: 16, height: 16 }} />
                  </button>
                </div>
              </div>
            </div>

            {(!domainConfig.verified || domainConfig.misconfigured) && (
              <div className="space-y-3">
                <p className="text-[13px] font-medium" style={{ color: "#1a1a1a" }}>Registros DNS necessarios</p>
                <p className="text-[12px]" style={{ color: "#737373" }}>Configure estes registros no painel do seu provedor de dominio:</p>
                {domainConfig.intendedRecords.map((rec, i) => (
                  <div key={i} className="grid grid-cols-3 gap-3 rounded-[10px] p-3" style={{ backgroundColor: "#f5f5f4" }}>
                    <div>
                      <p className="text-[11px] font-medium uppercase" style={{ color: "#a3a3a3" }}>Tipo</p>
                      <p className="text-[13px] font-medium" style={{ color: "#1a1a1a" }}>{rec.type}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium uppercase" style={{ color: "#a3a3a3" }}>Host</p>
                      <div className="flex items-center gap-1">
                        <code className="text-[13px]" style={{ color: "#1a1a1a" }}>{rec.host}</code>
                        <button onClick={() => { navigator.clipboard.writeText(rec.host); toast.success("Copiado"); }} className="p-0.5" style={{ color: "#a3a3a3" }}>
                          <IconCopy style={{ width: 12, height: 12 }} />
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium uppercase" style={{ color: "#a3a3a3" }}>Valor</p>
                      <div className="flex items-center gap-1">
                        <code className="text-[13px] truncate" style={{ color: "#1a1a1a" }}>{rec.value}</code>
                        <button onClick={() => { navigator.clipboard.writeText(rec.value); toast.success("Copiado"); }} className="shrink-0 p-0.5" style={{ color: "#a3a3a3" }}>
                          <IconCopy style={{ width: 12, height: 12 }} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </SectionBlock>

      <div className="my-6" style={{ height: 1, backgroundColor: "rgba(0,0,0,0.06)" }} />

      <SectionBlock title="Subdominio" description="O endereco gratuito do seu site">
        <div
          className="flex items-center justify-between rounded-[12px] p-4"
          style={{ border: "1px solid rgba(0,0,0,0.06)" }}
        >
          <div className="flex-1 min-w-0">
            {editingSubdomain ? (
              <div className="flex items-center gap-2">
                <input
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  className="rounded-[10px] px-[14px] py-[10px] text-[14px]"
                  style={{ backgroundColor: "#f5f5f4", border: "1px solid rgba(0,0,0,0.06)", outline: "none", flex: 1 }}
                />
                <span className="shrink-0 text-[13px]" style={{ color: "#737373" }}>.paginalocal.com.br</span>
                <PglButton variant="dark" size="xs" onClick={handleSaveSubdomain} disabled={savingSlug} loading={savingSlug}>
                  {!savingSlug && "Salvar"}
                </PglButton>
                <PglButton variant="ghost" size="xs" onClick={() => { setEditingSubdomain(false); setSubdomain(storeSlug); }}>Cancelar</PglButton>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <IconWorld style={{ width: 14, height: 14, color: "#737373", flexShrink: 0 }} />
                <span className="truncate text-[13px]" style={{ color: "#1a1a1a" }}>https://{storeSlug}.paginalocal.com.br</span>
                <button onClick={() => { navigator.clipboard.writeText(`https://${storeSlug}.paginalocal.com.br`); toast.success("Copiado"); }} className="shrink-0 p-1" style={{ color: "#a3a3a3" }}>
                  <IconCopy style={{ width: 14, height: 14 }} />
                </button>
              </div>
            )}
          </div>
          {!editingSubdomain && (
            <button onClick={() => setEditingSubdomain(true)} className="shrink-0 flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-[13px] font-medium" style={{ color: "#737373", border: "1px solid rgba(0,0,0,0.06)" }}>
              <IconPencil style={{ width: 14, height: 14 }} />
              Editar
            </button>
          )}
        </div>
      </SectionBlock>
    </div>
  );
}

function IntegrationsTab() {
  const integrations = [
    { name: "Google Meu Negocio", description: "Sincronize avaliacoes e informacoes do Google", connected: true, icon: "G" },
    { name: "Facebook", description: "Conecte sua pagina do Facebook", connected: false, icon: "f" },
    { name: "Instagram", description: "Conecte seu perfil do Instagram", connected: false, icon: "I" },
  ];

  return (
    <div className="max-w-2xl">
      <SectionTitle>Integracoes</SectionTitle>
      <div className="space-y-3">
        {integrations.map((item) => (
          <div
            key={item.name}
            className="flex items-center gap-4 rounded-[12px] p-4"
            style={{ border: "1px solid rgba(0,0,0,0.06)" }}
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-[10px] text-[16px] font-bold"
              style={{ backgroundColor: "#f5f5f4", color: "#1a1a1a" }}
            >
              {item.icon}
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-medium" style={{ color: "#1a1a1a" }}>{item.name}</p>
              <p className="text-[13px]" style={{ color: "#737373" }}>{item.description}</p>
            </div>
            {item.connected ? (
              <span
                className="rounded-full px-3 py-1 text-[12px] font-medium"
                style={{ backgroundColor: "#f0fdf4", color: "#16a34a" }}
              >
                Conectado
              </span>
            ) : (
              <span className="text-[13px]" style={{ color: "#a3a3a3" }}>Em breve</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

type TrackingPlatform = "GTM" | "GOOGLE_ANALYTICS" | "GOOGLE_ADS" | "META_PIXEL" | "KWAI" | "TIKTOK";

const PLATFORMS: { id: TrackingPlatform; name: string; placeholder: string; prefix: string }[] = [
  { id: "GTM", name: "Google Tag Manager", placeholder: "GTM-XXXXXXX", prefix: "GTM-" },
  { id: "GOOGLE_ANALYTICS", name: "Google Analytics", placeholder: "G-XXXXXXXXXX", prefix: "G-" },
  { id: "GOOGLE_ADS", name: "Google Ads", placeholder: "AW-XXXXXXXXX", prefix: "AW-" },
  { id: "META_PIXEL", name: "Meta Pixel", placeholder: "123456789012345", prefix: "" },
  { id: "KWAI", name: "Kwai Pixel", placeholder: "123456789", prefix: "" },
  { id: "TIKTOK", name: "TikTok Pixel", placeholder: "XXXXXXXXXXXXXXXXX", prefix: "" },
];

function TrackingTab({ storeSlug }: { storeSlug: string }) {
  const { executeAsync: fetchTracking } = useAction(getTrackingAction);
  const { executeAsync: upsertTracking } = useAction(upsertTrackingAction);
  const { executeAsync: deleteTracking } = useAction(deleteTrackingAction);
  const { executeAsync: toggleTracking } = useAction(toggleTrackingAction);

  const [configs, setConfigs] = useState<{ id: string; platform: string; trackingId: string; isActive: boolean }[]>([]);
  const [editPlatform, setEditPlatform] = useState<TrackingPlatform | null>(null);
  const [editValue, setEditValue] = useState("");
  const [, setLoaded] = useState(false);

  useEffect(() => {
    fetchTracking({ storeSlug }).then((r) => {
      if (r?.data) setConfigs(r.data as typeof configs);
      setLoaded(true);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeSlug]);

  async function handleSave() {
    if (!editPlatform || !editValue.trim()) return;
    const result = await upsertTracking({ storeSlug, platform: editPlatform, trackingId: editValue.trim() });
    if (result?.data) {
      setConfigs((prev) => {
        const existing = prev.findIndex((c) => c.platform === editPlatform);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = { ...updated[existing], trackingId: editValue.trim() };
          return updated;
        }
        return [...prev, { id: (result.data as { id: string }).id, platform: editPlatform, trackingId: editValue.trim(), isActive: true }];
      });
      toast.success("Rastreamento salvo");
    }
    setEditPlatform(null);
    setEditValue("");
  }

  async function handleDelete(platform: string) {
    const config = configs.find((c) => c.platform === platform);
    if (!config) return;
    await deleteTracking({ storeSlug, trackingId: config.id });
    setConfigs((prev) => prev.filter((c) => c.platform !== platform));
    toast.success("Rastreamento removido");
  }

  async function handleToggle(platform: string) {
    const config = configs.find((c) => c.platform === platform);
    if (!config) return;
    await toggleTracking({ storeSlug, trackingId: config.id, isActive: !config.isActive });
    setConfigs((prev) => prev.map((c) => c.platform === platform ? { ...c, isActive: !c.isActive } : c));
  }

  return (
    <div className="max-w-2xl">
      <SectionTitle>Rastreamento</SectionTitle>
      <p className="mb-6 text-[13px]" style={{ color: "#737373" }}>
        Configure pixels e codigos de rastreamento para monitorar visitas e conversoes.
      </p>

      {editPlatform && (
        <div
          className="mb-6 rounded-[12px] p-5"
          style={{ border: "1px solid rgba(0,0,0,0.06)", backgroundColor: "#fafaf9" }}
        >
          <p className="mb-3 text-[14px] font-medium" style={{ color: "#1a1a1a" }}>
            {PLATFORMS.find((p) => p.id === editPlatform)?.name}
          </p>
          <input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder={PLATFORMS.find((p) => p.id === editPlatform)?.placeholder}
            className="mb-3 w-full rounded-[10px] px-[14px] py-[10px] text-[14px]"
            style={{ backgroundColor: "#ffffff", border: "1px solid rgba(0,0,0,0.06)", outline: "none" }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.2)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.06)"; }}
          />
          <div className="flex justify-end gap-2">
            <PglButton variant="ghost" size="xs" onClick={() => { setEditPlatform(null); setEditValue(""); }}>Cancelar</PglButton>
            <PglButton variant="dark" size="xs" onClick={handleSave}>Salvar</PglButton>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {PLATFORMS.map((platform) => {
          const config = configs.find((c) => c.platform === platform.id);
          return (
            <div
              key={platform.id}
              className="flex items-center gap-4 rounded-[12px] p-4"
              style={{ border: "1px solid rgba(0,0,0,0.06)" }}
            >
              <div className="flex-1">
                <p className="text-[14px] font-medium" style={{ color: "#1a1a1a" }}>{platform.name}</p>
                {config ? (
                  <p className="mt-0.5 text-[13px]" style={{ color: "#737373" }}>{config.trackingId}</p>
                ) : (
                  <p className="mt-0.5 text-[13px]" style={{ color: "#a3a3a3" }}>Nao configurado</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {config ? (
                  <>
                    <Toggle checked={config.isActive} onChange={() => handleToggle(platform.id)} />
                    <button
                      onClick={() => { setEditPlatform(platform.id); setEditValue(config.trackingId); }}
                      className="rounded-[6px] p-1.5"
                      style={{ color: "#737373" }}
                    >
                      <IconPencil style={{ width: 14, height: 14 }} />
                    </button>
                    <button
                      onClick={() => handleDelete(platform.id)}
                      className="rounded-[6px] p-1.5"
                      style={{ color: "#a3a3a3" }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "#ef4444"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "#a3a3a3"; }}
                    >
                      <IconTrash style={{ width: 14, height: 14 }} />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { setEditPlatform(platform.id); setEditValue(""); }}
                    className="flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-[13px] font-medium transition-colors"
                    style={{ color: "#737373", border: "1px solid rgba(0,0,0,0.06)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.06)"; }}
                  >
                    <IconPlus style={{ width: 14, height: 14 }} />
                    Configurar
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
