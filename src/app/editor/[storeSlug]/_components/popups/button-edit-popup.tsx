"use client";

import { useState, useCallback } from "react";
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
import { cn } from "@/lib/utils";
import { useEditor } from "../../_lib/editor-context";
import { setFieldByPath } from "../../_lib/text-field-mapper";

const LINK_TYPES = [
  { value: "link", label: "Link externo" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "phone", label: "Telefone" },
  { value: "email", label: "Email" },
  { value: "scroll", label: "Seção da página" },
];

interface Props {
  sectionId: string;
  content: Record<string, unknown>;
  fieldPrefix: string;
  textField: string;
  linkField: string;
  typeField?: string;
  onClose: () => void;
}

export function ButtonEditPopup({
  sectionId,
  content,
  fieldPrefix,
  textField,
  linkField,
  typeField,
  onClose,
}: Props) {
  const { dispatch } = useEditor();

  const getFieldPath = (field: string) =>
    fieldPrefix ? `${fieldPrefix}.${field}` : field;

  const getFieldValue = (field: string): string => {
    const path = getFieldPath(field).split(".");
    let current: unknown = content;
    for (const key of path) {
      if (current == null || typeof current !== "object") return "";
      const idx = parseInt(key);
      if (Array.isArray(current) && !isNaN(idx)) {
        current = (current as unknown[])[idx];
      } else {
        current = (current as Record<string, unknown>)[key];
      }
    }
    return typeof current === "string" ? current : "";
  };

  const [label, setLabel] = useState(getFieldValue(textField));
  const [linkValue, setLinkValue] = useState(getFieldValue(linkField));
  const [linkType, setLinkType] = useState(
    (typeField ? getFieldValue(typeField) : "whatsapp") || "whatsapp"
  );

  const handleSave = useCallback(() => {
    let updated = content;
    updated = setFieldByPath(updated, getFieldPath(textField), label);
    updated = setFieldByPath(updated, getFieldPath(linkField), linkValue);
    if (typeField) {
      updated = setFieldByPath(updated, getFieldPath(typeField), linkType);
    }
    dispatch({
      type: "UPDATE_SECTION_CONTENT",
      sectionId,
      content: updated,
    });
    onClose();
  }, [content, dispatch, label, linkValue, linkType, sectionId, textField, linkField, typeField, fieldPrefix, onClose]);

  const placeholder =
    linkType === "whatsapp" ? "https://wa.me/5511999999999"
    : linkType === "phone" ? "+55 11 99999-9999"
    : linkType === "email" ? "contato@empresa.com"
    : linkType === "scroll" ? "#contato"
    : "https://";

  const linkLabel =
    linkType === "whatsapp" ? "Número WhatsApp"
    : linkType === "phone" ? "Telefone"
    : linkType === "email" ? "Email"
    : linkType === "scroll" ? "Âncora"
    : "URL";

  return (
    <Modal open onOpenChange={(open) => { if (!open) onClose(); }}>
      <ModalContent size="sm" data-editor-ui>
        <ModalHeader>
          <ModalTitle>Botão de ação</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Tipo de link</p>
              <div className="flex flex-wrap gap-1.5">
                {LINK_TYPES.map((lt) => (
                  <button
                    key={lt.value}
                    onClick={() => setLinkType(lt.value)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-[11px] font-medium transition-colors",
                      linkType === lt.value
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-transparent text-muted-foreground hover:border-primary/50"
                    )}
                  >
                    {lt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">{linkLabel}</p>
              <input
                type="text"
                value={linkValue}
                onChange={(e) => setLinkValue(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">Texto do botão</p>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Ex: Comece agora"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div />
          <ModalFooterActions>
            <Button variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar</Button>
          </ModalFooterActions>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
