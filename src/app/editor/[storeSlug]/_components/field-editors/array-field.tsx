"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { IconPlus, IconTrash, IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import type { FieldDef } from "../../_lib/field-definitions";
import { TextField } from "./text-field";
import { TextareaField } from "./textarea-field";
import { NumberField } from "./number-field";
import { BooleanField } from "./boolean-field";
import { SelectField } from "./select-field";
import { ImageField } from "./image-field";

interface Props {
  field: FieldDef;
  value: unknown[];
  onChange: (value: unknown[]) => void;
}

export function ArrayField({ field, value, onChange }: Props) {
  const items = Array.isArray(value) ? value : [];
  const itemFields = field.arrayItemFields ?? [];
  const [expandedIdx, setExpandedIdx] = useState<number | null>(items.length > 0 ? 0 : null);

  const isSimpleArray = itemFields.length === 1 && itemFields[0].key === "_value";

  function updateItem(index: number, key: string, val: unknown) {
    const updated = [...items];
    if (isSimpleArray) {
      updated[index] = val;
    } else {
      updated[index] = { ...(updated[index] as Record<string, unknown>), [key]: val };
    }
    onChange(updated);
  }

  function addItem() {
    if (isSimpleArray) {
      onChange([...items, ""]);
    } else {
      const empty: Record<string, unknown> = {};
      for (const f of itemFields) {
        if (f.type === "boolean") empty[f.key] = false;
        else if (f.type === "number") empty[f.key] = 0;
        else if (f.type === "array") empty[f.key] = [];
        else empty[f.key] = "";
      }
      onChange([...items, empty]);
    }
    setExpandedIdx(items.length);
  }

  function removeItem(index: number) {
    const updated = items.filter((_, i) => i !== index);
    onChange(updated);
    if (expandedIdx === index) setExpandedIdx(null);
    else if (expandedIdx !== null && expandedIdx > index) setExpandedIdx(expandedIdx - 1);
  }

  function moveItem(index: number, direction: "up" | "down") {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    const updated = [...items];
    [updated[index], updated[targetIdx]] = [updated[targetIdx], updated[index]];
    onChange(updated);
    setExpandedIdx(targetIdx);
  }

  function getItemLabel(item: unknown, index: number): string {
    if (isSimpleArray) return String(item || "").slice(0, 40) || `Item ${index + 1}`;
    const obj = item as Record<string, unknown>;
    return String(obj.name || obj.question || obj.text || obj.label || obj.author || "").slice(0, 40) || `Item ${index + 1}`;
  }

  return (
    <div>
      <label className="mb-2 block text-[13px] font-medium text-[#737373]">
        {field.label}
        <span className="ml-1 font-normal text-[#a3a3a3]">({items.length})</span>
      </label>

      <div className="space-y-1.5">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="overflow-hidden rounded-[10px] border border-black/6 bg-white"
          >
            <button
              type="button"
              onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
              className="flex w-full items-center gap-2 px-[14px] py-[12px] text-left text-[14px] hover:bg-[#f5f5f4]"
            >
              <span className="flex-1 truncate font-medium text-[#1a1a1a]">
                {getItemLabel(item, idx)}
              </span>
              <div className="flex shrink-0 items-center gap-0.5">
                <span
                  role="button"
                  onClick={(e) => { e.stopPropagation(); moveItem(idx, "up"); }}
                  className={cn("rounded p-0.5 text-[#737373] hover:bg-black/5", idx === 0 && "opacity-30 pointer-events-none")}
                >
                  <IconChevronUp className="h-3.5 w-3.5" />
                </span>
                <span
                  role="button"
                  onClick={(e) => { e.stopPropagation(); moveItem(idx, "down"); }}
                  className={cn("rounded p-0.5 text-[#737373] hover:bg-black/5", idx === items.length - 1 && "opacity-30 pointer-events-none")}
                >
                  <IconChevronDown className="h-3.5 w-3.5" />
                </span>
                <span
                  role="button"
                  onClick={(e) => { e.stopPropagation(); removeItem(idx); }}
                  className="rounded p-0.5 text-[#a3a3a3] hover:bg-red-50 hover:text-red-500"
                >
                  <IconTrash className="h-3.5 w-3.5" />
                </span>
              </div>
            </button>

            {expandedIdx === idx && (
              <div className="space-y-3 border-t border-black/6 px-[14px] py-3">
                {isSimpleArray ? (
                  <TextareaField
                    field={itemFields[0]}
                    value={String(item ?? "")}
                    onChange={(val) => updateItem(idx, "_value", val)}
                  />
                ) : (
                  itemFields.map((subField) => {
                    const obj = item as Record<string, unknown>;
                    const val = obj[subField.key];

                    if (subField.type === "array") {
                      return (
                        <ArrayField
                          key={subField.key}
                          field={subField}
                          value={val as unknown[] ?? []}
                          onChange={(v) => updateItem(idx, subField.key, v)}
                        />
                      );
                    }

                    return (
                      <FieldEditor
                        key={subField.key}
                        field={subField}
                        value={val}
                        onChange={(v) => updateItem(idx, subField.key, v)}
                      />
                    );
                  })
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-[10px] border border-dashed border-black/6 py-2 text-[13px] font-medium text-[#737373] transition-colors hover:border-black/20 hover:text-[#1a1a1a]"
      >
        <IconPlus className="h-3.5 w-3.5" />
        Adicionar
      </button>
    </div>
  );
}

function FieldEditor({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (val: unknown) => void;
}) {
  switch (field.type) {
    case "text":
      return <TextField field={field} value={String(value ?? "")} onChange={onChange} />;
    case "textarea":
      return <TextareaField field={field} value={String(value ?? "")} onChange={onChange} />;
    case "number":
      return <NumberField field={field} value={value as number} onChange={onChange} />;
    case "boolean":
      return <BooleanField field={field} value={Boolean(value)} onChange={onChange} />;
    case "select":
      return <SelectField field={field} value={String(value ?? "")} onChange={onChange} />;
    case "image":
      return <ImageField field={field} value={String(value ?? "")} onChange={onChange} />;
    default:
      return null;
  }
}
