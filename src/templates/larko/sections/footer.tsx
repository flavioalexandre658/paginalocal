"use client";

import { useState } from "react";
import type { DesignTokens } from "@/types/ai-generation";
import { FooterContentSchema } from "@/types/ai-generation";
import { useSubmitFormLead } from "@/hooks/use-submit-form-lead";
import { ScrollReveal } from "./scroll-reveal";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

/* ── Accent text: wraps *text* in italic accent span ── */
function renderAccentText(text: string, accentColor: string) {
  return text.split(/\*([^*]+)\*/).map((part, i) =>
    i % 2 === 1 ? (
      <span
        key={i}
        style={{
          color: accentColor,
          fontStyle: "italic",
          fontFamily: "var(--pgl-font-heading), Georgia, serif",
        }}
      >
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

/* ── Arrow icon ── */
function ArrowIcon({ color }: { color: string }) {
  return (
    <svg
      width="14"
      height="13"
      viewBox="0 0 14 13"
      fill="none"
      style={{ display: "block", transform: "rotate(-45deg)" }}
    >
      <path
        d="M1 6.5h12M7.5 1l5.5 5.5L7.5 12"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Send icon for newsletter button ── */
function SendIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M14.5 1.5L7 9M14.5 1.5L10 14.5L7 9M14.5 1.5L1.5 6L7 9"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Leaf icon for logo ── */
function LeafIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2C6.5 2 2 6.5 2 12c0 2.5 1 4.8 2.5 6.5C6 17 8.5 14 12 14s6 3 7.5 4.5C21 16.8 22 14.5 22 12c0-5.5-4.5-10-10-10z"
        fill={color}
        opacity="0.2"
      />
      <path
        d="M17 8c-2.5-1-5.5-.5-7.5 1.5S7 14.5 7 17"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M7 17c3-3 7-4.5 10-3"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ── Social media SVG icons ── */
function InstagramIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="1.5" width="13" height="13" rx="4" stroke={color} strokeWidth="1.2" />
      <circle cx="8" cy="8" r="3" stroke={color} strokeWidth="1.2" />
      <circle cx="11.8" cy="4.2" r="0.8" fill={color} />
    </svg>
  );
}

function FacebookIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M6 16V9H3.5V6.5H6V4.7C6 2.28 7.37 1 9.54 1c1.01 0 1.96.08 2.21.11v2.56h-1.52c-1.19 0-1.42.57-1.42 1.4V6.5H12l-.39 2.5H9.81V16"
        fill={color}
      />
    </svg>
  );
}

function YoutubeIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M15.05 3.68a1.89 1.89 0 00-1.33-1.34C12.53 2 8 2 8 2s-4.53 0-5.72.34A1.89 1.89 0 00.95 3.68 19.8 19.8 0 00.6 8c-.02 1.46.1 2.93.35 4.32a1.89 1.89 0 001.33 1.34C3.47 14 8 14 8 14s4.53 0 5.72-.34a1.89 1.89 0 001.33-1.34c.25-1.39.37-2.86.35-4.32.02-1.46-.1-2.93-.35-4.32z"
        fill={color}
      />
      <path d="M6.4 10.6V5.4L10.8 8l-4.4 2.6z" fill="#fff" />
    </svg>
  );
}

function LinkedinIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M1.52 5.15h2.84v9.33H1.52V5.15zM2.94 1.5c.91 0 1.65.74 1.65 1.65S3.85 4.8 2.94 4.8 1.29 4.06 1.29 3.15 2.03 1.5 2.94 1.5zM6.2 5.15h2.72v1.28h.04a2.98 2.98 0 012.69-1.48c2.87 0 3.41 1.89 3.41 4.35v5.18H12.2V9.84c0-1.1-.02-2.52-1.53-2.52-1.53 0-1.77 1.2-1.77 2.44v4.72H6.2V5.15z"
        fill={color}
      />
    </svg>
  );
}

function TiktokIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M11.2 1.33h-2.4v9.2a1.87 1.87 0 01-1.87 1.8 1.87 1.87 0 01-1.86-1.87 1.87 1.87 0 011.86-1.86c.2 0 .38.03.56.08V6.22a4.27 4.27 0 00-.56-.04 4.27 4.27 0 00-4.26 4.28 4.27 4.27 0 004.26 4.27 4.27 4.27 0 004.27-4.27V5.6a5.5 5.5 0 003.2 1.02V4.22a3.2 3.2 0 01-3.2-2.89z"
        fill={color}
      />
    </svg>
  );
}

