import { z } from "zod";

export const clientSchema = z.object({
	companyName: z.string().min(1, "Ime tvrtke je obavezno"),
	oib: z.string().optional(),
	vatNumber: z.string().optional(),
	vatCountryCode: z.string().min(1, "Država PDV-a je obavezna"),
	address: z.string().min(1, "Adresa je obavezna"),
	city: z.string().min(1, "Grad je obavezan"),
	postalCode: z.string().min(1, "Poštanski broj je obavezan"),
	contactFirstName: z.string().min(1, "Ime kontakt osobe je obavezno"),
	contactLastName: z.string().min(1, "Prezime kontakt osobe je obavezno"),
	email: z.email("Neispravna email adresa"),
	phone: z.string().optional(),
	iban: z.string().optional(),
	note: z.string().optional(),
});
