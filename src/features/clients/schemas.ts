import { z } from "zod";

export const clientSchema = z.object({
	companyName: z.string().min(1, "Company name is required"),
	oib: z.string().optional(),
	vatNumber: z.string().optional(),
	address: z.string().min(1, "Address is required"),
	city: z.string().min(1, "City is required"),
	postalCode: z.string().min(1, "Postal code is required"),
	contactFirstName: z.string().optional(),
	contactLastName: z.string().optional(),
	email: z.string().email("Invalid email address"),
	phone: z.string().optional(),
	iban: z.string().optional(),
	note: z.string().optional(),
});
