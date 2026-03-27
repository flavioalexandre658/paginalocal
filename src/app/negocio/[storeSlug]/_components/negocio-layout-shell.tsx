"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { NegocioSidebar } from "./negocio-sidebar";

interface Props {
  children: ReactNode;
  storeName: string;
  storeSlug: string;
  userStores: { id: string; name: string; slug: string }[];
}

export function NegocioLayoutShell({ children, storeName, storeSlug, userStores }: Props) {
  const pathname = usePathname();
  const isEditorRoute = pathname.includes(`/negocio/${storeSlug}/site`);

  if (isEditorRoute) {
    return (
      <div className="h-screen overflow-hidden" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
        {children}
      </div>
    );
  }

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ fontFamily: "system-ui, -apple-system, sans-serif", backgroundColor: "#ffffff" }}
    >
      <NegocioSidebar
        storeName={storeName}
        storeSlug={storeSlug}
        userStores={userStores}
      />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
