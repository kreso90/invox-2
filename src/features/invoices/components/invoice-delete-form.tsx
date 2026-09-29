"use client";
import { useActionState, useEffect } from "react";
import { deleteInvoice } from "../actions";
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
import { Prisma } from "@/generated/prisma/edge";
import { toast } from "@/components/ui/toast";

interface InvoiceDeleteFormProps {
	invoiceData: InvoiceWithClient | null;
	variant?: "destructive" | "ghost";
	size?: "sm" | "md" | "lg";
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

type InvoiceWithClient = Prisma.InvoiceGetPayload<{
	include: { client: true; invoicePayments: true };
}>;

export default function InvoiceDeleteForm({
	invoiceData,
	variant,
	size,
	open,
	onOpenChange,
}: InvoiceDeleteFormProps) {
	const [state, formAction, isPending] = useActionState(deleteInvoice, null);

	useEffect(() => {
		if (state?.status === "success") {
			toast.add({
				type: "success",
				description: "Račun je uspješno izbrisan.",
			});

			onOpenChange(false);
		}
	}, [state?.status]);
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Izbriši račun</DialogTitle>

					<DialogDescription>
						Jeste li sigurni da želite izbrisati račun{" "}
						{invoiceData?.invoiceNumber} za {invoiceData?.client?.companyName}
					</DialogDescription>
				</DialogHeader>

				<form action={formAction} className="no-wrapper">
					<input type="hidden" name="invoiceId" value={invoiceData?.id} />

					<DialogFooter className="mt-4">
						<Button
							type="button"
							size="lg"
							variant="outline"
							onClick={() => onOpenChange(false)}
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
							Izbriši račun
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
