"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  IconHome,
  IconDeviceDesktop,
  IconUsers,
  IconChartBar,
  IconSettings,
  IconHelp,
  IconSparkles,
  IconChevronDown,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Props {
  storeName: string;
  storeSlug: string;
  userStores: { id: string; name: string; slug: string }[];
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

function getNavItems(storeSlug: string) {
  return [
    { id: "home", label: "Inicio", icon: IconHome, href: `/negocio/${storeSlug}` },
    { id: "site", label: "Meu Site", icon: IconDeviceDesktop, href: `/negocio/${storeSlug}/site` },
    { id: "contatos", label: "Contatos", icon: IconUsers, href: `/negocio/${storeSlug}/contatos` },
    { id: "analitica", label: "Analitica", icon: IconChartBar, href: `/negocio/${storeSlug}/analitica` },
  ];
}

export function NegocioSidebar({ storeName, storeSlug, userStores, mobileOpen, onMobileClose }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const items = getNavItems(storeSlug);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navContent = (onItemClick?: () => void) => (
    <>
      {/* Store name + dropdown */}
      <div className="px-3 pt-4 pb-2">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex w-full items-center gap-2 rounded-[8px] px-2 py-1.5 transition-all duration-150"
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f5f5f4"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            <div
              className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold text-white shrink-0"
              style={{ backgroundColor: "#171717" }}
            >
              {storeName.charAt(0).toUpperCase()}
            </div>
            <span className="flex-1 truncate text-left text-[14px] font-semibold" style={{ color: "#1a1a1a" }}>
              {storeName}
            </span>
            <IconChevronDown style={{ width: 14, height: 14, color: "#737373", flexShrink: 0 }} />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
              <div
                className="absolute left-0 top-full z-50 mt-1 w-full rounded-[10px] py-1"
                style={{ backgroundColor: "#ffffff", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 12px 40px rgba(0,0,0,0.12)" }}
              >
                {userStores.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { setDropdownOpen(false); if (s.slug !== storeSlug) router.push(`/negocio/${s.slug}`); onItemClick?.(); }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-[13px] transition-colors"
                    style={{
                      backgroundColor: s.slug === storeSlug ? "#f5f5f4" : "transparent",
                      color: s.slug === storeSlug ? "#1a1a1a" : "#737373",
                      fontWeight: s.slug === storeSlug ? 500 : 400,
                    }}
                    onMouseEnter={(e) => { if (s.slug !== storeSlug) e.currentTarget.style.backgroundColor = "#fafaf9"; }}
                    onMouseLeave={(e) => { if (s.slug !== storeSlug) e.currentTarget.style.backgroundColor = "transparent"; }}
                  >
                    <div className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-semibold text-white" style={{ backgroundColor: "#171717" }}>
                      {s.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="truncate">{s.name}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Nav items */}
      <div className="px-2 py-1 flex-1">
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
              className="flex w-full items-center gap-[10px] rounded-[10px] px-3 py-2 my-0.5 transition-all duration-150"
              style={{
                backgroundColor: isActive ? "#f5f5f4" : "transparent",
                color: isActive ? "#1a1a1a" : "#737373",
                fontWeight: isActive ? 500 : 400,
                fontSize: 14,
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = "#fafaf9"; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = "transparent"; }}
            >
              <item.icon style={{ width: 18, height: 18, flexShrink: 0 }} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom section */}
      <div className="px-3 pb-3">
        <div
          className="rounded-[12px] p-4 mb-3"
          style={{ backgroundColor: "#f5f5f4", border: "1px solid rgba(0,0,0,0.06)" }}
        >
          <p className="text-[13px] font-semibold" style={{ color: "#1a1a1a" }}>Publique seu site</p>
          <p className="mt-1 text-[12px]" style={{ color: "#737373" }}>Acesse recursos premium</p>
          <button
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-[8px] py-2 text-[13px] font-medium transition-opacity"
            style={{ backgroundColor: "#171717", color: "#ffffff" }}
            onClick={() => { router.push(`/negocio/${storeSlug}/site`); onItemClick?.(); }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
          >
            <IconSparkles style={{ width: 14, height: 14 }} />
            Fazer upgrade
          </button>
        </div>
        <button
          onClick={() => { router.push(`/negocio/${storeSlug}/site`); onItemClick?.(); }}
          className="flex w-full items-center gap-2 rounded-[8px] px-2 py-1.5 text-[13px] transition-colors"
          style={{ color: "#737373" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#1a1a1a"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "#737373"; }}
        >
          <IconSettings style={{ width: 15, height: 15 }} />
          Configuracoes
        </button>
        <button
          className="flex w-full items-center gap-2 rounded-[8px] px-2 py-1.5 text-[13px] transition-colors"
          style={{ color: "#737373" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#1a1a1a"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "#737373"; }}
        >
          <IconHelp style={{ width: 15, height: 15 }} />
          Ajuda
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile sidebar overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 transition-opacity duration-200 md:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
        onClick={onMobileClose}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col transition-transform duration-200 ease-out md:hidden",
        )}
        style={{
          backgroundColor: "#ffffff",
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        {navContent(onMobileClose)}
      </aside>

      {/* Desktop sidebar */}
      <div
        className="hidden w-[200px] shrink-0 flex-col md:flex"
        style={{ borderRight: "1px solid rgba(0,0,0,0.06)" }}
      >
        {navContent()}
      </div>
    </>
  );
}
