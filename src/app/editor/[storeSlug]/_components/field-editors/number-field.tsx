"use client";

import { Input } from "@/components/ui/input";
import type { FieldDef } from "../../_lib/field-definitions";

interface Props {
  field: FieldDef;
  value: number | undefined;
  onChange: (value: number) => void;
}

export function NumberField({ field, value, onChange }: Props) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-700">
        {field.label}
        {field.required && <span className="text-red-500"> *</span>}
      </label>
      <Input
        type="number"
        value={value ?? ""}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        min={field.min}
        max={field.max}
        step={field.step ?? 1}
        className="h-9 text-sm"
      />
    </div>
  );
}
