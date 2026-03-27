"use client";

import { useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { PglButton } from "@/components/ui/pgl-button";
import {
  IconDeviceDesktop,
  IconUsers,
  IconChartBar,
  IconSettings,
  IconHelp,
  IconSparkles,
  IconChevronDown,
  IconHome,
} from "@tabler/icons-react";

function getNavItems(storeSlug: string) {
  return [
    { id: "home", label: "Inicio", icon: IconHome, href: `/negocio/${storeSlug}` },
    { id: "site", label: "Meu Site", icon: IconDeviceDesktop, href: `/negocio/${storeSlug}/site` },
    { id: "contatos", label: "Contatos", icon: IconUsers, href: `/negocio/${storeSlug}/contatos` },
    { id: "analitica", label: "Analitica", icon: IconChartBar, href: `/negocio/${storeSlug}/analitica` },
  ];
}

interface Props {
  collapsed: boolean;
  mobileOverlay?: boolean;
  mobileMenuOpen?: boolean;
  onCloseMobileMenu?: () => void;
  storeName?: string;
  storeSlug?: string;
  userStores?: { id: string; name: string; slug: string }[];
  onOpenSettings?: () => void;
  onOpenUpgrade?: () => void;
}

// ─── Nav Items ─────────────────────────────────────────────────────────────

function NavItems({
  expanded,
  storeSlug,
  onItemClick,
}: {
  expanded: boolean;
  storeSlug: string;
  onItemClick?: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const items = getNavItems(storeSlug);

  return (
    <ul className="flex w-full min-w-0 flex-col gap-2">
      {items.map((item) => {
        const isActive =
          item.id === "site"
            ? pathname.includes(`/negocio/${storeSlug}/site`) ||
              pathname.includes(`/editor/${storeSlug}`)
            : item.id === "home"
            ? pathname === `/negocio/${storeSlug}`
            : pathname.includes(item.href);

        return (
          <li key={item.id} className="relative flex items-center gap-1">
            <button
              data-active={isActive}
              onClick={() => {
                router.push(item.href);
                onItemClick?.();
              }}
              title={!expanded ? item.label : undefined}
              className={cn(
                "flex w-full items-center overflow-hidden font-medium outline-none",
                "transition-[background,color] duration-150",
                "text-black/55 hover:bg-black/5 hover:text-black/80",
                "data-[active=true]:bg-black/5 data-[active=true]:text-black/80",
                expanded
                  ? "gap-0 rounded-xl px-2 py-1 text-sm has-[>svg:first-child]:pl-2 has-[>svg:first-child]:pr-3"
                  : "justify-center rounded-xl p-1.5",
              )}
            >
              <item.icon className="size-5 shrink-0" />
              {expanded && (
                <span className="inline-block max-w-40 truncate pl-1 text-sm">
                  {item.label}
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

// ─── Upgrade Card ───────────────────────────────────────────────────────────

function UpgradeCard({ onUpgrade }: { onUpgrade?: () => void }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl bg-white p-1 shadow-[0_0_0_1px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.1)]">
      <div className="px-2 pt-2 pb-1">
        <p className="text-sm font-medium text-black/80">Publique seu site</p>
        <p className="text-sm text-black/55">Acesse recursos premium</p>
      </div>
      <PglButton
        variant="dark"
        size="sm"
        className="w-full"
        onClick={onUpgrade}
      >
        <IconSparkles />
        Fazer upgrade
      </PglButton>
    </div>
  );
}

// ─── Footer Links ───────────────────────────────────────────────────────────

function FooterLinks({
  expanded,
  onOpenSettings,
}: {
  expanded: boolean;
  onOpenSettings?: () => void;
}) {
  return (
    <div className="flex flex-col gap-2 border-t border-black/5 pt-3">
      <ul className="flex w-full min-w-0 flex-col gap-2">
        <li className="relative flex items-center gap-1">
          <button
            onClick={onOpenSettings}
            className={cn(
              "flex w-full items-center overflow-hidden font-medium outline-none",
              "transition-[background,color] duration-150",
              "text-black/55 hover:bg-black/5 hover:text-black/80",
              expanded
                ? "gap-0 rounded-xl px-2 py-1 text-sm has-[>svg:first-child]:pl-2 has-[>svg:first-child]:pr-3"
                : "justify-center rounded-xl p-1.5",
            )}
          >
            <IconSettings className="size-5 shrink-0" />
            {expanded && (
              <span className="inline-block max-w-40 truncate pl-1 text-sm">
                Configuracoes
              </span>
            )}
          </button>
        </li>
        <li className="relative flex items-center gap-1">
          <button
            className={cn(
              "flex w-full items-center overflow-hidden font-medium outline-none",
              "transition-[background,color] duration-150",
              "text-black/55 hover:bg-black/5 hover:text-black/80",
              expanded
                ? "gap-0 rounded-xl px-2 py-1 text-sm has-[>svg:first-child]:pl-2 has-[>svg:first-child]:pr-3"
                : "justify-center rounded-xl p-1.5",
            )}
          >
            <IconHelp className="size-5 shrink-0" />
            {expanded && (
              <span className="inline-block max-w-40 truncate pl-1 text-sm">
                Ajuda
              </span>
            )}
          </button>
        </li>
      </ul>
    </div>
  );
}

// ─── Store Dropdown ─────────────────────────────────────────────────────────

function StoreDropdown({
  storeName,
  storeSlug,
  userStores,
  variant,
  collapsed,
  onStoreSelect,
  onAddBusiness,
  onSignOut,
}: {
  storeName: string;
  storeSlug: string | undefined;
  userStores: { id: string; name: string; slug: string }[] | undefined;
  variant: "desktop" | "mobile";
  collapsed?: boolean;
  onStoreSelect: (slug: string) => void;
  onAddBusiness: () => void;
  onSignOut: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  const dropdownContent = (
    <>
      <div className="flex flex-col items-center py-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/80 text-[16px] font-semibold text-white">
          {storeName.charAt(0).toUpperCase()}
        </div>
        <p className="mt-2 text-[13px] font-semibold text-black/80">
          {storeName}
        </p>
      </div>
      <div className="my-1 h-px bg-black/[0.06]" />
      <div className="px-2 py-1">
        {userStores?.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              setIsOpen(false);
              onStoreSelect(s.slug);
            }}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] transition-colors",
              s.slug === storeSlug
                ? "bg-black/5 font-medium text-black/80"
                : "text-black/55 hover:bg-black/5 hover:text-black/80",
            )}
          >
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black/80 text-[10px] font-semibold text-white">
              {s.name.charAt(0).toUpperCase()}
            </div>
            <span className="truncate">{s.name}</span>
          </button>
        ))}
      </div>
      <div className="my-1 h-px bg-black/[0.06]" />
      <div className="px-2 py-1">
        <button
          onClick={() => {
            setIsOpen(false);
            onAddBusiness();
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] text-black/55 transition-colors hover:bg-black/5 hover:text-black/80"
        >
          + Adicionar negocio
        </button>
        <button
          onClick={() => {
            setIsOpen(false);
            onSignOut();
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] text-black/55 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          Sair
        </button>
      </div>
    </>
  );

  return (
    <div>
      <button
        ref={btnRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative inline-flex h-8 w-full min-w-0 items-center gap-2 rounded-xl py-1 text-sm font-medium text-black/80 outline-none transition-[background,color] duration-150 hover:bg-black/5",
          collapsed ? "justify-center px-1" : "px-2",
        )}
        title={collapsed ? storeName : undefined}
      >
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black/80 text-[11px] font-semibold text-white">
          {storeName.charAt(0).toUpperCase()}
        </div>
        {!collapsed && (
          <>
            <span className="min-w-0 flex-1 truncate text-left text-sm font-medium">
              {storeName}
            </span>
            <IconChevronDown
              className="size-3.5 shrink-0 text-black/40 transition-transform duration-200"
              style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          </>
        )}
      </button>

      {isOpen && variant === "desktop" && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div
            className="fixed z-50 w-[240px] rounded-xl border border-black/[0.08] bg-white py-2 shadow-xl shadow-black/10"
            style={{
              top: btnRef.current
                ? btnRef.current.getBoundingClientRect().bottom + 6
                : 60,
              left: btnRef.current
                ? btnRef.current.getBoundingClientRect().left
                : 12,
            }}
          >
            {dropdownContent}
          </div>
        </>
      )}

      {isOpen && variant === "mobile" && (
        <div className="mt-2 rounded-xl border border-black/[0.08] bg-white py-2 shadow-xl shadow-black/10">
          {dropdownContent}
        </div>
      )}
    </div>
  );
}

// ─── Editor Sidebar ─────────────────────────────────────────────────────────

export function EditorSidebar({
  collapsed,
  mobileOverlay,
  mobileMenuOpen,
  onCloseMobileMenu,
  storeName,
  storeSlug,
  userStores,
  onOpenSettings,
  onOpenUpgrade,
}: Props) {
  const router = useRouter();

  const handleSignOut = async () => {
    const { signOut } = await import("@/lib/auth-client");
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/entrar");
          router.refresh();
        },
      },
    });
  };

  if (mobileOverlay) {
    return (
      <>
        <div
          className={cn(
            "fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-200 md:hidden",
            mobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          onClick={onCloseMobileMenu}
        />
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-sidebar transition-transform duration-200 ease-out md:hidden",
          )}
          style={{
            transform: mobileMenuOpen ? "translateX(0)" : "translateX(-100%)",
          }}
        >
          <div className="flex flex-col gap-3 px-3 pt-4 max-md:p-3">
            {storeName && (
              <StoreDropdown
                storeName={storeName}
                storeSlug={storeSlug}
                userStores={userStores}
                variant="mobile"
                onStoreSelect={(slug) => {
                  if (slug !== storeSlug) {
                    onCloseMobileMenu?.();
                    router.push(`/negocio/${slug}/site`);
                  }
                }}
                onAddBusiness={() => {
                  onCloseMobileMenu?.();
                  router.push("/onboarding");
                }}
                onSignOut={async () => {
                  onCloseMobileMenu?.();
                  await handleSignOut();
                }}
              />
            )}
          </div>
          <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto px-3 py-4">
            <NavItems
              expanded
              storeSlug={storeSlug ?? ""}
              onItemClick={onCloseMobileMenu}
            />
          </div>
          <div className="flex flex-col gap-3 px-3 pb-4">
            <UpgradeCard
              onUpgrade={() => {
                onCloseMobileMenu?.();
                onOpenUpgrade?.();
              }}
            />
            <FooterLinks
              expanded
              onOpenSettings={() => {
                onCloseMobileMenu?.();
                onOpenSettings?.();
              }}
            />
          </div>
        </aside>
      </>
    );
  }

  return (
    <aside
      className="flex h-full shrink-0 flex-col bg-sidebar transition-[width] duration-200"
      style={{ width: collapsed ? 52 : 220 }}
    >
      {/* Header */}
      {storeName && (
        <div className="px-3 pt-4">
          <StoreDropdown
            storeName={storeName}
            storeSlug={storeSlug}
            userStores={userStores}
            variant="desktop"
            collapsed={collapsed}
            onStoreSelect={(slug) => {
              if (slug !== storeSlug) router.push(`/negocio/${slug}`);
            }}
            onAddBusiness={() => router.push("/onboarding")}
            onSignOut={handleSignOut}
          />
        </div>
      )}

      {/* Nav */}
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto px-3 py-4">
        <NavItems expanded={!collapsed} storeSlug={storeSlug ?? ""} />
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-3 px-3 pb-4">
        {!collapsed && <UpgradeCard onUpgrade={onOpenUpgrade} />}
        <FooterLinks
          expanded={!collapsed}
          onOpenSettings={onOpenSettings}
        />
      </div>
    </aside>
  );
}
