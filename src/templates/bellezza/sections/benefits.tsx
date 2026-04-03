"use client";

import type { DesignTokens } from "@/types/ai-generation";
import { ServicesContentSchema } from "@/types/ai-generation";
import { ScrollReveal } from "./scroll-reveal";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

function renderAccentText(text: string, accentColor: string) {
  return text.split(/\*([^*]+)\*/).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} style={{ color: accentColor }}>{part}</span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

/* ── Beauty / wellness benefit icons ── */
function BenefitIcon({ index, color }: { index: number; color: string }) {
  const icons = [
    /* Delivery / truck */
    <svg key="0" width="32" height="32" viewBox="0 0 256 256" fill="none">
      <path d="M255.42,117l-14-35A15.93,15.93,0,0,0,226.58,72H192V64a8,8,0,0,0-8-8H32A16,16,0,0,0,16,72V184a16,16,0,0,0,16,16H49a32,32,0,0,0,62,0h50a32,32,0,0,0,62,0h17a16,16,0,0,0,16-16V120A7.94,7.94,0,0,0,255.42,117ZM192,88h34.58l9.6,24H192ZM32,72H176v64H32ZM80,208a16,16,0,1,1,16-16A16,16,0,0,1,80,208Zm81-24H111a32,32,0,0,0-62,0H32V152H176v12.31A32.11,32.11,0,0,0,161,184Zm31,24a16,16,0,1,1,16-16A16,16,0,0,1,192,208Zm48-24H223a32.06,32.06,0,0,0-31-24V128h48Z" fill={color} />
    </svg>,
    /* Shield / guarantee */
    <svg key="1" width="32" height="32" viewBox="0 0 256 256" fill="none">
      <path d="M208,40H48A16,16,0,0,0,32,56V200a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V56A16,16,0,0,0,208,40ZM128,168a40,40,0,1,1,40-40A40,40,0,0,1,128,168Zm80,32H48V56H208Z" fill={color} />
      <path d="M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Z" fill={color} opacity="0.3" />
    </svg>,
    /* Cart / online order */
    <svg key="2" width="32" height="32" viewBox="0 0 256 256" fill="none">
      <path d="M216,64H176a48,48,0,0,0-96,0H40A16,16,0,0,0,24,80V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64ZM128,32a32,32,0,0,1,32,32H96A32,32,0,0,1,128,32Zm88,168H40V80H80V96a8,8,0,0,0,16,0V80h64V96a8,8,0,0,0,16,0V80h40Z" fill={color} />
    </svg>,
    /* Leaf / natural */
    <svg key="3" width="32" height="32" viewBox="0 0 256 256" fill="none">
      <path d="M223.45,39.07a8,8,0,0,0-6.52-6.52C209.26,31.07,168,24,128,56,92.81,27.37,57.44,31.07,39.07,32.55a8,8,0,0,0-6.52,6.52C31.07,46.74,24,88,56,128c-8.17,11.57-13.4,24.15-15.56,37.52A8,8,0,0,0,48,176a87.15,87.15,0,0,0,40-16v24a8,8,0,0,0,16,0V144a8,8,0,0,0-16,0v10.48C72.05,166,57,171.52,48.62,164.08c1.58-10.33,5.59-20.12,12-29.11C77.37,159,112,163.42,128,163.42s50.63-4.43,67.41-28.45c6.37,9,10.38,18.78,12,29.11C199,171.52,184,166,168,154.48V144a8,8,0,0,0-16,0v40a8,8,0,0,0,16,0V160a87.15,87.15,0,0,0,40,16,8,8,0,0,0,7.56-10.48C213.4,152.15,208.17,139.57,200,128,232,88,224.93,46.74,223.45,39.07Z" fill={color} />
    </svg>,
    /* Heart / care */
    <svg key="4" width="32" height="32" viewBox="0 0 256 256" fill="none">
      <path d="M178,40c-20.65,0-38.73,8.88-50,23.89C116.73,48.88,98.65,40,78,40a62.07,62.07,0,0,0-62,62c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,228.66,240,172,240,102A62.07,62.07,0,0,0,178,40ZM128,214.53C109.14,204.4,32,157.55,32,102A46.06,46.06,0,0,1,78,56c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.64,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,157.55,146.86,204.4,128,214.53Z" fill={color} />
    </svg>,
    /* Star / quality */
    <svg key="5" width="32" height="32" viewBox="0 0 256 256" fill="none">
      <path d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,92l59.46-5.15,23.21-55.36a16.4,16.4,0,0,1,30.5,0l23.21,55.36L226.92,92A16.46,16.46,0,0,1,234.29,114.85Z" fill={color} />
    </svg>,
  ];
  return icons[index % icons.length];
}

