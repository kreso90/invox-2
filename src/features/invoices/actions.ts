"use server";

import { headers } from "next/headers";
import { invoiceSchema } from "./schemas";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { PaymentType } from "@/generated/prisma";

export async function createInvoice(prevState: unknown, formData: FormData) {
	const data = Object.fromEntries(formData);

	const result = invoiceSchema.safeParse(data);

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

	const { invoiceId, items, ...invoiceData } = result.data;
	const client = await prisma.client.findFirst({
		where: { id: invoiceData.clientId, userId: session.user.id },
	});

	if (!client) {
		return { status: "error", messages: ["Klijent nije pronađen"] };
	}

	const invoiceItems = items.map((item, sortOrder) => ({
		...item,
		itemId: item.itemId || null,
		amount: item.quantity * item.unitPrice,
		sortOrder,
	}));

	let invoiceNumber = invoiceData.invoiceNumber;

	if (!invoiceId) {
		const year = invoiceData.issueDate.getFullYear();
		const prefix = `${year}-`;
		const lastInvoice = await prisma.invoice.findFirst({
			where: {
				userId: session.user.id,
				invoiceNumber: { startsWith: prefix },
			},
			orderBy: { invoiceNumber: "desc" },
		});
		const lastNumber = lastInvoice
			? Number(lastInvoice.invoiceNumber.slice(prefix.length))
			: 0;
		const nextNumber = lastNumber + 1;

		invoiceNumber = `${prefix}${String(nextNumber).padStart(4, "0")}`;
	}

	const totalAmount = invoiceItems.reduce(
		(total, item) => total + item.amount,
		0,
	);
	const invoiceValues = {
		...invoiceData,
		invoiceNumber,
		totalAmount,
		invoiceItems: { create: invoiceItems },
	};

	let invoice;

	try {
		invoice = invoiceId
			? await prisma.invoice.update({
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
			: await prisma.invoice.create({
					data: {
						...invoiceValues,
						userId: session.user.id,
					},
				});
	} catch (err: any) {
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
