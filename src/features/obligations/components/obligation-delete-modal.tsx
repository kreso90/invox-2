"use client";
import { useActionState, useEffect } from "react";

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
import { Obligation } from "@/generated/prisma";
import { toast } from "@/components/ui/toast";
import { deleteObligation } from "../actions";

interface ObligationDeleteFormProps {
	obligationData: Obligation | null;
	onClose: () => void;
}

export default function ObligationDeleteForm({
	obligationData,
	onClose,
}: ObligationDeleteFormProps) {
	const [state, formAction, isPending] = useActionState(deleteObligation, null);

	useEffect(() => {
		if (state?.status === "success") {
			toast.add({
				type: "success",
				description: "Obveza je uspješno izbrisana.",
			});

			onClose();
		}
	}, [state?.status, state?.message]);
	return (
		<Dialog open={!!obligationData} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Izbriši obvezu</DialogTitle>

					<DialogDescription>
						Jeste li sigurni da želite izbrisati obvezu?
					</DialogDescription>
				</DialogHeader>

				<form action={formAction} className="no-wrapper">
					<input
						type="hidden"
						name="obligationId"
						value={obligationData?.id ?? ""}
					/>

					<DialogFooter className="mt-4">
						<Button
							type="button"
							size="lg"
							variant="outline"
							onClick={() => onClose()}
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
							Izbriši obvezu
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
