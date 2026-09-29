import { z } from "zod";

export const obligationSchema = z.object({
	kind: z.enum([
		"MIO1",
		"MIO2",
		"HEALTH_INSURANCE",
		"INCOME_TAX",
		"PO_SD_FORM",
		"KPI_LEDGER",
		"PDV_FORM",
		"ZP_FORM",
		"OTHER",
	]),
	name: z.string().min(1, "Name is required"),
	periodLabel: z.string().min(1, "Period label is required"),

	dueDate: z.coerce.date({
		message: "Due date is required",
	}),

	amount: z.coerce.number().min(0, "Amount must be a positive number"),

	paymentModel: z.string().optional(),

	paymentReference: z.string().optional(),

	paymentDescription: z.string().optional(),

	status: z.string().min(1, "Status is required"),
});
