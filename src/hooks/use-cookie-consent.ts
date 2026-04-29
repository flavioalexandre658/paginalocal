"use client";

import { useCallback, useEffect, useState } from "react";

const COOKIE_CONSENT_KEY = "pgl-cookie-consent";

export type ConsentType = "all" | "essential" | "custom" | null;

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

const DEFAULT_PREFS: CookiePreferences = {
  essential: true,
  analytics: false,
  marketing: false,
};

export interface UseCookieConsentResult {
  isVisible: boolean;
  isExpanded: boolean;
  setIsExpanded: (v: boolean) => void;
  preferences: CookiePreferences;
  setPreferences: React.Dispatch<React.SetStateAction<CookiePreferences>>;
  acceptAll: () => void;
  acceptEssential: () => void;
  acceptCustom: () => void;
  dismiss: () => void;
}

/**
 * Hook que centraliza toda lógica de consentimento de cookies:
 *  - Lê/grava em localStorage (`pgl-cookie-consent`).
 *  - Estado `preferences` (essential/analytics/marketing).
 *  - Estado `isExpanded` para alternar entre banner colapsado e painel
 *    de configurações.
 *  - Aparece após 1.5s na primeira visita; some para sempre depois de
 *    qualquer escolha.
 *
 * Compartilhado por CookieBannerPgl e CookieBannerStore — nenhum dos dois
 * contém lógica de persistência, só visual.
 */
export function useCookieConsent(): UseCookieConsentResult {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFS);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!consent) {
        const timer = setTimeout(() => setIsVisible(true), 1500);
        return () => clearTimeout(timer);
      }
    } catch {
      // localStorage indisponível (privacy mode) → não mostra banner.
    }
  }, []);

  const saveConsent = useCallback(
    (type: ConsentType, prefs: CookiePreferences) => {
      try {
        localStorage.setItem(
          COOKIE_CONSENT_KEY,
          JSON.stringify({
            type,
            preferences: prefs,
            timestamp: new Date().toISOString(),
          })
        );
      } catch {
        // ignore
      }
      setIsVisible(false);
    },
    []
  );

  const acceptAll = useCallback(() => {
    const all: CookiePreferences = { essential: true, analytics: true, marketing: true };
    setPreferences(all);
    saveConsent("all", all);
  }, [saveConsent]);

  const acceptEssential = useCallback(() => {
    const ess: CookiePreferences = { essential: true, analytics: false, marketing: false };
    setPreferences(ess);
    saveConsent("essential", ess);
  }, [saveConsent]);

  const acceptCustom = useCallback(() => {
    saveConsent("custom", preferences);
    setIsExpanded(false);
  }, [preferences, saveConsent]);

  const dismiss = useCallback(() => setIsVisible(false), []);

  return {
    isVisible,
    isExpanded,
    setIsExpanded,
    preferences,
    setPreferences,
    acceptAll,
    acceptEssential,
    acceptCustom,
    dismiss,
  };
}

export { COOKIE_CONSENT_KEY };
