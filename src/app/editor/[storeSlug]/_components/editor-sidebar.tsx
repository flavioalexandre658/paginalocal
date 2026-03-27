"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
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
}

function NavItems({ expanded, storeSlug, onItemClick }: { expanded: boolean; storeSlug: string; onItemClick?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const items = getNavItems(storeSlug);

  return (
    <div className={cn("py-2", expanded ? "px-2" : "px-1")}>
      {items.map((item) => {
        const isActive = item.id === "site"
          ? pathname.includes(`/negocio/${storeSlug}/site`) || pathname.includes(`/editor/${storeSlug}`)
          : item.id === "home"
            ? pathname === `/negocio/${storeSlug}`
            : pathname.includes(item.href);
        return (
          <button
            key={item.id}
            onClick={() => { router.push(item.href); onItemClick?.(); }}
            className={cn(
              "flex w-full items-center rounded-[10px] transition-all duration-150",
              expanded ? "gap-[10px] px-3 py-2 my-0.5" : "justify-center p-2.5 my-0.5",
            )}
            style={{
              backgroundColor: isActive ? "#f5f5f4" : "transparent",
              color: isActive ? "#1a1a1a" : "#737373",
              fontWeight: isActive ? 500 : 400,
              fontSize: 14,
            }}
            title={!expanded ? item.label : undefined}
            onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = "#fafaf9"; }}
            onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            <item.icon style={{ width: 18, height: 18, flexShrink: 0 }} />
            {expanded && <span>{item.label}</span>}
          </button>
        );
      })}
    </div>
  );
}

function UpgradeCard() {
  return (
    <div className="px-3 pb-2">
      <div
        className="rounded-[12px] p-4"
        style={{ backgroundColor: "#f5f5f4", border: "1px solid rgba(0,0,0,0.06)" }}
      >
        <p className="text-[13px] font-semibold" style={{ color: "#1a1a1a" }}>Publique seu site</p>
        <p className="text-[12px] mt-0.5" style={{ color: "#737373" }}>Acesse recursos premium</p>
        <button
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-[8px] py-2 text-[13px] font-medium text-white"
          style={{ backgroundColor: "#171717" }}
        >
          <IconSparkles style={{ width: 14, height: 14 }} />
          Fazer upgrade
        </button>
      </div>
    </div>
  );
}

function FooterLinks({ expanded, onOpenSettings }: { expanded: boolean; onOpenSettings?: () => void }) {
  return (
    <div
      className={cn("py-2", expanded ? "px-2" : "px-1")}
      style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
    >
      <button
        onClick={onOpenSettings}
        className={cn(
          "flex w-full items-center rounded-[8px] transition-all duration-150",
          expanded ? "gap-[10px] px-3 py-1.5" : "justify-center p-2",
        )}
        style={{ color: "#737373", fontSize: 13 }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "#1a1a1a"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "#737373"; }}
      >
        <IconSettings style={{ width: 16, height: 16 }} />
        {expanded && <span>Configuracoes</span>}
      </button>
      <button
        className={cn(
          "flex w-full items-center rounded-[8px] transition-all duration-150",
          expanded ? "gap-[10px] px-3 py-1.5" : "justify-center p-2",
        )}
        style={{ color: "#737373", fontSize: 13 }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "#1a1a1a"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "#737373"; }}
      >
        <IconHelp style={{ width: 16, height: 16 }} />
        {expanded && <span>Ajuda</span>}
      </button>
    </div>
  );
}

interface StoreListDropdownProps {
  storeName: string;
  storeSlug: string | undefined;
  userStores: { id: string; name: string; slug: string }[] | undefined;
  /** desktop: absolute-positioned overlay; mobile: inline below trigger */
  variant: "desktop" | "mobile";
  onStoreSelect: (slug: string) => void;
  onAddBusiness: () => void;
  onSignOut: () => void;
}

