'use client';

import { useState, useCallback } from 'react';
import { useCalculator } from '@/hooks/useCalculator';
import { CalculatorForm } from '@/components/calculator/CalculatorForm';
import { ResultsPanel } from '@/components/calculator/ResultsPanel';

export function CalculatorPage() {
  const { inputs, result, updateInput, resetInputs } = useCalculator();
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = useCallback(async () => {
    if (!result) return;
    setIsExporting(true);
    try {
      const { generatePDF } = await import('@/lib/pdf');
      await generatePDF(inputs, result);
    } catch (e) {
      console.error('PDF export error:', e);
    } finally {
      setIsExporting(false);
    }
  }, [inputs, result]);

  return (
    <div className="min-h-screen bg-obsidian-950 text-obsidian-50">
      {/* Subtle background texture */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(245,158,11,0.06),transparent)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-10 lg:py-16">
        {/* Header */}
        <header className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/20 bg-gold-500/5 px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
            <span className="text-xs font-medium text-gold-400 tracking-widest uppercase">
              Инвестиционный калькулятор
            </span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-black tracking-tight text-obsidian-50 mb-4 leading-none">
            Доходность
            <br />
            <span className="text-gold-400">автомобиля</span>
          </h1>
          <p className="text-obsidian-400 text-base lg:text-lg max-w-md mx-auto">
            Рассчитайте чистую прибыль, срок окупаемости и годовую доходность вашего автомобиля
          </p>
        </header>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 lg:gap-8 items-start">
          <div className="lg:sticky lg:top-8">
            <CalculatorForm
              inputs={inputs}
              onUpdate={updateInput}
              onReset={resetInputs}
            />
          </div>

          <div>
            {result ? (
              <ResultsPanel
                result={result}
                inputs={inputs}
                onExportPDF={handleExportPDF}
                isExporting={isExporting}
              />
            ) : (
              <div className="rounded-2xl border border-obsidian-700/60 bg-obsidian-900/30 p-12 flex items-center justify-center">
                <p className="text-obsidian-500">Введите параметры для расчёта</p>
              </div>
            )}
          </div>
        </div>

        {/* Example preset */}
        <div className="mt-8 rounded-xl border border-obsidian-700/40 bg-obsidian-900/20 p-5">
          <p className="text-xs text-obsidian-500 tracking-widest uppercase mb-1">Пример</p>
          <p className="text-sm text-obsidian-400">
            <span className="text-obsidian-200 font-medium">Lamborghini Urus</span>
            {' '}— стоимость $320,000, аренда $1,200/день, загрузка 18 дней, комиссия 40%, расходы $5,500/мес.
            Чистая прибыль: <span className="text-gold-400 font-semibold">$7,460/мес.</span>{' '}
            ROI: <span className="text-gold-400 font-semibold">~28% годовых</span>
          </p>
        </div>

        <footer className="mt-12 text-center text-xs text-obsidian-600">
          Расчёты носят ориентировочный характер и не являются финансовой консультацией
        </footer>
      </div>
    </div>
  );
}
