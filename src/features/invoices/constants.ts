import { InvoiceStatus } from "@/generated/prisma";

export type InvoiceFilterStatus = InvoiceStatus | "OVERDUE";

export const statusLabels: Partial<Record<InvoiceFilterStatus, string>> = {
	DRAFT: "Nacrt",
	ISSUED: "Dospijeva",
	PAID: "Plaćeno",
	OVERDUE: "Neplaćeno",
};
