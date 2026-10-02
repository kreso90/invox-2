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
	name: z.string().min(1, "Naziv je obavezan"),
	periodLabel: z.string().min(1, "Period je obavezan"),
	dueDate: z.coerce.date({
		message: "Rok je obavezan",
	}),
	amount: z.coerce.number().min(0, "Iznos mora biti pozitivan broj"),
	paymentModel: z.string().optional(),
	paymentReference: z.string().optional(),
	paymentDescription: z.string().optional(),
	status: z.string().min(1, "Status je obavezan"),
});
