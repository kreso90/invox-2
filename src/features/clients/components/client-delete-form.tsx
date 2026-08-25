"use client";
import { useActionState } from "react";
import { deleteClient } from "../actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function ClientDeleteForm({ clientId }: { clientId: string }) {
	const [state, formAction, isPending] = useActionState(deleteClient, null);
	return (
		<form action={formAction} className="button-form">
			<input type="hidden" name="clientId" value={clientId} />
			<Button
				size="lg"
				variant="destructive"
				type="submit"
				disabled={isPending}
				className="btn btn-destructive btn-lg"
			>
				<Trash2 />
				Izbriši klijenta
			</Button>
		</form>
	);
}
