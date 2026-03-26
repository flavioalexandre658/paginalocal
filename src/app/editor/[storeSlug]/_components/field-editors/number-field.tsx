"use client";

import type { FieldDef } from "../../_lib/field-definitions";

interface Props {
  field: FieldDef;
  value: number | undefined;
  onChange: (value: number) => void;
}

export function NumberField({ field, value, onChange }: Props) {
  return (
    <div>
      <label className="mb-[6px] block text-[13px] font-medium text-[#737373]">
        {field.label}
        {field.required && <span className="text-red-500"> *</span>}
      </label>
      <input
        type="number"
        value={value ?? ""}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        min={field.min}
        max={field.max}
        step={field.step ?? 1}
        className="h-10 w-full rounded-[10px] border border-black/6 bg-[#f5f5f4] px-[14px] py-[10px] font-[system-ui] text-[14px] font-normal text-[#1a1a1a] placeholder:text-[#a3a3a3] focus:border-black/20 focus:outline-none"
      />
    </div>
  );
}
