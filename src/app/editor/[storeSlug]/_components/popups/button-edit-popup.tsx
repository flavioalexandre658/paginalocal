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
import { cn } from "@/lib/utils";
import { useEditor } from "../../_lib/editor-context";
import { setFieldByPath } from "../../_lib/text-field-mapper";

const LINK_TYPES = [
  { value: "link", label: "Link externo" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "phone", label: "Telefone" },
  { value: "email", label: "Email" },
  { value: "scroll", label: "Secao da pagina" },
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
    linkType === "whatsapp" ? "Numero WhatsApp"
    : linkType === "phone" ? "Telefone"
    : linkType === "email" ? "Email"
    : linkType === "scroll" ? "Ancora"
    : "URL";

  return (
    <Modal open onOpenChange={(open) => { if (!open) onClose(); }}>
      <ModalContent size="sm" data-editor-ui>
        <ModalHeader>
          <ModalTitle>Botao de acao</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <p className="mb-[6px] text-[13px] font-medium text-[#737373]">Tipo de link</p>
              <div className="flex flex-wrap gap-1.5">
                {LINK_TYPES.map((lt) => (
                  <button
                    key={lt.value}
                    onClick={() => setLinkType(lt.value)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-[13px] font-medium transition-colors",
                      linkType === lt.value
                        ? "border-transparent bg-[#171717] text-white"
                        : "border-[rgba(0,0,0,0.06)] bg-transparent text-[#737373] hover:border-[rgba(0,0,0,0.2)]"
                    )}
                  >
                    {lt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-[6px] text-[13px] font-medium text-[#737373]">{linkLabel}</p>
              <input
                type="text"
                value={linkValue}
                onChange={(e) => setLinkValue(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-[#f5f5f4] px-[14px] py-[10px] text-[14px] outline-none placeholder:text-[#a3a3a3] focus:border-[rgba(0,0,0,0.2)]"
              />
            </div>

            <div>
              <p className="mb-[6px] text-[13px] font-medium text-[#737373]">Texto do botao</p>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Ex: Comece agora"
                className="w-full rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-[#f5f5f4] px-[14px] py-[10px] text-[14px] outline-none placeholder:text-[#a3a3a3] focus:border-[rgba(0,0,0,0.2)]"
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div />
          <ModalFooterActions>
            <button
              onClick={onClose}
              className="text-[13px] font-medium text-[#737373] transition-colors hover:text-[#1a1a1a]"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="rounded-[8px] bg-[#171717] px-[20px] py-[8px] text-[13px] font-medium text-white transition-colors hover:bg-[#171717]/90"
            >
              Salvar
            </button>
          </ModalFooterActions>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
