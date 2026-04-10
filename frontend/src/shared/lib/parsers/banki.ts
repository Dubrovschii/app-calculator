/**
 * Парсер banki.ru
 *
 * banki.ru — крупнейший российский агрегатор банковских продуктов.
 * Страница ипотеки: https://www.banki.ru/products/hypothec/
 *
 * ВАЖНО: banki.ru не имеет публичного API. Парсинг выполняется
 * через fetch HTML и извлечение структурированных данных.
 * Сайт периодически меняет разметку — предусмотрен fallback.
 *
 * Стратегия:
 * 1. Пробуем получить данные из meta-тегов / JSON-LD (structured data)
 * 2. Парсим HTML таблицу предложений
 * 3. При неудаче — возвращаем статичные актуальные данные
 */

import type { ProgramKey } from '@/types/mortgage';

export interface BankiRateEntry {
  programKey: ProgramKey;
  rate: number;
  bankName: string;
  source: 'banki.ru' | 'static';
  updatedAt: string;
}

// Статичные данные — актуальны на апрель 2025
// Обновляются вручную раз в квартал как fallback
const STATIC_RATES: Record<ProgramKey, { rate: number; bankName: string }> = {
  family:   { rate: 5.7,  bankName: 'Сбербанк' },
  it:       { rate: 4.5,  bankName: 'ВТБ' },
  льготная: { rate: 7.5,  bankName: 'Сбербанк' },
  fareast:  { rate: 1.9,  bankName: 'Банк ДОМ.РФ' },
  rural:    { rate: 2.8,  bankName: 'Россельхозбанк' },
  market:   { rate: 28.5, bankName: 'среднее по рынку' },
};

/**
 * Пытается получить актуальные ставки с banki.ru
 * Возвращает данные или fallback при любой ошибке
 */
export async function fetchBankiRates(
  programKeys: ProgramKey[]
): Promise<BankiRateEntry[]> {
  const now = new Date().toLocaleDateString('ru-RU');

  try {
    // Пробуем получить данные с banki.ru через их страницу
    const results = await Promise.allSettled(
      programKeys.map((key) => fetchRateForProgram(key, now))
    );

    return results.map((result, idx) => {
      const key = programKeys[idx];
      if (result.status === 'fulfilled') {
        return result.value;
      }
      // Fallback для конкретной программы
      return makeStaticEntry(key, now);
    });
  } catch {
    // Полный fallback
    return programKeys.map((key) => makeStaticEntry(key, now));
  }
}

async function fetchRateForProgram(
  programKey: ProgramKey,
  now: string
): Promise<BankiRateEntry> {
  // URL-маппинг программ на страницы banki.ru
  const urlMap: Partial<Record<ProgramKey, string>> = {
    family:   'https://www.banki.ru/products/hypothec/?programType=family',
    it:       'https://www.banki.ru/products/hypothec/?programType=it',
    льготная: 'https://www.banki.ru/products/hypothec/?programType=state',
    fareast:  'https://www.banki.ru/products/hypothec/?programType=fareast',
    rural:    'https://www.banki.ru/products/hypothec/?programType=rural',
    market:   'https://www.banki.ru/products/hypothec/',
  };

  const url = urlMap[programKey];
  if (!url) return makeStaticEntry(programKey, now);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ru-RU,ru;q=0.9,en;q=0.8',
        Referer: 'https://www.banki.ru/',
      },
      next: { revalidate: 86400 },
    });

    if (!res.ok) throw new Error(`banki.ru responded ${res.status}`);

    const html = await res.text();

    // Стратегия 1: ищем JSON-LD structured data
    const jsonLdMatch = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi);
    if (jsonLdMatch) {
      for (const block of jsonLdMatch) {
        try {
          const json = JSON.parse(block.replace(/<script[^>]*>/, '').replace(/<\/script>/, ''));
          if (json.offers?.price || json.loanRate) {
            const rate = parseFloat(json.offers?.price || json.loanRate);
            if (isValidRate(rate, programKey)) {
              return { programKey, rate, bankName: json.name || 'banki.ru', source: 'banki.ru', updatedAt: now };
            }
          }
        } catch { /* продолжаем */ }
      }
    }

    // Стратегия 2: ищем числа вида "X.XX%" или "X,XX%" рядом со словами "ставка"
    const ratePatterns = [
      /ставка[^%\d]*?([\d]+[.,][\d]{1,2})\s*%/gi,
      /от\s+([\d]+[.,][\d]{1,2})\s*%/gi,
      /rate['":\s]+([\d]+[.,][\d]{1,2})/gi,
    ];

    for (const pattern of ratePatterns) {
      const matches = [...html.matchAll(pattern)];
      if (matches.length > 0) {
        const rates = matches
          .map((m) => parseFloat(m[1].replace(',', '.')))
          .filter((r) => isValidRate(r, programKey));

        if (rates.length > 0) {
          // Берём минимальную найденную ставку
          const minRate = Math.min(...rates);
          return { programKey, rate: minRate, bankName: 'banki.ru', source: 'banki.ru', updatedAt: now };
        }
      }
    }

    // Ничего не нашли — fallback
    throw new Error('No rate found in HTML');
  } finally {
    clearTimeout(timeout);
  }
}

function isValidRate(rate: number, programKey: ProgramKey): boolean {
  if (isNaN(rate) || rate <= 0) return false;
  const bounds: Record<ProgramKey, [number, number]> = {
    family:   [3, 8],
    it:       [2, 7],
    льготная: [5, 10],
    fareast:  [0.1, 3],
    rural:    [0.1, 4],
    market:   [12, 35],
  };
  const [min, max] = bounds[programKey];
  return rate >= min && rate <= max;
}

function makeStaticEntry(programKey: ProgramKey, now: string): BankiRateEntry {
  const s = STATIC_RATES[programKey];
  return { programKey, rate: s.rate, bankName: s.bankName, source: 'static', updatedAt: now };
}
