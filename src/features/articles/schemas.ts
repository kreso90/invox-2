import { z } from "zod";

export const articleSchema = z.object({
	name: z.string().min(1, "Name is required"),
	unit: z.string().min(1, "Unit is required"),
	price: z.coerce.number().min(0, "Price must be a positive number"),
	description: z.string().optional(),
	lastUsedAt: z.preprocess(
		(value) => (value === "" ? undefined : value),
		z.coerce.date().optional(),
	),
});
