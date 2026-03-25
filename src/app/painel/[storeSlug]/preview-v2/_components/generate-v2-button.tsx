"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { triggerV2Generation } from "@/actions/ai/trigger-v2-generation";
import { cn } from "@/lib/utils";

type Model = "sonnet" | "gpt-5.4-nano" | "gemini";

const MODELS: { id: Model; label: string; color: string }[] = [
  { id: "sonnet", label: "Sonnet", color: "bg-violet-600 hover:bg-violet-700" },
  { id: "gpt-5.4-nano", label: "gpt-5.4-nano", color: "bg-emerald-600 hover:bg-emerald-700" },
  { id: "gemini", label: "Gemini", color: "bg-blue-600 hover:bg-blue-700" },
];

interface GenerateV2ButtonProps {
  storeSlug: string;
  hasBlueprint: boolean;
}

export function GenerateV2Button({ storeSlug, hasBlueprint }: GenerateV2ButtonProps) {
  const [loadingModel, setLoadingModel] = useState<Model | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleGenerate(model: Model) {
    setLoadingModel(model);
    setError(null);
    try {
      const result = await triggerV2Generation({ storeSlug, model });
      if (result?.serverError) {
        setError(result.serverError);
        return;
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro desconhecido");
    } finally {
      setLoadingModel(null);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      {error && <p className="text-xs text-red-600 max-w-xs text-right">{error}</p>}
      <div className="flex gap-2">
        {MODELS.map(({ id, label, color }) => (
          <button
            key={id}
            onClick={() => handleGenerate(id)}
            disabled={loadingModel !== null}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium text-white transition-colors disabled:opacity-50",
              color,
            )}
          >
            {loadingModel === id
              ? "Gerando..."
              : hasBlueprint
                ? label
                : label}
          </button>
        ))}
      </div>
    </div>
  );
}
