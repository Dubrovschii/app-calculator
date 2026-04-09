'use client';

import { InputField } from '@/shared/ui/InputField';
import type { CalculatorInputs } from '@/shared/types/calculator';

interface CalculatorFormProps {
  inputs: CalculatorInputs;
  onUpdate: <K extends keyof CalculatorInputs>(
    key: K,
    value: CalculatorInputs[K],
  ) => void;
  onReset: () => void;
}

export function CalculatorForm({
  inputs,
  onUpdate,
  onReset,
}: CalculatorFormProps) {
  return (
    <div className="rounded-2xl border border-obsidian-700/60 bg-obsidian-900/30 p-6 lg:p-8 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-obsidian-50 tracking-tight">
            Параметры
          </h2>
          <p className="text-xs text-obsidian-500 mt-0.5">
            Введите данные автомобиля
          </p>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-obsidian-500 hover:text-gold-400 transition-colors border border-obsidian-700 rounded-lg px-3 py-1.5 hover:border-gold-500/40"
        >
          Сбросить
        </button>
      </div>

      <div className="space-y-5">
        <InputField
          label="Стоимость автомобиля"
          value={inputs.carCost}
          onChange={(v) => onUpdate('carCost', v)}
          prefix="$"
          min={0}
          step={1000}
          hint="Полная стоимость приобретения"
        />
        <InputField
          label="Цена аренды в день"
          value={inputs.dailyRentalPrice}
          onChange={(v) => onUpdate('dailyRentalPrice', v)}
          prefix="$"
          min={0}
          step={50}
        />
        <InputField
          label="Дней аренды в месяц"
          value={inputs.rentalDaysPerMonth}
          onChange={(v) => onUpdate('rentalDaysPerMonth', v)}
          suffix="дн."
          min={0}
          max={31}
          step={1}
          hint="Средняя загруженность"
        />

        <div className="h-px bg-obsidian-800 my-2" />

        <InputField
          label="Комиссия компании"
          value={inputs.companyCommissionPercent}
          onChange={(v) => onUpdate('companyCommissionPercent', v)}
          suffix="%"
          min={0}
          max={100}
          step={1}
        />
        <InputField
          label="Ежемесячные расходы"
          value={inputs.monthlyExpenses}
          onChange={(v) => onUpdate('monthlyExpenses', v)}
          prefix="$"
          min={0}
          step={100}
          hint="Страховка, обслуживание и т.д."
        />
      </div>
    </div>
  );
}
