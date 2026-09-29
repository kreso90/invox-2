"use server";

import { auth } from "@/lib/auth";
import { businessProfileSchema } from "./schemas";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { ObligationKind, TaxClass } from "@/generated/prisma/client";

function getMonthlyContributionObligations({
	userId,
	mio1MonthlyAmount,
	mio2MonthlyAmount,
	healthInsuranceMonthly,
	incomeTaxQuarterly,
}: {
	userId: string;
	mio1MonthlyAmount: number;
	mio2MonthlyAmount: number;
	healthInsuranceMonthly: number;
	incomeTaxQuarterly: number;
}) {
	const today = new Date();
	const year = today.getFullYear();
	const firstMonth = today.getMonth();
	const incomeTaxMonths = [1, 3, 6, 9, 12];

	return Array.from({ length: 12 - firstMonth }, (_, index) => {
		const month = firstMonth + index;
		const monthNumber = month + 1;
		const periodLabel = `${String(monthNumber).padStart(2, "0")}/${year}`;
		const dueDate = new Date(year, month + 1, 15);

		return [
			{
				userId,
				kind: ObligationKind.MIO1,
				name: "MIO I doprinos",
				periodLabel,
				dueDate,
				amount: mio1MonthlyAmount,
			},
			{
				userId,
				kind: ObligationKind.MIO2,
				name: "MIO II doprinos",
				periodLabel,
				dueDate,
				amount: mio2MonthlyAmount,
			},
			{
				userId,
				kind: ObligationKind.HEALTH_INSURANCE,
				name: "Doprinos za zdravstveno osiguranje",
				periodLabel,
				dueDate,
				amount: healthInsuranceMonthly,
			},
			{
				userId,
				kind: ObligationKind.OTHER,
				name: "PO-SD obrazac — prijava paušalnog dohotka",
				periodLabel: `${String(year + 1)}`,
				dueDate: new Date(year + 1, 0, 15),
			},

			...(incomeTaxMonths.includes(monthNumber)
				? [
						{
							userId,
							kind: ObligationKind.INCOME_TAX,
							name: "Porez na dohodak",
							periodLabel,
							dueDate,
							amount: incomeTaxQuarterly,
						},
					]
				: []),
		];
	}).flat();
}

export async function createBusiness(prevState: unknown, formData: FormData) {
	const data = Object.fromEntries(formData);

	const result = businessProfileSchema.safeParse(data);

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

	try {
		const business = await prisma.business.upsert({
			where: {
				userId: session.user.id,
			},
			update: {
				business_name: get("businessName")!,
				ownerFirstName: get("ownerFirstName")!,
				ownerLastName: get("ownerLastName")!,
				houseNumber: get("houseNumber")!,
				oib: get("oib")!,
				vatId: get("vatNumber") || null,
				street: get("address")!,
				city: get("city")!,
				postalCode: get("postalCode")!,
				activity_code: get("businessCode") || null,
				activity_name: get("activityName") || null,
				email: get("email")!,
				iban: get("iban") || null,
				bankName: get("bankName") || null,
				swiftCode: get("swiftCode") || null,
			},
			create: {
				business_name: get("businessName")!,
				ownerFirstName: get("ownerFirstName")!,
				ownerLastName: get("ownerLastName")!,
				houseNumber: get("houseNumber")!,
				oib: get("oib")!,
				vatId: get("vatNumber") || null,
				street: get("address")!,
				city: get("city")!,
				postalCode: get("postalCode")!,
				activity_code: get("businessCode") || null,
				activity_name: get("activityName") || null,
				email: get("email")!,
				iban: get("iban") || null,
				bankName: get("bankName") || null,
				swiftCode: get("swiftCode") || null,
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
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user?.id) {
		return { status: "error", message: "Korisnik nije logiran." };
	}
	const business = await prisma.business.findFirst({
		where: { id, userId: session.user.id },
		select: { userId: true },
	});

	if (!business) {
		return { status: "error", message: "Poslovni profil nije pronađen." };
	}

	const annualThreshold = Number(formData.get("annualRevenue"));
	const thresholdWarning = Number(formData.get("thresholdWarning"));
	const mio1MonthlyAmount = Number(formData.get("mio1MonthlyAmount"));
	const mio2MonthlyAmount = Number(formData.get("mio2MonthlyAmount"));
	const healthInsuranceMonthly = Number(formData.get("healthInsuranceMonthly"));
	const incomeTaxQuarterly = Number(formData.get("incomeTaxQuarterly"));
	const taxClass = formData.get("taxClass");

	const thresholdWarningPct = Number.isFinite(thresholdWarning)
		? thresholdWarning
		: null;

	if (
		!Object.values(TaxClass).includes(taxClass as TaxClass) ||
		![
			mio1MonthlyAmount,
			mio2MonthlyAmount,
			healthInsuranceMonthly,
			incomeTaxQuarterly,
		].every(Number.isFinite)
	) {
		return { status: "error", message: "Unesite valjane iznose doprinosa." };
	}

	await prisma.business.update({
		where: { id: id },
		data: {
			annual_threshold: Number.isFinite(annualThreshold)
				? annualThreshold
				: null,
			threshold_warning_pct: thresholdWarningPct,
			taxClass: taxClass as TaxClass,
			mio1MonthlyAmount,
			mio2MonthlyAmount,
			healthInsuranceMonthly,
			incomeTaxQuarterly,
		},
	});

	const obligations = getMonthlyContributionObligations({
		userId: business.userId,
		mio1MonthlyAmount,
		mio2MonthlyAmount,
		healthInsuranceMonthly,
		incomeTaxQuarterly,
	});

	await prisma.$transaction([
		...obligations.map((obligation) =>
			prisma.obligation.updateMany({
				where: {
					userId: obligation.userId,
					kind: obligation.kind,
					periodLabel: obligation.periodLabel,
					status: "PENDING",
					amount: { not: obligation.amount },
				},
				data: { amount: obligation.amount },
			}),
		),
		prisma.obligation.createMany({ data: obligations, skipDuplicates: true }),
	]);

	return { status: "success", message: "Porezni podaci su spremljeni." };
}
