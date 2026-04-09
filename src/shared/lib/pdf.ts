import type {
  CalculatorInputs,
  CalculatorResult,
} from '@/shared/types/calculator';
import {
  formatCurrency,
  formatPercent,
  formatMonths,
  formatYears,
} from './utils';

export async function generatePDF(
  inputs: CalculatorInputs,
  result: CalculatorResult,
): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const autoTable = (await import('jspdf-autotable')).default;

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageW = doc.internal.pageSize.getWidth();
  const margin = 20;

  // ── Header ──────────────────────────────────────────────
  doc.setFillColor(20, 19, 16);
  doc.rect(0, 0, pageW, 42, 'F');

  doc.setTextColor(245, 158, 11);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('АВТОМОБИЛЬНЫЙ КАЛЬКУЛЯТОР', pageW / 2, 18, { align: 'center' });

  doc.setTextColor(180, 174, 160);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Анализ доходности инвестиций', pageW / 2, 28, { align: 'center' });

  const now = new Date();
  doc.text(
    `Отчёт сформирован: ${now.toLocaleDateString('ru-RU')} ${now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`,
    pageW / 2,
    36,
    { align: 'center' },
  );

  // ── Section: Input parameters ────────────────────────────
  let y = 52;

  doc.setTextColor(20, 19, 16);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Параметры автомобиля', margin, y);
  y += 6;

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [['Параметр', 'Значение']],
    body: [
      ['Стоимость автомобиля', formatCurrency(inputs.carCost)],
      ['Средняя цена аренды в день', formatCurrency(inputs.dailyRentalPrice)],
      [
        'Среднее кол-во дней аренды в месяц',
        `${inputs.rentalDaysPerMonth} дней`,
      ],
      ['Комиссия компании', `${inputs.companyCommissionPercent}%`],
      ['Ежемесячные расходы', formatCurrency(inputs.monthlyExpenses)],
    ],
    headStyles: {
      fillColor: [20, 19, 16],
      textColor: [245, 158, 11],
      fontStyle: 'bold',
      fontSize: 10,
    },
    bodyStyles: { fontSize: 10, textColor: [37, 35, 32] },
    alternateRowStyles: { fillColor: [248, 247, 244] },
    columnStyles: { 1: { halign: 'right', fontStyle: 'bold' } },
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  // ── Section: Monthly calculation ─────────────────────────
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 19, 16);
  doc.text('Ежемесячный расчёт', margin, y);
  y += 6;

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [['Показатель', 'Сумма', 'Формула']],
    body: [
      [
        'Месячный оборот',
        formatCurrency(result.monthlyRevenue),
        `${formatCurrency(inputs.dailyRentalPrice)} × ${inputs.rentalDaysPerMonth} дн.`,
      ],
      [
        `Комиссия компании (${result.commissionPercent}%)`,
        `−${formatCurrency(result.companyCommission)}`,
        `${result.commissionPercent}% от оборота`,
      ],
      [
        'Доход после комиссии',
        formatCurrency(result.revenueAfterCommission),
        '',
      ],
      [
        'Операционные расходы',
        `−${formatCurrency(inputs.monthlyExpenses)}`,
        'ежемесячные затраты',
      ],
      ['Чистая выплата инвестору', formatCurrency(result.netMonthlyPayout), ''],
    ],
    headStyles: {
      fillColor: [20, 19, 16],
      textColor: [245, 158, 11],
      fontStyle: 'bold',
      fontSize: 10,
    },
    bodyStyles: { fontSize: 10, textColor: [37, 35, 32] },
    alternateRowStyles: { fillColor: [248, 247, 244] },
    columnStyles: {
      1: { halign: 'right', fontStyle: 'bold' },
      2: { halign: 'right', textColor: [107, 101, 88], fontSize: 9 },
    },
    didParseCell: (data: any) => {
      if (data.row.index === 4 && data.section === 'body') {
        data.cell.styles.fillColor = [20, 19, 16];
        data.cell.styles.textColor = [245, 158, 11];
        data.cell.styles.fontStyle = 'bold';
      }
    },
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  // ── Section: Summary KPIs ─────────────────────────────────
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 19, 16);
  doc.text('Ключевые показатели', margin, y);
  y += 6;

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    body: [
      ['Чистая выплата в месяц', formatCurrency(result.netMonthlyPayout)],
      ['Годовой доход', formatCurrency(result.annualPayout)],
      [
        'Срок окупаемости',
        `${formatMonths(result.paybackMonths)} (${formatYears(result.paybackYears)})`,
      ],
      ['Годовая доходность (ROI)', formatPercent(result.roi)],
    ],
    bodyStyles: { fontSize: 11, textColor: [37, 35, 32] },
    alternateRowStyles: { fillColor: [248, 247, 244] },
    columnStyles: {
      0: { fontStyle: 'bold' },
      1: { halign: 'right', fontStyle: 'bold', textColor: [180, 83, 9] },
    },
  });

  // ── Footer ────────────────────────────────────────────────
  const pageH = doc.internal.pageSize.getHeight();
  doc.setFillColor(20, 19, 16);
  doc.rect(0, pageH - 12, pageW, 12, 'F');
  doc.setTextColor(107, 101, 88);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(
    'Car ROI Calculator • Данный отчёт носит информационный характер',
    pageW / 2,
    pageH - 4.5,
    { align: 'center' },
  );

  doc.save(`car-roi-report-${Date.now()}.pdf`);
}
