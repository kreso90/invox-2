import { z } from "zod";

export const invoiceSchema = z.object({
	invoiceId: z.string().optional(),
	invoiceNumber: z.string().min(1, "Broj računa je obavezan"),
	issueDate: z.coerce.date(),
	dueDate: z.coerce.date(),
	clientId: z.string().min(1, "Klijent je obavezan"),
	paymentMethod: z.enum(["CASH", "BANK_TRANSFER"]),
	status: z.enum(["DRAFT", "ISSUED"]),
	issuePlace: z.string().min(1, "Mjesto izdavanja je obavezno"),
	note: z.string().optional(),
	items: z
		.string()
		.transform((value, context) => {
			try {
				return JSON.parse(value);
			} catch {
				context.addIssue({
					code: "custom",
					message: "Stavke računa nisu valjane",
				});
				return z.NEVER;
			}
		})
		.pipe(
			z
				.array(
					z.object({
						itemId: z.string().min(1).optional().or(z.literal("")),
						name: z.string().min(1, "Naziv stavke je obavezan"),
						quantity: z.coerce
							.number()
							.positive("Količina mora biti veća od nule"),
						unitPrice: z.coerce
							.number()
							.min(0, "Cijena ne može biti negativna"),
					}),
				)
				.min(1, "Račun mora imati barem jednu stavku"),
		),
});
