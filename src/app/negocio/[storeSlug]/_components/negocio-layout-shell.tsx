"use client";

import { type ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import { IconMenu2, IconChevronRight } from "@tabler/icons-react";
import { NegocioSidebar } from "./negocio-sidebar";

interface Props {
  children: ReactNode;
  storeName: string;
  storeSlug: string;
  userStores: { id: string; name: string; slug: string }[];
}

const PAGE_LABELS: Record<string, string> = {
  home: "Inicio",
  contatos: "Contatos",
  analitica: "Analitica",
  site: "Meu Site",
};

export function NegocioLayoutShell({ children, storeName, storeSlug, userStores }: Props) {
  const pathname = usePathname();
  const isEditorRoute = pathname.includes(`/negocio/${storeSlug}/site`);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isEditorRoute) {
    return (
      <div className="overflow-hidden" style={{ fontFamily: "system-ui, -apple-system, sans-serif", height: "100dvh" }}>
        {children}
      </div>
    );
  }

  const currentPage = pathname === `/negocio/${storeSlug}`
    ? "home"
    : pathname.includes("/contatos") ? "contatos"
    : pathname.includes("/analitica") ? "analitica"
    : "home";
  const pageLabel = PAGE_LABELS[currentPage] ?? "Inicio";

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{ fontFamily: "system-ui, -apple-system, sans-serif", backgroundColor: "#ffffff", height: "100dvh" }}
    >
      {/* Mobile topbar */}
      <div
        className="flex items-center gap-2 px-3 py-2.5 md:hidden shrink-0"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
      >
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="rounded-[8px] p-1.5 transition-all duration-150"
          style={{ color: "#737373" }}
        >
          <IconMenu2 style={{ width: 20, height: 20 }} />
        </button>

        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <div
            className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold text-white shrink-0"
            style={{ backgroundColor: "#171717" }}
          >
            {storeName.charAt(0).toUpperCase()}
          </div>
          <span className="text-[13px] font-semibold truncate" style={{ color: "#1a1a1a" }}>
            {storeName}
          </span>
          <IconChevronRight style={{ width: 12, height: 12, color: "#a3a3a3", flexShrink: 0 }} />
          <span className="text-[13px] font-medium" style={{ color: "#737373" }}>
            {pageLabel}
          </span>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        <NegocioSidebar
          storeName={storeName}
          storeSlug={storeSlug}
          userStores={userStores}
          mobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
