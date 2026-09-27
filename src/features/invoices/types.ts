import type { Prisma } from "@/generated/prisma/client";

export type Invoice = Prisma.InvoiceGetPayload<{
	include: {
		invoiceItems: true;
		client: true;
		invoicePayments: {
			orderBy: {
				paidAt: "desc";
			};
		};
	};
}>;
