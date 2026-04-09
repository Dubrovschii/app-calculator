'use client';

import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { calculateROI } from '@/lib/calculator';
import { DEFAULT_INPUTS } from '@/types/calculator';
import type { CalculatorInputs } from '@/types/calculator';

export function useCalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS);

  const { data: result, isLoading } = useQuery({
    queryKey: ['calculator', inputs],
    queryFn: () => calculateROI(inputs),
    staleTime: Infinity,
    placeholderData: (prev) => prev,
  });

  const updateInput = useCallback(
    <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => {
      setInputs((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetInputs = useCallback(() => {
    setInputs(DEFAULT_INPUTS);
  }, []);

  return { inputs, result, isLoading, updateInput, resetInputs };
}