const SOCIAL_ICONS = [
  { name: "Instagram", Icon: InstagramIcon },
  { name: "Facebook", Icon: FacebookIcon },
  { name: "YouTube", Icon: YoutubeIcon },
  { name: "LinkedIn", Icon: LinkedinIcon },
  { name: "TikTok", Icon: TiktokIcon },
];

/* ── Newsletter email form ── */
function NewsletterForm({
  primary,
  secondary,
  surface,
}: {
  primary: string;
  secondary: string;
  surface: string;
}) {
  const { submit, isSubmitting, submitted } = useSubmitFormLead();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    submit({ name: "Newsletter", email: email.trim() });
  };

  if (submitted) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          width: "100%",
          maxWidth: 420,
          padding: "12px 16px",
          borderRadius: 8,
          border: "1px solid var(--pgl-border, #f1f1f1)",
          backgroundColor: "#fff",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="7" fill={secondary} />
          <path
            d="M6 9l2 2 4-4"
            stroke={primary}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span
          style={{
            fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
            fontSize: 16,
            fontWeight: 300,
            color: primary,
          }}
        >
          Inscrito com sucesso!
        </span>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="pgl-larko-footer-form"
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        maxWidth: 420,
        position: "relative",
      }}
    >
      <input
        type="email"
        name="Email"
        placeholder="Email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          width: "100%",
          padding: "14px 60px 14px 16px",
          borderRadius: 8,
          border: "1px solid var(--pgl-border, #f1f1f1)",
          backgroundColor: "#fff",
          fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
          fontSize: 16,
          fontWeight: 300,
          color: primary,
          outline: "none",
        }}
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `.pgl-larko-footer-form input::placeholder { color: rgba(0,0,0,0.35); opacity: 1; }`,
        }}
      />
      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          position: "absolute",
          right: 6,
          top: "50%",
          transform: "translateY(-50%)",
          width: 40,
          height: 40,
          borderRadius: 6,
          border: "none",
          backgroundColor: secondary,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: isSubmitting ? "wait" : "pointer",
          opacity: isSubmitting ? 0.7 : 1,
          transition: "opacity 0.2s ease",
          flexShrink: 0,
        }}
      >
        <SendIcon color={primary} />
      </button>
    </form>
  );
}

/* =======================================================
   LARKO FOOTER
   ======================================================= */
