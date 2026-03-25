"use client";

import { useState, useCallback } from "react";
import { EditPopup } from "../edit-popup";
import { useEditor } from "../../_lib/editor-context";
import { setFieldByPath } from "../../_lib/text-field-mapper";

type LinkType = "whatsapp" | "link" | "scroll" | "phone" | "email";

interface Props {
  anchorRect: DOMRect;
  sectionId: string;
  content: Record<string, unknown>;
  fieldPrefix: string;
  textField: string;
  linkField: string;
  typeField?: string;
  onClose: () => void;
}

const LINK_TYPES: { value: LinkType; label: string }[] = [
  { value: "link", label: "Link externo" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "phone", label: "Telefone" },
  { value: "email", label: "Email" },
  { value: "scroll", label: "Seção da página" },
];

export function ButtonEditPopup({
  anchorRect,
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
  const [linkType, setLinkType] = useState<LinkType>(
    (typeField ? getFieldValue(typeField) : "whatsapp") as LinkType || "whatsapp"
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
  }, [content, dispatch, label, linkValue, linkType, sectionId, textField, linkField, typeField, fieldPrefix]);

  const placeholder =
    linkType === "whatsapp" ? "https://wa.me/5511999999999"
    : linkType === "phone" ? "+55 11 99999-9999"
    : linkType === "email" ? "contato@empresa.com"
    : linkType === "scroll" ? "#contact"
    : "https://";

  const linkLabel =
    linkType === "whatsapp" ? "Número WhatsApp"
    : linkType === "phone" ? "Telefone"
    : linkType === "email" ? "Email"
    : linkType === "scroll" ? "Âncora"
    : "URL";

  return (
    <EditPopup title="Call to Action" anchorRect={anchorRect} onClose={onClose} onSave={handleSave}>
      <div className="space-y-4">
        {/* Link Type — pill selector */}
        <div>
          <p className="mb-2 text-xs font-medium text-slate-500">Tipo de link</p>
          <div className="flex flex-wrap gap-1.5">
            {LINK_TYPES.map((lt) => (
              <button
                key={lt.value}
                onClick={() => setLinkType(lt.value)}
                className={`rounded-full px-3 py-1 text-[11px] font-medium transition-colors ${
                  linkType === lt.value
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {lt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Link value */}
        <div>
          <p className="mb-1.5 text-xs font-medium text-slate-500">{linkLabel}</p>
          <input
            type="text"
            value={linkValue}
            onChange={(e) => setLinkValue(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-slate-300 focus:ring-1 focus:ring-slate-300"
          />
        </div>

        {/* Button label */}
        <div>
          <p className="mb-1.5 text-xs font-medium text-slate-500">Texto do botão</p>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Ex: Comece agora"
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-slate-300 focus:ring-1 focus:ring-slate-300"
          />
        </div>
      </div>
    </EditPopup>
  );
}
