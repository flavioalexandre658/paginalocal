import { useQuery } from "@tanstack/react-query";
import type { GenerationStatus } from "@/db/schema/stores.schema";
import type { SiteBlueprint } from "@/types/ai-generation";

export const getGenerationStatusQueryKey = (slug: string) => [
  "generation-status",
  slug,
];

interface GenerationStatusResponse {
  status: GenerationStatus | null;
  blueprint: SiteBlueprint | null;
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
      const status = q.state.data?.status;
      if (!status || status.done) return false;
      return 2000;
    },
    enabled,
  });
}
