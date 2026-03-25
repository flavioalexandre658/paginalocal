"use client";

import { Switch } from "@/components/ui/switch";
import type { FieldDef } from "../../_lib/field-definitions";

interface Props {
  field: FieldDef;
  value: boolean;
  onChange: (value: boolean) => void;
}

export function BooleanField({ field, value, onChange }: Props) {
  return (
    <div className="flex items-center justify-between py-1">
      <label className="text-xs font-medium text-slate-700">{field.label}</label>
      <Switch checked={value ?? false} onCheckedChange={onChange} />
    </div>
  );
}
