'use client';

import { cn } from '@/lib/utils';

interface InputFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
}

export function InputField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  min = 0,
  max,
  step = 1,
  hint,
}: InputFieldProps) {
  return (
    <div className="group">
      <label className="block text-xs font-medium tracking-widest text-obsidian-400 uppercase mb-2">
        {label}
      </label>
      <div
        className={cn(
          'flex items-center gap-2 border border-obsidian-700 bg-obsidian-900/60',
          'rounded-lg px-4 py-3 transition-all duration-200',
          'focus-within:border-gold-500 focus-within:bg-obsidian-900'
        )}
      >
        {prefix && (
          <span className="text-gold-500 font-bold text-sm shrink-0">{prefix}</span>
        )}
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            if (!isNaN(v)) onChange(v);
          }}
          className={cn(
            'flex-1 bg-transparent text-obsidian-50 font-medium text-base',
            'outline-none placeholder:text-obsidian-600',
            'appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
          )}
        />
        {suffix && (
          <span className="text-obsidian-400 text-sm shrink-0">{suffix}</span>
        )}
      </div>
      {hint && <p className="mt-1.5 text-xs text-obsidian-500">{hint}</p>}
    </div>
  );
}
