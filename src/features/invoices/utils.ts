import type { InvoiceFilterStatus } from "./constants";
import { InvoiceStatus } from "@/generated/prisma";

export function getEffectiveStatus(
	invoice: Pick<{ status: InvoiceStatus; dueDate: Date }, "status" | "dueDate">,
): InvoiceFilterStatus {
	if (invoice.status === "ISSUED" && invoice.dueDate < new Date()) {
		return "OVERDUE";
	}

	return invoice.status;
}
