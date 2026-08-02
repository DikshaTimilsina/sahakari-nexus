"use client";

import type { CooperativeOption } from "@/types/comparison";

type CooperativeDropdownProps = {
  label: string;
  options: CooperativeOption[];
  value: string;
  onChange: (id: string) => void;
  disabledId?: string;
};

export function CooperativeDropdown({
  label,
  options,
  value,
  onChange,
  disabledId,
}: CooperativeDropdownProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </span>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
      >
        <option value="" disabled>
          Select a cooperative
        </option>
        {options.map((option) => (
          <option
            key={option.id}
            value={option.id}
            disabled={option.id === disabledId}
          >
            {option.name}
          </option>
        ))}
      </select>
    </label>
  );
}