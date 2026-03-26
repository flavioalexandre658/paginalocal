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
import { Button } from "@/components/ui/button";
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
                <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar imagem..."
                  className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <IconUpload className="mr-1.5 h-4 w-4" />
                Upload
              </Button>
            </div>

            {isUploading && (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-primary" />
              </div>
            )}

            {selectedUrl && !isUploading && (
              <div className="overflow-hidden rounded-lg border-2 border-primary">
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
              className="cursor-pointer rounded-lg border-2 border-dashed border-border p-6 text-center text-sm text-muted-foreground transition-colors hover:border-primary/50"
              onClick={() => fileInputRef.current?.click()}
            >
              Arraste uma imagem ou clique para fazer upload
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div />
          <ModalFooterActions>
            <Button variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSave} disabled={!selectedUrl}>Salvar</Button>
          </ModalFooterActions>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
