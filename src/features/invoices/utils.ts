import type { InvoiceFilterStatus } from "./constants";
import { Invoice } from "./types";

export function getEffectiveStatus(invoice: Invoice): InvoiceFilterStatus {
	if (invoice.status === "ISSUED" && invoice.dueDate < new Date()) {
		return "OVERDUE";
	}

	return invoice.status;
}
