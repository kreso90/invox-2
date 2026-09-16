import {
	Invoice,
	Business,
	User,
	Prisma,
	Obligation,
} from "@/generated/prisma";

import Builder from "fast-xml-builder";

const builder = new Builder({
	format: true,
	ignoreAttributes: false,
});

type InvoiceWithClientAndPayments = Prisma.InvoiceGetPayload<{
	include: { client: true; invoicePayments: true };
}>;

export function obrazacToXml({
	obligation,
	invoices,
	business,
	user,
}: {
	obligation: Obligation | null;
	business: Business | null;
	invoices: InvoiceWithClientAndPayments[];
	user: User | null;
}) {
	const invoicesByVatId = new Map<string, InvoiceWithClientAndPayments[]>();
	for (const invoice of invoices) {
		const key = invoice.client?.vatNumber ?? invoice.id;
		invoicesByVatId.set(key, [...(invoicesByVatId.get(key) ?? []), invoice]);
	}
	const totalAmount = invoices.reduce((sum, r) => {
		const num =
			parseFloat(
				String(r.totalAmount)
					.replace(/[^0-9,.-]/g, "")
					.replace(",", "."),
			) || 0;
		return sum + num;
	}, 0);

	const data = {
		"?xml": { "@_version": "1.0", "@_encoding": "UTF-8" },
		ObrazacZP: {
			Metapodaci: {
				Naslov:
					"Zbirna prijava za isporuke dobara i usluga u druge države članice Europske unije",
				Autor: user?.name,
				Datum: new Date().toISOString(),
				Format: "text/xml",
				Jezik: "hr-HR",
				Identifikator: "32b27827-3f27-469c-b81d-20a96ca860e4",
				Uskladjenost: "ObrazacZP-v1-0",
				Tip: "Elektronički obrazac",
				Adresant: "Ministarstvo Financija, Porezna uprava, Zagreb",
			},
			Zaglavlje: {
				Razdoblje: {
					DatumOd: new Date(obligation?.dueDate ?? "").toISOString() ?? "",
					DatumDo: new Date(obligation?.dueDate ?? "").toISOString() ?? "",
				},
				Obveznik: {
					Ime: business?.ownerFirstName ?? "",
					Prezime: business?.ownerLastName ?? "",
					OIB: business?.oib ?? "",
					Adresa: {
						Mjesto: business?.city ?? "",
						Ulica: business?.street ?? "",
						Broj: business?.houseNumber ?? "",
					},
				},
				ObracunSastavio: {
					Ime: business?.ownerFirstName ?? "",
					Prezime: business?.ownerLastName ?? "",
					Email: user?.email ?? "",
				},
				Ispostava: 3505,
			},
			Tijelo: {
				Isporuke: {
					Isporuka: [...invoicesByVatId.values()].map((groupedInvoices) => {
						const r = groupedInvoices[0];
						return {
							RedBr: groupedInvoices.indexOf(r) + 1,
							KodDrzave: r.client?.vatNumber?.slice(0, 2) ?? "",
							PDVID: r.client?.vatNumber?.slice(2) ?? "",
							T1: 0,
							T2: 0,
							T3: 0,
							T4: groupedInvoices.reduce(
								(sum, invoice) => sum + invoice.totalAmount,
								0,
							),
						};
					}),
				},
			},
			IsporukeUkupno: {
				T1: 0,
				T2: 0,
				T3: 0,
				T4: totalAmount.toFixed(2),
			},
		},
	};

	return builder.build(data);
}

export function downloadXml(xmlString: string, filename: string) {
	const blob = new Blob([xmlString], { type: "application/xml" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
}
