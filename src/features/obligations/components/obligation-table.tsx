"use client";

import type {
	Business,
	Obligation,
	ObligationKind,
	ObligationStatus,
	Prisma,
	User,
} from "@/generated/prisma";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	obligationLabels,
	obligationStatusLabels,
} from "@/features/obligations/constants";
import { useState } from "react";
import { BarcodeModal } from "./barcode-modal";
import { Button } from "@/components/ui/button";
import { FileText, Form, QrCode } from "lucide-react";
import { Card } from "@/components/ui/card";
import { FormsModal } from "./forms-modal";
import dynamic from "next/dynamic";

const DownloadKpr = dynamic(
	() => import("./kpr-pdf").then((mod) => mod.DownloadKpr),
	{ ssr: false },
);

export function ObligationTable({
	obligations,
	taxObligations,
	formsObligations,
	otherObligations,
	business,
	invoices,
	invoicesAmountsByPeriod,
	user,
}: {
	obligations: Obligation[];
	taxObligations: Obligation[];
	formsObligations: Obligation[];
	otherObligations: Obligation[];
	business: Business | null;
	invoicesAmountsByPeriod: Record<string, number>;
	invoices: Prisma.InvoiceGetPayload<{
		include: { client: true; invoiceItems: true; invoicePayments: true };
	}>[];
	user: User | null;
}) {
	const [selectedObligationId, setSelectedObligationId] = useState<
		string | null
	>(null);
	const [selectedFormObligationId, setSelectedFormObligationId] = useState<
		string | null
	>(null);
	return (
		<>
			<Card className="p-4 mb-4">
				<div className="mb-2">
					<span className="font-medium">Godišnje obveze i ostale obveze</span>
				</div>
				{otherObligations?.map((otherObligation) => (
					<div
						key={otherObligation.id}
						className="flex justify-between items-center gap-2 border-b border-border pb-2"
					>
						<div>
							<span className="font-medium">
								PO-SD obrazac — prijava paušalnog dohotka
							</span>
							<br />
							<span className="text-muted-foreground text-xs font-mono">
								rok: 15.01.2027.
							</span>
						</div>

						<Badge
							variant={otherObligation.status === "PENDING" ? "draft" : "paid"}
						>
							{
								obligationStatusLabels[
									otherObligation.status as ObligationStatus
								]
							}
						</Badge>
					</div>
				))}
				<div className="flex justify-between gap-2">
					<div>
						<span className="font-medium">KPR obrazac — knjiga prometa</span>
						<br />
						<span className="text-muted-foreground text-xs font-mono">
							Preuzmite knjigu prometa za odabrani poslovni profil.
						</span>
					</div>
					{business && invoices && user && (
						<DownloadKpr
							data={{
								business,
								user,
								invoices,
							}}
						/>
					)}
				</div>
			</Card>
			<Card className="p-4 mb-4">
				<div className="flex justify-between mb-2">
					<span className="font-medium">Mjesečni doprinosi</span>
					<span className="font-medium">
						1. i 2. mirovinski stup, zdravstveno osiguranje
					</span>
				</div>
				<Table>
					<TableHeader>
						<TableRow className="uppercase hover:bg-transparent">
							<TableHead>Razdoblje</TableHead>
							<TableHead>Obveza</TableHead>
							<TableHead>Rok</TableHead>
							<TableHead>Iznos</TableHead>
							<TableHead>Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{obligations?.map((obligation) => {
							return (
								<TableRow key={obligation.id} className="hover:bg-transparent">
									<TableCell className="font-medium font-mono text-muted text-xs">
										{(() => {
											const [month, year] = obligation.periodLabel.split("/");

											return new Intl.DateTimeFormat("hr-HR", {
												month: "long",
												year: "numeric",
											}).format(new Date(Number(year), Number(month) - 1));
										})()}
									</TableCell>
									<TableCell className="font-medium text-sm">
										{obligationLabels[obligation.kind as ObligationKind]}
									</TableCell>
									<TableCell className="font-mono text-sm">
										{obligation.dueDate
											? new Intl.DateTimeFormat("hr-HR", {
													day: "numeric",
													month: "numeric",
													year: "numeric",
												}).format(new Date(obligation.dueDate))
											: "N/A"}
									</TableCell>
									<TableCell className="font-mono font-medium text-sm">
										{obligation.amount
											? new Intl.NumberFormat("hr-HR", {
													style: "currency",
													currency: "EUR",
												}).format(obligation.amount)
											: "N/A"}
									</TableCell>
									<TableCell>
										<Badge
											variant={
												obligation.status === "PENDING" ? "draft" : "paid"
											}
										>
											{
												obligationStatusLabels[
													obligation.status as ObligationStatus
												]
											}
										</Badge>
									</TableCell>
									<TableCell className="text-right">
										<Button
											onClick={() => setSelectedObligationId(obligation.id)}
											className="bg-accent-foreground"
										>
											<QrCode />
											QR
										</Button>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</Card>
			<Card className="p-4 mb-4">
				<div className="flex justify-between mb-2 font-semibold">
					<span className="font-semibold">Porez na dohodak</span>
					<span>tromjesečno</span>
				</div>
				<Table>
					<TableHeader>
						<TableRow className="uppercase hover:bg-transparent">
							<TableHead>Razdoblje</TableHead>
							<TableHead>Obveza</TableHead>
							<TableHead>Rok</TableHead>
							<TableHead>Iznos</TableHead>
							<TableHead>Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{taxObligations?.map((taxObligation) => {
							return (
								<TableRow
									key={taxObligation.id}
									className="hover:bg-transparent"
								>
									<TableCell className="font-medium font-mono text-muted text-xs">
										{(() => {
											const [month, year] =
												taxObligation.periodLabel.split("/");

											return new Intl.DateTimeFormat("hr-HR", {
												month: "long",
												year: "numeric",
											}).format(new Date(Number(year), Number(month) - 1));
										})()}
									</TableCell>
									<TableCell className="font-medium text-sm">
										{obligationLabels[taxObligation.kind as ObligationKind]}
									</TableCell>
									<TableCell className="font-mono text-sm">
										{taxObligation.dueDate
											? new Intl.DateTimeFormat("hr-HR", {
													day: "numeric",
													month: "numeric",
													year: "numeric",
												}).format(new Date(taxObligation.dueDate))
											: "N/A"}
									</TableCell>
									<TableCell className="font-mono font-medium text-sm">
										{taxObligation.amount
											? new Intl.NumberFormat("hr-HR", {
													style: "currency",
													currency: "EUR",
												}).format(taxObligation.amount)
											: "N/A"}
									</TableCell>
									<TableCell>
										<Badge
											variant={
												taxObligation.status === "PENDING" ? "draft" : "paid"
											}
										>
											{
												obligationStatusLabels[
													taxObligation.status as ObligationStatus
												]
											}
										</Badge>
									</TableCell>
									<TableCell className="text-right">
										<Button
											onClick={() => setSelectedObligationId(taxObligation.id)}
											className="bg-accent-foreground"
										>
											<QrCode />
											QR
										</Button>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</Card>
			<Card className="p-4">
				<div className="flex justify-between mb-2">
					<span className="font-medium">PDV i EU izvještavanje</span>
					<span className="font-medium">samo ako imaš B2B klijente iz EU</span>
				</div>
				<Table>
					<TableHeader>
						<TableRow className="uppercase hover:bg-transparent">
							<TableHead>Razdoblje</TableHead>
							<TableHead>Obveza</TableHead>
							<TableHead>Rok</TableHead>
							<TableHead>Iznos</TableHead>
							<TableHead>Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{formsObligations?.map((obligation) => {
							return (
								<TableRow key={obligation.id} className="hover:bg-transparent">
									<TableCell className="font-medium font-mono text-muted text-xs">
										{(() => {
											const [month, year] = obligation.periodLabel.split("/");

											return new Intl.DateTimeFormat("hr-HR", {
												month: "long",
												year: "numeric",
											}).format(new Date(Number(year), Number(month) - 1));
										})()}
									</TableCell>
									<TableCell className="font-medium text-sm">
										{obligationLabels[obligation.kind as ObligationKind]}
									</TableCell>
									<TableCell className="font-mono text-sm">
										{obligation.dueDate
											? new Intl.DateTimeFormat("hr-HR", {
													day: "numeric",
													month: "numeric",
													year: "numeric",
												}).format(new Date(obligation.dueDate))
											: "N/A"}
									</TableCell>
									<TableCell className="font-mono font-medium text-sm">
										{invoicesAmountsByPeriod[obligation.periodLabel]
											? new Intl.NumberFormat("hr-HR", {
													style: "currency",
													currency: "EUR",
												}).format(
													invoicesAmountsByPeriod[obligation.periodLabel],
												)
											: "N/A"}
									</TableCell>
									<TableCell>
										<Badge
											variant={
												obligation.status === "PENDING" ? "draft" : "paid"
											}
										>
											{
												obligationStatusLabels[
													obligation.status as ObligationStatus
												]
											}
										</Badge>
									</TableCell>
									<TableCell className="text-right">
										<Button
											onClick={() => setSelectedFormObligationId(obligation.id)}
											className="bg-accent-foreground"
										>
											<FileText />
											Obrazac
										</Button>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</Card>

			<BarcodeModal
				obligation={
					[...obligations, ...taxObligations, ...formsObligations].find(
						(o) => o.id === selectedObligationId,
					) ?? null
				}
				onClose={() => setSelectedObligationId(null)}
				business={business}
			/>

			<FormsModal
				obligation={
					formsObligations.find((o) => o.id === selectedFormObligationId) ??
					null
				}
				invoices={invoices.filter((invoice) => {
					const selectedObligation = [
						...obligations,
						...taxObligations,
						...formsObligations,
					].find((o) => o.id === selectedFormObligationId);

					if (!selectedObligation) return false;

					const issueDate = new Date(invoice.issueDate);
					const invoicePeriodLabel = `${String(issueDate.getMonth() + 1).padStart(2, "0")}/${issueDate.getFullYear()}`;

					return invoicePeriodLabel === selectedObligation.periodLabel;
				})}
				business={business}
				onClose={() => setSelectedFormObligationId(null)}
			/>
		</>
	);
}
