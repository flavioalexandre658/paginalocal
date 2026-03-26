"use client";

import { useState, useRef, useCallback } from "react";
import { useAction } from "next-safe-action/hooks";
import toast from "react-hot-toast";
import { IconUpload, IconTrash, IconLoader2, IconLink } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { uploadEditorImageAction } from "@/actions/uploads/upload-editor-image.action";
import { useEditor } from "../../_lib/editor-context";
import type { FieldDef } from "../../_lib/field-definitions";

interface Props {
  field: FieldDef;
  value: string;
  onChange: (value: string) => void;
}

function inferRole(fieldKey: string): "hero" | "gallery" | "logo" | "general" {
  if (fieldKey === "backgroundImage") return "hero";
  if (fieldKey === "logoUrl") return "logo";
  if (fieldKey === "url" || fieldKey === "image") return "gallery";
  return "general";
}

export function ImageField({ field, value, onChange }: Props) {
  const { storeId } = useEditor();
  const { executeAsync, isExecuting } = useAction(uploadEditorImageAction);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Selecione um arquivo de imagem");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Imagem muito grande (max 10MB)");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const result = await executeAsync({
          storeId,
          imageData: base64,
          role: inferRole(field.key),
          filename: file.name.replace(/\.[^.]+$/, ""),
        });
        if (result?.data?.url) {
          onChange(result.data.url);
          toast.success("Imagem enviada!");
        } else {
          throw new Error("Falha no upload");
        }
      } catch {
        toast.error("Erro ao enviar imagem");
      }
    };
    reader.readAsDataURL(file);
  }, [storeId, field.key, executeAsync, onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div>
      <label className="mb-[6px] block text-[13px] font-medium text-[#737373]">
        {field.label}
        {field.required && <span className="text-red-500"> *</span>}
      </label>

      <div
        className={cn(
          "relative overflow-hidden rounded-[10px] border border-dashed transition-colors",
          isDragging ? "border-black/20 bg-[#ebebea]" : "border-black/6 bg-[#f5f5f4]",
          isExecuting && "pointer-events-none opacity-60"
        )}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {value ? (
          <div className="group relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt={field.label}
              className="h-32 w-full rounded-[10px] object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = ""; }}
            />
            <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-[10px] bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-[10px] bg-white px-3 py-1.5 text-[13px] font-medium text-[#737373] shadow-sm hover:bg-[#f5f5f4]"
              >
                Trocar
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="rounded-[10px] bg-red-500 px-3 py-1.5 text-[13px] font-medium text-white shadow-sm hover:bg-red-600"
              >
                <IconTrash className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-2 py-8 text-[#a3a3a3] hover:text-[#737373]"
          >
            {isExecuting ? (
              <IconLoader2 className="h-6 w-6 animate-spin" />
            ) : (
              <IconUpload className="h-6 w-6" />
            )}
            <span className="text-[13px] font-medium">
              {isExecuting ? "Enviando..." : "Clique ou arraste uma imagem"}
            </span>
          </button>
        )}

        {isExecuting && value && (
          <div className="absolute inset-0 flex items-center justify-center rounded-[10px] bg-white/70">
            <IconLoader2 className="h-6 w-6 animate-spin text-[#737373]" />
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      <button
        type="button"
        onClick={() => setShowUrlInput(!showUrlInput)}
        className="mt-1.5 flex items-center gap-1 text-[12px] text-[#a3a3a3] hover:text-[#737373]"
      >
        <IconLink className="h-3 w-3" />
        {showUrlInput ? "Ocultar URL" : "Colar URL"}
      </button>

      {showUrlInput && (
        <input
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="mt-1 h-10 w-full rounded-[10px] border border-black/6 bg-[#f5f5f4] px-[14px] py-[10px] font-[system-ui] text-[14px] font-normal text-[#1a1a1a] placeholder:text-[#a3a3a3] focus:border-black/20 focus:outline-none"
        />
      )}
    </div>
  );
}
