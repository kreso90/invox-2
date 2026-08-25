"use server";

import { auth } from "@/lib/auth";
import { businessProfileSchema } from "./schemas";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export async function createBusiness(prevState: unknown, formData: FormData) {
	const data = Object.fromEntries(formData);

	const result = businessProfileSchema.safeParse(data);

	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user?.id) {
		return { status: "error", message: "User not logged in" };
	}

	if (!result.success) {
		return {
			status: "error",
			messages: result.error.issues.map((issue) => issue.message),
		};
	}

	const get = (key: string) => (data[key] as string) || undefined;

	const annualRevenue = Number(get("annualRevenue"));

	try {
		const business = await prisma.business.upsert({
			where: {
				userId: session.user.id,
			},
			update: {
				business_name: get("businessName")!,
				oib: get("oib")!,
				vatId: get("vatNumber") || null,
				street: get("address")!,
				city: get("city")!,
				postalCode: get("postalCode")!,
				activity_code: get("businessCode") || null,
				email: get("email")!,
				iban: get("iban") || null,
				annual_threshold: annualRevenue
					? parseFloat(get("annualRevenue")!)
					: null,
			},
			create: {
				business_name: get("businessName")!,
				oib: get("oib")!,
				vatId: get("vatNumber") || null,
				street: get("address")!,
				city: get("city")!,
				postalCode: get("postalCode")!,
				activity_code: get("businessCode") || null,
				email: get("email")!,
				annual_threshold: annualRevenue
					? parseFloat(get("annualRevenue")!)
					: null,
				iban: get("iban") || null,
				userId: session.user.id,
			},
		});

		if (business) {
			return {
				status: "success",
				message: "Podaci o obrtu su uspješno spremljeni!",
			};
		}
	} catch (err: any) {
		return {
			status: "error",
			messages: ["Došlo je do pogreške. Molimo pokušajte ponovno."],
		};
	}
}

export async function updateAnnualThreshold(
	_previousState: unknown | null,
	formData: FormData,
) {
	const id = formData.get("businessId") as string;
	const annualThreshold = Number(formData.get("annualRevenue"));
	const thresholdWarning = Number(formData.get("thresholdWarning"));

	const thresholdWarningPct = annualThreshold
		? annualThreshold * thresholdWarning
		: null;

	await prisma.business.update({
		where: { id: id },
		data: {
			annual_threshold: annualThreshold,
			threshold_warning_pct: thresholdWarningPct,
		},
	});

	return { status: "success", message: "Porezni podaci su spremljeni." };
}
