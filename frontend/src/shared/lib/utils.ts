import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency = '$'): string {
  if (!isFinite(value)) return '—';
  return `${currency}${value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export function formatPercent(value: number): string {
  if (!isFinite(value)) return '—';
  return `${value.toFixed(1)}%`;
}

export function formatMonths(months: number): string {
  if (!isFinite(months)) return '∞';
  return `${months.toFixed(1)} мес.`;
}

export function formatYears(years: number): string {
  if (!isFinite(years)) return '∞';
  return `${years.toFixed(1)} лет`;
}
