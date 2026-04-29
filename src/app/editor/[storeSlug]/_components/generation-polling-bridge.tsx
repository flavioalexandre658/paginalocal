"use client";

import { useEffect, useRef } from "react";
import { useGenerationStatus } from "@/hooks/queries/use-generation-status";
import { useEditor } from "../_lib/editor-context";

interface Props {
  storeSlug: string;
}

const STALE_PROGRESS_MS = 90_000;
const RESUME_COOLDOWN_MS = 60_000;

/**
 * Polls /api/stores/[storeSlug]/generation-status while a site is being
 * generated in the background. As phases 2 and 3 finish, dispatches
 * MERGE_GENERATED_SECTIONS so the editor swaps out skeleton placeholders
 * for the freshly generated sections.
 *
 * Extra responsibilities:
 *  1. **Auto-resume** — if no progress for 90s and not done, fires
 *     POST /api/stores/[slug]/resume-generation (idempotente). Cooldown
 *     de 60s entre tentativas.
 *  2. **Final flush** — quando done transita false→true, faz SET_BLUEPRINT
 *     com o blueprint definitivo (não apenas merge) e BUMP_RENDER_EPOCH
 *     para forçar remount das seções e garantir que <img> peguem a URL
 *     final do S3.
 */
export function GenerationPollingBridge({ storeSlug }: Props) {
  const { state, dispatch } = useEditor();

  const hasPlaceholders = state.blueprint.pages.some((p) =>
    p.sections.some(
      (s) =>
        (s.content as Record<string, unknown> | undefined)?.__generating === true
    )
  );

  const { data } = useGenerationStatus(storeSlug, hasPlaceholders);

  // Quantas seções estavam prontas no último merge (evita re-merge no mesmo tick)
  const lastReadyRef = useRef<number>(-1);
  // Quando o último incremento foi observado (para detectar progresso parado)
  const lastProgressAtRef = useRef<number>(Date.now());
  // Timestamp do último POST de resume — respeita cooldown
  const lastResumeAtRef = useRef<number>(0);
  // Done já foi tratado? Evita disparar o flush final mais de uma vez
  const finalFlushedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!data?.status || !data.blueprint) return;
    const status = data.status;
    const ready = status.sectionsReady ?? 0;

    // Atualiza progresso se houve aumento
    if (ready > lastReadyRef.current) {
      lastReadyRef.current = ready;
      lastProgressAtRef.current = Date.now();
      if (!status.done) {
        dispatch({
          type: "MERGE_GENERATED_SECTIONS",
          blueprint: data.blueprint,
        });
      }
    }

    // Flush final — done virou true: substitui blueprint inteiro + bump epoch
    if (status.done && !finalFlushedRef.current) {
      finalFlushedRef.current = true;
      dispatch({ type: "SET_BLUEPRINT", blueprint: data.blueprint });
      dispatch({ type: "BUMP_RENDER_EPOCH" });
    }
  }, [data, dispatch]);

  // Auto-resume quando progresso travado por > 90s e ainda não terminou
  useEffect(() => {
    if (!data?.status || data.status.done) return;
    const interval = setInterval(() => {
      const now = Date.now();
      const stale = now - lastProgressAtRef.current > STALE_PROGRESS_MS;
      const cooldownOk = now - lastResumeAtRef.current > RESUME_COOLDOWN_MS;
      if (stale && cooldownOk) {
        lastResumeAtRef.current = now;
        fetch(`/api/stores/${storeSlug}/resume-generation`, {
          method: "POST",
        }).catch((err) => {
          console.warn("[generation-polling-bridge] resume failed:", err);
        });
      }
    }, 10_000);
    return () => clearInterval(interval);
  }, [data?.status, storeSlug]);

  return null;
}
