'use client';

import { formatRub, formatPct } from '@/lib/mortgageCalc';
import type { MortgageResult, MortgageProgram } from '@/types/mortgage';

interface MortgageResultsPanelProps {
  result: MortgageResult;
  program: MortgageProgram | null;
  onExportPDF: () => void;
  isExporting: boolean;
}

export function MortgageResultsPanel({ result, program, onExportPDF, isExporting }: MortgageResultsPanelProps) {
  return (
    <div className="space-y-5">
      {/* Main KPIs */}
      <div className="grid grid-cols-2 gap-3">
        <KpiCard label="Ежемесячный платёж" value={formatRub(result.monthlyPayment)} highlight delay={0} />
        <KpiCard label="Сумма кредита" value={formatRub(result.loanAmount)} delay={80} />
        <KpiCard label="Переплата" value={formatRub(result.totalInterest)} negative delay={160} />
        <KpiCard label="Переплата %" value={formatPct(result.overpaymentPct, 0)} negative delay={240} />
      </div>

      {/* Breakdown */}
      <div className="rounded-2xl border border-obsidian-700/60 bg-obsidian-900/30 p-5 space-y-0">
        <h3 className="text-xs font-bold text-obsidian-400 tracking-widest uppercase mb-4">
          Структура платежей
        </h3>

        <Row label="Стоимость недвижимости" value={formatRub(result.loanAmount + (result.loanAmount / (1 - result.downPaymentPct / 100) * (result.downPaymentPct / 100)))} />
        <Row label={`Первоначальный взнос (${result.downPaymentPct.toFixed(1)}%)`} value={formatRub(result.loanAmount / (1 - result.downPaymentPct / 100) * (result.downPaymentPct / 100))} />
        <Row label="Сумма кредита" value={formatRub(result.loanAmount)} />
        <Row label="Ставка" value={formatPct(result.effectiveRate)} />
        <Row label="Итого выплат" value={formatRub(result.totalPayment)} />
        <div className="h-px bg-gold-500/20 my-2" />
        <Row label="Переплата банку" value={formatRub(result.totalInterest)} highlight />

        {/* Visual bar */}
        <div className="mt-4 rounded-lg overflow-hidden h-2.5 bg-obsidian-800 flex">
          <div
            className="bg-gold-400 transition-all duration-700"
            style={{ width: `${Math.min(95, 100 - result.overpaymentPct / (1 + result.overpaymentPct / 100))}%` }}
          />
          <div className="bg-red-500/60 flex-1 transition-all duration-700" />
        </div>
        <div className="flex gap-4 mt-2 text-xs text-obsidian-500">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-gold-400" />Тело кредита
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-red-500/60" />Проценты
          </span>
        </div>
      </div>

      {/* Schedule preview (first 6 months) */}
      {result.schedule.length > 0 && (
        <div className="rounded-2xl border border-obsidian-700/60 bg-obsidian-900/30 p-5">
          <h3 className="text-xs font-bold text-obsidian-400 tracking-widest uppercase mb-4">
            График платежей (первые 6 мес.)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-obsidian-500 border-b border-obsidian-800">
                  <th className="text-left pb-2 font-medium">Мес.</th>
                  <th className="text-right pb-2 font-medium">Платёж</th>
                  <th className="text-right pb-2 font-medium">Осн. долг</th>
                  <th className="text-right pb-2 font-medium">Проценты</th>
                  <th className="text-right pb-2 font-medium">Остаток</th>
                </tr>
              </thead>
              <tbody>
                {result.schedule.slice(0, 6).map((row) => (
                  <tr key={row.month} className="border-b border-obsidian-800/40 text-obsidian-300">
                    <td className="py-1.5 text-obsidian-500">{row.month}</td>
                    <td className="py-1.5 text-right font-medium text-obsidian-100">{row.payment.toLocaleString('ru-RU')}</td>
                    <td className="py-1.5 text-right text-gold-500/80">{row.principal.toLocaleString('ru-RU')}</td>
                    <td className="py-1.5 text-right text-red-400/70">{row.interest.toLocaleString('ru-RU')}</td>
                    <td className="py-1.5 text-right">{row.balance.toLocaleString('ru-RU')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-obsidian-600 mt-3">* Полный график в PDF-отчёте</p>
        </div>
      )}

      {/* Program info */}
      {program && (
        <div className="rounded-xl border border-obsidian-700/40 bg-obsidian-900/20 p-4 text-xs text-obsidian-500 space-y-1">
          <p><span className="text-obsidian-400">Программа:</span> {program.label}</p>
          <p><span className="text-obsidian-400">Банки:</span> {program.banks.join(', ')}</p>
          <p><span className="text-obsidian-400">Ставка получена из:</span> {program.source}</p>
          {program.updatedAt && <p><span className="text-obsidian-400">Обновлено:</span> {program.updatedAt}</p>}
        </div>
      )}

      {/* PDF button */}
      <button
        onClick={onExportPDF}
        disabled={isExporting}
        className="w-full flex items-center justify-center gap-3 rounded-xl border border-gold-500/40 bg-gradient-to-r from-gold-600/10 to-gold-500/5 hover:from-gold-600/20 hover:to-gold-500/10 text-gold-400 font-semibold py-4 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        {isExporting ? 'Генерация PDF...' : 'Скачать отчёт PDF'}
      </button>
    </div>
  );
}

function KpiCard({ label, value, highlight, negative, delay }: {
  label: string; value: string; highlight?: boolean; negative?: boolean; delay?: number;
}) {
  return (
    <div
      className={`rounded-xl border p-4 animate-fade-up ${highlight ? 'border-gold-500/40 bg-gradient-to-br from-obsidian-800 to-obsidian-900' : 'border-obsidian-700/50 bg-obsidian-900/40'}`}
      style={{ animationDelay: `${delay ?? 0}ms`, animationFillMode: 'both', opacity: 0 }}
    >
      <p className="text-xs font-medium tracking-widest text-obsidian-400 uppercase mb-2">{label}</p>
      <p className={`text-xl font-bold leading-none ${highlight ? 'text-gold-400' : negative ? 'text-red-400' : 'text-obsidian-50'}`}>
        {value}
      </p>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex items-baseline justify-between py-2.5 border-b border-obsidian-800/60 ${highlight ? 'border-none' : ''}`}>
      <span className={`text-sm ${highlight ? 'text-obsidian-200 font-semibold' : 'text-obsidian-400'}`}>{label}</span>
      <span className={`text-sm tabular-nums ${highlight ? 'text-red-400 font-bold' : 'text-obsidian-200'}`}>{value}</span>
    </div>
  );
}
