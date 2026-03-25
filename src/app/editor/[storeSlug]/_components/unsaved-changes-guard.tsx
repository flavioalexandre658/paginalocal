"use client";

import { useEffect } from "react";
import { useEditor } from "../_lib/editor-context";

export function UnsavedChangesGuard() {
  const { state } = useEditor();

  useEffect(() => {
    if (!state.isDirty) return;

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [state.isDirty]);

  return null;
}
