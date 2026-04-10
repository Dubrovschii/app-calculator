import { NextResponse } from 'next/server';

import {
  fetchAllRates,
  buildPrograms,
} from '../../../shared/lib/parsers/programs';

// Кеш на уровне Next.js — пересобирается раз в 24 часа
export const revalidate = 86400;

export async function GET() {
  try {
    const parsed = await fetchAllRates();
    const programs = buildPrograms(parsed);

    return NextResponse.json(
      {
        ok: true,
        keyRate: parsed.keyRate,
        keyRateDate: parsed.keyRateDate,
        programs,
        fetchedAt: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control':
            'public, s-maxage=86400, stale-while-revalidate=3600',
        },
      },
    );
  } catch (error) {
    console.error('[mortgage-rates] fetch failed:', error);

    // Возвращаем статичные данные при ошибке
    const { buildPrograms: build, fetchAllRates: _ } =
      await import('../../../shared/lib/parsers/programs');
    const fallbackParsed = {
      keyRate: 21,
      keyRateDate: new Date().toLocaleDateString('ru-RU'),
      programs: {
        family: {
          rate: 5.7,
          source: 'статичные данные',
          updatedAt: new Date().toLocaleDateString('ru-RU'),
        },
        it: {
          rate: 4.5,
          source: 'статичные данные',
          updatedAt: new Date().toLocaleDateString('ru-RU'),
        },
        льготная: {
          rate: 7.5,
          source: 'статичные данные',
          updatedAt: new Date().toLocaleDateString('ru-RU'),
        },
        fareast: {
          rate: 1.9,
          source: 'статичные данные',
          updatedAt: new Date().toLocaleDateString('ru-RU'),
        },
        rural: {
          rate: 2.8,
          source: 'статичные данные',
          updatedAt: new Date().toLocaleDateString('ru-RU'),
        },
        market: {
          rate: 28.5,
          source: 'статичные данные',
          updatedAt: new Date().toLocaleDateString('ru-RU'),
        },
      } as any,
    };

    return NextResponse.json(
      {
        ok: true,
        fallback: true,
        ...fallbackParsed,
        programs: build(fallbackParsed),
        fetchedAt: new Date().toISOString(),
      },
      { status: 200 },
    );
  }
}
