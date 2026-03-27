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
                <IconSearch className="absolute left-[14px] top-1/2 h-4 w-4 -translate-y-1/2 text-[#a3a3a3]" />
                <input
                  type="text"
                  placeholder="Buscar imagem..."
                  className="w-full rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-[#f5f5f4] py-[10px] pl-10 pr-[14px] text-[14px] outline-none placeholder:text-[#a3a3a3] focus:border-[rgba(0,0,0,0.2)]"
                />
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 rounded-[8px] border border-[rgba(0,0,0,0.06)] bg-transparent px-[14px] py-[10px] text-[13px] font-medium text-[#737373] transition-colors hover:border-[rgba(0,0,0,0.2)]"
              >
                <IconUpload className="h-4 w-4" />
                Upload
              </button>
            </div>

            {isUploading && (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-[rgba(0,0,0,0.06)] border-t-[#171717]" />
              </div>
            )}

            {selectedUrl && !isUploading && (
              <div className="overflow-hidden rounded-[10px] border-2 border-[#171717]">
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
              className="cursor-pointer rounded-[10px] border border-dashed border-[rgba(0,0,0,0.06)] p-6 text-center text-[14px] text-[#a3a3a3] transition-colors hover:border-[rgba(0,0,0,0.2)]"
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
