"use client";

import { type ReactNode, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IconMenu2 } from "@tabler/icons-react";
import { PglButton } from "@/components/ui/pgl-button";
import { EditorSidebar } from "@/app/editor/[storeSlug]/_components/editor-sidebar";
import { SiteSettingsModal } from "@/app/editor/[storeSlug]/_components/site-settings-modal";
import { UpgradeModal } from "@/components/shared/upgrade-modal";

interface Props {
  children: ReactNode;
  storeId: string;
  storeName: string;
  storeSlug: string;
  userStores: { id: string; name: string; slug: string }[];
}

export function NegocioLayoutShell({ children, storeId, storeName, storeSlug, userStores }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const isEditorRoute = pathname.includes(`/negocio/${storeSlug}/site`);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

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
      {/* Mobile topbar */}
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-black/[0.06] px-3 md:hidden">
        <PglButton variant="ghost" size="icon-sm" onClick={() => setMobileMenuOpen(true)}>
          <IconMenu2 className="size-5" />
        </PglButton>

        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black/80 text-[10px] font-semibold text-white">
            {storeName.charAt(0).toUpperCase()}
          </div>
          <span className="truncate text-[13px] font-semibold text-black/80">
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
            onOpenUpgrade={() => setUpgradeOpen(true)}
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
        onOpenUpgrade={() => { setMobileMenuOpen(false); setUpgradeOpen(true); }}
      />

      <SiteSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        storeId={storeId}
        storeSlug={storeSlug}
        storeName={storeName}
        onOpenUpgrade={() => setUpgradeOpen(true)}
        onPublishChange={() => router.refresh()}
      />

      <UpgradeModal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        storeSlug={storeSlug}
      />
    </div>
  );
}
