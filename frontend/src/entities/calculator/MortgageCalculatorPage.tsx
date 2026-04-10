'use client';

import { useState, useCallback } from 'react';
import { useMortgageCalculator } from '@/hooks/useMortgageCalculator';
import { ProgramSelector } from './ProgramSelector';
import { MortgageCalculatorForm } from './MortgageCalculatorForm';
import { MortgageResultsPanel } from './MortgageResultsPanel';

export function MortgageCalculatorPage() {
  const {
    inputs,
    rawInputs,
    result,
    program,
    programs,
    keyRate,
    keyRateDate,
    ratesLoading,
    ratesError,
    isFallback,
    effectiveRate,
    customRate,
    setCustomRate,
    updateInput,
    selectProgram,
    resetInputs,
  } = useMortgageCalculator();

  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = useCallback(async () => {
    if (!result) return;
    setIsExporting(true);
    try {
      const { generateMortgagePDF } = await import('@/lib/mortgagePdf');
      await generateMortgagePDF(inputs, result, program, keyRate);
    } catch (e) {
      console.error('PDF error:', e);
    } finally {
      setIsExporting(false);
    }
  }, [inputs, result, program, keyRate]);

  return (
    <section>
      <div className="container">
        <div className="min-h-screen bg-obsidian-950 text-obsidian-50 rounded-[12px] py-[25px] px-[15px] mt-[20px]">

          {/* Background */}
          <div className="fixed inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(245,158,11,0.06),transparent)]" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
          </div>

          <div className="relative z-10">
            {/* Header */}
            <header className="text-center mb-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/20 bg-gold-500/5 px-4 py-1.5 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
                <span className="text-xs font-medium text-gold-400 tracking-widest uppercase">
                  Рассчётный калькулятор
                </span>
              </div>
              <h1 className="text-3xl lg:text-5xl font-black tracking-tight text-obsidian-50 mb-3 leading-none">
                Рассчитай
                <br />
                <span className="text-gold-500">СВОЮ </span>
                <span className="text-gold-400">квартиру</span>
              </h1>
              <p className="text-obsidian-400 text-sm lg:text-base max-w-sm mx-auto">
                Актуальные ставки с banki.ru и ЦБ РФ · Аннуитетный расчёт · PDF-отчёт
              </p>

              {ratesError && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs text-amber-400">
                  ⚠ Не удалось загрузить актуальные ставки — используются статичные данные
                </div>
              )}
            </header>

            {/* Program selector — full width */}
            <div className="mb-8">
              <h2 className="text-sm font-bold text-obsidian-400 tracking-widest uppercase mb-4 text-center">
                Выберите ипотечную программу
              </h2>
              <ProgramSelector
                programs={programs}
                selected={inputs.programKey}
                onSelect={selectProgram}
                isLoading={ratesLoading}
                keyRate={keyRate}
                isFallback={isFallback}
              />
            </div>

            {/* Calculator grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 lg:gap-8 items-start">
              {/* Left: form */}
              <div className="lg:sticky lg:top-6">
                <MortgageCalculatorForm
                  rawInputs={rawInputs}
                  effectiveRate={effectiveRate}
                  customRate={customRate}
                  onUpdateInput={updateInput as any}
                  onSetCustomRate={setCustomRate}
                  onReset={resetInputs}
                  programMaxRate={program?.maxRate ?? 6}
                  programMinDownPct={program?.minDownPaymentPct ?? 20}
                />
              </div>

              {/* Right: results */}
              <div>
                {result ? (
                  <MortgageResultsPanel
                    result={result}
                    program={program}
                    onExportPDF={handleExportPDF}
                    isExporting={isExporting}
                  />
                ) : (
                  <div className="rounded-2xl border border-obsidian-700/60 bg-obsidian-900/30 p-12 flex items-center justify-center min-h-[200px]">
                    <p className="text-obsidian-500 text-sm">Введите параметры для расчёта</p>
                  </div>
                )}
              </div>
            </div>

            <footer className="mt-12 text-center text-xs text-obsidian-600">
              Ставки получены с banki.ru и cbr.ru · Обновляются раз в 24 часа · Расчёты носят ориентировочный характер
            </footer>
          </div>
        </div>
      </div>
    </section>
  );
}
