import { TaxClass } from "@/generated/prisma";

export const taxClassLabels: Record<TaxClass, string> = {
	CLASS_1: "0,00 - 11.300,00",
	CLASS_2: "11.300,01 - 15.300,00",
	CLASS_3: "15.300,01 - 19.900,00",
	CLASS_4: "19.900,01 - 30.600,00",
	CLASS_5: "30.600,01 - 40.000,00",
	CLASS_6: "40.000,01 - 50.000,00",
	CLASS_7: "50.000,01 - 60.000,00	",
};

export const taxClassContributions: Record<
	TaxClass,
	{
		mio1MonthlyAmount: number;
		mio2MonthlyAmount: number;
		healthInsuranceMonthly: number;
		incomeTaxQuarterly: number;
		annualRevenue: number;
	}
> = {
	CLASS_1: {
		mio1MonthlyAmount: 119.58,
		mio2MonthlyAmount: 39.86,
		healthInsuranceMonthly: 131.54,
		incomeTaxQuarterly: 50.85,
		annualRevenue: 11300,
	},
	CLASS_2: {
		mio1MonthlyAmount: 119.58,
		mio2MonthlyAmount: 39.86,
		healthInsuranceMonthly: 131.54,
		incomeTaxQuarterly: 68.58,
		annualRevenue: 15300,
	},
	CLASS_3: {
		mio1MonthlyAmount: 119.58,
		mio2MonthlyAmount: 39.86,
		healthInsuranceMonthly: 131.54,
		incomeTaxQuarterly: 89.55,
		annualRevenue: 19900,
	},
	CLASS_4: {
		mio1MonthlyAmount: 119.58,
		mio2MonthlyAmount: 39.86,
		healthInsuranceMonthly: 131.54,
		incomeTaxQuarterly: 137.7,
		annualRevenue: 30600,
	},
	CLASS_5: {
		mio1MonthlyAmount: 119.58,
		mio2MonthlyAmount: 39.86,
		healthInsuranceMonthly: 131.54,
		incomeTaxQuarterly: 180,
		annualRevenue: 40000,
	},
	CLASS_6: {
		mio1MonthlyAmount: 134.53,
		mio2MonthlyAmount: 44.84,
		healthInsuranceMonthly: 147.98,
		incomeTaxQuarterly: 225,
		annualRevenue: 50000,
	},
	CLASS_7: {
		mio1MonthlyAmount: 149.48,
		mio2MonthlyAmount: 49.83,
		healthInsuranceMonthly: 164.42,
		incomeTaxQuarterly: 270,
		annualRevenue: 60000,
	},
};
