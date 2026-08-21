import { z } from "zod";

export const registerSchema = z
	.object({
		firstname: z.string().min(2, "Ime mora imati najmanje 2 znaka"),
		surname: z.string().min(2, "Prezime mora imati najmanje 2 znaka"),
		email: z.email("Neispravna email adresa"),
		password: z.string().min(8, "Lozinka mora imati najmanje 8 znakova"),
		passwordConfirmation: z.string(),
		terms: z.boolean().refine((value) => value === true, {
			message: "Morate prihvatiti uvjete korištenja",
		}),
	})
	.refine((data) => data.password === data.passwordConfirmation, {
		message: "Lozinke se ne podudaraju",
		path: ["passwordConfirmation"],
	});