function StoreListDropdown({
  storeName,
  storeSlug,
  userStores,
  variant,
  onStoreSelect,
  onAddBusiness,
  onSignOut,
}: StoreListDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownContent = (
    <>
      <div className="flex flex-col items-center py-3">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full text-[18px] font-semibold text-white"
          style={{ backgroundColor: "#171717" }}
        >
          {storeName.charAt(0).toUpperCase()}
        </div>
        <p className="mt-2 text-[14px] font-semibold" style={{ color: "#1a1a1a" }}>{storeName}</p>
      </div>

      <div className="my-1" style={{ height: 1, backgroundColor: "rgba(0,0,0,0.06)" }} />

      <div className="px-2 py-1">
        {userStores?.map((s) => (
          <button
            key={s.id}
            onClick={() => { setIsOpen(false); onStoreSelect(s.slug); }}
            className="flex w-full items-center gap-3 rounded-[8px] px-3 py-2 text-[13px] transition-colors"
            style={{
              backgroundColor: s.slug === storeSlug ? "#f5f5f4" : "transparent",
              color: s.slug === storeSlug ? "#1a1a1a" : "#737373",
              fontWeight: s.slug === storeSlug ? 500 : 400,
            }}
            onMouseEnter={(e) => { if (s.slug !== storeSlug) e.currentTarget.style.backgroundColor = "#fafaf9"; }}
            onMouseLeave={(e) => { if (s.slug !== storeSlug) e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            <div
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
              style={{ backgroundColor: "#171717" }}
            >
              {s.name.charAt(0).toUpperCase()}
            </div>
            <span className="truncate">{s.name}</span>
          </button>
        ))}
      </div>

      <div className="my-1" style={{ height: 1, backgroundColor: "rgba(0,0,0,0.06)" }} />

      <div className="px-2 py-1">
        <button
          className="flex w-full items-center gap-3 rounded-[8px] px-3 py-2 text-[13px] transition-colors"
          style={{ color: "#737373" }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#fafaf9"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
          onClick={() => { setIsOpen(false); onAddBusiness(); }}
        >
          + Adicionar negocio
        </button>
        <button
          className="flex w-full items-center gap-3 rounded-[8px] px-3 py-2 text-[13px] transition-colors"
          style={{ color: "#737373" }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#fafaf9"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
          onClick={() => { setIsOpen(false); onSignOut(); }}
        >
          Sair
        </button>
      </div>
    </>
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center gap-2 rounded-[8px] px-2 transition-all duration-150",
          variant === "desktop" ? "py-1.5" : "py-1",
        )}
        onMouseEnter={(e) => { if (variant === "desktop") e.currentTarget.style.backgroundColor = "#f5f5f4"; }}
        onMouseLeave={(e) => { if (variant === "desktop") e.currentTarget.style.backgroundColor = "transparent"; }}
      >
        <div
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
          style={{ backgroundColor: "#171717" }}
        >
          {storeName.charAt(0).toUpperCase()}
        </div>
        <span className="flex-1 truncate text-left text-[14px] font-semibold" style={{ color: "#1a1a1a" }}>
          {storeName}
        </span>
        <IconChevronDown
          style={{
            width: 14, height: 14, color: "#737373", flexShrink: 0,
            transition: "transform 200ms",
            transform: isOpen ? "rotate(180deg)" : "rotate(0)",
          }}
        />
      </button>

      {isOpen && variant === "desktop" && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div
            className="absolute left-0 top-full z-50 mt-2 w-[260px] rounded-[12px] py-2"
            style={{ backgroundColor: "#ffffff", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 25px 60px rgba(0,0,0,0.15)" }}
          >
            {dropdownContent}
          </div>
        </>
      )}

      {isOpen && variant === "mobile" && (
        <div
          className="mt-2 rounded-[12px] py-2"
          style={{ backgroundColor: "#ffffff", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 12px 40px rgba(0,0,0,0.12)" }}
        >
          {dropdownContent}
        </div>
      )}
    </div>
  );
}

export function EditorSidebar({
  collapsed,
  mobileOverlay,
  mobileMenuOpen,
  onCloseMobileMenu,
  storeName,
  storeSlug,
  userStores,
  onOpenSettings,
}: Props) {
  const router = useRouter();

  if (mobileOverlay) {
    return (
      <>
        <div
          className={cn(
            "fixed inset-0 z-40 transition-opacity duration-200 md:hidden",
            mobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
          )}
          style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
          onClick={onCloseMobileMenu}
        />

        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col transition-transform duration-200 ease-out md:hidden",
          )}
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            backgroundColor: "#ffffff",
            transform: mobileMenuOpen ? "translateX(0)" : "translateX(-100%)",
          }}
        >
          <div
            className="px-4 py-4"
            style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
          >
            {storeName && (
              <StoreListDropdown
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
                onAddBusiness={() => { onCloseMobileMenu?.(); router.push("/painel"); }}
                onSignOut={async () => {
                  onCloseMobileMenu?.();
                  const { signOut } = await import("@/lib/auth-client");
                  await signOut({ fetchOptions: { onSuccess: () => { router.push("/entrar"); router.refresh(); } } });
                }}
              />
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            <NavItems expanded storeSlug={storeSlug ?? ""} onItemClick={onCloseMobileMenu} />
          </div>

          <UpgradeCard />
          <FooterLinks expanded onOpenSettings={() => { onCloseMobileMenu?.(); onOpenSettings?.(); }} />
        </aside>
      </>
    );
  }

  return (
    <aside
      className="flex h-full shrink-0 flex-col transition-all duration-200"
      style={{
        width: collapsed ? 56 : 220,
        fontFamily: "system-ui, -apple-system, sans-serif",
        backgroundColor: "#ffffff",
        borderRight: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      {!collapsed && storeName && (
        <div className="px-3 pt-4 pb-1">
          <StoreListDropdown
            storeName={storeName}
            storeSlug={storeSlug}
            userStores={userStores}
            variant="desktop"
            onStoreSelect={(slug) => {
              if (slug !== storeSlug) router.push(`/negocio/${slug}`);
            }}
            onAddBusiness={() => router.push("/onboarding")}
            onSignOut={async () => {
              const { signOut } = await import("@/lib/auth-client");
              await signOut({ fetchOptions: { onSuccess: () => { router.push("/entrar"); router.refresh(); } } });
            }}
          />
        </div>
      )}
      <div className="flex-1 overflow-y-auto">
        <NavItems expanded={!collapsed} storeSlug={storeSlug ?? ""} />
      </div>
      {!collapsed && <UpgradeCard />}
      <FooterLinks expanded={!collapsed} onOpenSettings={onOpenSettings} />
    </aside>
  );
}
