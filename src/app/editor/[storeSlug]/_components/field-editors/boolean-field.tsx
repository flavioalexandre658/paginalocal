"use client";

import type { FieldDef } from "../../_lib/field-definitions";

interface Props {
  field: FieldDef;
  value: boolean;
  onChange: (value: boolean) => void;
}

export function BooleanField({ field, value, onChange }: Props) {
  const checked = value ?? false;

  return (
    <div className="flex items-center justify-between py-1">
      <label className="text-[14px] font-normal text-[#1a1a1a]">{field.label}</label>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border transition-colors ${
          checked
            ? "border-[#171717] bg-[#171717]"
            : "border-black/6 bg-[#f5f5f4]"
        }`}
      >
        <span
          className={`pointer-events-none block h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-transform ${
            checked ? "translate-x-[22px]" : "translate-x-[3px]"
          }`}
        />
      </button>
    </div>
  );
}
