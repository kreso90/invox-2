import { AvatarPlaceholder } from "@/components/ui/avatar-placeholder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardContentRow } from "@/components/ui/card";
import { getUserClients } from "@/features/clients/queries";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function ClientsPage() {
	const clients = await getUserClients();

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
					className="h-10 mb-4 flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition"
				>
					<Plus />
					Novi klijent
				</Link>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{clients?.map((client) => (
					<Link key={client.id} href={`/clients/${client.id}`}>
						<Card key={client.id}>
							<CardContent>
								<div className="flex items-center gap-2">
									<AvatarPlaceholder
										firstname={client.contactFirstName || ""}
										surname={client.contactLastName || ""}
										className="rounded-lg bg-primary text-white"
									/>
									<div className="flex flex-col">
										<p className="text-sm font-semibold">
											{client.companyName}
										</p>
										<span className="text-muted text-xs font-mono">
											OIB: {client.oib}
										</span>
									</div>
								</div>
								<div className="mt-4">
									<CardContentRow>
										<span className="text-muted text-sm">
											Ukupno fakturirano
										</span>
										<span className="text-sm font-mono">5.340,00 €</span>
									</CardContentRow>
									<CardContentRow>
										<span className="text-muted text-sm">Kontakt osoba</span>
										<span className="text-sm font-mono">
											{client.contactFirstName} {client.contactLastName}
										</span>
									</CardContentRow>
									<CardContentRow>
										<span className="text-muted text-sm">Zadnji račun</span>
										<span className="text-sm font-mono">14.08.2026.</span>
									</CardContentRow>
									<CardContentRow>
										<span className="text-muted text-sm">Broj računa</span>
										<span className="text-sm font-mono">7</span>
									</CardContentRow>
								</div>
							</CardContent>
						</Card>
					</Link>
				))}
			</div>
		</>
	);
}
