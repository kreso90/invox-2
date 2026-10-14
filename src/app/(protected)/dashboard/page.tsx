import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { getCurrentBusiness } from "@/features/business/queries";
import { getCurrentUser } from "@/features/dashboard/queries";
import {
	getDueInvoices,
	getInvoices,
	getInvoicesAmounts,
} from "@/features/invoices/queries";
import { statusLabels } from "@/features/invoices/constants";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getEffectiveStatus } from "@/features/invoices/utils";
import { Plus } from "lucide-react";
import { getDueObligations } from "@/features/obligations/queries";

export default async function DashboardPage() {
	const [
		userData,
		businessData,
		invoicesData,
		amountsData,
		dueInvoices,
		dueObligations,
	] = await Promise.all([
		getCurrentUser(),
		getCurrentBusiness(),
		getInvoices(undefined, 1, 5),
		getInvoicesAmounts(),
		getDueInvoices(),
		getDueObligations(),
	]);

	const currentAnnualThreshold = amountsData.currentYearIssuedAmount ?? 0;
	const thresholdLeft = businessData?.annual_threshold
		? businessData.annual_threshold - currentAnnualThreshold
		: 0;
	const thresholdPercentage =
		(currentAnnualThreshold / (businessData?.annual_threshold ?? 1)) * 100;

	const currentMonth = new Intl.DateTimeFormat("hr-HR", {
		month: "long",
	}).format(new Date());

	const previousMonth = new Intl.DateTimeFormat("hr-HR", {
		month: "long",
	}).format(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1));

	const currentDate = new Intl.DateTimeFormat("hr-HR", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric",
	}).format(new Date());

	const current = amountsData.currentMonthPaidAmount ?? 0;
	const previous = amountsData.previousMonthPaidAmount ?? 0;

	const upcomingDeadlines = [
		...(dueInvoices ?? []).map((invoice) => ({
			id: invoice.id,
			type: "invoice" as const,
			title: `${invoice.client.companyName} - račun ${invoice.invoiceNumber}`,
			dueDate: invoice.dueDate,
		})),
		...(dueObligations ?? []).map((obligation) => ({
			id: obligation.id,
			type: "obligation" as const,
			title: obligation.name,
			dueDate: obligation.dueDate,
		})),
	].sort(
		(a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
	);

	const percentageText =
		previous === 0 && current > 0
			? ""
			: previous === 0 && current === 0
				? "Isto kao prošli mjesec"
				: current > previous
					? `↑ ${(((current - previous) / previous) * 100).toFixed(0)}% više u odnosu na ${previousMonth}`
					: current < previous
						? `${(((previous - current) / previous) * 100).toFixed(0)}% manje u odnosu na ${previousMonth}`
						: "Isto kao prošli mjesec";
	return (
		<>
			<div className="flex justify-between items-end mb-8">
				<div>
					<h1 className="page-title">Pozdrav, {userData?.name}</h1>
					<span className="font-mono text-sm">{currentDate}</span>
				</div>

				<Link
					href="/invoices/new"
					className="h-10 mb-4 flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition"
				>
					<Plus />
					Novi račun
				</Link>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
				<Card>
					<CardHeader>
						<CardTitle className="font-mono uppercase text-muted text-xs tracking-wider">
							Fakturirano — {currentMonth}
						</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col">
						<span className="font-mono text-2xl font-semibold">
							{amountsData.currentMonthPaidAmount?.toLocaleString("hr-HR", {
								style: "currency",
								currency: "EUR",
							})}
						</span>
						<span className="text-muted text-xs font-normal">
							{percentageText}
						</span>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="font-mono uppercase text-muted text-xs tracking-wider">
							Neplaćeno
						</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col">
						<span className="font-mono text-2xl font-semibold">
							{amountsData.unpaidAmount?.toLocaleString("hr-HR", {
								style: "currency",
								currency: "EUR",
							})}
						</span>
						<span className="text-muted text-xs font-normal">
							{amountsData.invoiceUnpaid ?? 0} računa čekaju uplatu
						</span>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="font-mono uppercase text-muted text-xs tracking-wider">
							Godišnji prag paušalnog oporezivanja
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-center justify-between">
							<div className="font-mono text-xl font-semibold">
								{currentAnnualThreshold.toLocaleString("hr-HR", {
									style: "currency",
									currency: "EUR",
								})}{" "}
								/{" "}
								<span className="text-muted text-sm font-normal">
									{businessData?.annual_threshold?.toLocaleString("hr-HR", {
										style: "currency",
										currency: "EUR",
									})}
								</span>
							</div>
							<div className="text-muted text-xs">
								preostalo{" "}
								{thresholdLeft.toLocaleString("hr-HR", {
									style: "currency",
									currency: "EUR",
								})}
							</div>
						</div>
						<Progress
							value={thresholdPercentage}
							locale="hr-HR"
							className="h-5 mt-4"
						></Progress>
						<div className="flex justify-between text-xxs text-muted mt-1 font-mono">
							<span>
								{(0).toLocaleString("hr-HR", {
									style: "currency",
									currency: "EUR",
								})}
							</span>
							<span>
								{(businessData?.annual_threshold
									? businessData.annual_threshold / 2
									: 0
								).toLocaleString("hr-HR", {
									style: "currency",
									currency: "EUR",
								})}
							</span>
							<span>
								{businessData?.annual_threshold?.toLocaleString("hr-HR", {
									style: "currency",
									currency: "EUR",
								})}
							</span>
						</div>
					</CardContent>
				</Card>
			</div>
			<div className="lg:grid lg:grid-cols-[1.7fr_1fr] gap-4">
				<Card className="p-4">
					<div className="flex items-center justify-between mb-4">
						<span className="font-semibold">Nedavni računi</span>
						<Link href="/invoices" className="text-muted text-xs font-semibold">
							Svi računi →
						</Link>
					</div>
					<Table>
						<TableHeader>
							<TableRow className="uppercase pointer-events-none">
								<TableHead className="w-25">Broj</TableHead>
								<TableHead>Klijenti</TableHead>
								<TableHead>Datum</TableHead>
								<TableHead className="text-right">Iznos</TableHead>
								<TableHead className="text-right">Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{invoicesData.invoices.map((invoice) => (
								<TableRow key={invoice.id} className="hover:bg-transparent">
									<TableCell className="font-medium font-mono">
										<Link href={`/invoices/${invoice.id}`}>
											{invoice.invoiceNumber}
										</Link>
									</TableCell>
									<TableCell className="font-medium">
										{invoice.client.companyName}
									</TableCell>
									<TableCell className="font-mono">
										{new Date(invoice.issueDate).toLocaleDateString("hr-HR")}
									</TableCell>
									<TableCell className="text-right font-mono">
										{invoice.totalAmount.toLocaleString("hr-HR", {
											style: "currency",
											currency: "EUR",
										})}
									</TableCell>
									<TableCell className="text-right">
										<Badge
											className="ml-auto"
											variant={`${
												getEffectiveStatus(invoice).toLowerCase() as
													| "paid"
													| "issued"
													| "draft"
													| "overdue"
													| "partially_paid"
													| "cancelled"
											}`}
										>
											{statusLabels[getEffectiveStatus(invoice)]}
										</Badge>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Card>

				<Card className="p-4">
					<div className="font-semibold">Rokovi</div>
					<ul className="mt-4 space-y-2">
						{upcomingDeadlines.map((deadline) => {
							const today = new Date();
							today.setHours(0, 0, 0, 0);

							const dueDate = new Date(deadline.dueDate);
							dueDate.setHours(0, 0, 0, 0);

							const daysUntilDue = Math.ceil(
								(dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
							);

							const isOverdue = daysUntilDue < 0;

							const daysLabel = isOverdue
								? `${Math.abs(daysUntilDue)} ${
										Math.abs(daysUntilDue) === 1 ? "dan" : "dana"
									} u kašnjenju`
								: daysUntilDue === 0
									? "Danas"
									: `${daysUntilDue} ${daysUntilDue === 1 ? "dan" : "dana"}`;

							return (
								<li
									key={`${deadline.type}-${deadline.id}`}
									className="flex items-center justify-between border-b border-border pb-2"
								>
									<div className="flex flex-col">
										<span className="font-semibold">{deadline.title}</span>

										<span className="text-muted text-xxs font-mono">
											{isOverdue ? "rok prošao" : "dospijeva"}{" "}
											{dueDate.toLocaleDateString("hr-HR")}
										</span>
									</div>

									<span
										className={
											isOverdue
												? "text-destructive bg-destructive-foreground px-2 py-1 text-sm rounded"
												: "text-warning bg-warning-foreground px-2 py-1 text-sm rounded"
										}
									>
										{daysLabel}
									</span>
								</li>
							);
						})}
					</ul>
				</Card>
			</div>
		</>
	);
}
