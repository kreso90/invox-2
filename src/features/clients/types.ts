import type { Prisma } from "@/generated/prisma/client";

export type Client = Prisma.ClientGetPayload<{
	include: {
		invoices: true;
	};
}>;
