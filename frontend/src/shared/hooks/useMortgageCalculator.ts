'use client';

import { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useMortgageRates } from './useMortgageRates';
import { calculateMortgage } from '@/lib/mortgageCalc';
import type { MortgageInputs, ProgramKey } from '@/types/mortgage';

const DEFAULT_INPUTS: Omit<MortgageInputs, 'rate'> = {
  programKey: 'family',
  propertyPrice: 8_000_000,
  downPayment: 2_000_000,
  termYears: 20,
};

export function useMortgageCalculator() {
  const { data: ratesData, isLoading: ratesLoading, isError: ratesError } = useMortgageRates();

  const [selectedProgram, setSelectedProgram] = useState<ProgramKey>('family');
  const [inputs, setInputs] = useState<Omit<MortgageInputs, 'rate' | 'programKey'>>(
    { propertyPrice: DEFAULT_INPUTS.propertyPrice, downPayment: DEFAULT_INPUTS.downPayment, termYears: DEFAULT_INPUTS.termYears }
  );
  const [customRate, setCustomRate] = useState<number | null>(null); // null = использовать ставку из парсера

  // Программа из API
  const program = useMemo(
    () => ratesData?.programs.find((p) => p.key === selectedProgram) ?? null,
    [ratesData, selectedProgram]
  );

  // Актуальная ставка: кастомная > live > maxRate программы
  const effectiveRate = useMemo(() => {
    if (customRate !== null) return customRate;
    return program?.liveRate ?? program?.maxRate ?? 6;
  }, [customRate, program]);

  const fullInputs: MortgageInputs = useMemo(
    () => ({ ...inputs, programKey: selectedProgram, rate: effectiveRate }),
    [inputs, selectedProgram, effectiveRate]
  );

  const result = useQuery({
    queryKey: ['mortgage-calc', fullInputs],
    queryFn: () => calculateMortgage(fullInputs),
    staleTime: Infinity,
    placeholderData: (prev) => prev,
    enabled: effectiveRate > 0 && inputs.propertyPrice > 0,
  });

  const updateInput = useCallback(
    <K extends keyof typeof inputs>(key: K, value: (typeof inputs)[K]) => {
      setInputs((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const selectProgram = useCallback((key: ProgramKey) => {
    setSelectedProgram(key);
    setCustomRate(null); // сбрасываем ручную ставку при смене программы
  }, []);

  const resetInputs = useCallback(() => {
    setInputs({ propertyPrice: DEFAULT_INPUTS.propertyPrice, downPayment: DEFAULT_INPUTS.downPayment, termYears: DEFAULT_INPUTS.termYears });
    setSelectedProgram('family');
    setCustomRate(null);
  }, []);

  return {
    inputs: fullInputs,
    rawInputs: inputs,
    result: result.data ?? null,
    program,
    programs: ratesData?.programs ?? [],
    keyRate: ratesData?.keyRate ?? null,
    keyRateDate: ratesData?.keyRateDate ?? null,
    ratesLoading,
    ratesError,
    isFallback: ratesData?.fallback ?? false,
    effectiveRate,
    customRate,
    setCustomRate,
    updateInput,
    selectProgram,
    resetInputs,
  };
}
