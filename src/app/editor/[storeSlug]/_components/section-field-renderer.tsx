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
  if (!fields) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
        Sem campos editaveis para este tipo de bloco.
      </div>
    );
  }

  function handleFieldChange(key: string, value: unknown) {
    onChange({ ...content, [key]: value });
  }

  const simpleFields = fields.filter((f) => f.type !== "array" && f.type !== "record");
  const complexFields = fields.filter((f) => f.type === "array" || f.type === "record");

  return (
    <div className="space-y-6">
      {simpleFields.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {simpleFields.map((field) => {
            const isFullWidth = field.type === "textarea" || field.type === "image";
            return (
              <div key={field.key} className={isFullWidth ? "sm:col-span-2" : ""}>
                <FieldSwitch
                  field={field}
                  value={content[field.key]}
                  onChange={(val) => handleFieldChange(field.key, val)}
                />
              </div>
            );
          })}
        </div>
      )}

      {complexFields.map((field) => (
        <div key={field.key} className="border-t border-border pt-5">
          <FieldSwitch
            field={field}
            value={content[field.key]}
            onChange={(val) => handleFieldChange(field.key, val)}
          />
        </div>
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
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {field.label}
      </label>
      <div className="space-y-2">
        {entries.map(([key, val]) => (
          <div key={key} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-sm font-medium text-foreground">{key}</span>
            <Input
              value={val}
              onChange={(e) => updateEntry(key, e.target.value)}
              className="h-9"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
