"use client";

import { Button } from "@/components/ui/button";
import { obligationLabels } from "@/features/obligations/constants";
import type {
	User,
	Business,
	Obligation,
	ObligationKind,
	Prisma,
} from "@/generated/prisma";
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
import { downloadXml, obrazacToXml } from "./xml-zp-export";
import { pdvToXml } from "./xml-pdv-export";

type InvoiceWithClient = Prisma.InvoiceGetPayload<{
	include: { client: true; invoicePayments: true };
}>;

export function FormsModal({
	obligation,
	invoices,
	business,
	user,
	onClose,
}: {
	obligation: Obligation | null;
	business: Business | null;
	invoices: InvoiceWithClient[];
	user: User | null;
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
			<div className="bg-white p-6 rounded-lg border border-border">
				<div className="flex flex-col gap-0 mb-4">
					<span className="font-semibold">
						{obligationLabels[obligation?.kind as ObligationKind]}
					</span>

					<span className="text-sm text-muted">
						Razdoblje: {obligation?.periodLabel ?? ""}
					</span>
				</div>
				<Table>
					<TableHeader>
						<TableRow className="uppercase hover:bg-transparent text-xs  font-mono ">
							<TableHead>Klijent</TableHead>
							<TableHead>Sifra drzave</TableHead>
							<TableHead>PDV broj</TableHead>
							<TableHead className="text-right">Iznos</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{[...invoicesByVatId.entries()].map(([vatId, groupedInvoices]) => (
							<TableRow
								key={vatId}
								className="text-left text-sm mt-2 hover:bg-transparent"
							>
								<TableCell key={vatId}>
									{groupedInvoices[0]?.client?.companyName ?? ""}
								</TableCell>
								<TableCell>
									{groupedInvoices[0]?.client?.vatCountryCode ?? ""}
								</TableCell>
								<TableCell>{vatId.slice(2)}</TableCell>
								<TableCell className="font-mono text-right">
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
				<div className="mt-4 border-t border-border">
					<div className="flex justify-between text-sm font-medium my-2">
						<span>Ukupno za razdoblje</span>{" "}
						<span className="font-mono">
							{[...invoicesByVatId.values()]
								.flat()
								.reduce(
									(total, invoice) => total + (invoice.totalAmount ?? 0),
									0,
								)
								.toLocaleString("hr-HR", {
									style: "currency",
									currency: "EUR",
								})}
						</span>
					</div>
					<div className="text-xs text-muted">
						Ovi podaci ne šalju se automatski Poreznoj upravi — služe kao
						priprema koju prepisuješ (ili izvoziš) u ePorezna sustav pri predaji
						obrasca.
					</div>
				</div>

				<div className="flex justify-center gap-2 mt-5">
					<Button onClick={onClose} variant="outline">
						Zatvori
					</Button>
					{obligation?.kind === "ZP_FORM" && (
						<Button
							onClick={() =>
								downloadXml(
									obrazacToXml({ obligation, invoices, business, user }),
									`${obligation?.kind?.toLowerCase().includes("zp") ? "zp-obrazac" : "pdv-obrazac"}-${obligation?.periodLabel?.replace(/\s|\.$/g, "")}.xml`,
								)
							}
						>
							Izvezi ZP XML
						</Button>
					)}
					{obligation?.kind === "PDV_FORM" && (
						<Button
							onClick={() =>
								downloadXml(
									pdvToXml({ obligation, invoices, business, user }),
									`${obligation?.kind?.toLowerCase().includes("zp") ? "zp-obrazac" : "pdv-obrazac"}-${obligation?.periodLabel?.replace(/\s|\.$/g, "")}.xml`,
								)
							}
						>
							Izvezi PDV XML
						</Button>
					)}
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
