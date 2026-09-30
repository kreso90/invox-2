"use client";
import { useActionState, useState } from "react";
import { deleteClient } from "../actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

export default function ClientDeleteForm({ clientId }: { clientId: string }) {
	const [state, formAction, isPending] = useActionState(deleteClient, null);
	const [open, setOpen] = useState(false);

	return (
		<>
			<Button
				size="lg"
				variant="destructive"
				type="button"
				onClick={() => setOpen(true)}
				disabled={isPending}
				className="btn btn-destructive btn-lg"
			>
				<Trash2 />
				Izbriši klijenta
			</Button>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Izbriši klijenta</DialogTitle>

						<DialogDescription>
							Jeste li sigurni da želite izbrisati klijenta?
						</DialogDescription>
					</DialogHeader>

					<form action={formAction} className="no-wrapper">
						<input type="hidden" name="clientId" value={clientId} />

						<DialogFooter className="mt-4">
							<Button
								type="button"
								size="lg"
								variant="outline"
								onClick={() => setOpen(false)}
							>
								Odustani
							</Button>

							<Button
								variant="destructive"
								size="lg"
								type="submit"
								disabled={isPending}
							>
								<Trash2 />
								Izbriši klijenta
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
}
