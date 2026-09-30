import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ObligationTable } from "@/features/obligations/components/obligation-table";

import { obligationLabels } from "@/features/obligations/constants";
import { getCurrentBusiness } from "@/features/business/queries";
import {
	getUserObligations,
	getUserTaxObligations,
	getUserFormsObligations,
	getOtherObligations,
	getMonthlyObligationsAmount,
} from "@/features/obligations/queries";
import { ObligationKind } from "@/generated/prisma";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getInvoices, getInvoicesAmounts } from "@/features/invoices/queries";
import { EU_COUNTRY_CODES } from "@/features/invoices/constants";
import { Progress } from "@/components/ui/progress";
import { DownloadKpr } from "@/features/obligations/components/kpr-pdf";
import { getCurrentUser } from "@/features/dashboard/queries";

export default async function ObligationsPage({
	searchParams,
}: {
	searchParams: Promise<{
		search?: string;
		page?: number;
		status?: ObligationKind;
	}>;
}) {
	const { search, status } = await searchParams;
	const page = Math.max(Number((await searchParams).page) || 1, 1);
	const [
		obligations,
		taxObligations,
		formsObligations,
		otherObligations,
		business,
		invoices,
		monthlyObligationsAmount,
		user,
	] = await Promise.all([
		getUserObligations(),
		getUserTaxObligations(),
		getUserFormsObligations(),
		getOtherObligations(),
		getCurrentBusiness(),
		getInvoices(),
		getMonthlyObligationsAmount(),
		getCurrentUser(),
	]);

	const invoicesAmountsByPeriod = Object.fromEntries(
		await Promise.all(
			(formsObligations ?? []).map(async (obligation) => {
				const [month, year] = obligation.periodLabel.split("/");
				// periodLabel is the filing month; the invoices belong to the month before it.
				const countryFilter =
					obligation.kind === "ZP_FORM"
						? { vatCountryCode: { in: EU_COUNTRY_CODES } }
						: obligation.kind === "PDV_FORM"
							? { vatCountryCode: { not: "HR" } }
							: undefined;
				const amounts = await getInvoicesAmounts(
					new Date(Number(year), Number(month) - 2),
					countryFilter,
				);

				return [
					`${obligation.kind}_${obligation.periodLabel}`,
					amounts.selectedMonthPaidAmount ?? 0,
				];
			}),
		),
	);

	return (
		<>
			<div className="flex justify-between mb-8">
				<div className="flex flex-col">
					<h1 className="page-title">Obveze</h1>
					<span className="font-mono text-sm">
						Porezni kalendar — {new Date().getFullYear()}.
					</span>
				</div>
				<Link
					href="/obligations/new"
					className="h-10 mb-4 flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition"
				>
					<Plus />
					Nova obveza
				</Link>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
				<Card>
					<CardHeader>
						<CardTitle className="font-mono uppercase text-muted text-xs tracking-wider">
							Mjesečna obveza (MIO I + MIO II + ZO)
						</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col">
						<span className="font-mono text-2xl font-semibold">
							{monthlyObligationsAmount?._sum?.amount
								? new Intl.NumberFormat("hr-HR", {
										style: "currency",
										currency: "EUR",
									}).format(Number(monthlyObligationsAmount?._sum?.amount ?? 0))
								: "N/A"}
						</span>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="font-mono uppercase text-muted text-xs tracking-wider">
							Sljedeći rok
						</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col">
						<span className="font-mono text-2xl font-semibold">
							15.{String(new Date().getMonth() + 2).padStart(2, "0")}
						</span>
						<span className="text-muted text-xs font-normal">
							doprinosi za{" "}
							{new Date(
								new Date().getFullYear(),
								new Date().getMonth(),
							).toLocaleString("hr-HR", { month: "long" })}{" "}
							2026.
						</span>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="font-mono uppercase text-muted text-xs tracking-wider">
							Porez na dohodak (tromjesečno)
						</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col">
						<span className="font-mono text-2xl font-semibold">
							{taxObligations?.[0]?.amount
								? new Intl.NumberFormat("hr-HR", {
										style: "currency",
										currency: "EUR",
									}).format(taxObligations[0].amount)
								: "N/A"}
						</span>
						<span className="text-muted text-xs font-normal">
							sljedeći rok:{" "}
							{new Date(
								taxObligations?.[0]?.dueDate ?? "N/A",
							).toLocaleDateString("hr-HR") ?? "N/A"}
							.
						</span>
					</CardContent>
				</Card>
			</div>

			<ObligationTable
				obligations={obligations ?? []}
				taxObligations={taxObligations ?? []}
				formsObligations={formsObligations ?? []}
				otherObligations={otherObligations ?? []}
				business={business}
				invoices={invoices?.invoices ?? []}
				invoicesAmountsByPeriod={invoicesAmountsByPeriod}
				user={user ?? null}
			/>
		</>
	);
}
