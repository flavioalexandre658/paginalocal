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
              "flex w-full items-center rounded-xl text-[14px] transition-all duration-150",
              expanded ? "gap-[10px] px-3 py-2 my-0.5" : "justify-center p-2.5 my-0.5",
              isActive
                ? "bg-slate-100 text-slate-900 font-medium dark:bg-slate-800 dark:text-white"
                : "text-slate-500 hover:bg-slate-100/60 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200",
            )}
            title={!expanded ? item.label : undefined}
          >
            <item.icon className="h-[18px] w-[18px] shrink-0" />
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
      <div className="rounded-xl p-4 border border-slate-200/40 bg-slate-50/80 dark:border-slate-700/40 dark:bg-slate-800/50">
        <p className="text-[13px] font-semibold text-slate-900 dark:text-white">Publique seu site</p>
        <p className="text-[12px] mt-0.5 text-slate-500 dark:text-slate-400">Acesse recursos premium</p>
        <PglButton variant="dark" size="sm" className="mt-3 w-full">
          <IconSparkles className="h-3.5 w-3.5" />
          Fazer upgrade
        </PglButton>
      </div>
    </div>
  );
}

function FooterLinks({ expanded, onOpenSettings }: { expanded: boolean; onOpenSettings?: () => void }) {
  return (
    <div className={cn("py-2 border-t border-slate-200/40 dark:border-slate-700/40", expanded ? "px-2" : "px-1")}>
      <PglButton
        variant="ghost"
        size={expanded ? "sm" : "icon-sm"}
        onClick={onOpenSettings}
        className={cn("w-full", expanded ? "justify-start" : "")}
      >
        <IconSettings className="h-4 w-4" />
        {expanded && <span>Configuracoes</span>}
      </PglButton>
      <PglButton
        variant="ghost"
        size={expanded ? "sm" : "icon-sm"}
        className={cn("w-full", expanded ? "justify-start" : "")}
      >
        <IconHelp className="h-4 w-4" />
        {expanded && <span>Ajuda</span>}
      </PglButton>
    </div>
  );
}

function StoreDropdown({
  storeName, storeSlug, userStores, variant, onStoreSelect, onAddBusiness, onSignOut,
}: {
  storeName: string; storeSlug: string | undefined; userStores: { id: string; name: string; slug: string }[] | undefined;
  variant: "desktop" | "mobile"; onStoreSelect: (slug: string) => void; onAddBusiness: () => void; onSignOut: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  const content = (
    <>
      <div className="flex flex-col items-center py-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-[18px] font-semibold text-white dark:bg-white dark:text-slate-900">
          {storeName.charAt(0).toUpperCase()}
        </div>
        <p className="mt-2 text-[14px] font-semibold text-slate-900 dark:text-white">{storeName}</p>
      </div>
      <div className="my-1 h-px bg-slate-200/60 dark:bg-slate-700/60" />
      <div className="px-2 py-1">
        {userStores?.map((s) => (
          <button
            key={s.id}
            onClick={() => { setIsOpen(false); onStoreSelect(s.slug); }}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] transition-colors",
              s.slug === storeSlug
                ? "bg-slate-100 text-slate-900 font-medium dark:bg-slate-800 dark:text-white"
                : "text-slate-500 hover:bg-slate-100/60 dark:text-slate-400 dark:hover:bg-slate-800/60",
            )}
          >
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[10px] font-semibold text-white dark:bg-white dark:text-slate-900">
              {s.name.charAt(0).toUpperCase()}
            </div>
            <span className="truncate">{s.name}</span>
          </button>
        ))}
      </div>
      <div className="my-1 h-px bg-slate-200/60 dark:bg-slate-700/60" />
      <div className="px-2 py-1">
        <button
          onClick={() => { setIsOpen(false); onAddBusiness(); }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] text-slate-500 transition-colors hover:bg-slate-100/60 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800/60"
        >
          + Adicionar negocio
        </button>
        <button
          onClick={() => { setIsOpen(false); onSignOut(); }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-950 dark:hover:text-red-400"
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
          "flex w-full items-center gap-2 rounded-lg transition-all duration-150 hover:bg-slate-100/60 dark:hover:bg-slate-800/60",
          variant === "desktop" ? "px-2 py-1.5" : "px-2 py-1",
        )}
      >
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[11px] font-semibold text-white dark:bg-white dark:text-slate-900">
          {storeName.charAt(0).toUpperCase()}
        </div>
        <span className="flex-1 truncate text-left text-[14px] font-semibold text-slate-900 dark:text-white">
          {storeName}
        </span>
        <IconChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0 transition-transform duration-200" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)" }} />
      </button>

      {isOpen && variant === "desktop" && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div
            className="fixed z-50 w-[260px] rounded-xl border border-slate-200/60 bg-white/95 py-2 shadow-2xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-900/95 dark:shadow-slate-900/50"
            style={{
              top: btnRef.current ? btnRef.current.getBoundingClientRect().bottom + 8 : 60,
              left: btnRef.current ? btnRef.current.getBoundingClientRect().left : 12,
            }}
          >
            {content}
          </div>
        </>
      )}

      {isOpen && variant === "mobile" && (
        <div className="mt-2 rounded-xl border border-slate-200/60 bg-white/95 py-2 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-900/95">
          {content}
        </div>
      )}
    </div>
  );
}

export function EditorSidebar({
  collapsed, mobileOverlay, mobileMenuOpen, onCloseMobileMenu,
  storeName, storeSlug, userStores, onOpenSettings,
}: Props) {
  const router = useRouter();

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
            "fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-white/95 backdrop-blur-xl transition-transform duration-200 ease-out md:hidden dark:bg-slate-900/95",
          )}
          style={{ fontFamily: "system-ui, -apple-system, sans-serif", transform: mobileMenuOpen ? "translateX(0)" : "translateX(-100%)" }}
        >
          <div className="px-4 py-4 border-b border-slate-200/40 dark:border-slate-700/40">
            {storeName && (
              <StoreDropdown
                storeName={storeName} storeSlug={storeSlug} userStores={userStores} variant="mobile"
                onStoreSelect={(slug) => { if (slug !== storeSlug) { onCloseMobileMenu?.(); router.push(`/negocio/${slug}/site`); } }}
                onAddBusiness={() => { onCloseMobileMenu?.(); router.push("/onboarding"); }}
                onSignOut={async () => { onCloseMobileMenu?.(); const { signOut } = await import("@/lib/auth-client"); await signOut({ fetchOptions: { onSuccess: () => { router.push("/entrar"); router.refresh(); } } }); }}
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
      className="flex h-full shrink-0 flex-col bg-white transition-all duration-200 dark:bg-slate-900"
      style={{ width: collapsed ? 56 : 220, fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      {!collapsed && storeName && (
        <div className="px-3 pt-4 pb-1">
          <StoreDropdown
            storeName={storeName} storeSlug={storeSlug} userStores={userStores} variant="desktop"
            onStoreSelect={(slug) => { if (slug !== storeSlug) router.push(`/negocio/${slug}`); }}
            onAddBusiness={() => router.push("/onboarding")}
            onSignOut={async () => { const { signOut } = await import("@/lib/auth-client"); await signOut({ fetchOptions: { onSuccess: () => { router.push("/entrar"); router.refresh(); } } }); }}
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
