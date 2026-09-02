import { z } from "zod";

export const obligationSchema = z.object({
	kind: z.string().min(1, "Kind is required"),
	name: z.string().min(1, "Name is required"),
	periodLabel: z.string().min(1, "Period label is required"),
	dueDate: z.preprocess(
		(value) => (value === "" ? undefined : value),
		z.coerce.date().optional(),
	),
	amount: z.coerce.number().min(0, "Amount must be a positive number"),
	paymentModel: z.string().min(1, "Payment model is required"),
	paymentReference: z.string().optional(),
	paymentDescription: z.string().optional(),
	status: z.string().min(1, "Status is required"),
});
