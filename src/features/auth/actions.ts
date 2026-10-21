"use server";

import { auth } from "@/lib/auth";
import { registerSchema } from "./schemas";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function createUser(prevState: unknown, formData: FormData) {
	const data = {
		...Object.fromEntries(formData),
		terms: formData.get("terms") === "on",
	};

	const result = registerSchema.safeParse(data);

	if (!result.success) {
		return {
			status: "error",
			messages: result.error.issues.map((issue) => issue.message),
		};
	}

	const { firstname, surname, email, password } = result.data;

	try {
		const user = await auth.api.signUpEmail({
			body: {
				name: `${firstname} ${surname}`,
				email,
				password,
			},
		});

		if (user) {
			return {
				status: "success",
				message:
					"Korisnički račun je uspješno kreiran! Provjerite svoju e-poštu kako biste potvrdili svoj račun.",
			};
		}
	} catch (err) {
		return {
			status: "error",
			messages: [
				err instanceof Error ? err.message : "Registracija nije uspjela",
			],
		};
	}

	return {
		status: "error",
		messages: ["Pogreška pri kreiranju korisničkog računa"],
	};
}

export async function login(prevState: any, formData: FormData) {
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;

	try {
		await auth.api.signInEmail({
			body: {
				email: email,
				password: password,
			},
		});
	} catch (err: any) {
		return {
			status: "error",
			message:
				err instanceof Error
					? err.message == "Email not verified"
						? "Email nije potvrđen"
						: err.message == "Invalid email or password"
							? "Neispravna e-pošta ili lozinka"
							: err.message
					: "Prijava nije uspjela",
		};
	}

	redirect("/dashboard");
}

export async function signOut() {
	await auth.api.signOut({
		headers: await headers(),
	});
	redirect("/login");
}

export async function resetPasswordRequest(prevState: any, formData: FormData) {
	const email = formData.get("email") as string;

	try {
		await auth.api.requestPasswordReset({
			body: {
				email: email,
				redirectTo: "https://example.com/reset-password",
			},
		});

		return {
			status: "success",
			message: "Provjeri svoju e-poštu za link za resetiranje lozinke",
		};
	} catch (err: any) {
		return {
			status: "error",
			message:
				err?.message ?? "Došlo je do neočekivane pogreške. Pokušajte ponovno.",
		};
	}
}

export async function resetPassword(prevState: any, formData: FormData) {
	const token = formData.get("token") as string;
	const password = formData.get("password") as string;

	if (!token) {
		return {
			status: "error",
			message: "Neispravan ili istekao link za resetiranje lozinke.",
		};
	}

	if (!password) {
		return {
			status: "error",
			message: "Unesite novu lozinku.",
		};
	}

	try {
		await auth.api.resetPassword({
			body: {
				newPassword: password,
				token,
			},
		});

		return {
			status: "success",
			message: "Vaša lozinka je uspješno resetirana. Sada se možete prijaviti.",
		};
	} catch (err: any) {
		return {
			status: "error",
			message:
				err?.message ?? "Došlo je do neočekivane pogreške. Pokušajte ponovno.",
		};
	}
}
