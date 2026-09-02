import ObligationForm from "@/features/obligations/components/obligations-form";
import Link from "next/link";

export default function NewObligationPage() {
	return (
		<>
			<div className="flex items-end justify-between mb-8">
				<div className="flex flex-col">
					<Link
						href="/obligations"
						className="text-muted text-sm mb-1 hover:underline"
					>
						&larr; Povratak na listu obveza
					</Link>
					<h1 className="page-title">Nova obveza</h1>
					<span className="font-mono text-sm">
						Ručno dodana obveza — prikazuje se u popisu obveza
					</span>
				</div>
			</div>
			<ObligationForm />
		</>
	);
}
