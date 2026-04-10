import type { MortgageInputs, MortgageResult, PaymentRow } from '@/types/mortgage';

/**
 * Аннуитетный расчёт ипотеки
 */
export function calculateMortgage(inputs: MortgageInputs): MortgageResult {
  const { propertyPrice, downPayment, termYears, rate } = inputs;

  const loanAmount = propertyPrice - downPayment;
  const termMonths = termYears * 12;
  const monthlyRate = rate / 100 / 12;

  if (loanAmount <= 0 || termMonths <= 0 || rate <= 0) {
    return {
      loanAmount: Math.max(0, loanAmount),
      monthlyPayment: 0,
      totalPayment: 0,
      totalInterest: 0,
      downPaymentPct: (downPayment / propertyPrice) * 100,
      effectiveRate: rate,
      overpaymentPct: 0,
      schedule: [],
    };
  }

  // Аннуитетный платёж: M = P * (r * (1+r)^n) / ((1+r)^n - 1)
  const factor = Math.pow(1 + monthlyRate, termMonths);
  const monthlyPayment = loanAmount * (monthlyRate * factor) / (factor - 1);

  const totalPayment = monthlyPayment * termMonths;
  const totalInterest = totalPayment - loanAmount;
  const overpaymentPct = (totalInterest / loanAmount) * 100;

  // График платежей (первые 12 месяцев для PDF + полный для хранения)
  const schedule: PaymentRow[] = [];
  let balance = loanAmount;

  for (let month = 1; month <= Math.min(termMonths, 360); month++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    balance = Math.max(0, balance - principalPayment);

    schedule.push({
      month,
      payment: Math.round(monthlyPayment),
      principal: Math.round(principalPayment),
      interest: Math.round(interestPayment),
      balance: Math.round(balance),
    });

    if (balance <= 0) break;
  }

  return {
    loanAmount: Math.round(loanAmount),
    monthlyPayment: Math.round(monthlyPayment),
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
    downPaymentPct: (downPayment / propertyPrice) * 100,
    effectiveRate: rate,
    overpaymentPct,
    schedule,
  };
}

export function formatRub(value: number): string {
  if (!isFinite(value)) return '—';
  return value.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 });
}

export function formatPct(value: number, digits = 1): string {
  if (!isFinite(value)) return '—';
  return `${value.toFixed(digits)}%`;
}
