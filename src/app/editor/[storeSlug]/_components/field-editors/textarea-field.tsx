"use client";

import { Textarea } from "@/components/ui/textarea";
import type { FieldDef } from "../../_lib/field-definitions";

interface Props {
  field: FieldDef;
  value: string;
  onChange: (value: string) => void;
}

export function TextareaField({ field, value, onChange }: Props) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-700">
        {field.label}
        {field.required && <span className="text-red-500"> *</span>}
      </label>
      <Textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        rows={3}
        className="text-sm resize-none"
      />
    </div>
  );
}
