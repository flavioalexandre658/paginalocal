"use client";

import { useState, useRef, useCallback } from "react";
import { IconUpload, IconSearch } from "@tabler/icons-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  ModalFooterActions,
} from "@/components/ui/modal-blocks";
import { PglButton } from "@/components/ui/pgl-button";
import { useEditor } from "../../_lib/editor-context";
import { setFieldByPath } from "../../_lib/text-field-mapper";
import { useAction } from "next-safe-action/hooks";
import { uploadEditorImageAction } from "@/actions/uploads/upload-editor-image.action";

interface Props {
  sectionId: string;
  content: Record<string, unknown>;
  fieldPath: string;
  storeId: string;
  currentUrl?: string;
  onClose: () => void;
}

export function ImageEditPopup({
  sectionId,
  content,
  fieldPath,
  storeId,
  currentUrl,
  onClose,
}: Props) {
  const { dispatch } = useEditor();
  const [selectedUrl, setSelectedUrl] = useState<string | null>(currentUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { executeAsync: uploadImage } = useAction(uploadEditorImageAction);

  const handleUpload = useCallback(async (file: File) => {
    setIsUploading(true);
    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      const role = fieldPath.includes("backgroundImage") ? "hero"
        : fieldPath.includes("logo") ? "logo"
        : fieldPath.includes("image") ? "gallery"
        : "general";

      const result = await uploadImage({
        storeId,
        imageData: base64,
        role: role as "hero" | "gallery" | "logo" | "general",
        filename: file.name.replace(/\.[^.]+$/, ""),
      });

      if (result?.data?.url) {
        setSelectedUrl(result.data.url);
      }
    } finally {
      setIsUploading(false);
    }
  }, [fieldPath, storeId, uploadImage]);

  const handleSave = useCallback(() => {
    if (!selectedUrl) return;
    const updated = setFieldByPath(content, fieldPath, selectedUrl);
    dispatch({
      type: "UPDATE_SECTION_CONTENT",
      sectionId,
      content: updated,
    });
    onClose();
  }, [content, dispatch, fieldPath, sectionId, selectedUrl, onClose]);

  return (
    <Modal open onOpenChange={(open) => { if (!open) onClose(); }}>
      <ModalContent size="md" data-editor-ui>
        <ModalHeader>
          <ModalTitle>Editar imagem</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
            }}
          />

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <IconSearch className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-black/30" />
                <input
                  type="text"
                  placeholder="Buscar imagem..."
                  className="w-full rounded-xl border border-black/10 bg-white py-2.5 pl-10 pr-3.5 text-sm text-black/80 outline-none transition-colors placeholder:text-black/30 focus:border-black/30 focus:ring-1 focus:ring-black/10"
                />
              </div>
              <PglButton
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <IconUpload className="size-4" />
                Upload
              </PglButton>
            </div>

            {isUploading && (
              <div className="flex items-center justify-center py-8">
                <div className="size-6 animate-spin rounded-full border-2 border-black/10 border-t-black/80" />
              </div>
            )}

            {selectedUrl && !isUploading && (
              <div className="overflow-hidden rounded-xl border-2 border-black/80">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selectedUrl} alt="Selecionada" className="h-40 w-full object-cover" />
              </div>
            )}

            <div
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const file = e.dataTransfer.files[0];
                if (file && file.type.startsWith("image/")) handleUpload(file);
              }}
              className="cursor-pointer rounded-xl border border-dashed border-black/10 p-6 text-center text-sm text-black/40 transition-colors hover:border-black/20"
              onClick={() => fileInputRef.current?.click()}
            >
              Arraste uma imagem ou clique para fazer upload
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div />
          <ModalFooterActions>
            <PglButton variant="ghost" size="sm" onClick={onClose}>Cancelar</PglButton>
            <PglButton variant="dark" size="sm" onClick={handleSave} disabled={!selectedUrl}>Salvar</PglButton>
          </ModalFooterActions>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
