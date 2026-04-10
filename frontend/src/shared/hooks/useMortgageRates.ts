'use client';

import { useQuery } from '@tanstack/react-query';
import type { MortgageProgram } from '@/types/mortgage';

interface MortgageRatesResponse {
  ok: boolean;
  fallback?: boolean;
  keyRate: number;
  keyRateDate: string;
  programs: MortgageProgram[];
  fetchedAt: string;
}

async function fetchMortgageRates(): Promise<MortgageRatesResponse> {
  const res = await fetch('/api/mortgage-rates', {
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error('Failed to fetch mortgage rates');
  return res.json();
}

export function useMortgageRates() {
  return useQuery({
    queryKey: ['mortgage-rates'],
    queryFn: fetchMortgageRates,
    staleTime: 1000 * 60 * 60 * 4, // 4 часа — не перезапрашиваем часто
    gcTime: 1000 * 60 * 60 * 24,   // 24 часа в кеше
    retry: 2,
    retryDelay: 1000,
  });
}
