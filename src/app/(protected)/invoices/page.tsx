import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getCurrentSettings } from "@/features/settings/queries";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { getUserClients } from "@/features/clients/queries";
import {
	InvoiceFilterStatus,
	statusLabels,
} from "@/features/invoices/constants";
import { getInvoices } from "@/features/invoices/queries";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getEffectiveStatus } from "@/features/invoices/utils";
import { InvoiceActions } from "@/features/invoices/components/invoice-actions";
import { getCurrentBusiness } from "@/features/business/queries";
import {
	CustomTable,
	CustomTRow,
	CustomTRItem,
} from "@/components/ui/custom-table";

export default async function InvoicesPage({
	searchParams,
}: {
	searchParams: Promise<{
		search?: string;
		page?: number;
		status?: InvoiceFilterStatus;
	}>;
}) {
	const { search, status } = await searchParams;
	const page = Math.max(Number((await searchParams).page) || 1, 1);

	const result = await getInvoices(search, page, 10, status);
	const settingsData = await getCurrentSettings();
	const businessData = await getCurrentBusiness();

	return (
		<>
			<div className="flex justify-between mb-8">
				<div className="flex flex-col">
					<h1 className="page-title">Računi</h1>
					<span className="font-mono text-sm">
						{result.total} računa ove godine
					</span>
				</div>
				<Link
					href="/invoices/new"
					className="fixed bottom-16 right-2.5 lg:static z-10 h-10 mb-4 flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition"
				>
					<Plus />
					<span className="hidden lg:inline">Novi račun</span>
				</Link>
			</div>

			<div className="xl:flex flex-wrap justify-between items-center mb-4 gap-4">
				<div className="flex flex-wrap mb-4 xl:mb-0 gap-2 order-2 lg:order-1">
					<Link
						key="ALL"
						href={`/invoices${search ? `?search=${encodeURIComponent(search)}` : ""}`}
						className={`${!status ? "bg-primary text-white" : "bg-white"} flex items-center rounded-lg py-1 text-xs px-2.5 lg:py-2 lg:text-sm`}
					>
						Svi
					</Link>
					{(Object.keys(statusLabels) as InvoiceFilterStatus[]).map(
						(statusLable) => (
							<Link
								key={statusLable}
								href={`/invoices?status=${statusLable}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
								className={`${status === statusLable ? "bg-primary text-white" : "bg-white"} flex items-center rounded-lg py-1 text-xs px-2.5 lg:py-2 lg:text-sm`}
							>
								{statusLabels[statusLable]}
							</Link>
						),
					)}
				</div>
				<form
					method="get"
					className="no-wrapper w-full lg:w-auto order-1 lg:order-2"
				>
					{status && <input type="hidden" name="status" value={status} />}
					<div className="flex items-center">
						<Input
							name="search"
							placeholder="Pretraži klijenta ili broj..."
							defaultValue={search}
							className="w-full bg-white"
						/>
						<Button type="submit" className="ml-2 h-10" size="lg">
							Pretraži
						</Button>
					</div>
				</form>
			</div>

			<CustomTable
				className="mt-4 lg:mt-8"
				columns={[
					"0.25fr",
					"1fr",
					"0.5fr",
					"0.5fr",
					"0.5fr",
					"0.5fr",
					"0.25fr",
				]}
				mobileColumns={["1fr", "0.75fr"]}
			>
				<CustomTRow variant="head" className="hidden lg:grid">
					<CustomTRItem>Broj</CustomTRItem>
					<CustomTRItem>Klijent</CustomTRItem>
					<CustomTRItem>Datum izdavanja</CustomTRItem>
					<CustomTRItem>Dospijeće</CustomTRItem>
					<CustomTRItem>Iznos</CustomTRItem>
					<CustomTRItem className="text-right">Status</CustomTRItem>
					<CustomTRItem className="text-right">Akcije</CustomTRItem>
				</CustomTRow>
				{result.invoices?.map((invoice) => (
					<CustomTRow key={invoice.id}>
						<CustomTRItem className="order-3 lg:order-1 text-muted text-xs lg:text-sm">
							<Link
								href={`/invoices/${invoice.id}`}
								className="text-primary underline"
							>
								{invoice.invoiceNumber}
								<span className="lg:hidden">
									{" "}
									·{" "}
									{invoice.issueDate
										? new Intl.DateTimeFormat("hr-HR", {
												day: "numeric",
												month: "numeric",
												year: "numeric",
											}).format(new Date(invoice.issueDate))
										: "N/A"}
								</span>
							</Link>
						</CustomTRItem>
						<CustomTRItem className="order-1 lg:order-2 text-sm font-medium">
							{invoice.client.companyName}
						</CustomTRItem>
						<CustomTRItem className="hidden lg:block lg:order-3 text-sm font-mono">
							{invoice.issueDate
								? new Intl.DateTimeFormat("hr-HR", {
										day: "numeric",
										month: "numeric",
										year: "numeric",
									}).format(new Date(invoice.issueDate))
								: "N/A"}
						</CustomTRItem>
						<CustomTRItem className="hidden lg:block lg:order-4 text-sm font-mono">
							{invoice.dueDate
								? new Intl.DateTimeFormat("hr-HR", {
										day: "numeric",
										month: "numeric",
										year: "numeric",
									}).format(new Date(invoice.dueDate))
								: "N/A"}
						</CustomTRItem>
						<CustomTRItem className="order-2 text-right lg:text-left lg:order-5 font-mono text-sm font-medium">
							{invoice.totalAmount.toLocaleString("hr-HR", {
								style: "currency",
								currency: "EUR",
							})}
						</CustomTRItem>
						<CustomTRItem className="order-4 lg:order-6">
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
						</CustomTRItem>
						<CustomTRItem className="text-right hidden lg:block lg:order-7">
							<InvoiceActions
								invoiceData={invoice}
								settingsData={settingsData}
								businessData={businessData}
							/>
						</CustomTRItem>
					</CustomTRow>
				))}
			</CustomTable>

			{(result.totalPages ?? 1) > 1 && (
				<div className="flex justify-center mt-8 gap-2">
					{Array.from({ length: result.totalPages ?? 0 }).map((_, index) => (
						<Link
							key={index}
							href={`?page=${index + 1}${status ? `&status=${status}` : ""}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
							className={`px-3 py-1 border rounded hover:bg-white ${
								page === index + 1 ? "bg-white" : ""
							}`}
						>
							{index + 1}
						</Link>
					))}
				</div>
			)}
		</>
	);
}
