"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FieldDef } from "../../_lib/field-definitions";

interface Props {
  field: FieldDef;
  value: string;
  onChange: (value: string) => void;
}

export function SelectField({ field, value, onChange }: Props) {
  const options = field.options ?? [];
  const labels = field.optionLabels ?? {};

  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-700">
        {field.label}
        {field.required && <span className="text-red-500"> *</span>}
      </label>
      <Select value={value ?? ""} onValueChange={onChange}>
        <SelectTrigger className="h-9 text-sm">
          <SelectValue placeholder="Selecionar..." />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {labels[opt] ?? opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
