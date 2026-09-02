export type Hub3aPaymentData = {
	amount: number;
	payerName: string;
	payerAddress: string;
	payerCity: string;
	recipientName: string;
	recipientAddress: string;
	recipientCity: string;
	recipientIban: string;
	recipientModel?: string;
	recipientReference?: string;
	purposeCode?: string;
	description: string;
};

function field(value: string | undefined, maximumLength: number) {
	return (value ?? "")
		.replace(/[\r\n]+/g, " ")
		.trim()
		.slice(0, maximumLength);
}

function paymentAmount(amount: number) {
	if (!Number.isFinite(amount) || amount < 0) {
		throw new Error("Iznos plaćanja mora biti pozitivan broj.");
	}

	return Math.round(amount * 100)
		.toString()
		.padStart(15, "0");
}

export function generateHub3aData(data: Hub3aPaymentData): string {
	return [
		"HRVHUB30",
		"EUR",
		paymentAmount(data.amount),
		field(data.payerName, 30),
		field(data.payerAddress, 27),
		field(data.payerCity, 27),
		field(data.recipientName, 25),
		field(data.recipientAddress, 25),
		field(data.recipientCity, 27),
		field(data.recipientIban.replace(/\s/g, ""), 21),
		field(data.recipientModel, 4),
		field(data.recipientReference?.replace(/\s/g, ""), 22),
		field(data.purposeCode, 4),
		field(data.description, 35),
	].join("\n");
}