export function LarkoFooter({ content, tokens }: Props) {
  const parsed = FooterContentSchema.safeParse(content);
  const copyrightText = parsed.success
    ? parsed.data.copyrightText
    : (content.copyrightText as string | undefined);
  const showSocial = parsed.success
    ? parsed.data.showSocial
    : (content.showSocial as boolean | undefined);

  const storeName =
    typeof content.storeName === "string" ? content.storeName : "Empresa";
  const navLinks =
    (content.navLinks as { label: string; href: string }[]) || [];

  const primary = tokens.palette.primary;
  const accent = tokens.palette.accent;
  const secondary = tokens.palette.secondary;
  const surface = tokens.palette.surface;

  /* Split nav links into 3 columns */
  const colSize = Math.ceil(navLinks.length / 3);
  const col1 = navLinks.slice(0, colSize);
  const col2 = navLinks.slice(colSize, colSize * 2);
  const col3 = navLinks.slice(colSize * 2);

  const columnTitles = ["Empresa", "Links Uteis", "Suporte"];

  return (
    <footer
      data-pgl-edit="footer"
      data-pgl-path="footer"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        backgroundColor: surface,
      }}
    >
      {/* Scoped responsive + hover styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .pgl-larko-ft-outer {
              display: flex;
              flex-direction: column;
              align-items: center;
              width: 100%;
              max-width: 1280px;
              margin: 0 auto;
              padding: 130px 0 40px;
            }
            .pgl-larko-ft-container {
              display: flex;
              flex-direction: column;
              gap: 40px;
              width: 100%;
              max-width: 1440px;
              padding: 0 55px;
            }

            /* ── Top Wrapper ── */
            .pgl-larko-ft-top {
              display: flex;
              flex-direction: row;
              align-items: flex-end;
              justify-content: flex-end;
              gap: 40px;
              width: 100%;
              padding-bottom: 30px;
              border-bottom: 1px solid var(--pgl-border, #f1f1f1);
            }
            .pgl-larko-ft-title-wrap {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              justify-content: center;
              flex: 1;
              min-width: 0;
            }

            /* ── CTA Button ── */
            .pgl-larko-ft-cta {
              display: flex;
              align-items: center;
              gap: 14px;
              padding: 14px 28px;
              border-radius: 50px;
              background-color: ${secondary};
              text-decoration: none;
              cursor: pointer;
              flex-shrink: 0;
              transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            .pgl-larko-ft-cta:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            }
            .pgl-larko-ft-cta-icon {
              width: 36px;
              height: 36px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
              background-color: ${primary};
            }

            /* ── Middle: contacts + links ── */
            .pgl-larko-ft-middle {
              display: flex;
              flex-direction: row;
              align-items: flex-start;
              gap: 60px;
              width: 100%;
            }
            .pgl-larko-ft-contacts {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              gap: 30px;
              flex: 1;
              min-width: 0;
            }
            .pgl-larko-ft-body-form {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              gap: 16px;
              width: 100%;
              max-width: 420px;
            }
            .pgl-larko-ft-social-row {
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .pgl-larko-ft-social-btn {
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 7px;
              border: 1px solid var(--pgl-border, #f1f1f1);
              border-radius: 3px;
              background-color: ${surface};
              cursor: pointer;
              transition: background-color 0.25s ease;
            }
            .pgl-larko-ft-social-btn:hover {
              background-color: ${secondary};
            }

            /* ── Link columns ── */
            .pgl-larko-ft-columns {
              display: flex;
              flex-direction: row;
              align-items: flex-start;
              flex: 1;
              min-width: 0;
              gap: 70px;
            }
            .pgl-larko-ft-col {
              display: flex;
              flex-direction: column;
              align-items: center;
              flex: 1;
              min-width: 0;
              gap: 20px;
            }
            .pgl-larko-ft-col-title {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
              padding-bottom: 8px;
              border-bottom: 1px solid var(--pgl-border, #f1f1f1);
            }
            .pgl-larko-ft-col-links {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 10px;
              width: 100%;
            }
            .pgl-larko-ft-link {
              font-family: var(--pgl-font-body), system-ui, sans-serif;
              font-size: 16px;
              font-weight: 500;
              line-height: 1.5;
              color: ${primary};
              text-decoration: none;
              text-align: center;
              width: 100%;
              transition: color 0.2s ease;
              cursor: pointer;
            }
            .pgl-larko-ft-link:hover {
              color: ${accent};
            }

            /* ── Copyright bar ── */
            .pgl-larko-ft-copyright {
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-between;
              width: 100%;
            }

            /* ── Responsive: 1279px ── */
            @media (max-width: 1279px) {
              .pgl-larko-ft-container {
                padding: 0 20px;
              }
              .pgl-larko-ft-columns {
                gap: 30px;
              }
              .pgl-larko-ft-middle {
                gap: 20px;
              }
            }

            /* ── Responsive: 991px ── */
            @media (max-width: 991px) {
              .pgl-larko-ft-top {
                flex-direction: column;
                align-items: center;
                justify-content: center;
              }
              .pgl-larko-ft-title-wrap {
                align-items: center;
                text-align: center;
              }
              .pgl-larko-ft-middle {
                flex-direction: column;
              }
              .pgl-larko-ft-contacts {
                order: 1;
                flex: none;
                width: 100%;
                align-items: center;
              }
              .pgl-larko-ft-body-form {
                align-items: center;
              }
              .pgl-larko-ft-columns {
                order: 0;
                flex: none;
                width: 100%;
                flex-wrap: wrap;
              }
              .pgl-larko-ft-copyright {
                flex-direction: column;
                align-items: center;
                gap: 12px;
                text-align: center;
              }
            }
          `,
        }}
      />

      <div className="pgl-larko-ft-outer">
        <div className="pgl-larko-ft-container">
          {/* === Top Wrapper: Title + CTA === */}
          <ScrollReveal delay={0}>
            <div className="pgl-larko-ft-top">
              <div className="pgl-larko-ft-title-wrap">
                <h2
                  style={{
                    fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                    fontSize: "clamp(32px, 4vw, 50px)",
                    fontWeight: 500,
                    lineHeight: "1.2em",
                    color: primary,
                    margin: 0,
                  }}
                >
                  {copyrightText ? (
                    renderAccentText(copyrightText, accent)
                  ) : (
                    <>
                      Pronto para transformar seu negocio?{" "}
                      <span
                        style={{
                          fontFamily: "var(--pgl-font-heading), Georgia, serif",
                          fontStyle: "italic",
                          color: accent,
                        }}
                      >
                        Vamos criar algo incrivel juntos!
                      </span>
                    </>
                  )}
                </h2>
              </div>

              <a className="pgl-larko-ft-cta" href="#contato">
                <span
                  style={{
                    fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                    fontSize: 16,
                    fontWeight: 400,
                    lineHeight: "1.5em",
                    color: primary,
                    whiteSpace: "nowrap",
                  }}
                >
                  Fale conosco
                </span>
                <div className="pgl-larko-ft-cta-icon">
                  <ArrowIcon color="#fff" />
                </div>
              </a>
            </div>
          </ScrollReveal>

          {/* === Middle: Contacts & Links === */}
          <div className="pgl-larko-ft-middle">
            {/* -- Left: Logo + Body + Form + Social -- */}
            <ScrollReveal delay={100}>
              <div className="pgl-larko-ft-contacts">
                {/* Logo: leaf + store name */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <LeafIcon color={accent} />
                  <span
                    style={{
                      fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                      fontSize: 20,
                      fontWeight: 600,
                      color: primary,
                    }}
                    data-pgl-path="storeName"
                    data-pgl-edit="text"
                  >
                    {storeName}
                  </span>
                </div>

                {/* Body text + email form */}
                <div className="pgl-larko-ft-body-form">
                  <p
                    style={{
                      fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                      fontSize: 18,
                      fontWeight: 300,
                      lineHeight: "1.6em",
                      color: primary,
                      opacity: 0.6,
                      margin: 0,
                      maxWidth: 420,
                    }}
                  >
                    Fique por dentro das ultimas novidades, tendencias e
                    atualizacoes exclusivas. Inscreva-se agora!
                  </p>

                  <NewsletterForm
                    primary={primary}
                    secondary={secondary}
                    surface={surface}
                  />
                </div>

                {/* Social icons */}
                {showSocial !== false && (
                  <div className="pgl-larko-ft-social-row">
                    {SOCIAL_ICONS.map(({ name, Icon }) => (
                      <span
                        key={name}
                        className="pgl-larko-ft-social-btn"
                        title={name}
                        role="link"
                        tabIndex={0}
                      >
                        <Icon color={primary} />
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </ScrollReveal>

            {/* -- Right: 3 Link Columns -- */}
            <div className="pgl-larko-ft-columns">
              {[col1, col2, col3].map((colLinks, colIdx) => (
                <div key={colIdx} className="pgl-larko-ft-col">
                  <ScrollReveal delay={100 + colIdx * 50}>
                    <div className="pgl-larko-ft-col-title">
                      <h6
                        style={{
                          fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                          fontSize: 18,
                          fontWeight: 500,
                          lineHeight: "1.2em",
                          color: primary,
                          margin: 0,
                          textAlign: "center",
                        }}
                      >
                        {columnTitles[colIdx]}
                      </h6>
                    </div>
                  </ScrollReveal>

                  <nav className="pgl-larko-ft-col-links">
                    {colLinks.length > 0
                      ? colLinks.map((link, i) => (
                          <ScrollReveal
                            key={i}
                            delay={150 + colIdx * 50 + i * 30}
                          >
                            <a
                              href={link.href}
                              className="pgl-larko-ft-link"
                            >
                              {link.label}
                            </a>
                          </ScrollReveal>
                        ))
                      : /* Fallback placeholder links */
                        ["Sobre", "Servicos", "Contato"].map((label, i) => (
                          <ScrollReveal key={i} delay={150 + colIdx * 50 + i * 30}>
                            <a href="#" className="pgl-larko-ft-link">
                              {label}
                            </a>
                          </ScrollReveal>
                        ))}
                  </nav>
                </div>
              ))}
            </div>
          </div>

          {/* === Copyright bar === */}
          <ScrollReveal delay={300}>
            <div className="pgl-larko-ft-copyright">
              <p
                style={{
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: 16,
                  fontWeight: 300,
                  lineHeight: "1.5em",
                  color: primary,
                  opacity: 0.5,
                  margin: 0,
                }}
                data-pgl-path="copyrightText"
                data-pgl-edit="text"
              >
                {`\u00a9 ${storeName}. Todos os direitos reservados.`}
              </p>
              <p
                style={{
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: 16,
                  fontWeight: 300,
                  lineHeight: "1.5em",
                  color: primary,
                  opacity: 0.5,
                  margin: 0,
                  whiteSpace: "nowrap",
                }}
              >
                Desenvolvido por Decolou
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </footer>
  );
}
