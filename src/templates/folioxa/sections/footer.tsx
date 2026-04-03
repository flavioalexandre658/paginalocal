"use client";

import type { DesignTokens } from "@/types/ai-generation";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

export function FolioxaFooter({ content, tokens }: Props) {
  const storeName = (content.storeName as string) || "Empresa";
  const copyrightText = content.copyrightText as string | undefined;

  return (
    <footer
      data-pgl-edit="footer"
      data-pgl-path="footer"
      style={{
        backgroundColor: "var(--pgl-surface, #FAFAFA)",
        borderTop: "1px solid var(--pgl-border, rgba(0,0,0,0.06))",
      }}
    >
      <div
        className="px-5 py-8 md:px-[80px] md:py-10"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        {/* Credito principal */}
        <p
          style={{
            fontFamily: "var(--pgl-font-body, 'Outfit'), system-ui, sans-serif",
            fontSize: 14,
            fontWeight: 400,
            color: "var(--pgl-text-muted)",
            margin: 0,
            textAlign: "center",
          }}
          data-pgl-path="copyrightText"
          data-pgl-edit="text"
        >
          {copyrightText ||
            `\u00a9 ${new Date().getFullYear()} ${storeName}. Todos os direitos reservados.`}
        </p>

        {/* Links e badges */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {/* Politica de Privacidade */}
          <a
            href="#"
            style={{
              fontFamily: "var(--pgl-font-body, 'Outfit'), system-ui, sans-serif",
              fontSize: 13,
              fontWeight: 400,
              color: "var(--pgl-text-muted)",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--pgl-text)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--pgl-text-muted)";
            }}
          >
            Politica de Privacidade
          </a>

          {/* Separador */}
          <span
            style={{
              width: 3,
              height: 3,
              borderRadius: "50%",
              backgroundColor: "var(--pgl-text-muted)",
              opacity: 0.4,
            }}
          />

          {/* Badge Decolou */}
          <span
            style={{
              fontFamily: "var(--pgl-font-body, 'Outfit'), system-ui, sans-serif",
              fontSize: 12,
              fontWeight: 400,
              color: "var(--pgl-text-muted)",
              opacity: 0.6,
            }}
          >
            Desenvolvido por Decolou
          </span>
        </div>
      </div>
    </footer>
  );
}
