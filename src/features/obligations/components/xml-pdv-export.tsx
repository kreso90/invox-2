import { Business, Obligation, Prisma, User } from "@/generated/prisma";

import Builder from "fast-xml-builder";

const builder = new Builder({
	format: true,
	ignoreAttributes: false,
});

type InvoiceWithClientAndPayments = Prisma.InvoiceGetPayload<{
	include: {
		client: true;
		invoicePayments: true;
	};
}>;

function formatAmount(value: number | string | null | undefined): string {
	const amount =
		parseFloat(
			String(value ?? 0)
				.replace(/[^0-9,.-]/g, "")
				.replace(",", "."),
		) || 0;

	return amount.toFixed(2);
}

function formatDate(date: Date | string | null | undefined): string {
	if (!date) return "";

	const d = new Date(date);

	if (Number.isNaN(d.getTime())) return "";

	return d.toISOString().slice(0, 10);
}

export function pdvToXml({
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
	const totalAmount = invoices.reduce((sum, invoice) => {
		const amount =
			parseFloat(
				String(invoice.totalAmount ?? 0)
					.replace(/[^0-9,.-]/g, "")
					.replace(",", "."),
			) || 0;

		return sum + amount;
	}, 0);

	const dateFrom = formatDate(obligation?.dueDate);
	const dateTo = formatDate(obligation?.dueDate);

	const data = {
		"?xml": {
			"@_version": "1.0",
			"@_encoding": "UTF-8",
		},

		ObrazacPDV: {
			"@_xmlns":
				"http://e-porezna.porezna-uprava.hr/sheme/zahtjevi/ObrazacPDV/v11-0",

			"@_xmlns:ns5":
				"http://e-porezna.porezna-uprava.hr/sheme/VanjskaOmotnica/v1-0",

			"@_xmlns:ns4": "http://uri.etsi.org/01903/v1.3.2#",

			"@_xmlns:ns3": "http://www.w3.org/2000/09/xmldsig#",

			"@_xmlns:ns2":
				"http://e-porezna.porezna-uprava.hr/sheme/zahtjevi/ObrazacPDV/v11-0",

			"@_verzijaSheme": "11.0",

			Metapodaci: {
				"@_xmlns": "http://e-porezna.porezna-uprava.hr/sheme/Metapodaci/v2-0",

				Naslov: {
					"@_dc": "http://purl.org/dc/elements/1.1/title",
					"#text": "Obrazac PDV",
				},

				Autor: {
					"@_dc": "http://purl.org/dc/elements/1.1/creator",
					"#text": user?.name ?? "",
				},

				Datum: {
					"@_dc": "http://purl.org/dc/elements/1.1/date",
					"#text": new Date().toISOString(),
				},

				Format: {
					"@_dc": "http://purl.org/dc/elements/1.1/format",
					"#text": "text/xml",
				},

				Jezik: {
					"@_dc": "http://purl.org/dc/elements/1.1/language",
					"#text": "hr-HR",
				},

				Identifikator: {
					"@_dc": "http://purl.org/dc/elements/1.1/identifier",
					"#text": crypto.randomUUID(),
				},

				Uskladjenost: {
					"@_dc": "http://purl.org/dc/terms/conformsTo",
					"#text": "ObrazacPDV-v11-0",
				},

				Tip: {
					"@_dc": "http://purl.org/dc/elements/1.1/type",
					"#text": "Elektronički obrazac",
				},

				Adresant: "Ministarstvo Financija, Porezna uprava, Zagreb",
			},

			Zaglavlje: {
				Razdoblje: {
					DatumOd: dateFrom,
					DatumDo: dateTo,
				},

				Obveznik: {
					Ime: business?.ownerFirstName ?? "",
					Prezime: business?.ownerLastName ?? "",
					OIB: business?.oib ?? "",

					Adresa: {
						Mjesto: business?.city ?? "",
						Ulica: business?.street ?? "",
						Broj: business?.houseNumber ?? 1,
					},
				},

				ObracunSastavio: {
					Ime: business?.ownerFirstName ?? "",
					Prezime: business?.ownerLastName ?? "",
				},

				Ispostava: 3505,
			},

			Tijelo: {
				Podatak000: formatAmount(totalAmount),

				Podatak100: formatAmount(totalAmount),

				Podatak101: "0.00",
				Podatak102: "0.00",
				Podatak103: "0.00",
				Podatak104: formatAmount(totalAmount),
				Podatak105: "0.00",
				Podatak106: "0.00",
				Podatak107: "0.00",
				Podatak108: "0.00",
				Podatak109: "0.00",
				Podatak110: "0.00",
				Podatak111: "0.00",

				Podatak200: {
					Vrijednost: "0.00",
					Porez: "0.00",
				},

				Podatak201: {
					Vrijednost: "0.00",
					Porez: "0.00",
				},

				Podatak202: {
					Vrijednost: "0.00",
					Porez: "0.00",
				},

				Podatak203: {
					Vrijednost: "0.00",
					Porez: "0.00",
				},

				Podatak204: {
					Vrijednost: "0.00",
					Porez: "0.00",
				},

				Podatak205: {
					Vrijednost: "0.00",
					Porez: "0.00",
				},

				Podatak206: {
					Vrijednost: "0.00",
					Porez: "0.00",
				},

				Podatak207: {
					Vrijednost: "0.00",
					Porez: "0.00",
				},

				Podatak208: {
					Vrijednost: "0.00",
					Porez: "0.00",
				},

				Podatak209: {
					Vrijednost: "0.00",
					Porez: "0.00",
				},

				Podatak210: {
					Vrijednost: "0.00",
					Porez: "0.00",
				},

				Podatak211: {
					Vrijednost: "0.00",
					Porez: "0.00",
				},

				Podatak212: {
					Vrijednost: "0.00",
					Porez: "0.00",
				},

				Podatak213: {
					Vrijednost: "0.00",
					Porez: "0.00",
				},

				Podatak214: {
					Vrijednost: "0.00",
					Porez: "0.00",
				},

				Podatak215: {
					Vrijednost: "0.00",
					Porez: "0.00",
				},

				Podatak300: {
					Vrijednost: "0.00",
					Porez: "0.00",
				},

				Podatak301: {
					Vrijednost: "0.00",
					Porez: "0.00",
				},

				Podatak302: {
					Vrijednost: "0.00",
					Porez: "0.00",
				},

				Podatak303: {
					Vrijednost: "0.00",
					Porez: "0.00",
				},

				Podatak304: {
					Vrijednost: "0.00",
					Porez: "0.00",
				},

				Podatak305: {
					Vrijednost: "0.00",
					Porez: "0.00",
				},

				Podatak306: {
					Vrijednost: "0.00",
					Porez: "0.00",
				},

				Podatak307: {
					Vrijednost: "0.00",
					Porez: "0.00",
				},

				Podatak308: {
					Vrijednost: "0.00",
					Porez: "0.00",
				},

				Podatak309: {
					Vrijednost: "0.00",
					Porez: "0.00",
				},

				Podatak310: {
					Vrijednost: "0.00",
					Porez: "0.00",
				},

				Podatak311: {
					Vrijednost: "0.00",
					Porez: "0.00",
				},

				Podatak312: {
					Vrijednost: "0.00",
					Porez: "0.00",
				},

				Podatak313: {
					Vrijednost: "0.00",
					Porez: "0.00",
				},

				Podatak314: {
					Vrijednost: "0.00",
					Porez: "0.00",
				},

				Podatak315: "0.00",

				Podatak400: "0.00",
				Podatak500: "0.00",

				Podatak610: "0.00",
				Podatak611: "0.00",
				Podatak612: "0.00",
				Podatak613: "0.00",
				Podatak614: "0.00",
				Podatak615: "0.00",

				Podatak620: "0.00",
				Podatak630: "0.00",
				Podatak640: "0.00",
				Podatak650: "0.00",

				Podatak660: false,

				Podatak701: {
					NabavnaVrijednost: "0.00",
					ProdajnaVrijednost: "0.00",
				},

				Podatak702: {
					NabavnaVrijednost: "0.00",
					ProdajnaVrijednost: "0.00",
				},

				Podatak703: {
					NabavnaVrijednost: "0.00",
					ProdajnaVrijednost: "0.00",
				},

				Podatak704: {
					NabavnaVrijednost: "0.00",
					ProdajnaVrijednost: "0.00",
				},

				Povrat: "0.00",

				PodaciZaUstup: {},

				Predujam: "0.00",

				UstupPovrata: "0.00",
			},
		},
	};

	return builder.build(data);
}

export function downloadXml(xmlString: string, filename: string) {
	const blob = new Blob([xmlString], {
		type: "application/xml",
	});

	const url = URL.createObjectURL(blob);

	const a = document.createElement("a");

	a.href = url;
	a.download = filename;

	document.body.appendChild(a);

	a.click();

	a.remove();

	URL.revokeObjectURL(url);
}
