"use client";

import { type ReactNode, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IconMenu2, IconX, IconHome, IconDeviceDesktop, IconUsers, IconChartBar } from "@tabler/icons-react";
import { NegocioSidebar } from "./negocio-sidebar";
import { cn } from "@/lib/utils";

interface Props {
  children: ReactNode;
  storeName: string;
  storeSlug: string;
  userStores: { id: string; name: string; slug: string }[];
}

export function NegocioLayoutShell({ children, storeName, storeSlug, userStores }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const isEditorRoute = pathname.includes(`/negocio/${storeSlug}/site`);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isEditorRoute) {
    return (
      <div className="overflow-hidden" style={{ fontFamily: "system-ui, -apple-system, sans-serif", height: "100dvh" }}>
        {children}
      </div>
    );
  }

  const navItems = [
    { id: "home", label: "Inicio", icon: IconHome, href: `/negocio/${storeSlug}` },
    { id: "site", label: "Meu Site", icon: IconDeviceDesktop, href: `/negocio/${storeSlug}/site` },
    { id: "contatos", label: "Contatos", icon: IconUsers, href: `/negocio/${storeSlug}/contatos` },
    { id: "analitica", label: "Analitica", icon: IconChartBar, href: `/negocio/${storeSlug}/analitica` },
  ];

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{ fontFamily: "system-ui, -apple-system, sans-serif", backgroundColor: "#ffffff", height: "100dvh" }}
    >
      {/* Mobile topbar */}
      <div
        className="flex items-center justify-between px-4 py-3 md:hidden shrink-0"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold text-white"
            style={{ backgroundColor: "#171717" }}
          >
            {storeName.charAt(0).toUpperCase()}
          </div>
          <span className="text-[14px] font-semibold truncate max-w-[180px]" style={{ color: "#1a1a1a" }}>
            {storeName}
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-[8px] p-1.5"
          style={{ color: "#737373" }}
        >
          {mobileMenuOpen ? <IconX style={{ width: 20, height: 20 }} /> : <IconMenu2 style={{ width: 20, height: 20 }} />}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div
          className="absolute inset-x-0 top-[52px] z-50 md:hidden"
          style={{ backgroundColor: "#ffffff", borderBottom: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
        >
          <div className="px-3 py-2">
            {navItems.map((item) => {
              const isActive = item.id === "home"
                ? pathname === `/negocio/${storeSlug}`
                : pathname.includes(item.href);
              return (
                <button
                  key={item.id}
                  onClick={() => { router.push(item.href); setMobileMenuOpen(false); }}
                  className={cn("flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 my-0.5")}
                  style={{
                    backgroundColor: isActive ? "#f5f5f4" : "transparent",
                    color: isActive ? "#1a1a1a" : "#737373",
                    fontWeight: isActive ? 500 : 400,
                    fontSize: 14,
                  }}
                >
                  <item.icon style={{ width: 18, height: 18 }} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Desktop layout: sidebar + content */}
      <div className="flex flex-1 overflow-hidden">
        <NegocioSidebar
          storeName={storeName}
          storeSlug={storeSlug}
          userStores={userStores}
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
