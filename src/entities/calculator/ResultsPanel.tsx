'use client';

import { KpiCard } from '@/shared/ui/KpiCard';
import {
  formatCurrency,
  formatPercent,
  formatMonths,
  formatYears,
} from '@/shared/lib/utils';
import type {
  CalculatorInputs,
  CalculatorResult,
} from '@/shared/types/calculator';

interface ResultsPanelProps {
  result: CalculatorResult;
  inputs: CalculatorInputs;
  onExportPDF: () => void;
  isExporting: boolean;
}

export function ResultsPanel({
  result,
  inputs,
  onExportPDF,
  isExporting,
}: ResultsPanelProps) {
  const isPositive = result.netMonthlyPayout > 0;

  return (
    <div className="space-y-6">
      {/* Main KPIs */}
      <div className="grid grid-cols-2 gap-3">
        <KpiCard
          label="Чистая выплата / мес."
          value={formatCurrency(result.netMonthlyPayout)}
          highlight={isPositive}
          negative={!isPositive}
          delay={0}
        />
        <KpiCard
          label="Годовой доход"
          value={formatCurrency(result.annualPayout)}
          delay={80}
        />
        <KpiCard
          label="Срок окупаемости"
          value={formatMonths(result.paybackMonths)}
          sub={formatYears(result.paybackYears)}
          delay={160}
        />
        <KpiCard
          label="Доходность (ROI)"
          value={formatPercent(result.roi)}
          highlight
          delay={240}
        />
      </div>

      {/* Breakdown */}
      <div className="rounded-2xl border border-obsidian-700/60 bg-obsidian-900/30 p-6 backdrop-blur-sm">
        <h3 className="text-sm font-bold text-obsidian-300 tracking-widest uppercase mb-5">
          Структура доходов и расходов
        </h3>

        <div className="space-y-0">
          <BreakdownRow
            label={`Месячный оборот (${inputs.dailyRentalPrice}$ × ${inputs.rentalDaysPerMonth} дн.)`}
            value={formatCurrency(result.monthlyRevenue)}
            type="income"
          />
          <BreakdownRow
            label={`Комиссия компании (${result.commissionPercent}%)`}
            value={`−${formatCurrency(result.companyCommission)}`}
            type="expense"
          />
          <BreakdownRow
            label="Доход после комиссии"
            value={formatCurrency(result.revenueAfterCommission)}
            type="neutral"
          />
          <BreakdownRow
            label="Операционные расходы"
            value={`−${formatCurrency(inputs.monthlyExpenses)}`}
            type="expense"
          />

          <div className="h-px bg-gold-500/20 my-2" />

          <BreakdownRow
            label="Чистая выплата инвестору"
            value={formatCurrency(result.netMonthlyPayout)}
            type="highlight"
          />
        </div>

        {/* Visual bar */}
        <div className="mt-5 rounded-lg overflow-hidden h-2.5 bg-obsidian-800 flex">
          <div
            className="bg-red-500/70 transition-all duration-700"
            style={{
              width: `${Math.min(100, (result.companyCommission / result.monthlyRevenue) * 100)}%`,
            }}
          />
          <div
            className="bg-amber-500/70 transition-all duration-700"
            style={{
              width: `${Math.min(100, (inputs.monthlyExpenses / result.monthlyRevenue) * 100)}%`,
            }}
          />
          <div className="bg-gold-400 transition-all duration-700 flex-1" />
        </div>
        <div className="flex gap-4 mt-2 text-xs text-obsidian-500">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-red-500/70" />
            Комиссия
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-500/70" />
            Расходы
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-gold-400" />
            Прибыль
          </span>
        </div>
      </div>

      {/* PDF Export */}
      <button
        onClick={onExportPDF}
        disabled={isExporting}
        className="w-full flex items-center justify-center gap-3 rounded-xl border border-gold-500/40 bg-gradient-to-r from-gold-600/10 to-gold-500/5 hover:from-gold-600/20 hover:to-gold-500/10 text-gold-400 font-semibold py-4 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        {isExporting ? 'Генерация...' : 'Скачать PDF отчёт'}
      </button>
    </div>
  );
}

function BreakdownRow({
  label,
  value,
  type,
}: {
  label: string;
  value: string;
  type: 'income' | 'expense' | 'neutral' | 'highlight';
}) {
  const colors = {
    income: { label: 'text-obsidian-300', value: 'text-emerald-400' },
    expense: { label: 'text-obsidian-400', value: 'text-red-400' },
    neutral: { label: 'text-obsidian-300', value: 'text-obsidian-200' },
    highlight: {
      label: 'text-obsidian-100 font-semibold',
      value: 'text-gold-400 font-bold text-lg',
    },
  };

  return (
    <div
      className={`flex items-baseline justify-between py-2.5 ${type === 'highlight' ? '' : 'border-b border-obsidian-800/60'}`}
    >
      <span className={`text-sm ${colors[type].label}`}>{label}</span>
      <span className={`text-sm ${colors[type].value} tabular-nums`}>
        {value}
      </span>
    </div>
  );
}
