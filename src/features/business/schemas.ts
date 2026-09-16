import { z } from "zod";

export const businessProfileSchema = z.object({
	businessName: z.string().min(2, "Ime mora imati najmanje 2 znaka"),
	ownerFirstName: z.string().min(2, "Ime vlasnika mora imati najmanje 2 znaka"),
	ownerLastName: z
		.string()
		.min(2, "Prezime vlasnika mora imati najmanje 2 znaka"),
	houseNumber: z.string().min(1, "Kućni broj mora imati najmanje 1 znak"),
	address: z.string().min(2, "Adresa mora imati najmanje 2 znaka"),
	city: z.string().min(2, "Grad mora imati najmanje 2 znaka"),
	oib: z.string().length(11, "OIB mora imati točno 11 znakova"),
	postalCode: z.string().min(2, "Poštanski broj mora imati najmanje 2 znaka"),
	businessCode: z
		.string()
		.min(2, "Šifra djelatnosti mora imati najmanje 2 znaka"),
	vatNumber: z.string().optional(),
	iban: z.string().optional(),
});