export function BellezzaBenefits({ content, tokens }: Props) {
  const parsed = ServicesContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent;
  const primary = tokens.palette.primary;

  return (
    <section
      id="benefits"
      style={{
        backgroundColor: "var(--pgl-background)",
        overflow: "hidden",
      }}
    >
      <div
        className="px-5 md:px-16 py-16 md:py-[100px]"
        style={{ maxWidth: 1440, margin: "0 auto" }}
      >
        {/* ═══ Title centered ═══ */}
        <ScrollReveal delay={0}>
          <h2
            style={{
              fontFamily: "var(--pgl-font-heading), serif",
              fontSize: "clamp(32px, 4vw, 52px)",
              fontWeight: 500,
              letterSpacing: "0em",
              lineHeight: "1.2em",
              color: primary,
              textAlign: "center",
              textTransform: "capitalize",
              margin: 0,
              marginBottom: 16,
            }}
            data-pgl-path="title"
            data-pgl-edit="text"
          >
            {renderAccentText(c.title, accent)}
          </h2>
        </ScrollReveal>

        {c.subtitle && (
          <ScrollReveal delay={80}>
            <p
              style={{
                fontFamily: "var(--pgl-font-body), sans-serif",
                fontSize: 16,
                fontWeight: 400,
                lineHeight: "1.4em",
                color: "var(--pgl-text-muted)",
                textAlign: "center",
                margin: 0,
                marginBottom: 56,
                maxWidth: 560,
                marginLeft: "auto",
                marginRight: "auto",
              }}
              data-pgl-path="subtitle"
              data-pgl-edit="text"
            >
              {c.subtitle}
            </p>
          </ScrollReveal>
        )}

        {/* ═══ Benefits grid — 3 columns ═══ */}
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ gap: 20, marginTop: c.subtitle ? 0 : 56 }}
        >
          {c.items.map((item, idx) => (
            <ScrollReveal key={idx} delay={100 + idx * 100}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  padding: 32,
                  borderRadius: 16,
                  border: "1px solid rgba(0,0,0,0.1)",
                  backgroundColor: "#fff",
                  transition: "border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease",
                  cursor: "default",
                  height: "100%",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = accent;
                  e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.06)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Icon area */}
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    backgroundColor: `${accent}14`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                    flexShrink: 0,
                  }}
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      data-pgl-path={`items.${idx}.image`}
                      data-pgl-edit="image"
                      style={{
                        width: 32,
                        height: 32,
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <BenefitIcon index={idx} color={accent} />
                  )}
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: "var(--pgl-font-body), sans-serif",
                    fontSize: 20,
                    fontWeight: 500,
                    letterSpacing: "0em",
                    lineHeight: "1.2em",
                    color: primary,
                    margin: 0,
                    marginBottom: 10,
                  }}
                  data-pgl-path={`items.${idx}.name`}
                  data-pgl-edit="text"
                >
                  {item.name}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontFamily: "var(--pgl-font-body), sans-serif",
                    fontSize: 15,
                    fontWeight: 400,
                    lineHeight: "1.5em",
                    color: "var(--pgl-text-muted)",
                    margin: 0,
                  }}
                  data-pgl-path={`items.${idx}.description`}
                  data-pgl-edit="text"
                >
                  {item.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
