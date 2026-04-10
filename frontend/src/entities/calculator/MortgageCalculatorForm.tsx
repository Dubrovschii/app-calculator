'use client';

import { cn } from '@/lib/utils';
import type { MortgageInputs, ProgramKey } from '@/types/mortgage';

interface MortgageFormProps {
  rawInputs: { propertyPrice: number; downPayment: number; termYears: number };
  effectiveRate: number;
  customRate: number | null;
  onUpdateInput: <K extends 'propertyPrice' | 'downPayment' | 'termYears'>(key: K, value: number) => void;
  onSetCustomRate: (rate: number | null) => void;
  onReset: () => void;
  programMaxRate: number;
  programMinDownPct: number;
}

export function MortgageCalculatorForm({
  rawInputs,
  effectiveRate,
  customRate,
  onUpdateInput,
  onSetCustomRate,
  onReset,
  programMaxRate,
  programMinDownPct,
}: MortgageFormProps) {
  const downPct = rawInputs.propertyPrice > 0
    ? ((rawInputs.downPayment / rawInputs.propertyPrice) * 100).toFixed(1)
    : '0';

  return (
    <div className="rounded-2xl border border-obsidian-700/60 bg-obsidian-900/30 p-6 backdrop-blur-sm space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-obsidian-100">Параметры кредита</h3>
          <p className="text-xs text-obsidian-500 mt-0.5">Настройте под свои условия</p>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-obsidian-500 hover:text-gold-400 transition-colors border border-obsidian-700 rounded-lg px-3 py-1.5 hover:border-gold-500/40"
        >
          Сбросить
        </button>
      </div>

      <FormField label="Стоимость недвижимости" prefix="₽">
        <input
          type="number"
          value={rawInputs.propertyPrice}
          step={100000}
          min={500000}
          onChange={(e) => onUpdateInput('propertyPrice', Number(e.target.value))}
          className="flex-1 bg-transparent text-obsidian-50 font-medium outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </FormField>

      <FormField label={`Первоначальный взнос (${downPct}%)`} prefix="₽" hint={`Минимум ${programMinDownPct}% для этой программы`}>
        <input
          type="number"
          value={rawInputs.downPayment}
          step={100000}
          min={0}
          onChange={(e) => onUpdateInput('downPayment', Number(e.target.value))}
          className="flex-1 bg-transparent text-obsidian-50 font-medium outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </FormField>

      <FormField label="Срок кредита" suffix="лет">
        <input
          type="number"
          value={rawInputs.termYears}
          step={1}
          min={1}
          max={30}
          onChange={(e) => onUpdateInput('termYears', Number(e.target.value))}
          className="flex-1 bg-transparent text-obsidian-50 font-medium outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </FormField>

      {/* Rate override */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium tracking-widest text-obsidian-400 uppercase">
            Ставка
          </label>
          {customRate !== null && (
            <button
              onClick={() => onSetCustomRate(null)}
              className="text-[10px] text-gold-500 hover:text-gold-300 transition-colors"
            >
              ← вернуть из программы
            </button>
          )}
        </div>
        <div className={cn(
          'flex items-center gap-2 border rounded-lg px-4 py-3 transition-all duration-200',
          customRate !== null
            ? 'border-gold-500/50 bg-obsidian-900'
            : 'border-obsidian-700 bg-obsidian-900/60'
        )}>
          <input
            type="number"
            value={effectiveRate}
            step={0.1}
            min={0.1}
            max={50}
            onChange={(e) => onSetCustomRate(Number(e.target.value))}
            className="flex-1 bg-transparent text-obsidian-50 font-medium outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="text-obsidian-400 text-sm">%</span>
          {customRate === null && (
            <span className="text-[10px] bg-gold-500/10 text-gold-500 border border-gold-500/20 rounded px-1.5 py-0.5 whitespace-nowrap">
              из программы
            </span>
          )}
        </div>
        <p className="mt-1.5 text-xs text-obsidian-500">
          {customRate !== null ? 'Ручная ставка' : `Актуальная ставка по выбранной программе`}
        </p>
      </div>
    </div>
  );
}

function FormField({
  label,
  prefix,
  suffix,
  hint,
  children,
}: {
  label: string;
  prefix?: string;
  suffix?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium tracking-widest text-obsidian-400 uppercase mb-2">
        {label}
      </label>
      <div className="flex items-center gap-2 border border-obsidian-700 bg-obsidian-900/60 rounded-lg px-4 py-3 focus-within:border-gold-500 transition-colors">
        {prefix && <span className="text-gold-500 font-bold text-sm shrink-0">{prefix}</span>}
        {children}
        {suffix && <span className="text-obsidian-400 text-sm shrink-0">{suffix}</span>}
      </div>
      {hint && <p className="mt-1.5 text-xs text-obsidian-500">{hint}</p>}
    </div>
  );
}
