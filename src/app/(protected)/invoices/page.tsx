import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Edit2, MoreHorizontalIcon, Plus } from "lucide-react";
import Link from "next/link";
import InvoiceDeleteForm from "@/features/invoices/components/invoice-delete-form";
import { Badge } from "@/components/ui/badge";
import { getEffectiveStatus } from "@/features/invoices/utils";

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
	const clients = await getUserClients();

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
					className="h-10 mb-4 flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition"
				>
					<Plus />
					Novi račun
				</Link>
			</div>

			<div className="flex justify-between items-center mb-4">
				<div className="flex gap-2">
					<Link
						key="ALL"
						href={`/invoices${search ? `?search=${encodeURIComponent(search)}` : ""}`}
						className={`${!status ? "bg-primary text-white" : "bg-white"}  rounded-lg px-2.5 py-2 text-sm`}
					>
						Svi
					</Link>
					{(Object.keys(statusLabels) as InvoiceFilterStatus[]).map(
						(statusLable) => (
							<Link
								key={statusLable}
								href={`/invoices?status=${statusLable}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
								className={`${status === statusLable ? "bg-primary text-white" : "bg-white"}  rounded-lg px-2.5 py-2 text-sm`}
							>
								{statusLabels[statusLable]}
							</Link>
						),
					)}
				</div>
				<form method="get" className="no-wrapper">
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

			<Card className="p-4">
				<Table>
					<TableHeader>
						<TableRow className="uppercase hover:bg-transparent">
							<TableHead>Broj</TableHead>
							<TableHead>Klijent</TableHead>
							<TableHead>Datum izdavanja</TableHead>
							<TableHead>Dospijeće</TableHead>
							<TableHead>Iznos</TableHead>
							<TableHead className="text-right">Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{result.invoices?.map((invoice) => (
							<TableRow key={invoice.id} className="hover:bg-transparent">
								<TableCell className="font-medium font-mono text-muted">
									<Link
										href={`/invoices/${invoice.id}`}
										className="text-primary underline"
									>
										{invoice.invoiceNumber}
									</Link>
								</TableCell>
								<TableCell className="font-medium">
									{invoice.client.companyName}
								</TableCell>
								<TableCell className="font-mono">
									{invoice.dueDate
										? new Intl.DateTimeFormat("hr-HR", {
												day: "numeric",
												month: "numeric",
												year: "numeric",
											}).format(new Date(invoice.dueDate))
										: "N/A"}
								</TableCell>
								<TableCell className="font-mono">
									{invoice.issueDate
										? new Intl.DateTimeFormat("hr-HR", {
												day: "numeric",
												month: "numeric",
												year: "numeric",
											}).format(new Date(invoice.issueDate))
										: "N/A"}
								</TableCell>
								<TableCell className="font-mono font-medium">
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
								<TableCell className="text-right">
									<DropdownMenu>
										<DropdownMenuTrigger
											render={
												<Button variant="ghost" size="icon" className="size-8">
													<MoreHorizontalIcon />
													<span className="sr-only">Open menu</span>
												</Button>
											}
										/>
										<DropdownMenuContent align="end">
											<DropdownMenuItem>
												<Link
													href={`/invoices/${invoice.id}`}
													className="flex w-full"
												>
													<Edit2 className="mr-2" />
													Uredi
												</Link>
											</DropdownMenuItem>
											<DropdownMenuSeparator />
											<InvoiceDeleteForm
												invoiceId={invoice.id}
												variant="ghost"
											/>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Card>
			{(result.totalPages ?? 1) > 1 && (
				<div className="flex justify-center mt-8 gap-2">
					{Array.from({ length: result.totalPages ?? 0 }).map((_, index) => (
						<Link
							key={index}
							href={`?page=${index + 1}${status ? `&status=${status}` : ""}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
							className="px-3 py-1 border rounded hover:bg-white"
						>
							{index + 1}
						</Link>
					))}
				</div>
			)}
		</>
	);
}
