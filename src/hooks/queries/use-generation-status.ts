import { useQuery } from "@tanstack/react-query";
import type { GenerationStatus } from "@/db/schema/stores.schema";
import type { SiteBlueprint } from "@/types/ai-generation";
import { isPendingImage } from "@/lib/image-pending-token";

export const getGenerationStatusQueryKey = (slug: string) => [
  "generation-status",
  slug,
];

interface GenerationStatusResponse {
  status: GenerationStatus | null;
  blueprint: SiteBlueprint | null;
}

/**
 * Verifica se o blueprint ainda tem qualquer imagem pendente
 * (IMAGE_PENDING_TOKEN em algum slot). Quando true, polling continua
 * mesmo que `status.done === true`.
 */
function hasPendingImages(blueprint: SiteBlueprint | null | undefined): boolean {
  if (!blueprint) return false;
  for (const page of blueprint.pages || []) {
    for (const sec of page.sections || []) {
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

export function useGenerationStatus(slug: string, enabled: boolean) {
  return useQuery<GenerationStatusResponse>({
    queryKey: getGenerationStatusQueryKey(slug),
    queryFn: async () => {
      const r = await fetch(`/api/stores/${slug}/generation-status`);
      if (!r.ok) throw new Error("Failed to fetch generation status");
      return (await r.json()) as GenerationStatusResponse;
    },
    refetchInterval: (q) => {
      const data = q.state.data;
      const status = data?.status;
      // Para polling somente quando: status.done === true E nenhuma imagem
      // ainda está pendente.  Imagens podem chegar depois do done.
      if (!status) return 2000;
      if (status.done && !hasPendingImages(data?.blueprint)) return false;
      return 2000;
    },
    enabled,
  });
}
