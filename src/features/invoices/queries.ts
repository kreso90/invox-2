import { Prisma } from "@/generated/prisma";
import type { InvoiceFilterStatus } from "./constants";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function getUserInvoice(invoiceId: string) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		return null;
	}

	return prisma.invoice.findFirst({
		where: { id: invoiceId, userId: session.user.id },
		include: {
			invoiceItems: true,
			client: true,
			invoicePayments: {
				orderBy: {
					paidAt: "desc",
				},
			},
		},
	});
}

export async function getInvoices(
	search?: string,
	page?: number,
	pageSize?: number,
	status?: InvoiceFilterStatus,
	date?: Date,
	clientId?: string,
) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		return { invoices: [], total: 0 };
	}

	const normalizedSearch = search?.trim();
	const where: Prisma.InvoiceWhereInput = {
		userId: session.user.id,
		...(clientId ? { clientId } : {}),
		...(normalizedSearch
			? {
					OR: [
						{
							invoiceNumber: {
								contains: normalizedSearch,
								mode: "insensitive" as const,
							},
						},
						{
							client: {
								companyName: {
									contains: normalizedSearch,
									mode: "insensitive" as const,
								},
							},
						},
					],
				}
			: {}),
		...(status === "OVERDUE"
			? {
					status: "ISSUED",
					dueDate: {
						lt: new Date(),
					},
				}
			: status
				? { status }
				: {}),
		...(date
			? {
					issueDate: {
						gte: new Date(date.getFullYear(), date.getMonth(), 1),
						lt: new Date(date.getFullYear(), date.getMonth() + 1, 1),
					},
				}
			: {}),
	};

	const [invoices, total] = await Promise.all([
		prisma.invoice.findMany({
			where,
			skip: ((page ?? 1) - 1) * (pageSize ?? 10),
			take: pageSize ?? 10,
			orderBy: { createdAt: "desc" },
			include: { invoiceItems: true, client: true, invoicePayments: true },
		}),
		prisma.invoice.count({ where }),
	]);

	return {
		invoices,
		total,
		totalPages: Math.ceil(total / (pageSize ?? 10)),
	};
}

export async function getInvoicesAmounts(
	date?: Date,
	clientCountryFilter?: Prisma.InvoiceWhereInput["client"],
) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session?.user) {
		return {
			unpaidAmount: 0,
			invoiceUnpaid: 0,
			paidAmount: 0,
			currentMonthPaidAmount: 0,
			previousMonthPaidAmount: 0,
			selectedMonthPaidAmount: 0,
			currentYearIssuedAmount: 0,
		};
	}
	const now = new Date();
	const year = now.getFullYear();
	const month = now.getMonth();
	const currentMonthStart = new Date(year, month, 1);
	const nextMonthStart = new Date(year, month + 1, 1);
	const previousMonthStart = new Date(year, month - 1, 1);
	const currentYearStart = new Date(year, 0, 1);
	const nextYearStart = new Date(year + 1, 0, 1);
	const selectedMonth = date ?? now;
	const selectedMonthStart = new Date(
		selectedMonth.getFullYear(),
		selectedMonth.getMonth(),
		1,
	);
	const nextSelectedMonthStart = new Date(
		selectedMonth.getFullYear(),
		selectedMonth.getMonth() + 1,
		1,
	);
	const [
		unpaid,
		paidAmount,
		currentMonthPaidAmount,
		previousMonthPaidAmount,
		selectedMonthPaidAmount,
		currentYearIssuedAmount,
	] = await Promise.all([
		prisma.invoice.aggregate({
			where: {
				userId: session.user.id,
				status: { in: ["ISSUED", "PARTIALLY_PAID"] },
			},
			_sum: { totalAmount: true },
			_count: { totalAmount: true },
		}),
		prisma.invoice.aggregate({
			where: {
				userId: session.user.id,
				status: { notIn: ["DRAFT", "CANCELLED"] },
			},
			_sum: { totalAmount: true },
		}),
		prisma.invoice.aggregate({
			where: {
				userId: session.user.id,
				status: { notIn: ["DRAFT", "CANCELLED"] },
				issueDate: { gte: currentMonthStart, lt: nextMonthStart },
			},
			_sum: { totalAmount: true },
		}),
		prisma.invoice.aggregate({
			where: {
				userId: session.user.id,
				status: { notIn: ["DRAFT", "CANCELLED"] },
				issueDate: { gte: previousMonthStart, lt: currentMonthStart },
			},
			_sum: { totalAmount: true },
		}),
		prisma.invoice.aggregate({
			where: {
				userId: session.user.id,
				status: { in: ["PAID", "ISSUED"] },
				issueDate: { gte: selectedMonthStart, lt: nextSelectedMonthStart },
				...(clientCountryFilter ? { client: clientCountryFilter } : {}),
			},
			_sum: { totalAmount: true },
		}),
		prisma.invoice.aggregate({
			where: {
				userId: session.user.id,
				status: { in: ["PAID", "ISSUED"] },
				issueDate: { gte: currentYearStart, lt: nextYearStart },
				...(clientCountryFilter ? { client: clientCountryFilter } : {}),
			},
			_sum: { totalAmount: true },
		}),
	]);
	return {
		unpaidAmount: unpaid._sum.totalAmount ?? 0,
		invoiceUnpaid: unpaid._count.totalAmount ?? 0,
		paidAmount: paidAmount._sum.totalAmount ?? 0,
		currentMonthPaidAmount: currentMonthPaidAmount._sum.totalAmount ?? 0,
		previousMonthPaidAmount: previousMonthPaidAmount._sum.totalAmount ?? 0,
		selectedMonthPaidAmount: selectedMonthPaidAmount._sum.totalAmount ?? 0,
		currentYearIssuedAmount: currentYearIssuedAmount._sum.totalAmount ?? 0,
	};
}

export async function getLastInvoiceNumber() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		return null;
	}

	const year = new Date().getFullYear();

	const invoice = await prisma.invoice.findFirst({
		where: {
			userId: session.user.id,
			invoiceNumber: { startsWith: `${year}-` },
		},
		orderBy: { invoiceNumber: "desc" },
		select: { invoiceNumber: true },
	});

	return invoice?.invoiceNumber ?? null;
}

export async function getDueInvoices() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		return null;
	}

	const dueInvoices = await prisma.invoice.findMany({
		where: {
			userId: session.user.id,
			status: "ISSUED",
		},
		orderBy: { dueDate: "asc" },
		take: 5,
		include: { client: true },
	});

	return dueInvoices;
}
