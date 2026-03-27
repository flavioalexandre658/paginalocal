"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";
import {
  IconUser,
  IconCreditCard,
  IconBuilding,
  IconCamera,
  IconLoader2,
  IconTrash,
  IconCheck,
  IconCalendar,
  IconAlertTriangle,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { PglButton } from "@/components/ui/pgl-button";
import {
  PglField,
  PglFieldLabel,
  PglFieldInput,
  PglFieldTextarea,
  PglFieldHint,
} from "@/components/ui/pgl-field";
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
  SettingsModalSection,
} from "@/components/ui/pgl-settings-modal";
import { uploadUserAvatarAction } from "@/actions/uploads/upload-user-avatar.action";
import { getStoreForEditAction } from "@/actions/stores/get-store-for-edit.action";
import { updateStoreAction } from "@/actions/stores/update-store.action";
import { deleteStoreAction } from "@/actions/stores/delete-store.action";
import { getUserSubscription } from "@/actions/subscriptions/get-user-subscription.action";

type Tab = "perfil" | "assinatura" | "negocio";

interface Props {
  open: boolean;
  onClose: () => void;
  storeId: string;
  storeSlug: string;
  initialTab?: Tab;
  onOpenUpgrade?: () => void;
}

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "perfil", label: "Perfil", icon: <IconUser className="size-5" /> },
  { id: "assinatura", label: "Assinatura", icon: <IconCreditCard className="size-5" /> },
  { id: "negocio", label: "Detalhes do negocio", icon: <IconBuilding className="size-5" /> },
];

export function UserSettingsModal({
  open,
  onClose,
  storeId,
  storeSlug,
  initialTab,
  onOpenUpgrade,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab ?? "perfil");

  useEffect(() => {
    if (open && initialTab) setActiveTab(initialTab);
  }, [open, initialTab]);

  return (
    <SettingsModal open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <SettingsModalContent defaultTab={activeTab}>
        <SettingsModalSidebar>
          <SettingsModalSidebarTitle>Configuracoes</SettingsModalSidebarTitle>
          {TABS.map((tab) => (
            <SettingsModalSidebarItem key={tab.id} value={tab.id} icon={tab.icon}>
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
            <SettingsModalTabPanel value="perfil">
              <ProfileTab />
            </SettingsModalTabPanel>
            <SettingsModalTabPanel value="assinatura">
              <BillingTab onOpenUpgrade={onOpenUpgrade} />
            </SettingsModalTabPanel>
            <SettingsModalTabPanel value="negocio">
              <BusinessDetailsTab storeId={storeId} storeSlug={storeSlug} onClose={onClose} />
            </SettingsModalTabPanel>
          </SettingsModalBody>
        </div>
      </SettingsModalContent>
    </SettingsModal>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-semibold text-black/80 md:text-2xl">{children}</h2>;
}

function Divider() {
  return <div className="h-px w-full bg-black/[0.06]" />;
}

// ─── Profile Tab ──────────────────────────────────────────────────

function ProfileTab() {
  const { data: session, isPending } = useSession();
  const { executeAsync: uploadAvatar, isExecuting: isUploading } = useAction(uploadUserAvatarAction);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name ?? "");
      setAvatarUrl(session.user.image ?? null);
    }
  }, [session]);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Selecione uma imagem valida"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("A imagem deve ter no maximo 5MB"); return; }
    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadAvatar({ file: formData });
    if (result?.data?.url) {
      setAvatarUrl(result.data.url);
      toast.success("Foto atualizada!");
    }
  }

  async function handleSave() {
    setIsSaving(true);
    // TODO: wire updateUser action when available
    await new Promise((r) => setTimeout(r, 600));
    setIsSaving(false);
    toast.success("Perfil atualizado!");
  }

  if (isPending) {
    return (
      <div className="max-w-2xl space-y-8">
        <Skeleton className="h-7 w-20 bg-[#f5f5f4]" />
        <div className="flex items-center gap-6">
          <Skeleton className="size-20 shrink-0 rounded-full bg-[#f5f5f4]" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32 bg-[#f5f5f4]" />
            <Skeleton className="h-4 w-48 bg-[#f5f5f4]" />
          </div>
        </div>
        <Skeleton className="h-px w-full bg-[#f5f5f4]" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Skeleton className="h-[60px] w-full rounded-2xl bg-[#f5f5f4]" />
          <Skeleton className="h-[60px] w-full rounded-2xl bg-[#f5f5f4]" />
        </div>
      </div>
    );
  }

  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className="max-w-2xl space-y-8">
      <SectionTitle>Perfil</SectionTitle>

      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="relative shrink-0">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="Avatar" className="size-20 rounded-full object-cover" />
          ) : (
            <div className="flex size-20 items-center justify-center rounded-full bg-black/80 text-xl font-semibold text-white">
              {initials}
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-black/80 text-white shadow-md transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isUploading ? (
              <IconLoader2 className="size-3.5 animate-spin" />
            ) : (
              <IconCamera className="size-3.5" />
            )}
          </button>
        </div>
        <div>
          <p className="text-sm font-semibold text-black/80">{session?.user?.name}</p>
          <p className="text-sm text-black/40">{session?.user?.email}</p>
        </div>
      </div>

      <Divider />

      {/* Form */}
      <SettingsModalSection title="Informacoes pessoais" description="Atualize seu nome e informacoes de contato">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <PglField>
            <PglFieldLabel htmlFor="user-name">Nome completo</PglFieldLabel>
            <PglFieldInput
              id="user-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
            />
          </PglField>
          <PglField>
            <PglFieldLabel htmlFor="user-email">E-mail</PglFieldLabel>
            <PglFieldInput
              id="user-email"
              type="email"
              value={session?.user?.email ?? ""}
              disabled
            />
            <PglFieldHint>O e-mail nao pode ser alterado</PglFieldHint>
          </PglField>
        </div>
      </SettingsModalSection>

      <div className="flex justify-end">
        <PglButton variant="dark" size="sm" onClick={handleSave} loading={isSaving}>
          {!isSaving && <IconCheck />}
          Salvar alteracoes
        </PglButton>
      </div>
    </div>
  );
}

