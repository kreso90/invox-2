import { InvoiceStatus, PaymentType } from "@/generated/prisma";

export type InvoiceFilterStatus = InvoiceStatus | "OVERDUE";

export const statusLabels: Partial<Record<InvoiceFilterStatus, string>> = {
	DRAFT: "Nacrt",
	ISSUED: "Dospijeva",
	PAID: "Plaćeno",
	OVERDUE: "Neplaćeno",
	PARTIALLY_PAID: "Djelomično plaćeno",
	CANCELLED: "Stornirano",
};

export const paymentLabels: Record<PaymentType, string> = {
	BANK_TRANSFER: "Bankovni transfer",
	CASH: "Gotovina",
};
