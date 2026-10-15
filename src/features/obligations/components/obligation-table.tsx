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
import { FileText, Form, Link, QrCode, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { FormsModal } from "./forms-modal";
import dynamic from "next/dynamic";
import { deleteObligation } from "../actions";
import ObligationDeleteForm from "./obligation-delete-modal";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	CustomTable,
	CustomTHead,
	CustomTRItem,
	CustomTRow,
} from "@/components/ui/custom-table";

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
	const [selectedDeleteObligationId, setSelectedDeleteObligationId] = useState<
		string | null
	>(null);
	const invoiceYears = [
		...new Set(
			invoices.map((invoice) => new Date(invoice.issueDate).getFullYear()),
		),
	].sort((a, b) => b - a);
	const [selectedYear, setSelectedYear] = useState<Date | null>(
		() => new Date(invoiceYears[0] ?? new Date().getFullYear(), 0, 1),
	);
	const currentMonth = new Intl.DateTimeFormat("hr-HR", {
		month: "2-digit",
		year: "numeric",
	}).format(new Date());

	const [selectedMonths, setSelectedMonths] = useState<
		Record<string, string | null>
	>({
		obligations: currentMonth,
		otherObligations: currentMonth,
	});
	return (
		<>
			<Card className="p-4 mb-4">
				<div className="mb-2">
					<span className="font-medium">Godišnje obveze i ostale obveze</span>
				</div>
				{otherObligations?.map((otherObligation) => (
					<div
						key={otherObligation.id}
						className="flex flex-col lg:flex-row justify-between lg:items-center gap-2 border-b border-border pb-2"
					>
						<div>
							<span className="font-medium">{otherObligation.name}</span>
							<br />
							<span className="text-muted-foreground text-xs font-mono">
								rok:{" "}
								{otherObligation.dueDate
									? new Date(otherObligation.dueDate).toLocaleDateString(
											"hr-HR",
										)
									: "N/A"}
							</span>
						</div>
						<div className="flex gap-4">
							<Badge
								variant={
									otherObligation.status === "PENDING" ? "draft" : "paid"
								}
							>
								{
									obligationStatusLabels[
										otherObligation.status as ObligationStatus
									]
								}
							</Badge>
							<Button
								variant="outline"
								className="bg-destructive text-white"
								onClick={() =>
									setSelectedDeleteObligationId(otherObligation.id)
								}
							>
								<Trash2 />
							</Button>
						</div>
					</div>
				))}
				<div className="flex flex-col lg:flex-row justify-between gap-2">
					<div>
						<span className="font-medium">KPR obrazac — knjiga prometa</span>
						<br />
						<span className="text-muted-foreground text-xs font-mono">
							Preuzmite knjigu prometa za odabrani poslovni profil.
						</span>
					</div>
					{business && invoices && user && (
						<div className="flex gap-2">
							<Select
								value={selectedYear?.getFullYear().toString() ?? "Sve godine"}
								onValueChange={(value) =>
									setSelectedYear(
										value === "Sve godine" || value === null
											? null
											: new Date(Number(value), 0, 1),
									)
								}
							>
								<SelectTrigger className="w-full">
									<SelectValue>
										{(value: string | null) =>
											value && value !== "null" ? value : "Odaberi godinu"
										}
									</SelectValue>
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectItem value="Sve godine">Sve godine</SelectItem>
										{invoiceYears.map((year) => (
											<SelectItem key={year} value={year.toString()}>
												{year}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>

							<DownloadKpr
								data={{
									business,
									user,
									invoices,
									year: selectedYear,
								}}
							/>
						</div>
					)}
				</div>
			</Card>

			<CustomTable
				className="mb-4"
				columns={["0.75fr", "1fr", "0.5fr", "0.5fr", "0.75fr", "0.75fr"]}
				mobileColumns={["1fr", "1fr"]}
			>
				<CustomTHead className="mb-6">
					<div className="flex justify-between mb-4 text-sm">
						<span className="font-medium">Mjesečni doprinosi</span>
						<span className="font-medium text-right lg:text-left">
							1. i 2. mirovinski stup, zdravstveno osiguranje
						</span>
					</div>
					<div className="flex gap-2 mb-2">
						<Button
							variant="outline"
							className={
								selectedMonths.obligations ===
								new Intl.DateTimeFormat("hr-HR", {
									month: "2-digit",
									year: "numeric",
								}).format(new Date())
									? "bg-primary text-white"
									: ""
							}
							onClick={() =>
								setSelectedMonths((prev) => ({
									...prev,
									obligations: new Intl.DateTimeFormat("hr-HR", {
										month: "2-digit",
										year: "numeric",
									}).format(new Date()),
								}))
							}
						>
							Ovaj mjesec
						</Button>
						<Button
							variant="outline"
							className={
								selectedMonths.obligations ===
								new Intl.DateTimeFormat("hr-HR", {
									month: "2-digit",
									year: "numeric",
								}).format(
									new Date(new Date().getFullYear(), new Date().getMonth() - 1),
								)
									? "bg-primary text-white"
									: ""
							}
							onClick={() =>
								setSelectedMonths((prev) => ({
									...prev,
									obligations: new Intl.DateTimeFormat("hr-HR", {
										month: "2-digit",
										year: "numeric",
									}).format(
										new Date(
											new Date().getFullYear(),
											new Date().getMonth() - 1,
										),
									),
								}))
							}
						>
							Prošli mjesec
						</Button>
						<Button
							variant="outline"
							className={
								selectedMonths.obligations === null
									? "bg-primary text-white"
									: ""
							}
							onClick={() =>
								setSelectedMonths((prev) => ({ ...prev, obligations: null }))
							}
						>
							Svi mjeseci
						</Button>
					</div>
				</CustomTHead>
				<CustomTRow variant="head" className="hidden lg:grid border-0!">
					<CustomTRItem>Razdoblje</CustomTRItem>
					<CustomTRItem>Obveza</CustomTRItem>
					<CustomTRItem>Rok</CustomTRItem>
					<CustomTRItem>Iznos</CustomTRItem>
					<CustomTRItem className="text-center">Status</CustomTRItem>
					<CustomTRItem className="text-right">Akcije</CustomTRItem>
				</CustomTRow>
				{obligations
					?.filter((obligation) => {
						if (!selectedMonths.obligations) return true;
						const [month, year] = obligation.periodLabel.split("/");
						const obligationMonth = new Intl.DateTimeFormat("hr-HR", {
							month: "2-digit",
							year: "numeric",
						}).format(new Date(Number(year), Number(month) - 1));
						return obligationMonth === selectedMonths.obligations;
					})
					.map((obligation) => {
						return (
							<CustomTRow key={obligation.id} className="hover:bg-transparent">
								<CustomTRItem className="font-medium font-mono text-muted text-xs order-1 lg:order-1">
									{(() => {
										const [month, year] = obligation.periodLabel.split("/");

										return new Intl.DateTimeFormat("hr-HR", {
											month: "long",
											year: "numeric",
										}).format(new Date(Number(year), Number(month) - 1));
									})()}
								</CustomTRItem>
								<CustomTRItem className="font-medium text-sm order-3 lg:order-2">
									{obligationLabels[obligation.kind as ObligationKind]}
								</CustomTRItem>
								<CustomTRItem className="font-mono text-sm order-2 lg:order-3 text-right lg:text-left">
									{obligation.dueDate
										? new Intl.DateTimeFormat("hr-HR", {
												day: "numeric",
												month: "numeric",
												year: "numeric",
											}).format(new Date(obligation.dueDate))
										: "N/A"}
								</CustomTRItem>
								<CustomTRItem className="font-mono font-medium text-sm order-5 lg:order-4 text-right lg:text-left">
									{obligation.amount
										? new Intl.NumberFormat("hr-HR", {
												style: "currency",
												currency: "EUR",
											}).format(obligation.amount)
										: "N/A"}
								</CustomTRItem>
								<CustomTRItem className="lg:mx-auto order-5 lg:order-5">
									<Badge
										variant={obligation.status === "PENDING" ? "draft" : "paid"}
									>
										{
											obligationStatusLabels[
												obligation.status as ObligationStatus
											]
										}
									</Badge>
								</CustomTRItem>
								<CustomTRItem className="text-right flex justify-end gap-2 order-6 lg:order-6">
									<Button
										onClick={() => setSelectedObligationId(obligation.id)}
										className="bg-accent-foreground"
									>
										<QrCode />
										QR
									</Button>
									<Button
										variant="outline"
										className="bg-destructive text-white"
										onClick={() => setSelectedDeleteObligationId(obligation.id)}
									>
										<Trash2 />
									</Button>
								</CustomTRItem>
							</CustomTRow>
						);
					})}
			</CustomTable>

			{/* <Card className="p-4 mb-4">
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
									<TableCell className="text-right flex justify-end gap-2">
										<Button
											onClick={() => setSelectedObligationId(taxObligation.id)}
											className="bg-accent-foreground"
										>
											<QrCode />
											QR
										</Button>
										<Button
											variant="outline"
											className="bg-destructive text-white"
											onClick={() =>
												setSelectedDeleteObligationId(taxObligation.id)
											}
										>
											<Trash2 />
										</Button>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</Card> */}

			<CustomTable
				className="mb-4"
				columns={["0.75fr", "1fr", "0.5fr", "0.5fr", "0.75fr", "0.75fr"]}
				mobileColumns={["1fr", "1fr"]}
			>
				<CustomTHead className="mb-6">
					<div className="flex justify-between mb-4 text-sm">
						<span className="font-medium">Porez na dohodak</span>
						<span className="font-medium text-right lg:text-left">
							tromjesečno
						</span>
					</div>
				</CustomTHead>
				<CustomTRow variant="head" className="hidden lg:grid border-0!">
					<CustomTRItem>Razdoblje</CustomTRItem>
					<CustomTRItem>Obveza</CustomTRItem>
					<CustomTRItem>Rok</CustomTRItem>
					<CustomTRItem>Iznos</CustomTRItem>
					<CustomTRItem className="text-center">Status</CustomTRItem>
					<CustomTRItem className="text-right">Akcije</CustomTRItem>
				</CustomTRow>
				{taxObligations?.map((taxObligation) => {
					return (
						<CustomTRow key={taxObligation.id} className="hover:bg-transparent">
							<CustomTRItem className="font-medium font-mono text-muted text-xs">
								{(() => {
									const [month, year] = taxObligation.periodLabel.split("/");

									return new Intl.DateTimeFormat("hr-HR", {
										month: "long",
										year: "numeric",
									}).format(new Date(Number(year), Number(month) - 1));
								})()}
							</CustomTRItem>
							<CustomTRItem className="font-medium text-sm text-right lg:text-left">
								{obligationLabels[taxObligation.kind as ObligationKind]}
							</CustomTRItem>
							<CustomTRItem className="font-mono text-sm">
								{taxObligation.dueDate
									? new Intl.DateTimeFormat("hr-HR", {
											day: "numeric",
											month: "numeric",
											year: "numeric",
										}).format(new Date(taxObligation.dueDate))
									: "N/A"}
							</CustomTRItem>
							<CustomTRItem className="font-mono font-medium text-sm text-right lg:text-left">
								{taxObligation.amount
									? new Intl.NumberFormat("hr-HR", {
											style: "currency",
											currency: "EUR",
										}).format(taxObligation.amount)
									: "N/A"}
							</CustomTRItem>
							<CustomTRItem className="lg:mx-auto">
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
							</CustomTRItem>
							<CustomTRItem className="text-right flex justify-end gap-2">
								<Button
									onClick={() => setSelectedObligationId(taxObligation.id)}
									className="bg-accent-foreground"
								>
									<QrCode />
									QR
								</Button>
								<Button
									variant="outline"
									className="bg-destructive text-white"
									onClick={() =>
										setSelectedDeleteObligationId(taxObligation.id)
									}
								>
									<Trash2 />
								</Button>
							</CustomTRItem>
						</CustomTRow>
					);
				})}
			</CustomTable>

			<CustomTable
				className="mb-4"
				columns={["0.75fr", "1fr", "0.5fr", "0.5fr", "0.75fr", "0.75fr"]}
				mobileColumns={["1fr", "1fr"]}
			>
				<CustomTHead className="mb-6">
					<div className="flex justify-between mb-4 text-sm">
						<span className="font-medium">PDV i EU izvještavanje</span>
						<span className="font-medium text-right lg:text-left">
							samo ako imaš B2B klijente iz EU
						</span>
					</div>
					<div className="flex gap-2 mb-2">
						<Button
							variant="outline"
							className={
								selectedMonths.otherObligations ===
								new Intl.DateTimeFormat("hr-HR", {
									month: "2-digit",
									year: "numeric",
								}).format(new Date())
									? "bg-primary text-white"
									: ""
							}
							onClick={() =>
								setSelectedMonths((prev) => ({
									...prev,
									otherObligations: new Intl.DateTimeFormat("hr-HR", {
										month: "2-digit",
										year: "numeric",
									}).format(new Date()),
								}))
							}
						>
							Ovaj mjesec
						</Button>
						<Button
							variant="outline"
							className={
								selectedMonths.otherObligations ===
								new Intl.DateTimeFormat("hr-HR", {
									month: "2-digit",
									year: "numeric",
								}).format(
									new Date(new Date().getFullYear(), new Date().getMonth() - 1),
								)
									? "bg-primary text-white"
									: ""
							}
							onClick={() =>
								setSelectedMonths((prev) => ({
									...prev,
									otherObligations: new Intl.DateTimeFormat("hr-HR", {
										month: "2-digit",
										year: "numeric",
									}).format(
										new Date(
											new Date().getFullYear(),
											new Date().getMonth() - 1,
										),
									),
								}))
							}
						>
							Prošli mjesec
						</Button>
						<Button
							variant="outline"
							className={
								selectedMonths.otherObligations === null
									? "bg-primary text-white"
									: ""
							}
							onClick={() =>
								setSelectedMonths((prev) => ({
									...prev,
									otherObligations: null,
								}))
							}
						>
							Svi mjeseci
						</Button>
					</div>
				</CustomTHead>
				<CustomTRow variant="head" className="hidden lg:grid border-0!">
					<CustomTRItem>Razdoblje</CustomTRItem>
					<CustomTRItem>Obveza</CustomTRItem>
					<CustomTRItem>Rok</CustomTRItem>
					<CustomTRItem>Iznos</CustomTRItem>
					<CustomTRItem className="text-center">Status</CustomTRItem>
					<CustomTRItem className="text-right">Akcije</CustomTRItem>
				</CustomTRow>
				{formsObligations
					?.filter((obligation) => {
						if (!selectedMonths.otherObligations) return true;
						const [month, year] = obligation.periodLabel.split("/");
						const obligationMonth = new Intl.DateTimeFormat("hr-HR", {
							month: "2-digit",
							year: "numeric",
						}).format(new Date(Number(year), Number(month) - 1));
						return obligationMonth === selectedMonths.otherObligations;
					})
					.map((obligation) => {
						return (
							<CustomTRow key={obligation.id}>
								<CustomTRItem className="font-medium font-mono text-muted text-xs">
									{(() => {
										const [month, year] = obligation.periodLabel.split("/");

										return new Intl.DateTimeFormat("hr-HR", {
											month: "long",
											year: "numeric",
										}).format(new Date(Number(year), Number(month) - 1));
									})()}
								</CustomTRItem>
								<CustomTRItem className="font-medium text-sm text-right lg:text-left">
									{obligationLabels[obligation.kind as ObligationKind]}
								</CustomTRItem>
								<CustomTRItem className="font-mono text-sm">
									{obligation.dueDate
										? new Intl.DateTimeFormat("hr-HR", {
												day: "numeric",
												month: "numeric",
												year: "numeric",
											}).format(new Date(obligation.dueDate))
										: "N/A"}
								</CustomTRItem>
								<CustomTRItem className="font-mono font-medium text-sm text-right lg:text-left">
									{invoicesAmountsByPeriod[
										`${obligation.kind}_${obligation.periodLabel}`
									]
										? new Intl.NumberFormat("hr-HR", {
												style: "currency",
												currency: "EUR",
											}).format(
												invoicesAmountsByPeriod[
													`${obligation.kind}_${obligation.periodLabel}`
												],
											)
										: "N/A"}
								</CustomTRItem>
								<CustomTRItem className="lg:mx-auto">
									<Badge
										variant={obligation.status === "PENDING" ? "draft" : "paid"}
									>
										{
											obligationStatusLabels[
												obligation.status as ObligationStatus
											]
										}
									</Badge>
								</CustomTRItem>
								<CustomTRItem className="text-right flex justify-end gap-2">
									<Button
										onClick={() => setSelectedFormObligationId(obligation.id)}
										className="bg-accent-foreground"
									>
										<FileText />
										Obrazac
									</Button>
									<Button
										variant="outline"
										className="bg-destructive text-white"
										onClick={() => setSelectedDeleteObligationId(obligation.id)}
									>
										<Trash2 />
									</Button>
								</CustomTRItem>
							</CustomTRow>
						);
					})}
			</CustomTable>

			<ObligationDeleteForm
				obligationData={
					[
						...obligations,
						...taxObligations,
						...formsObligations,
						...otherObligations,
					].find((o) => o.id === selectedDeleteObligationId) ?? null
				}
				onClose={() => setSelectedDeleteObligationId(null)}
			/>

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
					const filingDate = new Date(
						issueDate.getFullYear(),
						issueDate.getMonth() + 1,
						1,
					);
					const invoicePeriodLabel = `${String(filingDate.getMonth() + 1).padStart(2, "0")}/${filingDate.getFullYear()}`;

					return invoicePeriodLabel === selectedObligation.periodLabel;
				})}
				business={business}
				user={user}
				onClose={() => setSelectedFormObligationId(null)}
			/>
		</>
	);
}
