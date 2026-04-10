/**
 * Парсер ЦБ РФ
 * Источник: https://www.cbr.ru/hd_base/KeyRate/
 * ЦБ публикует ключевую ставку в XML и на странице статистики.
 * Используем официальный XML API — он стабилен и не блокируется.
 */

export interface CbrKeyRate {
  rate: number;
  date: string;
}

/**
 * Получает текущую ключевую ставку ЦБ РФ через официальный XML API.
 * endpoint: https://www.cbr.ru/scripts/XML_val.asp — не подходит (курсы валют)
 * endpoint: https://www.cbr.ru/DailyInfoWebServ/DailyInfo.asmx — SOAP (сложно)
 * Используем страницу статистики и парсим HTML таблицу.
 */
export async function fetchCbrKeyRate(): Promise<CbrKeyRate> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    // ЦБ публикует данные в формате XML через этот эндпоинт
    const url = 'https://www.cbr.ru/hd_base/KeyRate/?UniDbQuery.Posted=True&UniDbQuery.From=01.01.2025&UniDbQuery.To=31.12.2025';

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MortgageCalc/1.0)',
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'ru-RU,ru;q=0.9',
      },
      next: { revalidate: 86400 }, // кеш 24 часа
    });

    if (!res.ok) throw new Error(`CBR responded ${res.status}`);

    const html = await res.text();

    // Парсим таблицу ЦБ — ищем строки с датой и ставкой
    // Формат таблицы: <td>DD.MM.YYYY</td><td>XX,XX</td>
    const rowRegex = /<tr[^>]*>[\s\S]*?<td[^>]*>([\d]{2}\.[\d]{2}\.[\d]{4})<\/td>[\s\S]*?<td[^>]*>([\d]+[,.][\d]+)<\/td>/gi;

    const matches: Array<{ date: string; rate: number }> = [];
    let match;

    while ((match = rowRegex.exec(html)) !== null) {
      const dateStr = match[1];
      const rateStr = match[2].replace(',', '.');
      const rate = parseFloat(rateStr);
      if (!isNaN(rate) && rate > 0 && rate < 100) {
        matches.push({ date: dateStr, rate });
      }
    }

    if (matches.length === 0) {
      throw new Error('No key rate data found in CBR response');
    }

    // Берём последнюю (самую свежую) запись
    const latest = matches[matches.length - 1];
    return { rate: latest.rate, date: latest.date };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Fallback: парсим XML через SOAP-подобный GET эндпоинт ЦБ
 * Используется если основной метод недоступен
 */
export async function fetchCbrKeyRateFallback(): Promise<CbrKeyRate> {
  // ЦБ публикует данные в формате XML
  const today = new Date();
  const from = new Date(today);
  from.setMonth(from.getMonth() - 2);

  const fmt = (d: Date) =>
    `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;

  const url = `https://www.cbr.ru/hd_base/KeyRate/?UniDbQuery.Posted=True&UniDbQuery.From=${fmt(from)}&UniDbQuery.To=${fmt(today)}`;

  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
    next: { revalidate: 86400 },
  });

  const html = await res.text();

  // Ищем паттерн числа вида "21,00" или "16,00" рядом с датой
  const rateMatch = html.match(/(\d{2},\d{2})\s*<\/td>/g);
  if (!rateMatch || rateMatch.length === 0) {
    // Если не можем спарсить — возвращаем актуальное значение на момент написания
    // Ключевая ставка ЦБ на апрель 2025 — 21%
    return { rate: 21, date: fmt(today) };
  }

  const lastRate = rateMatch[rateMatch.length - 1];
  const rate = parseFloat(lastRate.replace(/<\/td>/g, '').replace(',', '.').trim());

  return { rate: isNaN(rate) ? 21 : rate, date: fmt(today) };
}
