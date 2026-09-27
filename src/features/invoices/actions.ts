"use server";

import { headers } from "next/headers";
import { invoiceSchema } from "./schemas";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { PaymentType, ObligationKind } from "@/generated/prisma";

const EU_COUNTRY_CODES = [
	"AT",
	"BE",
	"BG",
	"CY",
	"CZ",
	"DE",
	"DK",
	"EE",
	"ES",
	"FI",
	"FR",
	"GR",
	"HU",
	"IE",
	"IT",
	"LT",
	"LU",
	"LV",
	"MT",
	"NL",
	"PL",
	"PT",
	"RO",
	"SE",
	"SI",
	"SK",
];

export async function createInvoice(prevState: unknown, formData: FormData) {
	const data = Object.fromEntries(formData);

	const result = invoiceSchema.safeParse(data);

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

	const { invoiceId, items, ...invoiceData } = result.data;

	const client = await prisma.client.findFirst({
		where: {
			id: invoiceData.clientId,
			userId: session.user.id,
		},
	});

	if (!client) {
		return {
			status: "error",
			messages: ["Klijent nije pronađen"],
		};
	}

	const invoiceItems = items.map((item, sortOrder) => ({
		...item,
		itemId: item.itemId || null,
		amount: item.quantity * item.unitPrice,
		sortOrder,
	}));

	const totalAmount = invoiceItems.reduce(
		(total, item) => total + item.amount,
		0,
	);

	let invoice;

	try {
		invoice = await prisma.$transaction(async (tx) => {
			let invoiceNumber = invoiceData.invoiceNumber;

			if (!invoiceId) {
				const settings = await tx.settings.findUnique({
					where: {
						userId: session.user.id,
					},
					select: {
						nextInvoiceNumber: true,
					},
				});

				invoiceNumber = settings?.nextInvoiceNumber ?? "1/1/1";
			}

			const invoiceValues = {
				...invoiceData,
				invoiceNumber,
				totalAmount,
				invoiceItems: {
					create: invoiceItems,
				},
			};

			const savedInvoice = invoiceId
				? await tx.invoice.update({
						where: {
							id: invoiceId,
							userId: session.user.id,
						},
						data: {
							...invoiceValues,
							invoiceItems: {
								deleteMany: {},
								create: invoiceItems,
							},
						},
					})
				: await tx.invoice.create({
						data: {
							...invoiceValues,
							userId: session.user.id,
						},
					});

			if (!invoiceId) {
				const [number, ...rest] = invoiceNumber!.split("/");

				const nextInvoiceNumber = `${Number(number) + 1}/${rest.join("/")}`;

				await tx.settings.upsert({
					where: {
						userId: session.user.id,
					},
					update: {
						nextInvoiceNumber,
					},
					create: {
						userId: session.user.id,
						nextInvoiceNumber,
					},
				});
			}

			const countryCode = client.vatCountryCode;
			const isOutsideHR = countryCode && countryCode !== "HR";
			const isEU = countryCode && EU_COUNTRY_CODES.includes(countryCode);

			if (isOutsideHR) {
				const month = invoiceData.issueDate.getMonth() + 1;
				const year = invoiceData.issueDate.getFullYear();

				const periodLabel = `${month.toString().padStart(2, "0")}/${year}`;

				const dueDate = new Date(year, month, 20);

				await tx.obligation.upsert({
					where: {
						userId_kind_periodLabel: {
							userId: session.user.id,
							kind: ObligationKind.PDV_FORM,
							periodLabel,
						},
					},
					create: {
						userId: session.user.id,
						kind: ObligationKind.PDV_FORM,
						name: `PDV obrazac za ${periodLabel}`,
						periodLabel,
						dueDate,
						status: "PENDING",
					},
					update: {},
				});

				if (isEU) {
					await tx.obligation.upsert({
						where: {
							userId_kind_periodLabel: {
								userId: session.user.id,
								kind: ObligationKind.ZP_FORM,
								periodLabel,
							},
						},
						create: {
							userId: session.user.id,
							kind: ObligationKind.ZP_FORM,
							name: `Zbirna prijava (ZP) za ${periodLabel}`,
							periodLabel,
							dueDate,
							status: "PENDING",
						},
						update: {},
					});
				}
			}

			return savedInvoice;
		});
	} catch (err) {
		return {
			status: "error",
			messages: ["Došlo je do pogreške. Molimo pokušajte ponovno."],
		};
	}

	if (!invoiceId) {
		redirect(`/invoices/${invoice.id}`);
	}

	revalidatePath(`/invoices/${invoiceId}`);

	return {
		status: "success",
		message:
			invoiceData.status === "DRAFT"
				? "Nacrt računa je uspješno spremljen!"
				: invoiceData.status === "CANCELLED"
					? "Račun je uspješno storniran!"
					: "Račun je uspješno izdan!",
	};
}

export async function deleteInvoice(prevState: any, formData: FormData) {
	const invoiceId = formData.get("invoiceId") as string;

	if (!invoiceId) {
		return {
			status: "error",
			message: "Račun nije pronađen",
		};
	}

	await prisma.invoice.delete({
		where: { id: invoiceId },
	});

	revalidatePath("/invoices");
	redirect("/invoices");
}

export async function enterPayment(prevState: any, formData: FormData) {
	const invoiceId = formData.get("invoiceId") as string;
	const amount = Number(formData.get("amount"));
	const method = formData.get("paymentMethod") as PaymentType;

	if (!invoiceId || !Number.isFinite(amount) || amount <= 0) {
		return {
			status: "error",
			message: "Unesite valjani iznos uplate",
		};
	}

	if (!Object.values(PaymentType).includes(method)) {
		return {
			status: "error",
			message: "Odaberite način plaćanja",
		};
	}

	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user?.id) {
		return { status: "error", message: "Korisnik nije logiran" };
	}

	const invoice = await prisma.invoice.findFirst({
		where: { id: invoiceId, userId: session.user.id },
		select: { id: true, totalAmount: true },
	});

	if (!invoice) {
		return { status: "error", message: "Račun nije pronađen" };
	}

	await prisma.$transaction(async (transaction) => {
		await transaction.invoicePayment.create({
			data: {
				invoiceId,
				amount,
				method,
			},
		});

		const payments = await transaction.invoicePayment.aggregate({
			where: { invoiceId },
			_sum: { amount: true },
		});
		const paidAmount = payments._sum.amount ?? 0;
		const isFullyPaid = paidAmount >= invoice.totalAmount - 0.01;

		await transaction.invoice.update({
			where: { id: invoiceId },
			data: {
				status: isFullyPaid ? "PAID" : "PARTIALLY_PAID",
				paidAt: isFullyPaid ? new Date() : null,
			},
		});
	});

	revalidatePath("/invoices");
	revalidatePath(`/invoices/${invoiceId}`);
}

export async function deletePayment(prevState: any, formData: FormData) {
	const invoiceId = formData.get("invoiceId") as string;
	const paymentId = formData.get("paymentId") as string;

	if (!paymentId) {
		return {
			status: "error",
			message: "Uplata nije pronađena",
		};
	}

	await prisma.invoicePayment.delete({
		where: { id: paymentId },
	});

	revalidatePath(`/invoices/${invoiceId}`);
}
