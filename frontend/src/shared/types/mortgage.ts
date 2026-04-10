export type ProgramKey =
  | 'family'
  | 'it'
  | 'льготная'
  | 'fareast'
  | 'rural'
  | 'market';

export interface MortgageProgram {
  key: ProgramKey;
  label: string;
  description: string;
  maxRate: number; // максимальная ставка по программе (%)
  minRate: number; // минимальная ставка (%)
  liveRate: number | null; // актуальная с парсера (null пока грузится)
  maxLoanAmount: number | null; // руб.
  minDownPaymentPct: number; // % первоначального взноса
  maxTermYears: number;
  banks: string[];
  source: string; // откуда взяли ставку
  updatedAt: string | null;
}

export interface ParsedRates {
  keyRate: number; // ключевая ставка ЦБ
  keyRateDate: string;
  programs: Record<
    ProgramKey,
    { rate: number; source: string; updatedAt: string }
  >;
}

export interface MortgageInputs {
  programKey: ProgramKey;
  propertyPrice: number; // стоимость недвижимости, руб.
  downPayment: number; // первоначальный взнос, руб.
  termYears: number; // срок, лет
  rate: number; // ставка % (может быть переопределена пользователем)
}

export interface MortgageResult {
  loanAmount: number;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  downPaymentPct: number;
  effectiveRate: number;
  overpaymentPct: number;
  schedule: PaymentRow[]; // первые 12 строк для PDF
}

export interface PaymentRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export const STATIC_PROGRAMS: Record<
  ProgramKey,
  Omit<MortgageProgram, 'liveRate' | 'source' | 'updatedAt'>
> = {
  family: {
    key: 'family',
    label: 'Семейная ипотека',
    description: 'Для семей с детьми. Ребёнок рождён после 01.01.2018',
    maxRate: 6,
    minRate: 4,
    maxLoanAmount: 12_000_000,
    minDownPaymentPct: 20,
    maxTermYears: 30,
    banks: ['Сбербанк', 'ВТБ', 'Т-Банк', 'Альфа-Банк', 'ДОМ.РФ'],
  },
  it: {
    key: 'it',
    label: 'IT-ипотека',
    description: 'Сотрудники аккредитованных IT-компаний',
    maxRate: 6,
    minRate: 3,
    maxLoanAmount: 18_000_000,
    minDownPaymentPct: 20,
    maxTermYears: 30,
    banks: ['Сбербанк', 'ВТБ', 'ДОМ.РФ', 'Альфа-Банк'],
  },
  льготная: {
    key: 'льготная',
    label: 'Льготная ипотека',
    description: 'Новостройки, господдержка для всех категорий',
    maxRate: 8,
    minRate: 6,
    maxLoanAmount: 6_000_000,
    minDownPaymentPct: 20,
    maxTermYears: 30,
    banks: ['Сбербанк', 'ВТБ', 'Россельхозбанк', 'Открытие'],
  },
  fareast: {
    key: 'fareast',
    label: 'Дальневосточная / Арктическая',
    description: 'Жильё на Дальнем Востоке и в Арктике. Возраст до 35 лет',
    maxRate: 2,
    minRate: 0.1,
    maxLoanAmount: 9_000_000,
    minDownPaymentPct: 15,
    maxTermYears: 20,
    banks: ['Банк ДОМ.РФ', 'Примсоцбанк', 'ВБРР', 'Сбербанк'],
  },
  rural: {
    key: 'rural',
    label: 'Сельская ипотека',
    description: 'Приобретение жилья в сельской местности',
    maxRate: 3,
    minRate: 0.1,
    maxLoanAmount: 6_000_000,
    minDownPaymentPct: 10,
    maxTermYears: 25,
    banks: ['Россельхозбанк', 'Центр-инвест', 'Сбербанк'],
  },
  market: {
    key: 'market',
    label: 'Рыночная ипотека',
    description:
      'Стандартная ипотека по рыночной ставке (ключевая ставка ЦБ + маржа банка)',
    maxRate: 30,
    minRate: 12,
    maxLoanAmount: null,
    minDownPaymentPct: 10,
    maxTermYears: 30,
    banks: ['Любой банк'],
  },
};
