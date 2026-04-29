"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { usePathname } from "next/navigation";
import { useCookieConsent } from "@/hooks/use-cookie-consent";
import {
  CookieBannerPgl,
  CookieBannerPglCollapsed,
  CookieBannerPglIcon,
  CookieBannerPglMessage,
  CookieBannerPglPolicyLink,
  CookieBannerPglActions,
  CookieBannerPglSettingsButton,
  CookieBannerPglAcceptButton,
  CookieBannerPglExpanded,
  CookieBannerPglHeader,
  CookieBannerPglToggleList,
  CookieBannerPglToggle,
  CookieBannerPglFooter,
  CookieBannerPglSecondary,
  CookieBannerPglPrimary,
} from "@/components/ui/cookie-banner-pgl";
import {
  CookieBannerStore,
  CookieBannerStoreCollapsed,
  CookieBannerStoreIcon,
  CookieBannerStoreMessage,
  CookieBannerStorePolicyLink,
  CookieBannerStoreActions,
  CookieBannerStoreSettingsButton,
  CookieBannerStoreAcceptButton,
  CookieBannerStoreExpanded,
  CookieBannerStoreHeader,
  CookieBannerStoreToggleList,
  CookieBannerStoreToggle,
  CookieBannerStoreFooter,
  CookieBannerStoreSecondary,
  CookieBannerStorePrimary,
} from "@/components/ui/cookie-banner-store";

/**
 * Decide qual banner renderizar baseado no contexto da rota:
 *
 *  - Páginas dentro de `/site/[slug]` → `CookieBannerStore` (herda
 *    cores e fontes do template do cliente via `--pgl-*` CSS vars).
 *  - Demais (painel, marketing, auth) → `CookieBannerPgl` (Linear/HIG
 *    monocromático preto).
 *
 * Toda lógica (localStorage, preferências, expand) vive no hook
 * `useCookieConsent` — os bannersão wrappers visuais.
 */
/**
 * Lê as CSS vars do template do cliente DIRETAMENTE do elemento que as
 * injeta (`[data-style]` do DesignTokensProvider).  As vars NÃO estão no
 * `:root`, então `position: fixed` no body não as enxerga via cascade —
 * por isso copiamos os valores resolvidos e aplicamos inline no banner.
 */
function readStoreTokens(): CSSProperties | null {
  if (typeof window === "undefined") return null;
  const host = document.querySelector("[data-style]") as HTMLElement | null;
  if (!host) return null;
  const cs = getComputedStyle(host);

  const get = (name: string) => cs.getPropertyValue(name).trim();

  const primary = get("--pgl-primary");
  const text = get("--pgl-text");
  if (!primary && !text) return null;

  // Replica todas as vars relevantes inline no container do banner.
  // CSS vars CASCATEIAM para baixo, então qualquer `var(--pgl-...)` dentro
  // do banner vai resolver com esses valores — mesmo o banner estando em
  // outro ramo do DOM.
  const vars: Record<string, string> = {
    "--pgl-primary": primary,
    "--pgl-secondary": get("--pgl-secondary"),
    "--pgl-accent": get("--pgl-accent"),
    "--pgl-background": get("--pgl-background"),
    "--pgl-surface": get("--pgl-surface"),
    "--pgl-text": text,
    "--pgl-text-muted": get("--pgl-text-muted"),
    "--pgl-font-heading": get("--pgl-font-heading"),
    "--pgl-font-body": get("--pgl-font-body"),
    "--pgl-radius": get("--pgl-radius"),
  };

  return Object.fromEntries(
    Object.entries(vars).filter(([, v]) => v.length > 0)
  ) as CSSProperties;
}

