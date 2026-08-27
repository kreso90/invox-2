"use client";
import { useActionState } from "react";
import { deleteInvoice } from "../actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function InvoiceDeleteForm({
	invoiceId,
	variant,
	size,
}: {
	invoiceId: string;
	variant?: "destructive" | "ghost";
	size?: "sm" | "md" | "lg";
}) {
	const [state, formAction, isPending] = useActionState(deleteInvoice, null);
	return (
		<form action={formAction} className="no-wrapper">
			<input type="hidden" name="invoiceId" value={invoiceId} />
			<Button
				variant={variant || "ghost"}
				size="lg"
				type="submit"
				disabled={isPending}
				className={
					variant === "ghost"
						? "text-destructive hover:bg-destructive/20 hover:text-destructive text-sm font-normal cursor-pointer"
						: ""
				}
			>
				<Trash2 />
				Izbriši račun
			</Button>
		</form>
	);
}
