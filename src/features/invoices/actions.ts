"use server";

import { headers } from "next/headers";
import { invoiceSchema } from "./schemas";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createInvoice(prevState: unknown, formData: FormData) {
	const data = Object.fromEntries(formData);

	const result = invoiceSchema.safeParse(data);

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

	return {
		status: "success",
		message:
			invoiceData.status === "DRAFT"
				? "Nacrt računa je uspješno spremljen!"
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
