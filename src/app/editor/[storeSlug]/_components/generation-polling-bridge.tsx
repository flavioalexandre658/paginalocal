"use client";

import { useEffect, useRef } from "react";
import { useGenerationStatus } from "@/hooks/queries/use-generation-status";
import { useEditor } from "../_lib/editor-context";
import { isPendingImage } from "@/lib/image-pending-token";
import type { SiteBlueprint } from "@/types/ai-generation";

interface Props {
  storeSlug: string;
}

const STALE_PROGRESS_MS = 90_000;
const RESUME_COOLDOWN_MS = 60_000;

function blueprintHasPendingImages(blueprint: SiteBlueprint | null | undefined): boolean {
  if (!blueprint) return false;
  for (const page of blueprint.pages) {
    for (const sec of page.sections) {
      const c = sec.content as Record<string, unknown> | undefined;
      if (!c) continue;
      for (const v of Object.values(c)) {
        if (isPendingImage(v)) return true;
        if (Array.isArray(v)) {
          for (const it of v as Record<string, unknown>[]) {
            if (it && typeof it === "object") {
              if (isPendingImage(it.image) || isPendingImage(it.url)) return true;
            }
          }
        }
      }
    }
  }
  return false;
}

/**
 * Polls /api/stores/[storeSlug]/generation-status enquanto:
 *  - alguma seção ainda tem placeholder de TEXTO (`__generating: true`), OU
 *  - alguma imagem ainda está com IMAGE_PENDING_TOKEN no slot.
 *
 * Para cada update do servidor:
 *  - Se vieram seções de TEXTO novas → MERGE_GENERATED_SECTIONS
 *  - Se vieram URLs de IMAGEM novas → MERGE_IMAGE_URLS (preserva edits do user)
 *  - Quando done=true E nenhuma imagem pendente → flush final + bump epoch
 *
 * Também faz auto-resume da geração se o progresso ficar parado >90s.
 */
export function GenerationPollingBridge({ storeSlug }: Props) {
  const { state, dispatch } = useEditor();

  const hasTextPlaceholders = state.blueprint.pages.some((p) =>
    p.sections.some(
      (s) =>
        (s.content as Record<string, unknown> | undefined)?.__generating === true
    )
  );
  const hasImagePending = blueprintHasPendingImages(state.blueprint);
  const shouldPoll = hasTextPlaceholders || hasImagePending;

  const { data } = useGenerationStatus(storeSlug, shouldPoll);

  const lastReadyRef = useRef<number>(-1);
  const lastProgressAtRef = useRef<number>(Date.now());
  const lastResumeAtRef = useRef<number>(0);
  const finalFlushedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!data?.blueprint) return;
    const status = data.status;
    const incoming = data.blueprint;
    const ready = status?.sectionsReady ?? 0;

    // Texto novo (sectionsReady aumentou)
    if (ready > lastReadyRef.current) {
      lastReadyRef.current = ready;
      lastProgressAtRef.current = Date.now();
      if (!status?.done) {
        dispatch({ type: "MERGE_GENERATED_SECTIONS", blueprint: incoming });
      }
    }

    // Imagens — sempre tentar merge: barato, só atualiza se tem URL nova
    // que substitui um IMAGE_PENDING_TOKEN local. Atualiza progresso também
    // se algo realmente mudou (cliente sabe pelo número de pending atual).
    const hadPending = blueprintHasPendingImages(state.blueprint);
    dispatch({ type: "MERGE_IMAGE_URLS", blueprint: incoming });
    const stillPending = blueprintHasPendingImages(incoming);
    if (hadPending && !stillPending) {
      lastProgressAtRef.current = Date.now();
    } else if (hadPending) {
      // Mesmo se ainda tem pendente, se VAGA mudou (algumas imagens chegaram),
      // bumpa o timer de progresso para evitar resume desnecessário.
      lastProgressAtRef.current = Date.now();
    }

    // Flush final — done E todas imagens entregues
    const allDone = !!status?.done && !stillPending;
    if (allDone && !finalFlushedRef.current) {
      finalFlushedRef.current = true;
      dispatch({ type: "SET_BLUEPRINT", blueprint: incoming });
      dispatch({ type: "BUMP_RENDER_EPOCH" });
    }
  }, [data, dispatch, state.blueprint]);

  // Auto-resume quando progresso travado por > 90s e ainda não terminou
  useEffect(() => {
    if (!shouldPoll) return;
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
  }, [shouldPoll, storeSlug]);

  return null;
}
