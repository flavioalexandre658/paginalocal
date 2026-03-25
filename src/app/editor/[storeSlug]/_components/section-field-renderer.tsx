"use client";

import type { BlockType } from "@/types/ai-generation";
import { FIELD_DEFINITIONS, type FieldDef } from "../_lib/field-definitions";
import { TextField } from "./field-editors/text-field";
import { TextareaField } from "./field-editors/textarea-field";
import { NumberField } from "./field-editors/number-field";
import { BooleanField } from "./field-editors/boolean-field";
import { SelectField } from "./field-editors/select-field";
import { ImageField } from "./field-editors/image-field";
import { ArrayField } from "./field-editors/array-field";
import { Input } from "@/components/ui/input";

interface Props {
  blockType: BlockType;
  content: Record<string, unknown>;
  onChange: (content: Record<string, unknown>) => void;
}

export function SectionFieldRenderer({ blockType, content, onChange }: Props) {
  const fields = FIELD_DEFINITIONS[blockType];
  if (!fields) return <p className="text-sm text-slate-400">Sem campos para este tipo de bloco.</p>;

  function handleFieldChange(key: string, value: unknown) {
    onChange({ ...content, [key]: value });
  }

  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <FieldSwitch
          key={field.key}
          field={field}
          value={content[field.key]}
          onChange={(val) => handleFieldChange(field.key, val)}
        />
      ))}
    </div>
  );
}

function FieldSwitch({
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
    case "array":
      return (
        <ArrayField
          field={field}
          value={(value as unknown[]) ?? []}
          onChange={onChange}
        />
      );
    case "record":
      return <RecordField field={field} value={(value as Record<string, string>) ?? {}} onChange={onChange} />;
    default:
      return null;
  }
}

/** Key-value editor for record fields (e.g. hours schedule) */
function RecordField({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: Record<string, string>;
  onChange: (val: Record<string, string>) => void;
}) {
  const entries = Object.entries(value);

  function updateEntry(key: string, newValue: string) {
    onChange({ ...value, [key]: newValue });
  }

  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-700">{field.label}</label>
      <div className="space-y-2">
        {entries.map(([key, val]) => (
          <div key={key} className="flex items-center gap-2">
            <span className="w-24 shrink-0 text-xs font-medium text-slate-500">{key}</span>
            <Input
              value={val}
              onChange={(e) => updateEntry(key, e.target.value)}
              className="h-8 text-sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
