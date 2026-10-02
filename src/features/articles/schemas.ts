import { z } from "zod";

export const articleSchema = z.object({
	name: z.string().min(1, "Naziv je obavezan"),
	unit: z.string().min(1, "Jedinica je obavezna"),
	price: z.coerce.number().min(0, "Cijena mora biti pozitivan broj"),
	description: z.string().optional(),
	lastUsedAt: z.preprocess(
		(value) => (value === "" ? undefined : value),
		z.coerce.date().optional(),
	),
});
