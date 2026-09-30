import { InvoiceStatus, PaymentType } from "@/generated/prisma";

export type InvoiceFilterStatus = InvoiceStatus | "OVERDUE";

export const statusLabels: Partial<Record<InvoiceFilterStatus, string>> = {
	DRAFT: "Nacrt",
	ISSUED: "Dospijeva",
	PAID: "Plaćeno",
	OVERDUE: "Neplaćeno",
	PARTIALLY_PAID: "Djelomično plaćeno",
	CANCELLED: "Stornirano",
};

export const paymentLabels: Record<PaymentType, string> = {
	BANK_TRANSFER: "Bankovni transfer",
	CASH: "Gotovina",
};

export const EU_COUNTRY_CODES = [
	"AT",
	"BE",
	"BG",
	"CY",
	"CZ",
	"DE",
	"DK",
	"EE",
	"ES",
	"FI",
	"FR",
	"GR",
	"HU",
	"IE",
	"IT",
	"LT",
	"LU",
	"LV",
	"MT",
	"NL",
	"PL",
	"PT",
	"RO",
	"SE",
	"SI",
	"SK",
];
