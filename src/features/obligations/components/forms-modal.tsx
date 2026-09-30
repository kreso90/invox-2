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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { downloadXml, obrazacToXml } from "./xml-zp-export";
import { pdvToXml } from "./xml-pdv-export";
import { EU_COUNTRY_CODES } from "@/features/invoices/constants";

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
	const [state, formAction, isPending] = useActionState(
		updateObligationStatus,
		null,
	);

	// ZP only covers EU clients (HR is never in EU_COUNTRY_CODES); PDV covers everyone except HR.
	const relevantInvoices =
		obligation?.kind === "ZP_FORM"
			? invoices.filter(
					(invoice) =>
						invoice.client?.vatCountryCode &&
						EU_COUNTRY_CODES.includes(invoice.client.vatCountryCode),
				)
			: obligation?.kind === "PDV_FORM"
				? invoices.filter((invoice) => invoice.client?.vatCountryCode !== "HR")
				: invoices;

	const invoicesByVatId = new Map<string, InvoiceWithClient[]>();
	for (const invoice of relevantInvoices) {
		const key = invoice.client?.vatNumber ?? invoice.id;
		invoicesByVatId.set(key, [...(invoicesByVatId.get(key) ?? []), invoice]);
	}

	return (
		<Dialog open={!!obligation} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{obligationLabels[obligation?.kind as ObligationKind]}
					</DialogTitle>

					<DialogDescription>
						Razdoblje: {obligation?.periodLabel ?? ""}
					</DialogDescription>
				</DialogHeader>

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
								<TableCell>{vatId}</TableCell>
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

				<DialogFooter className="mt-4">
					<Button onClick={onClose} variant="outline">
						Zatvori
					</Button>
					{obligation?.kind === "ZP_FORM" && (
						<Button
							onClick={() =>
								downloadXml(
									obrazacToXml({
										obligation,
										invoices: relevantInvoices,
										business,
										user,
									}),
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
									pdvToXml({
										obligation,
										invoices: relevantInvoices,
										business,
										user,
									}),
									`${obligation?.kind?.toLowerCase().includes("zp") ? "zp-obrazac" : "pdv-obrazac"}-${obligation?.periodLabel?.replace(/\s|\.$/g, "")}.xml`,
								)
							}
						>
							Izvezi PDV XML
						</Button>
					)}
					{obligation?.status !== "SUBMITTED" && (
						<form action={formAction} className="no-wrapper">
							<input
								type="hidden"
								name="obligationId"
								value={obligation?.id ?? ""}
							/>
							<Button type="submit" disabled={isPending}>
								Podneseno
							</Button>
						</form>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
