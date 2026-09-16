import ClientForm from "@/features/clients/components/client-form";
import { AvatarPlaceholder } from "@/components/ui/avatar-placeholder";
import { Card, CardContent, CardContentRow } from "@/components/ui/card";
import ClientDeleteForm from "@/features/clients/components/client-delete-form";
import { getClientById } from "@/features/clients/queries";
import Link from "next/link";

export default async function ClientPage({
	params,
}: {
	params: { id: string };
}) {
	const id = (await params).id;
	const client = await getClientById(id);

	return (
		<div>
			<div className="flex items-end justify-between mb-8">
				<div className="flex flex-col">
					<Link
						href="/clients"
						className="text-muted text-sm mb-1 hover:underline"
					>
						&larr; Povratak na listu klijenata
					</Link>
					<h1 className="page-title">Klijent</h1>
					<span className="font-mono text-sm">
						{client?.companyName}, {client?.oib}
					</span>
				</div>
				<ClientDeleteForm clientId={client?.id || ""} />
			</div>
			<div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-4">
				<ClientForm clientData={client} />
				<div>
					<div className="text-xs tracking-wider uppercase mb-2 text-muted">
						Pregled kartice
					</div>
					<Card key={client?.id}>
						<CardContent>
							<div className="flex items-center gap-2">
								<AvatarPlaceholder
									firstname={client?.contactFirstName || ""}
									surname={client?.contactLastName || ""}
									className="rounded-lg bg-primary text-white"
								/>

								<div className="flex flex-col">
									<p className="text-sm font-semibold">{client?.companyName}</p>
									{client?.oib && (
										<span className="text-muted text-xs font-mono">
											OIB: {client?.oib}
										</span>
									)}
								</div>
							</div>
							<div className="mt-4">
								<CardContentRow>
									<span className="text-muted text-sm">Ukupno fakturirano</span>
									<span className="text-sm font-mono">
										{client?.invoices
											.reduce(
												(total, invoice) => total + invoice.totalAmount,
												0,
											)
											.toLocaleString("hr-HR", {
												style: "currency",
												currency: "EUR",
											})}
									</span>
								</CardContentRow>
								<CardContentRow>
									<span className="text-muted text-sm">Kontakt osoba</span>
									<span className="text-sm font-mono">
										{client?.contactFirstName} {client?.contactLastName}
									</span>
								</CardContentRow>
								<CardContentRow>
									<span className="text-muted text-sm">Zadnji račun</span>
									<span className="text-sm font-mono">
										{client?.invoices.length
											? new Date(
													client.invoices[client.invoices.length - 1].issueDate,
												).toLocaleDateString("hr-HR")
											: "-"}
									</span>
								</CardContentRow>
								<CardContentRow>
									<span className="text-muted text-sm">Broj računa</span>
									<span className="text-sm font-mono">
										{client?.invoices.length || 0}
									</span>
								</CardContentRow>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
