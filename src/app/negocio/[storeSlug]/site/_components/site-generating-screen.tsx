"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IconLoader2 } from "@tabler/icons-react";

interface Props {
  storeSlug: string;
  storeName: string;
}

export function SiteGeneratingScreen({ storeSlug, storeName }: Props) {
  const router = useRouter();
  const [dots, setDots] = useState("");
  const [elapsed, setElapsed] = useState(0);

  // Animate dots
  useEffect(() => {
    const timer = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 500);
    return () => clearInterval(timer);
  }, []);

  // Track elapsed time
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed((e) => e + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Poll every 5s to check if blueprint is ready
  useEffect(() => {
    const poll = setInterval(() => {
      router.refresh();
    }, 5000);
    return () => clearInterval(poll);
  }, [router]);

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-6 px-6"
      style={{ backgroundColor: "#fafaf9" }}
    >
      <div className="flex flex-col items-center gap-4">
        <IconLoader2 className="size-10 animate-spin text-black/20" />

        <h1
          className="text-center text-2xl font-semibold text-black/80"
          style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
        >
          Gerando seu site{dots}
        </h1>

        <p className="max-w-sm text-center text-sm text-black/50">
          Estamos criando o design do seu site com IA.
          {storeName && (
            <>
              {" "}O site de <strong className="text-black/70">{storeName}</strong> estará pronto em instantes.
            </>
          )}
        </p>

        {elapsed > 15 && (
          <p className="mt-2 text-center text-xs text-black/35">
            Isso pode levar até 60 segundos. A página recarregará automaticamente.
          </p>
        )}

        {elapsed > 60 && (
          <button
            onClick={() => router.push(`/negocio/${storeSlug}`)}
            className="mt-4 rounded-xl bg-black/5 px-4 py-2 text-sm font-medium text-black/60 transition-colors hover:bg-black/10 hover:text-black/80"
          >
            Voltar ao painel
          </button>
        )}
      </div>
    </div>
  );
}
