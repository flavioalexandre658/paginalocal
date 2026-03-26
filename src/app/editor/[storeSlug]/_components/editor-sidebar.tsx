"use client";

import { cn } from "@/lib/utils";
import {
  IconDeviceDesktop,
  IconFileStack,
  IconWorld,
  IconSearch,
  IconUsers,
  IconChartBar,
  IconSettings,
  IconHelp,
  IconSparkles,
} from "@tabler/icons-react";

const NAV_ITEMS = [
  { id: "website", label: "Meu Site", icon: IconDeviceDesktop },
  { id: "pages", label: "Paginas", icon: IconFileStack },
  { id: "domain", label: "Dominio", icon: IconWorld },
  { id: "seo", label: "SEO", icon: IconSearch },
  { id: "contacts", label: "Contatos", icon: IconUsers },
  { id: "analytics", label: "Analytics", icon: IconChartBar },
];

interface Props {
  collapsed: boolean;
}

export function EditorSidebar({ collapsed }: Props) {
  return (
    <aside
      className="flex shrink-0 flex-col transition-all duration-200"
      style={{
        width: collapsed ? 56 : 220,
        fontFamily: "system-ui, -apple-system, sans-serif",
        backgroundColor: "#ffffff",
      }}
    >
      <div className="flex-1 overflow-y-auto">
        <div className={cn("py-2", collapsed ? "px-1" : "px-2")}>
          {NAV_ITEMS.map((item) => {
            const isActive = item.id === "website";
            return (
              <button
                key={item.id}
                className={cn(
                  "flex w-full items-center rounded-[10px] transition-all duration-150",
                  collapsed ? "justify-center p-2.5 my-0.5" : "gap-[10px] px-3 py-2 my-0.5",
                )}
                style={{
                  backgroundColor: isActive ? "#f5f5f4" : "transparent",
                  color: isActive ? "#1a1a1a" : "#737373",
                  fontWeight: isActive ? 500 : 400,
                  fontSize: 14,
                }}
                title={collapsed ? item.label : undefined}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = "#fafaf9"; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                <item.icon style={{ width: 18, height: 18, flexShrink: 0 }} />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {!collapsed && (
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
      )}

      <div
        className={cn("py-2", collapsed ? "px-1" : "px-2")}
        style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
      >
        <button
          className={cn(
            "flex w-full items-center rounded-[8px] transition-all duration-150",
            collapsed ? "justify-center p-2" : "gap-[10px] px-3 py-1.5",
          )}
          style={{ color: "#737373", fontSize: 13 }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#1a1a1a"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "#737373"; }}
        >
          <IconSettings style={{ width: 16, height: 16 }} />
          {!collapsed && <span>Configuracoes</span>}
        </button>
        <button
          className={cn(
            "flex w-full items-center rounded-[8px] transition-all duration-150",
            collapsed ? "justify-center p-2" : "gap-[10px] px-3 py-1.5",
          )}
          style={{ color: "#737373", fontSize: 13 }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#1a1a1a"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "#737373"; }}
        >
          <IconHelp style={{ width: 16, height: 16 }} />
          {!collapsed && <span>Ajuda</span>}
        </button>
      </div>
    </aside>
  );
}
