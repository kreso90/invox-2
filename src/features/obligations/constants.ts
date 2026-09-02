import { ObligationKind, ObligationStatus } from "@/generated/prisma";

export const obligationLabels: Record<ObligationKind, string> = {
	MIO1: "	1. Mirovinski stup",
	MIO2: "	2. Mirovinski stup",
	HEALTH_INSURANCE: "Zdravstveno osiguranje",
	INCOME_TAX: "Porez na dohodak",
	PO_SD_FORM: "PO SD obrazac",
	KPI_LEDGER: "KPI knjiga",
	PDV_FORM: "PDV obrazac",
	ZP_FORM: "ZP obrazac",
	OTHER: "Ostalo",
};

export const obligationStatusLabels: Record<ObligationStatus, string> = {
	PENDING: "Nije podneseno",
	SUBMITTED: "Podneseno",
};

export const obligationPaymentDetails: Partial<
	Record<
		ObligationKind,
		{
			recipientName: string;
			recipientIban: string;
			paymentModel: string;
			paymentReference: string;
			paymentDescription: string;
		}
	>
> = {
	MIO1: {
		recipientName: "Drzavni proracun Republike Hrvatske",
		recipientIban: "HR1210010051863000160",
		paymentModel: "HR68",
		paymentReference: "8174",
		paymentDescription: "Doprinos za mirovinsko osiguranje I. stup",
	},
	MIO2: {
		recipientName: "REGOS",
		recipientIban: "HR7610010051863000160",
		paymentModel: "HR68",
		paymentReference: "8175",
		paymentDescription: "Doprinos za mirovinsko osiguranje II. stup",
	},
	HEALTH_INSURANCE: {
		recipientName: "Hrvatski zavod za zdravstveno osiguranje",
		recipientIban: "HR6510010051863000160",
		paymentModel: "HR68",
		paymentReference: "8478",
		paymentDescription: "Doprinos za obvezno zdravstveno osiguranje",
	},
	INCOME_TAX: {
		recipientName: "Porezna uprava",
		recipientIban: "HR1210010051863000160",
		paymentModel: "HR68",
		paymentReference: "8176",
		paymentDescription: "Porez na dohodak",
	},
};
