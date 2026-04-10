export interface CalculatorInputs {
  carCost: number;
  dailyRentalPrice: number;
  rentalDaysPerMonth: number;
  companyCommissionPercent: number;
  monthlyExpenses: number;
}

export interface CalculatorResult {
  monthlyRevenue: number;
  companyCommission: number;
  revenueAfterCommission: number;
  netMonthlyPayout: number;
  paybackMonths: number;
  paybackYears: number;
  annualPayout: number;
  roi: number;
  commissionPercent: number;
}

export const DEFAULT_INPUTS: CalculatorInputs = {
  carCost: 320000,
  dailyRentalPrice: 1200,
  rentalDaysPerMonth: 18,
  companyCommissionPercent: 40,
  monthlyExpenses: 5500,
};
