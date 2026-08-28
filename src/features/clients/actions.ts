"use server";

import { auth } from "@/lib/auth";
import { clientSchema } from "./schemas";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createClient(prevState: unknown, formData: FormData) {
	const data = Object.fromEntries(formData);

	const result = clientSchema.safeParse(data);

	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user?.id) {
		return { status: "error", message: "Korisnik nije logiran" };
	}

	if (!result.success) {
		return {
			status: "error",
			messages: result.error.issues.map((issue) => issue.message),
		};
	}

	const get = (key: string) => (data[key] as string) || undefined;

	const clientId = get("clientId");

	const clientValues = {
		companyName: get("companyName")!,
		oib: get("oib") || null,
		vatNumber: get("vatNumber") || null,
		address: get("address")!,
		city: get("city")!,
		postalCode: get("postalCode")!,
		contactFirstName: get("contactFirstName") || null,
		contactLastName: get("contactLastName") || null,
		email: get("email")!,
		phone: get("phone") || null,
		iban: get("iban") || null,
		note: get("note") || null,
	};

	try {
		const client = clientId
			? await prisma.client.update({
					where: {
						id: clientId,
						userId: session.user.id,
					},
					data: clientValues,
				})
			: await prisma.client.create({
					data: {
						...clientValues,
						userId: session.user.id,
					},
				});

		if (client) {
			return {
				status: "success",
				message: "Podaci o klijentu su uspješno spremljeni!",
			};
		}
	} catch (err: any) {
		return {
			status: "error",
			messages: ["Došlo je do pogreške. Molimo pokušajte ponovno."],
		};
	}
}

export async function deleteClient(prevState: any, formData: FormData) {
	const clientId = formData.get("clientId") as string;

	if (!clientId) {
		return {
			status: "error",
			message: "Klijent nije pronađen",
		};
	}

	await prisma.client.delete({
		where: { id: clientId },
	});

	revalidatePath("/clients");
	redirect("/clients");
}
