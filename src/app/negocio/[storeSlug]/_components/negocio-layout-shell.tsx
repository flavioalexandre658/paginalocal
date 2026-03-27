"use client";

import { type ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import { IconMenu2 } from "@tabler/icons-react";
import { PglButton } from "@/components/ui/pgl-button";
import { EditorSidebar } from "@/app/editor/[storeSlug]/_components/editor-sidebar";
import { SiteSettingsModal } from "@/app/editor/[storeSlug]/_components/site-settings-modal";

interface Props {
  children: ReactNode;
  storeId: string;
  storeName: string;
  storeSlug: string;
  userStores: { id: string; name: string; slug: string }[];
}

export function NegocioLayoutShell({ children, storeId, storeName, storeSlug, userStores }: Props) {
  const pathname = usePathname();
  const isEditorRoute = pathname.includes(`/negocio/${storeSlug}/site`);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  if (isEditorRoute) {
    return (
      <div className="overflow-hidden" style={{ fontFamily: "system-ui, -apple-system, sans-serif", height: "100dvh" }}>
        {children}
      </div>
    );
  }

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{ fontFamily: "system-ui, -apple-system, sans-serif", backgroundColor: "#ffffff", height: "100dvh" }}
    >
      {/* Mobile topbar — same pattern as editor */}
      <div
        className="flex items-center gap-2 px-3 h-12 md:hidden shrink-0"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
      >
        <PglButton variant="ghost" size="icon-sm" onClick={() => setMobileMenuOpen(true)}>
          <IconMenu2 className="h-5 w-5" />
        </PglButton>

        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div
            className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold text-white shrink-0"
            style={{ backgroundColor: "#171717" }}
          >
            {storeName.charAt(0).toUpperCase()}
          </div>
          <span className="text-[13px] font-semibold truncate" style={{ color: "#1a1a1a" }}>
            {storeName}
          </span>
        </div>
      </div>

      {/* Desktop sidebar + content */}
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:block">
          <EditorSidebar
            collapsed={false}
            storeName={storeName}
            storeSlug={storeSlug}
            userStores={userStores}
            onOpenSettings={() => setSettingsOpen(true)}
          />
        </div>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      {/* Mobile sidebar overlay — reuse same component */}
      <EditorSidebar
        collapsed={false}
        mobileOverlay
        mobileMenuOpen={mobileMenuOpen}
        onCloseMobileMenu={() => setMobileMenuOpen(false)}
        storeName={storeName}
        storeSlug={storeSlug}
        userStores={userStores}
        onOpenSettings={() => { setMobileMenuOpen(false); setSettingsOpen(true); }}
      />

      <SiteSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        storeId={storeId}
        storeSlug={storeSlug}
        storeName={storeName}
      />
    </div>
  );
}
