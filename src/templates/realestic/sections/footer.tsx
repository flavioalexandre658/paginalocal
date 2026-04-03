"use client";

import type { DesignTokens } from "@/types/ai-generation";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
  navigation?: { label: string; href: string; isExternal?: boolean }[];
}

function renderAccentText(text: string, accentColor: string) {
  return text.split(/\*([^*]+)\*/).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} style={{ color: accentColor }}>
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

/** Split array into N roughly equal chunks */
function chunkArray<T>(arr: T[], chunks: number): T[][] {
  const result: T[][] = [];
  const size = Math.ceil(arr.length / chunks);
  for (let i = 0; i < chunks; i++) {
    result.push(arr.slice(i * size, (i + 1) * size));
  }
  return result;
}

export function RealesticFooter({ content, tokens, navigation }: Props) {
  const accent = tokens.palette.accent;

  const storeName = (content.storeName as string) || "Empresa";
  const heading = (content.heading as string) || (content.tagline as string) || "";
  const copyrightText = (content.copyrightText as string) || "";
  const navLinks =
    (content.navLinks as { label: string; href: string }[]) || navigation || [];

  // Split navigation into 3 columns
  const [col1, col2, col3] = chunkArray(navLinks, 3);

  const columnTitles = [
    (content.linksTitle1 as string) || "Links",
    (content.linksTitle2 as string) || "Empresa",
    (content.linksTitle3 as string) || "Contato",
  ];

  // Bottom bar links — first few nav items or fallback
  const bottomLinks = navLinks.slice(0, 4);

  // Derive accent-light background for social icons
  const accentLightBg = "var(--pgl-accent-light, rgba(237, 243, 255, 1))";

  const linkTextStyle: React.CSSProperties = {
    fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
    fontSize: 18,
    fontWeight: 500,
    letterSpacing: "-0.03em",
    lineHeight: "1.25em",
    color: "var(--pgl-text)",
    opacity: 0.7,
    textDecoration: "none",
    transition: "opacity 0.2s ease",
  };

  const columnTitleStyle: React.CSSProperties = {
    fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
    fontSize: 20,
    fontWeight: 500,
    letterSpacing: "-0.02em",
    lineHeight: "1.5em",
    color: "var(--pgl-text)",
    margin: 0,
  };

  return (
    <footer
      data-pgl-edit="footer"
      data-pgl-path="copyrightText"
      style={{
        backgroundColor: "var(--pgl-background)",
        padding: "48px 0 28px",
      }}
    >
      <div
        className="mx-auto px-[25px] flex flex-col"
        style={{ maxWidth: 1200, gap: 100 }}
      >
        {/* ═══ Top Area: 2-column grid ═══ */}
        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ gap: 28 }}
        >
          {/* ── Left Column: Heading + Social ── */}
          <div
            className="flex flex-col pr-0 md:pr-[26px]"
            style={{ gap: 25 }}
          >
            {/* H3 Heading */}
            <h3
              style={{
                fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                fontSize: "clamp(28px, 3vw, 36px)",
                fontWeight: 500,
                letterSpacing: "-0.04em",
                lineHeight: "1.2em",
                color: "var(--pgl-text)",
                margin: 0,
              }}
              data-pgl-path="heading"
              data-pgl-edit="text"
            >
              {heading ? renderAccentText(heading, accent) : storeName}
            </h3>

            {/* Social Icons */}
            <div className="flex flex-row" style={{ gap: 10 }}>
              {/* Facebook */}
              <a
                href="#"
                aria-label="Facebook"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 42,
                  height: 42,
                  borderRadius: 8,
                  backgroundColor: accentLightBg,
                  textDecoration: "none",
                  transition: "opacity 0.2s ease",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--pgl-text)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="#"
                aria-label="Instagram"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 42,
                  height: 42,
                  borderRadius: 8,
                  backgroundColor: accentLightBg,
                  textDecoration: "none",
                  transition: "opacity 0.2s ease",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--pgl-text)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              {/* Twitter / X */}
              <a
                href="#"
                aria-label="Twitter"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 42,
                  height: 42,
                  borderRadius: 8,
                  backgroundColor: accentLightBg,
                  textDecoration: "none",
                  transition: "opacity 0.2s ease",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--pgl-text)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* ── Right Column: 3x Links Grid ── */}
          <div
            className="grid grid-cols-1 sm:grid-cols-3"
            style={{ gap: 10 }}
          >
            {/* Column 1 */}
            <div className="flex flex-col" style={{ gap: 16 }}>
              <p style={columnTitleStyle}>{columnTitles[0]}</p>
              <nav className="flex flex-col" style={{ gap: 12 }}>
                {(col1 || []).map((link, i) => (
                  <a key={i} href={link.href} style={linkTextStyle}>
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col" style={{ gap: 16 }}>
              <p style={columnTitleStyle}>{columnTitles[1]}</p>
              <nav className="flex flex-col" style={{ gap: 12 }}>
                {(col2 || []).map((link, i) => (
                  <a key={i} href={link.href} style={linkTextStyle}>
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col" style={{ gap: 16 }}>
              <p style={columnTitleStyle}>{columnTitles[2]}</p>
              <nav className="flex flex-col" style={{ gap: 12 }}>
                {(col3 || []).map((link, i) => (
                  <a key={i} href={link.href} style={linkTextStyle}>
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* ═══ Bottom Bar ═══ */}
        <div
          className="flex flex-col sm:flex-row justify-between items-center gap-4"
          style={{
            borderTop: "1px solid rgba(0,0,0,0.1)",
            paddingTop: 24,
          }}
        >
          {/* Copyright */}
          <span
            style={{
              fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
              fontSize: 20,
              fontWeight: 500,
              color: "var(--pgl-text)",
              letterSpacing: "-0.02em",
            }}
            data-pgl-path="copyrightText"
            data-pgl-edit="text"
          >
            {copyrightText ||
              `\u00a9 ${new Date().getFullYear()} ${storeName}. Todos os direitos reservados.`}
          </span>

          {/* Bottom Quick Links with dot separators */}
          <div className="flex items-center" style={{ gap: 12 }}>
            {bottomLinks.map((link, i) => (
              <div key={i} className="flex items-center" style={{ gap: 12 }}>
                {i > 0 && (
                  <span
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: 1000,
                      backgroundColor: "var(--pgl-text)",
                      opacity: 0.3,
                      flexShrink: 0,
                    }}
                  />
                )}
                <a
                  href={link.href}
                  style={{
                    fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                    fontSize: 18,
                    fontWeight: 500,
                    letterSpacing: "-0.03em",
                    lineHeight: "1.25em",
                    color: "var(--pgl-text)",
                    opacity: 0.7,
                    textDecoration: "none",
                    transition: "opacity 0.2s ease",
                    whiteSpace: "nowrap",
                  }}
                >
                  {link.label}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
