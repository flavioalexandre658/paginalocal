"use client";

import { Input } from "@/components/ui/input";
import type { FieldDef } from "../../_lib/field-definitions";

interface Props {
  field: FieldDef;
  value: string;
  onChange: (value: string) => void;
}

export function TextField({ field, value, onChange }: Props) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-700">
        {field.label}
        {field.required && <span className="text-red-500"> *</span>}
      </label>
      <Input
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        className="h-9 text-sm"
      />
    </div>
  );
}