export function CookieConsent() {
  const pathname = usePathname();
  const [storeTokens, setStoreTokens] = useState<CSSProperties | null>(null);
  const {
    isVisible,
    isExpanded,
    setIsExpanded,
    preferences,
    setPreferences,
    acceptAll,
    acceptEssential,
    acceptCustom,
  } = useCookieConsent();

  // Tenta detectar o template do cliente quando o banner aparece.
  // - Rota tem que começar com `/site/`.
  // - Re-tenta com pequeno polling enquanto o `<DesignTokensProvider>` ainda
  //   pode estar montando (CSS vars chegam após hidratação do site renderer).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isStoreRoute = pathname?.startsWith("/site/") ?? false;
    if (!isStoreRoute) {
      setStoreTokens(null);
      return;
    }

    // Lê imediatamente
    const initial = readStoreTokens();
    if (initial) {
      setStoreTokens(initial);
      return;
    }

    // Polling curto (até 2s) para esperar o DesignTokensProvider montar
    let attempts = 0;
    const id = setInterval(() => {
      attempts++;
      const t = readStoreTokens();
      if (t) {
        setStoreTokens(t);
        clearInterval(id);
      } else if (attempts >= 20) {
        clearInterval(id);
      }
    }, 100);
    return () => clearInterval(id);
  }, [pathname]);

  if (!isVisible) return null;

  if (storeTokens) {
    return (
      <CookieBannerStore
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        cssVars={storeTokens}
      >
        <CookieBannerStoreCollapsed>
          <CookieBannerStoreIcon />
          <CookieBannerStoreMessage>
            <span className="hidden sm:inline">
              Usamos cookies para melhorar sua experiência.{" "}
              <CookieBannerStorePolicyLink />
            </span>
            <span className="sm:hidden">
              Usamos cookies. <CookieBannerStorePolicyLink />
            </span>
          </CookieBannerStoreMessage>
          <CookieBannerStoreActions>
            <CookieBannerStoreSettingsButton />
            <CookieBannerStoreAcceptButton onClick={acceptAll} />
          </CookieBannerStoreActions>
        </CookieBannerStoreCollapsed>

        <CookieBannerStoreExpanded>
          <CookieBannerStoreHeader />
          <CookieBannerStoreToggleList>
            <CookieBannerStoreToggle
              title="Essenciais"
              description="Necessários para o site funcionar"
              checked
              disabled
              onChange={() => {}}
            />
            <CookieBannerStoreToggle
              title="Análise"
              description="Nos ajude a melhorar a experiência"
              checked={preferences.analytics}
              onChange={(c) => setPreferences((p) => ({ ...p, analytics: c }))}
            />
            <CookieBannerStoreToggle
              title="Marketing"
              description="Anúncios mais relevantes para você"
              checked={preferences.marketing}
              onChange={(c) => setPreferences((p) => ({ ...p, marketing: c }))}
            />
          </CookieBannerStoreToggleList>
          <CookieBannerStoreFooter>
            <CookieBannerStoreSecondary onClick={acceptEssential}>
              Apenas essenciais
            </CookieBannerStoreSecondary>
            <CookieBannerStorePrimary onClick={acceptCustom}>
              Salvar
            </CookieBannerStorePrimary>
          </CookieBannerStoreFooter>
        </CookieBannerStoreExpanded>
      </CookieBannerStore>
    );
  }

  return (
    <CookieBannerPgl isExpanded={isExpanded} setIsExpanded={setIsExpanded}>
      <CookieBannerPglCollapsed>
        <CookieBannerPglIcon />
        <CookieBannerPglMessage>
          <span className="hidden sm:inline">
            Usamos cookies para melhorar sua experiência.{" "}
            <CookieBannerPglPolicyLink />
          </span>
          <span className="sm:hidden">
            Usamos cookies. <CookieBannerPglPolicyLink />
          </span>
        </CookieBannerPglMessage>
        <CookieBannerPglActions>
          <CookieBannerPglSettingsButton />
          <CookieBannerPglAcceptButton onClick={acceptAll} />
        </CookieBannerPglActions>
      </CookieBannerPglCollapsed>

      <CookieBannerPglExpanded>
        <CookieBannerPglHeader />
        <CookieBannerPglToggleList>
          <CookieBannerPglToggle
            title="Essenciais"
            description="Necessários para o site funcionar"
            checked
            disabled
            onChange={() => {}}
          />
          <CookieBannerPglToggle
            title="Análise"
            description="Nos ajude a melhorar a experiência"
            checked={preferences.analytics}
            onChange={(c) => setPreferences((p) => ({ ...p, analytics: c }))}
          />
          <CookieBannerPglToggle
            title="Marketing"
            description="Anúncios mais relevantes para você"
            checked={preferences.marketing}
            onChange={(c) => setPreferences((p) => ({ ...p, marketing: c }))}
          />
        </CookieBannerPglToggleList>
        <CookieBannerPglFooter>
          <CookieBannerPglSecondary onClick={acceptEssential}>
            Apenas essenciais
          </CookieBannerPglSecondary>
          <CookieBannerPglPrimary onClick={acceptCustom}>
            Salvar
          </CookieBannerPglPrimary>
        </CookieBannerPglFooter>
      </CookieBannerPglExpanded>
    </CookieBannerPgl>
  );
}
