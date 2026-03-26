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
      <label className="mb-[6px] block text-[13px] font-medium text-[#737373]">
        {field.label}
        {field.required && <span className="text-red-500"> *</span>}
      </label>
      <Select value={value ?? ""} onValueChange={onChange}>
        <SelectTrigger className="h-10 w-full rounded-[10px] border border-black/6 bg-[#f5f5f4] px-[14px] font-[system-ui] text-[14px] font-normal text-[#1a1a1a] placeholder:text-[#a3a3a3] shadow-none ring-0 focus:border-black/20 focus:outline-none focus:ring-0">
          <SelectValue placeholder="Selecionar..." />
        </SelectTrigger>
        <SelectContent className="rounded-[10px] border border-black/6 bg-[#f5f5f4] shadow-md">
          {options.map((opt) => (
            <SelectItem key={opt} value={opt} className="rounded-lg text-[14px] font-normal text-[#1a1a1a] focus:bg-black/5">
              {labels[opt] ?? opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
