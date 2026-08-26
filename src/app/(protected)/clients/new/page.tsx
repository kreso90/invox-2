import ClientForm from "@/features/clients/components/client-form";
import Link from "next/link";

export default function NewClientPage() {
	return (
		<>
			<div className="flex items-end justify-between mb-8">
				<div className="flex flex-col">
					<Link
						href="/clients"
						className="text-muted text-sm mb-1 hover:underline"
					>
						&larr; Povratak na listu klijenata
					</Link>
					<h1 className="page-title">Novi klijent</h1>
					<span className="font-mono text-sm">
						Podaci se koriste na računima
					</span>
				</div>
			</div>
			<ClientForm />
		</>
	);
}
