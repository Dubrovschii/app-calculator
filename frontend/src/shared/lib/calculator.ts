import type { CalculatorInputs, CalculatorResult } from '../types/calculator';

export function calculateROI(inputs: CalculatorInputs): CalculatorResult {
  const {
    carCost,
    dailyRentalPrice,
    rentalDaysPerMonth,
    companyCommissionPercent,
    monthlyExpenses,
  } = inputs;

  const monthlyRevenue = dailyRentalPrice * rentalDaysPerMonth;
  const companyCommission = (monthlyRevenue * companyCommissionPercent) / 100;
  const revenueAfterCommission = monthlyRevenue - companyCommission;
  const netMonthlyPayout = revenueAfterCommission - monthlyExpenses;
  const paybackMonths =
    netMonthlyPayout > 0 ? carCost / netMonthlyPayout : Infinity;
  const paybackYears = paybackMonths / 12;
  const annualPayout = netMonthlyPayout * 12;
  const roi = (annualPayout / carCost) * 100;

  return {
    monthlyRevenue,
    companyCommission,
    revenueAfterCommission,
    netMonthlyPayout,
    paybackMonths,
    paybackYears,
    annualPayout,
    roi,
    commissionPercent: companyCommissionPercent,
  };
}
