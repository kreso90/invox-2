"use client";

import { Hub3aBarcode } from "@/components/payment-barcode";
import { Button } from "@/components/ui/button";
import {
	obligationLabels,
	obligationPaymentDetails,
} from "@/features/obligations/constants";
import type { Obligation, ObligationKind } from "@/generated/prisma";
import type { Business } from "@/generated/prisma";
import { generateHub3aData } from "@/lib/hub3";
import { updateObligationStatus } from "../actions";
import { useActionState, useEffect } from "react";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";

export function BarcodeModal({
	obligation,
	business,
	onClose,
}: {
	obligation: Obligation | null;
	business: Business | null;
	onClose: () => void;
}) {
	const [state, formAction, isPending] = useActionState(
		updateObligationStatus,
		null,
	);
	const paymentDetails =
		obligationPaymentDetails[obligation?.kind as ObligationKind];
	const barcodeValue =
		business && paymentDetails && obligation?.amount != null
			? generateHub3aData({
					amount: obligation.amount,
					payerName: business.business_name,
					payerAddress: business.street,
					payerCity: `${business.postalCode} ${business.city}`,
					recipientName: paymentDetails.recipientName,
					recipientAddress: "",
					recipientCity: "",
					recipientIban: paymentDetails.recipientIban,
					recipientModel: paymentDetails.paymentModel + "-" + business.oib,
					recipientReference: paymentDetails.paymentReference,
					description: paymentDetails.paymentDescription,
				})
			: null;

	useEffect(() => {
		if (state?.status === "success") {
			toast.add({
				type: "success",
				description: state.message,
			});

			onClose();
		}
	}, [state]);
	return (
		<Dialog open={!!obligation} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{obligationLabels[obligation?.kind as ObligationKind]}
					</DialogTitle>

					<DialogDescription>
						Skeniraj kod u mobilnom bankarstvu
					</DialogDescription>
				</DialogHeader>

				<div className="my-4 flex justify-center">
					{obligation && <Hub3aBarcode value={barcodeValue ?? ""} />}
				</div>

				<ul className="text-sm">
					<li className="flex justify-between gap-4 border-b border-border py-1">
						<span className="text-muted">Iznos:</span>{" "}
						<span>
							{obligation?.amount
								? new Intl.NumberFormat("hr-HR", {
										style: "currency",
										currency: "EUR",
									}).format(obligation.amount)
								: "N/A"}
						</span>
					</li>
					<li className="flex justify-between gap-4 border-b border-border py-1">
						<span className="text-muted">IBAN primatelja</span>{" "}
						<span className="font-mono">
							{paymentDetails?.recipientIban ?? "N/A"}
						</span>
					</li>
					<li className="flex justify-between gap-4 border-b border-border py-1">
						<span className="text-muted">Model</span>{" "}
						<span className="font-mono">
							{paymentDetails?.paymentModel ?? "N/A"}
						</span>
					</li>
					<li className="flex justify-between gap-4 border-b border-border py-1">
						<span className="text-muted">Poziv na broj</span>{" "}
						<span className="font-mono">
							{paymentDetails?.paymentReference ?? "N/A"} -{" "}
							{business?.oib ?? "N/A"}
						</span>
					</li>
					<li className="flex justify-between gap-4 py-1">
						<span className="text-muted">Opis plaćanja</span>{" "}
						<span className="font-mono text-right">
							{paymentDetails?.paymentDescription ?? "N/A"}
						</span>
					</li>
				</ul>

				<DialogFooter className="mt-4">
					<Button onClick={onClose} variant="outline" size="lg">
						Zatvori
					</Button>

					<form action={formAction} className="no-wrapper">
						<input
							type="hidden"
							name="obligationId"
							value={obligation?.id ?? ""}
						/>
						<Button type="submit" size="lg" disabled={isPending}>
							{obligation?.status !== "SUBMITTED"
								? "Plačeno"
								: "Poništi plaćanje"}
						</Button>
					</form>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