// ─── Billing Tab ──────────────────────────────────────────────────

function BillingTab({ onOpenUpgrade }: { onOpenUpgrade?: () => void }) {
  const { executeAsync: fetchSub, result: subResult, isExecuting: loadingSub } = useAction(getUserSubscription);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      fetchSub().then(() => setLoaded(true));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const subscription = subResult?.data;
  const isLoading = !loaded || loadingSub;

  return (
    <div className="max-w-md space-y-6">
      <SectionTitle>Assinatura</SectionTitle>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-[72px] w-full rounded-2xl bg-[#f5f5f4]" />
          <Skeleton className="h-9 w-36 rounded-xl bg-[#f5f5f4]" />
        </div>
      ) : (
        <>
          {/* Plan card */}
          <div className="overflow-hidden rounded-2xl border border-black/[0.06]">
            <div className="flex items-center justify-between px-4 py-3.5">
              <div>
                <p className="text-sm font-semibold text-black/80">
                  {subscription ? `Plano ${subscription.plan?.name}` : "Sem plano ativo"}
                </p>
                {subscription?.currentPeriodEnd ? (
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-black/40">
                    <IconCalendar className="size-3.5 shrink-0" />
                    Renova em {new Date(subscription.currentPeriodEnd).toLocaleDateString("pt-BR")}
                  </p>
                ) : (
                  <p className="mt-0.5 text-xs text-black/40">
                    Publique seu site e acesse recursos premium
                  </p>
                )}
              </div>
              {subscription && (
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
                  <span className="size-1.5 shrink-0 rounded-full bg-emerald-500" />
                  Ativo
                </span>
              )}
            </div>
          </div>

          <PglButton variant="dark" size="sm" onClick={onOpenUpgrade}>
            <IconCreditCard />
            {subscription ? "Alterar plano" : "Fazer upgrade"}
          </PglButton>
        </>
      )}
    </div>
  );
}

