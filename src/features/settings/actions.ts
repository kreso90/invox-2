"use server";

import { auth } from "@/lib/auth";
import { settingsSchema, emailSettingsSchema } from "./schemas";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { PaymentType } from "@/generated/prisma";

export async function updateSettings(prevState: unknown, formData: FormData) {
	const data = Object.fromEntries(formData);

	const result = settingsSchema.safeParse(data);

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

	const settingsValues = {
		nextInvoiceNumber: get("nextInvoiceNumber")!,
		nextQuoteNumber: get("nextQuoteNumber")!,

		defaultDueDays: Number(get("defaultDueDays")!),
		defaultIssuePlace: get("defaultIssuePlace")!,
		defaultPaymentMethod: get("defaultPaymentMethod") as PaymentType,
		defaultFooterNote: get("defaultFooterNote") || null,

		emailSenderName: get("emailSenderName") || "",
		emailReplyTo: get("emailReplyTo") || "",
		emailSubjectTemplate: get("emailSubjectTemplate") || "",
		emailBodyTemplate: get("emailBodyTemplate") || "",
	};

	try {
		const settings = await prisma.settings.upsert({
			where: {
				userId: session.user.id,
			},
			update: settingsValues,
			create: {
				userId: session.user.id,
				...settingsValues,
			},
		});

		if (settings) {
			return {
				status: "success",
				message: "Postavke su uspješno spremljene!",
			};
		}
	} catch (err: any) {
		console.error("UPDATE SETTINGS ERROR:", err);
		return {
			status: "error",
			messages: ["Došlo je do pogreške. Molimo pokušajte ponovno."],
		};
	}
}

export async function updateEmailSettings(
	prevState: unknown,
	formData: FormData,
) {
	const data = Object.fromEntries(formData);

	const result = emailSettingsSchema.safeParse(data);

	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user?.id) {
		return {
			status: "error",
			message: "Korisnik nije logiran",
		};
	}

	if (!result.success) {
		return {
			status: "error",
			messages: result.error.issues.map((issue) => issue.message),
		};
	}

	try {
		await prisma.settings.upsert({
			where: {
				userId: session.user.id,
			},
			update: result.data,
			create: {
				userId: session.user.id,
				...result.data,
			},
		});

		return {
			status: "success",
			message: "Postavke su uspješno spremljene!",
		};
	} catch (err) {
		console.error("UPDATE EMAIL SETTINGS ERROR:", err);

		return {
			status: "error",
			messages: ["Došlo je do pogreške. Molimo pokušajte ponovno."],
		};
	}
}
