import type {
  MortgageProgram,
  ParsedRates,
  ProgramKey,
} from '../../types/mortgage';
import { STATIC_PROGRAMS } from '../../types/mortgage';
import { fetchCbrKeyRate, fetchCbrKeyRateFallback } from './cbr';
import { fetchBankiRates } from './banki';

/**
 * Главная функция — собирает данные из всех источников
 * и возвращает объединённые программы с актуальными ставками.
 * Запускается только на сервере (Next.js API route).
 */
export async function fetchAllRates(): Promise<ParsedRates> {
  const now = new Date().toLocaleDateString('ru-RU');
  const allKeys = Object.keys(STATIC_PROGRAMS) as ProgramKey[];

  // Параллельно тянем ЦБ и banki.ru
  const [cbrResult, bankiResults] = await Promise.allSettled([
    fetchCbrKeyRateSafe(),
    fetchBankiRates(allKeys),
  ]);

  const keyRate =
    cbrResult.status === 'fulfilled'
      ? cbrResult.value
      : { rate: 21, date: now };

  const bankiMap: Partial<
    Record<ProgramKey, { rate: number; source: string }>
  > = {};
  if (bankiResults.status === 'fulfilled') {
    for (const entry of bankiResults.value) {
      bankiMap[entry.programKey] = { rate: entry.rate, source: entry.source };
    }
  }

  // Для рыночной ипотеки — ключевая ставка + спред банка (~2.5%)
  const marketRate = parseFloat((keyRate.rate + 2.5).toFixed(2));

  const programs = {} as Record<
    ProgramKey,
    { rate: number; source: string; updatedAt: string }
  >;

  for (const key of allKeys) {
    if (key === 'market') {
      programs[key] = {
        rate: bankiMap[key]?.rate ?? marketRate,
        source:
          bankiMap[key]?.source === 'banki.ru'
            ? 'banki.ru'
            : `ЦБ РФ (${keyRate.rate}%) + спред`,
        updatedAt: now,
      };
    } else {
      const banki = bankiMap[key];
      programs[key] = {
        rate: banki?.rate ?? STATIC_PROGRAMS[key].maxRate,
        source: banki?.source === 'banki.ru' ? 'banki.ru' : 'статичные данные',
        updatedAt: now,
      };
    }
  }

  return {
    keyRate: keyRate.rate,
    keyRateDate: keyRate.date,
    programs,
  };
}

async function fetchCbrKeyRateSafe() {
  try {
    return await fetchCbrKeyRate();
  } catch {
    return await fetchCbrKeyRateFallback();
  }
}

/**
 * Мержит статические данные программ с актуальными ставками
 */
export function buildPrograms(parsed: ParsedRates): MortgageProgram[] {
  return (Object.keys(STATIC_PROGRAMS) as ProgramKey[]).map((key) => {
    const staticData = STATIC_PROGRAMS[key];
    const live = parsed.programs[key];
    return {
      ...staticData,
      liveRate: live?.rate ?? null,
      source: live?.source ?? 'статичные данные',
      updatedAt: live?.updatedAt ?? null,
    };
  });
}
