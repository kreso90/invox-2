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
import { useActionState } from "react";

export function BarcodeModal({
	obligation,
	business,
	onClose,
}: {
	obligation: Obligation | null;
	business: Business | null;
	onClose: () => void;
}) {
	const [state, fromAction, isPending] = useActionState(
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
	return (
		<div
			className={`fixed z-10 ${obligation ? "flex" : "hidden"} justify-center items-center inset-0 bg-black/40 bg-opacity-50`}
		>
			<div className="bg-white p-6 rounded-lg border border-border text-center">
				<div className="text-lg font-semibold">
					{obligationLabels[obligation?.kind as ObligationKind]}
				</div>
				<div className="text-center">Skeniraj kod u mobilnom bankarstvu</div>

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
						<span className="font-mono">
							{paymentDetails?.paymentDescription ?? "N/A"}
						</span>
					</li>
				</ul>
				<div className="flex justify-center gap-2 mt-5">
					<Button onClick={onClose} variant="outline">
						Zatvori
					</Button>
					{obligation?.status !== "SUBMITTED" && (
						<form action={fromAction} className="no-wrapper">
							<input
								type="hidden"
								name="obligationId"
								value={obligation?.id ?? ""}
							/>
							<Button type="submit">Plačeno</Button>
						</form>
					)}
				</div>
			</div>
		</div>
	);
}
