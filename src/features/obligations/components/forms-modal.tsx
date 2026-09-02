"use client";

import { Button } from "@/components/ui/button";
import { obligationLabels } from "@/features/obligations/constants";
import type { Obligation, ObligationKind, Prisma } from "@/generated/prisma";
import type { Business } from "@/generated/prisma";
import { updateObligationStatus } from "../actions";
import { useActionState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

type InvoiceWithClient = Prisma.InvoiceGetPayload<{
	include: { client: true };
}>;

export function FormsModal({
	obligation,
	invoices,
	business,
	onClose,
}: {
	obligation: Obligation | null;
	business: Business | null;
	invoices: InvoiceWithClient[];
	onClose: () => void;
}) {
	const [state, fromAction, isPending] = useActionState(
		updateObligationStatus,
		null,
	);

	const invoicesByVatId = new Map<string, InvoiceWithClient[]>();
	for (const invoice of invoices) {
		const key = invoice.client?.vatNumber ?? invoice.id;
		invoicesByVatId.set(key, [...(invoicesByVatId.get(key) ?? []), invoice]);
	}

	return (
		<div
			className={`fixed z-10 ${obligation ? "flex" : "hidden"} justify-center items-center inset-0 bg-black/40 bg-opacity-50`}
		>
			<div className="bg-white p-6 rounded-lg border border-border text-center">
				<div className="text-lg font-semibold">
					{obligationLabels[obligation?.kind as ObligationKind]}
				</div>
				<Table>
					<TableHeader>
						<TableRow className="uppercase hover:bg-transparent">
							<TableHead>PDV Broj</TableHead>
							<TableHead>Iznos</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{[...invoicesByVatId.entries()].map(([vatId, groupedInvoices]) => (
							<TableRow key={vatId} className="text-left text-sm mt-2">
								<TableCell key={vatId}>{vatId}</TableCell>
								<TableCell>
									{groupedInvoices
										.reduce(
											(total, invoice) => total + (invoice.totalAmount ?? 0),
											0,
										)
										.toLocaleString("hr-HR", {
											style: "currency",
											currency: "EUR",
										})}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>

				<div className="flex justify-center gap-2 mt-5">
					<Button onClick={onClose} variant="outline">
						Zatvori
					</Button>
					{obligation?.status !== "SUBMITTED" && (
						<form action={fromAction} className="no-wrapper">
							<input
								type="hidden"
								name="obligationId"
								value={obligation?.id ?? ""}
							/>
							<Button type="submit">Podneseno</Button>
						</form>
					)}
				</div>
			</div>
		</div>
	);
}