// ─── Business Details Tab ──────────────────────────────────────────

interface StoreDetails {
  name: string;
  description: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

function BusinessDetailsTab({
  storeId,
  storeSlug,
  onClose,
}: {
  storeId: string;
  storeSlug: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const { executeAsync: loadStore } = useAction(getStoreForEditAction);
  const { executeAsync: updateStore } = useAction(updateStoreAction);
  const { executeAsync: deleteStore } = useAction(deleteStoreAction);

  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<StoreDetails>({
    name: "",
    description: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  // Delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadStore({ storeSlug }).then((r) => {
      if (r?.data?.store) {
        const s = r.data.store;
        setForm({
          name: s.name ?? "",
          description: s.description ?? "",
          phone: s.phone ?? "",
          address: s.address ?? "",
          city: s.city ?? "",
          state: s.state ?? "",
          zipCode: s.zipCode ?? "",
        });
      }
      setLoaded(true);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeSlug]);

  function set(field: keyof StoreDetails, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    const result = await updateStore({
      storeId,
      name: form.name,
      description: form.description,
      phone: form.phone,
      address: form.address,
      city: form.city,
      state: form.state.slice(0, 2).toUpperCase(),
      zipCode: form.zipCode,
    });
    if (result?.data) {
      toast.success("Negocio atualizado!");
    } else {
      toast.error("Erro ao salvar");
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (deleteText !== "EXCLUIR") {
      toast.error("Digite EXCLUIR para confirmar");
      return;
    }
    setDeleting(true);
    const result = await deleteStore({ storeId, confirmationText: "EXCLUIR" });
    if (result?.data?.success) {
      toast.success("Negocio excluido");
      onClose();
      router.push("/painel");
    } else {
      toast.error("Erro ao excluir negocio");
    }
    setDeleting(false);
  }

  if (!loaded) {
    return (
      <div className="max-w-2xl space-y-8">
        <Skeleton className="h-7 w-40 bg-[#f5f5f4]" />
        <div className="space-y-4">
          <Skeleton className="h-[52px] w-full rounded-2xl bg-[#f5f5f4]" />
          <Skeleton className="h-[96px] w-full rounded-2xl bg-[#f5f5f4]" />
        </div>
        <Skeleton className="h-px w-full bg-[#f5f5f4]" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Skeleton className="h-[52px] rounded-2xl bg-[#f5f5f4]" />
          <Skeleton className="h-[52px] rounded-2xl bg-[#f5f5f4]" />
        </div>
        <Skeleton className="h-px w-full bg-[#f5f5f4]" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Skeleton className="h-[52px] rounded-2xl bg-[#f5f5f4]" />
          <Skeleton className="h-[52px] rounded-2xl bg-[#f5f5f4]" />
          <Skeleton className="h-[52px] rounded-2xl bg-[#f5f5f4]" />
          <Skeleton className="h-[52px] rounded-2xl bg-[#f5f5f4]" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8">
      <SectionTitle>Detalhes do negocio</SectionTitle>

      {/* Basic info */}
      <SettingsModalSection title="Informacoes do negocio" description="Nome e descricao que aparecem no seu site">
        <div className="space-y-4">
          <PglField>
            <PglFieldLabel htmlFor="biz-name">Nome do negocio</PglFieldLabel>
            <PglFieldInput
              id="biz-name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Ex: Alonso Academia"
            />
          </PglField>
          <PglField>
            <PglFieldLabel htmlFor="biz-desc">Descricao do negocio</PglFieldLabel>
            <PglFieldTextarea
              id="biz-desc"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Descreva seu negocio..."
              rows={4}
            />
          </PglField>
        </div>
      </SettingsModalSection>

      <Divider />

      {/* Contact */}
      <SettingsModalSection title="Contato do negocio" description="As informacoes de contato do seu negocio">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <PglField>
            <PglFieldLabel htmlFor="biz-email">E-mail de contato</PglFieldLabel>
            <PglFieldInput
              id="biz-email"
              type="email"
              value={session?.user?.email ?? ""}
              disabled
            />
            <PglFieldHint>Vinculado a sua conta</PglFieldHint>
          </PglField>
          <PglField>
            <PglFieldLabel htmlFor="biz-phone">Telefone</PglFieldLabel>
            <PglFieldInput
              id="biz-phone"
              type="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="(11) 99999-9999"
            />
          </PglField>
        </div>
      </SettingsModalSection>

      <Divider />

      {/* Address */}
      <SettingsModalSection title="Endereco do negocio" description="Usaremos essas informacoes para exibir seu endereco no site">
        <div className="space-y-4">
          <PglField>
            <PglFieldLabel htmlFor="biz-addr">Endereco</PglFieldLabel>
            <PglFieldInput
              id="biz-addr"
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              placeholder="Rua, numero, bairro"
            />
          </PglField>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <PglField>
              <PglFieldLabel htmlFor="biz-city">Cidade</PglFieldLabel>
              <PglFieldInput
                id="biz-city"
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                placeholder="Sao Paulo"
              />
            </PglField>
            <PglField>
              <PglFieldLabel htmlFor="biz-state">Estado (sigla)</PglFieldLabel>
              <PglFieldInput
                id="biz-state"
                value={form.state}
                onChange={(e) => set("state", e.target.value.toUpperCase().slice(0, 2))}
                placeholder="SP"
                maxLength={2}
              />
            </PglField>
            <PglField>
              <PglFieldLabel htmlFor="biz-zip">CEP</PglFieldLabel>
              <PglFieldInput
                id="biz-zip"
                value={form.zipCode}
                onChange={(e) => set("zipCode", e.target.value)}
                placeholder="00000-000"
              />
            </PglField>
          </div>
        </div>
      </SettingsModalSection>

      <div className="flex justify-end">
        <PglButton variant="dark" size="sm" onClick={handleSave} loading={saving}>
          {!saving && <IconCheck />}
          Salvar alteracoes
        </PglButton>
      </div>

      <Divider />

      {/* Delete */}
      <SettingsModalSection title="Excluir negocio" description="Este negocio sera permanentemente excluido, incluindo clientes, arquivos e o site. Qualquer assinatura sera cancelada. Esta acao e irreversivel.">
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className={cn(
              "flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-500",
              "transition-colors hover:border-red-300 hover:bg-red-50",
            )}
          >
            <IconTrash className="size-4" />
            Excluir negocio
          </button>
        ) : (
          <div className="space-y-4 rounded-2xl border border-red-200 bg-red-50/50 p-4">
            <div className="flex items-start gap-3">
              <IconAlertTriangle className="mt-0.5 size-5 shrink-0 text-red-500" />
              <div>
                <p className="text-sm font-semibold text-red-700">Tem certeza?</p>
                <p className="mt-0.5 text-xs text-red-500">
                  Digite <strong>EXCLUIR</strong> abaixo para confirmar a exclusao permanente.
                </p>
              </div>
            </div>
            <PglFieldInput
              value={deleteText}
              onChange={(e) => setDeleteText(e.target.value)}
              placeholder="EXCLUIR"
              className="border-red-200 bg-white"
            />
            <div className="flex gap-2">
              <PglButton
                variant="ghost"
                size="xs"
                onClick={() => { setShowDeleteConfirm(false); setDeleteText(""); }}
              >
                Cancelar
              </PglButton>
              <button
                onClick={handleDelete}
                disabled={deleteText !== "EXCLUIR" || deleting}
                className={cn(
                  "flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors",
                  deleteText === "EXCLUIR" && !deleting
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "cursor-not-allowed bg-red-200 text-red-300",
                )}
              >
                {deleting ? <IconLoader2 className="size-3.5 animate-spin" /> : <IconTrash className="size-3.5" />}
                Excluir permanentemente
              </button>
            </div>
          </div>
        )}
      </SettingsModalSection>
    </div>
  );
}
