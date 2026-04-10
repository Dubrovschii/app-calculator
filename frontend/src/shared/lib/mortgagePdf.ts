import type { MortgageInputs, MortgageResult, MortgageProgram } from '@/types/mortgage';
import { formatRub, formatPct } from './mortgageCalc';

export async function generateMortgagePDF(
  inputs: MortgageInputs,
  result: MortgageResult,
  program: MortgageProgram | null,
  keyRate: number | null
): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const autoTable = (await import('jspdf-autotable')).default;

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 18;

  // ── Header ──────────────────────────────────────────────
  doc.setFillColor(20, 19, 16);
  doc.rect(0, 0, pageW, 46, 'F');

  doc.setTextColor(245, 158, 11);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('ИПОТЕЧНЫЙ КАЛЬКУЛЯТОР', pageW / 2, 17, { align: 'center' });

  doc.setTextColor(180, 174, 160);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(
    program ? `Программа: ${program.label}` : 'Анализ ипотечного кредита',
    pageW / 2, 27, { align: 'center' }
  );

  const now = new Date();
  doc.text(
    `Отчёт: ${now.toLocaleDateString('ru-RU')} ${now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`,
    pageW / 2, 37, { align: 'center' }
  );

  // ── Input parameters ─────────────────────────────────────
  let y = 54;

  doc.setTextColor(20, 19, 16);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Параметры ипотеки', margin, y);
  y += 5;

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [['Параметр', 'Значение']],
    body: [
      ['Программа', program?.label ?? 'Пользовательская'],
      ['Стоимость недвижимости', formatRub(inputs.propertyPrice)],
      ['Первоначальный взнос', `${formatRub(inputs.downPayment)} (${result.downPaymentPct.toFixed(1)}%)`],
      ['Сумма кредита', formatRub(result.loanAmount)],
      ['Срок кредита', `${inputs.termYears} лет (${inputs.termYears * 12} мес.)`],
      ['Процентная ставка', formatPct(result.effectiveRate)],
      ...(keyRate !== null ? [['Ключевая ставка ЦБ РФ', formatPct(keyRate)]] : []),
      ...(program ? [['Источник ставки', program.source]] : []),
    ],
    headStyles: { fillColor: [20, 19, 16], textColor: [245, 158, 11], fontStyle: 'bold', fontSize: 10 },
    bodyStyles: { fontSize: 10, textColor: [37, 35, 32] },
    alternateRowStyles: { fillColor: [248, 247, 244] },
    columnStyles: { 1: { halign: 'right', fontStyle: 'bold' } },
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  // ── Key results ───────────────────────────────────────────
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 19, 16);
  doc.text('Результаты расчёта', margin, y);
  y += 5;

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    body: [
      ['Ежемесячный платёж', formatRub(result.monthlyPayment)],
      ['Итого выплат', formatRub(result.totalPayment)],
      ['Сумма процентов (переплата)', formatRub(result.totalInterest)],
      ['Переплата к сумме кредита', formatPct(result.overpaymentPct, 1)],
    ],
    bodyStyles: { fontSize: 11 },
    alternateRowStyles: { fillColor: [248, 247, 244] },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: [37, 35, 32] },
      1: { halign: 'right', fontStyle: 'bold', textColor: [180, 83, 9] },
    },
    didParseCell: (data: any) => {
      if (data.row.index === 0 && data.section === 'body') {
        data.cell.styles.fillColor = [20, 19, 16];
        data.cell.styles.textColor = [245, 158, 11];
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fontSize = 12;
      }
    },
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  // ── Payment schedule ──────────────────────────────────────
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 19, 16);
  doc.text('График платежей (первые 24 месяца)', margin, y);
  y += 5;

  const scheduleRows = result.schedule.slice(0, 24).map((row) => [
    row.month,
    row.payment.toLocaleString('ru-RU'),
    row.principal.toLocaleString('ru-RU'),
    row.interest.toLocaleString('ru-RU'),
    row.balance.toLocaleString('ru-RU'),
  ]);

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [['Мес.', 'Платёж ₽', 'Основной долг ₽', 'Проценты ₽', 'Остаток ₽']],
    body: scheduleRows,
    headStyles: { fillColor: [20, 19, 16], textColor: [245, 158, 11], fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 9, textColor: [37, 35, 32] },
    alternateRowStyles: { fillColor: [248, 247, 244] },
    columnStyles: {
      0: { halign: 'center', cellWidth: 12 },
      1: { halign: 'right' },
      2: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'right' },
    },
  });

  // ── Program info (if available) ───────────────────────────
  if (program) {
    doc.addPage();
    let py = 20;

    doc.setFillColor(20, 19, 16);
    doc.rect(0, 0, pageW, 14, 'F');
    doc.setTextColor(245, 158, 11);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`Программа: ${program.label}`, margin, 9);

    doc.setTextColor(20, 19, 16);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Условия программы', margin, py);
    py += 5;

    autoTable(doc, {
      startY: py,
      margin: { left: margin, right: margin },
      body: [
        ['Описание', program.description],
        ['Максимальная ставка', `${program.maxRate}%`],
        ['Минимальная ставка', `${program.minRate}%`],
        ['Мин. первоначальный взнос', `${program.minDownPaymentPct}%`],
        ['Максимальный срок', `${program.maxTermYears} лет`],
        ...(program.maxLoanAmount ? [['Максимальная сумма', formatRub(program.maxLoanAmount)]] : []),
        ['Банки-участники', program.banks.join(', ')],
      ],
      headStyles: { fillColor: [20, 19, 16], textColor: [245, 158, 11] },
      bodyStyles: { fontSize: 10 },
      alternateRowStyles: { fillColor: [248, 247, 244] },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 55, textColor: [80, 77, 67] },
        1: { textColor: [37, 35, 32] },
      },
    });
  }

  // ── Footer ────────────────────────────────────────────────
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    const pageH = doc.internal.pageSize.getHeight();
    doc.setFillColor(20, 19, 16);
    doc.rect(0, pageH - 12, pageW, 12, 'F');
    doc.setTextColor(107, 101, 88);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Ипотечный калькулятор • Данный отчёт носит информационный характер • стр. ${i} из ${totalPages}`,
      pageW / 2, pageH - 4.5, { align: 'center' }
    );
  }

  doc.save(`mortgage-report-${Date.now()}.pdf`);
}
