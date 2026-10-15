import { AvatarPlaceholder } from "@/components/ui/avatar-placeholder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardContentRow } from "@/components/ui/card";
import { getUserClients } from "@/features/clients/queries";
import { getInvoices } from "@/features/invoices/queries";
import { Invoice } from "@/features/invoices/types";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function ClientsPage() {
	const [clients, invoices] = await Promise.all([
		getUserClients(),
		getInvoices(),
	]);

	const invoicesByClient = new Map<string, Invoice[]>();
	for (const invoice of invoices.invoices as Invoice[]) {
		const clientInvoices = invoicesByClient.get(invoice.clientId) ?? [];
		clientInvoices.push(invoice);
		invoicesByClient.set(invoice.clientId, clientInvoices);
	}

	return (
		<>
			<div className="flex justify-between mb-4">
				<div className="flex flex-col mb-8">
					<h1 className="page-title">Klijenti</h1>
					<span className="font-mono text-sm">
						{clients?.length} aktivnih klijenata
					</span>
				</div>
				<Link
					href="/clients/new"
					className="fixed bottom-16 right-2.5 lg:static z-10 h-10 mb-4 flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition"
				>
					<Plus />
					<span className="hidden lg:inline">Novi klijent</span>
				</Link>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{clients?.map((client) => {
					const clientInvoices = invoicesByClient.get(client.id) ?? [];
					const totalAmount = clientInvoices.reduce(
						(total, invoice) => total + invoice.totalAmount,
						0,
					);
					const lastInvoice = [...clientInvoices].sort(
						(a, b) =>
							new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime(),
					)[0];

					return (
						<Link key={client.id} href={`/clients/${client.id}`}>
							<Card key={client.id}>
								<CardContent>
									<div className="flex items-center gap-2">
										<AvatarPlaceholder
											firstname={client.contactFirstName || ""}
											surname={client.contactLastName || ""}
											className="rounded-lg bg-primary text-white"
										/>
										<div className="flex flex-col flex-1">
											<p className="text-sm font-semibold">
												{client.companyName}
											</p>
											{client.oib && (
												<span className="text-muted text-xs font-mono">
													OIB: {client.oib}
												</span>
											)}
										</div>
									</div>
									<div className="mt-4">
										<CardContentRow>
											<span className="text-muted text-sm">
												Ukupno fakturirano
											</span>
											<span className="text-sm font-mono">
												{totalAmount.toLocaleString("hr-HR", {
													style: "currency",
													currency: "EUR",
												})}
											</span>{" "}
										</CardContentRow>
										<CardContentRow>
											<span className="text-muted text-sm">Kontakt osoba</span>
											<span className="text-sm font-mono text-right">
												{client.contactFirstName} {client.contactLastName}
											</span>
										</CardContentRow>
										<CardContentRow>
											<span className="text-muted text-sm">Zadnji račun</span>
											<span className="text-sm font-mono">
												{lastInvoice
													? new Date(lastInvoice.issueDate).toLocaleDateString(
															"hr-HR",
														)
													: "-"}
											</span>
										</CardContentRow>
										<CardContentRow>
											<span className="text-muted text-sm">Broj računa</span>
											<span className="text-sm font-mono">
												{clientInvoices.length}
											</span>
										</CardContentRow>
									</div>
								</CardContent>
							</Card>
						</Link>
					);
				})}
			</div>
		</>
	);
}
