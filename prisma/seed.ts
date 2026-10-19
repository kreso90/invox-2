import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { auth } from "../src/lib/auth";

import {
	InvoiceStatus,
	PaymentType,
	Unit,
	TaxClass,
	ObligationKind,
	ObligationStatus,
} from "../src/generated/prisma/client";

const adapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
	adapter,
});

const DEMO_EMAIL = "demo@invox.hr";
const DEMO_PASSWORD = "admin123";
const DEMO_NAME = "Demo Korisnik";

async function main() {
	console.log("🌱 Starting INVOX seed...\n");

	// =========================================================
	// 1. CREATE / GET DEMO USER
	// =========================================================

	let user = await prisma.user.findUnique({
		where: {
			email: DEMO_EMAIL,
		},
	});

	if (!user) {
		console.log("👤 Creating demo user...");

		const result = await auth.api.signUpEmail({
			body: {
				name: DEMO_NAME,
				email: DEMO_EMAIL,
				password: DEMO_PASSWORD,
			},
		});

		if (!result.user) {
			throw new Error("Failed to create demo user.");
		}

		user = await prisma.user.findUnique({
			where: {
				id: result.user.id,
			},
		});

		if (!user) {
			throw new Error("Demo user was not found after creation.");
		}
	} else {
		console.log("👤 Demo user already exists.");
	}

	const userId = user.id;

	console.log(`   Email: ${DEMO_EMAIL}`);
	console.log(`   Password: ${DEMO_PASSWORD}`);
	console.log(`   ID: ${userId}\n`);

	// =========================================================
	// 2. DELETE EXISTING DEMO DATA
	// =========================================================

	console.log("🧹 Cleaning existing demo data...");

	// Payments first because they depend on invoices
	await prisma.invoicePayment.deleteMany({
		where: {
			invoice: {
				userId,
			},
		},
	});

	// Invoice items
	await prisma.invoiceItem.deleteMany({
		where: {
			invoice: {
				userId,
			},
		},
	});

	// Invoices
	await prisma.invoice.deleteMany({
		where: {
			userId,
		},
	});

	// Obligations
	await prisma.obligation.deleteMany({
		where: {
			userId,
		},
	});

	// Clients
	await prisma.client.deleteMany({
		where: {
			userId,
		},
	});

	// Articles
	await prisma.article.deleteMany({
		where: {
			userId,
		},
	});

	// Business
	await prisma.business.deleteMany({
		where: {
			userId,
		},
	});

	// Settings
	await prisma.settings.deleteMany({
		where: {
			userId,
		},
	});

	console.log("   ✓ Demo data cleaned\n");

	// =========================================================
	// 3. BUSINESS
	// =========================================================

	console.log("🏢 Creating business...");

	const business = await prisma.business.create({
		data: {
			userId,

			business_name: "INVOX DEMO d.o.o.",

			ownerFirstName: "Demo",
			ownerLastName: "Korisnik",

			oib: "12345678901",
			vatId: "HR12345678901",

			street: "Ilica",
			houseNumber: "42",
			city: "Zagreb",
			postalCode: "10000",
			country: "HR",

			email: DEMO_EMAIL,
			phone: "+385 91 123 4567",

			bankName: "Zagrebačka banka",
			swiftCode: "ZABAHR2X",
			iban: "HR1723600001101234565",

			description:
				"Demo poslovni subjekt za razvoj i testiranje INVOX aplikacije.",

			activity_name: "Računalno programiranje",
			activity_code: "62.10",

			annual_threshold: 60000,
			threshold_warning_pct: 80,

			taxClass: TaxClass.CLASS_3,

			mio1MonthlyAmount: 119.58,
			mio2MonthlyAmount: 39.86,
			healthInsuranceMonthly: 131.54,
			incomeTaxQuarterly: 137.7,
		},
	});

	console.log(`   ✓ ${business.business_name}`);

	// =========================================================
	// 4. SETTINGS
	// =========================================================

	console.log("⚙️ Creating settings...");

	await prisma.settings.create({
		data: {
			userId,
			nextInvoiceNumber: "21/1/1",
		},
	});

	console.log("   ✓ Settings created\n");

	// =========================================================
	// 5. CLIENTS - 10
	// =========================================================

	console.log("👥 Creating clients...");

	const clientData = [
		{
			companyName: "Alfa Solutions d.o.o.",
			oib: "11111111111",
			vatNumber: "HR11111111111",
			vatCountryCode: "HR",
			address: "Vukovarska 10",
			city: "Zagreb",
			postalCode: "10000",
			contactFirstName: "Marko",
			contactLastName: "Marić",
			email: "marko@alfasolutions.hr",
			phone: "+385 91 111 1111",
			iban: "HR1223600001101111111",
			note: "Glavni domaći klijent.",
		},

		{
			companyName: "Beta Commerce d.o.o.",
			oib: "22222222222",
			vatNumber: "HR22222222222",
			vatCountryCode: "HR",
			address: "Savska cesta 25",
			city: "Zagreb",
			postalCode: "10000",
			contactFirstName: "Ivan",
			contactLastName: "Horvat",
			email: "ivan@betacommerce.hr",
			phone: "+385 91 222 2222",
			iban: "HR1223600001102222222",
			note: null,
		},

		{
			companyName: "Gamma Studio j.d.o.o.",
			oib: "33333333333",
			vatNumber: "HR33333333333",
			vatCountryCode: "HR",
			address: "Domovinskog rata 15",
			city: "Split",
			postalCode: "21000",
			contactFirstName: "Ana",
			contactLastName: "Kovač",
			email: "ana@gammastudio.hr",
			phone: "+385 91 333 3333",
			iban: "HR1223600001103333333",
			note: "Dizajn i marketing.",
		},

		{
			companyName: "Delta Systems d.o.o.",
			oib: "44444444444",
			vatNumber: "HR44444444444",
			vatCountryCode: "HR",
			address: "Korzo 12",
			city: "Rijeka",
			postalCode: "51000",
			contactFirstName: "Petar",
			contactLastName: "Novak",
			email: "petar@deltasystems.hr",
			phone: "+385 91 444 4444",
			iban: "HR1223600001104444444",
			note: null,
		},

		{
			companyName: "Epsilon Consulting d.o.o.",
			oib: "55555555555",
			vatNumber: "HR55555555555",
			vatCountryCode: "HR",
			address: "Kralja Tomislava 8",
			city: "Osijek",
			postalCode: "31000",
			contactFirstName: "Luka",
			contactLastName: "Babić",
			email: "luka@epsilon.hr",
			phone: "+385 91 555 5555",
			iban: "HR1223600001105555555",
			note: "IT konzultantske usluge.",
		},

		{
			companyName: "Zeta Digital d.o.o.",
			oib: "66666666666",
			vatNumber: "HR66666666666",
			vatCountryCode: "HR",
			address: "Ulica grada Vukovara 100",
			city: "Zagreb",
			postalCode: "10000",
			contactFirstName: "Maja",
			contactLastName: "Radić",
			email: "maja@zetadigital.hr",
			phone: "+385 91 666 6666",
			iban: "HR1223600001106666666",
			note: null,
		},

		{
			companyName: "Eta Marketing d.o.o.",
			oib: "77777777777",
			vatNumber: "HR77777777777",
			vatCountryCode: "HR",
			address: "Poljička cesta 20",
			city: "Split",
			postalCode: "21000",
			contactFirstName: "Nikola",
			contactLastName: "Perić",
			email: "nikola@etamarketing.hr",
			phone: "+385 91 777 7777",
			iban: "HR1223600001107777777",
			note: null,
		},

		{
			companyName: "Theta GmbH",
			oib: null,
			vatNumber: "DE123456789",
			vatCountryCode: "DE",
			address: "Berliner Strasse 15",
			city: "Berlin",
			postalCode: "10115",
			contactFirstName: "Thomas",
			contactLastName: "Schmidt",
			email: "thomas@theta.de",
			phone: "+49 30 123456",
			iban: "DE89370400440532013000",
			note: "EU client.",
		},

		{
			companyName: "Lambda Tech GmbH",
			oib: null,
			vatNumber: "ATU12345678",
			vatCountryCode: "AT",
			address: "Mariahilfer Strasse 50",
			city: "Vienna",
			postalCode: "1070",
			contactFirstName: "Peter",
			contactLastName: "Müller",
			email: "peter@lambda.at",
			phone: "+43 1 123456",
			iban: "AT611904300234573201",
			note: "EU client.",
		},

		{
			companyName: "Omega Digital d.o.o.",
			oib: "88888888888",
			vatNumber: "HR88888888888",
			vatCountryCode: "HR",
			address: "Zagrebačka 55",
			city: "Zadar",
			postalCode: "23000",
			contactFirstName: "Filip",
			contactLastName: "Grgić",
			email: "filip@omega.hr",
			phone: "+385 91 888 8888",
			iban: "HR1223600001108888888",
			note: "Web development klijent.",
		},
	];

	const clients = [];

	for (const data of clientData) {
		const client = await prisma.client.create({
			data: {
				...data,
				userId,
			},
		});

		clients.push(client);
	}

	console.log(`   ✓ Created ${clients.length} clients\n`);

	// =========================================================
	// 6. ARTICLES - 10
	// =========================================================

	console.log("📦 Creating articles...");

	const articleData = [
		{
			name: "Web development",
			unit: Unit.HOUR,
			price: 50,
			description: "Izrada i razvoj web aplikacija.",
		},

		{
			name: "Frontend development",
			unit: Unit.HOUR,
			price: 55,
			description: "Frontend razvoj React/Next.js aplikacija.",
		},

		{
			name: "Backend development",
			unit: Unit.HOUR,
			price: 60,
			description: "Backend razvoj i API integracije.",
		},

		{
			name: "UI/UX dizajn",
			unit: Unit.HOUR,
			price: 45,
			description: "Dizajn korisničkog sučelja i korisničkog iskustva.",
		},

		{
			name: "SEO optimizacija",
			unit: Unit.HOUR,
			price: 40,
			description: "Tehnička i sadržajna SEO optimizacija.",
		},

		{
			name: "Hosting",
			unit: Unit.HOUR,
			price: 25,
			description: "Mjesečni hosting paket.",
		},

		{
			name: "Održavanje web stranice",
			unit: Unit.HOUR,
			price: 80,
			description: "Održavanje i ažuriranje web stranice.",
		},

		{
			name: "Konzultantske usluge",
			unit: Unit.HOUR,
			price: 70,
			description: "IT konzultantske usluge.",
		},

		{
			name: "Google Ads kampanja",
			unit: Unit.PIECE,
			price: 150,
			description: "Postavljanje i optimizacija Google Ads kampanje.",
		},

		{
			name: "Izrada web stranice",
			unit: Unit.PIECE,
			price: 1200,
			description: "Kompletna izrada poslovne web stranice.",
		},
	];

	// `Unit.MONTH` ne postoji u tvom enumu.
	// Hosting ćemo zato prebaciti na PIECE.
	articleData[5].unit = Unit.PIECE;

	const articles = [];

	for (const data of articleData) {
		const article = await prisma.article.create({
			data: {
				...data,
				userId,
			},
		});

		articles.push(article);
	}

	console.log(`   ✓ Created ${articles.length} articles\n`);

	// =========================================================
	// 7. INVOICES - 20
	// =========================================================

	console.log("🧾 Creating invoices...");

	const invoices = [];

	for (let i = 1; i <= 20; i++) {
		const client = clients[(i - 1) % clients.length];

		// Invoice dates spread through previous months
		const issueDate = new Date();

		issueDate.setHours(10, 0, 0, 0);
		issueDate.setDate(issueDate.getDate() - i * 4);

		const dueDate = new Date(issueDate);
		dueDate.setDate(dueDate.getDate() + 15);

		// -------------------------------------------------------
		// Status
		// -------------------------------------------------------

		let status: InvoiceStatus;

		switch (i) {
			case 4:
			case 8:
			case 12:
			case 16:
				status = InvoiceStatus.PAID;
				break;

			case 5:
			case 10:
				status = InvoiceStatus.PARTIALLY_PAID;
				break;

			case 6:
			case 14:
			case 18:
				status = InvoiceStatus.OVERDUE;
				break;

			case 19:
				status = InvoiceStatus.DRAFT;
				break;

			case 20:
				status = InvoiceStatus.CANCELLED;
				break;

			default:
				status = InvoiceStatus.ISSUED;
				break;
		}

		// -------------------------------------------------------
		// Payment method
		// -------------------------------------------------------

		const paymentMethod =
			i % 4 === 0 ? PaymentType.CASH : PaymentType.BANK_TRANSFER;

		// -------------------------------------------------------
		// Items
		// -------------------------------------------------------

		const itemCount = (i % 4) + 1;

		const invoiceItems = [];

		for (let j = 0; j < itemCount; j++) {
			const article = articles[(i + j) % articles.length];

			let quantity: number;

			if (article.unit === Unit.PIECE) {
				quantity = (j % 3) + 1;
			} else {
				quantity = (j + 1) * 2;
			}

			const amount = quantity * article.price;

			invoiceItems.push({
				itemId: article.id,
				name: article.name,
				quantity,
				unit: article.unit,
				unitPrice: article.price,
				amount,
				sortOrder: j,
			});
		}

		const totalAmount = invoiceItems.reduce(
			(sum, item) => sum + item.amount,
			0,
		);

		// -------------------------------------------------------
		// Paid date
		// -------------------------------------------------------

		let paidAt: Date | null = null;

		if (status === InvoiceStatus.PAID) {
			paidAt = new Date(issueDate);
			paidAt.setDate(paidAt.getDate() + 7);
		}

		// -------------------------------------------------------
		// Sent date
		// -------------------------------------------------------

		let sentAt: Date | null = null;

		if (status !== InvoiceStatus.DRAFT) {
			sentAt = new Date(issueDate);
			sentAt.setDate(sentAt.getDate() + 1);
		}

		// -------------------------------------------------------
		// Create invoice
		// -------------------------------------------------------

		const invoice = await prisma.invoice.create({
			data: {
				userId,
				clientId: client.id,

				invoiceNumber: `${i}/1/1`,

				issueDate,
				dueDate,

				issuePlace: "Zagreb",

				paymentMethod,

				status,

				note: i % 5 === 0 ? "Hvala na suradnji!" : null,

				totalAmount,

				paidAt,
				sentAt,

				fiscalizedAt:
					status === InvoiceStatus.ISSUED ||
					status === InvoiceStatus.PAID ||
					status === InvoiceStatus.PARTIALLY_PAID
						? new Date(issueDate.getTime() + 2 * 60 * 60 * 1000)
						: null,

				pdfUrl: null,

				isEmailSent:
					status !== InvoiceStatus.DRAFT && status !== InvoiceStatus.CANCELLED,

				invoiceItems: {
					create: invoiceItems,
				},
			},
		});

		invoices.push(invoice);

		// -------------------------------------------------------
		// Full payment
		// -------------------------------------------------------

		if (status === InvoiceStatus.PAID) {
			await prisma.invoicePayment.create({
				data: {
					invoiceId: invoice.id,
					amount: totalAmount,
					method: paymentMethod,
					paidAt: paidAt ?? new Date(),
				},
			});
		}

		// -------------------------------------------------------
		// Partial payment - 50%
		// -------------------------------------------------------

		if (status === InvoiceStatus.PARTIALLY_PAID) {
			const partialAmount = Math.round(totalAmount * 0.5 * 100) / 100;

			const partialPaidAt = new Date(issueDate);
			partialPaidAt.setDate(partialPaidAt.getDate() + 5);

			await prisma.invoicePayment.create({
				data: {
					invoiceId: invoice.id,
					amount: partialAmount,
					method: PaymentType.BANK_TRANSFER,
					paidAt: partialPaidAt,
				},
			});
		}
	}

	console.log(`   ✓ Created ${invoices.length} invoices\n`);

	// =========================================================
	// 8. OBLIGATIONS
	// =========================================================

	console.log("📋 Creating obligations...");

	const now = new Date();

	// Current month
	const currentMonth = now.getMonth() + 1;
	const currentYear = now.getFullYear();

	const currentPeriod = `${currentMonth.toString().padStart(2, "0")}/${currentYear}`;

	const nextMonthDate = new Date(currentYear, currentMonth, 1);

	const nextMonth = nextMonthDate.getMonth() + 1;
	const nextMonthYear = nextMonthDate.getFullYear();

	const nextPeriod = `${nextMonth.toString().padStart(2, "0")}/${nextMonthYear}`;

	const obligations = [
		{
			kind: ObligationKind.MIO1,
			name: "MIO I. stup za vlasnika",
			periodLabel: currentPeriod,
			dueDate: new Date(currentYear, currentMonth, 15),
			amount: 119.58,
			status: ObligationStatus.PENDING,
		},

		{
			kind: ObligationKind.MIO2,
			name: "MIO II. stup za vlasnika",
			periodLabel: currentPeriod,
			dueDate: new Date(currentYear, currentMonth, 15),
			amount: 39.86,
			status: ObligationStatus.PENDING,
		},

		{
			kind: ObligationKind.HEALTH_INSURANCE,
			name: "Zdravstveno osiguranje",
			periodLabel: currentPeriod,
			dueDate: new Date(currentYear, currentMonth, 15),
			amount: 131.54,
			status: ObligationStatus.SUBMITTED,
		},

		{
			kind: ObligationKind.INCOME_TAX,
			name: "Porez na dohodak",
			periodLabel: currentPeriod,
			dueDate: new Date(currentYear, currentMonth, 20),
			amount: 137.7,
			status: ObligationStatus.PENDING,
		},

		{
			kind: ObligationKind.PDV_FORM,
			name: `PDV obrazac za ${currentPeriod}`,
			periodLabel: currentPeriod,
			dueDate: new Date(currentYear, currentMonth, 20),
			amount: null,
			status: ObligationStatus.PENDING,
		},

		{
			kind: ObligationKind.ZP_FORM,
			name: `Zbirna prijava (ZP) za ${currentPeriod}`,
			periodLabel: currentPeriod,
			dueDate: new Date(currentYear, currentMonth, 20),
			amount: null,
			status: ObligationStatus.SUBMITTED,
		},

		{
			kind: ObligationKind.KPI_LEDGER,
			name: "KPI knjiga",
			periodLabel: currentPeriod,
			dueDate: new Date(currentYear, currentMonth, 25),
			amount: null,
			status: ObligationStatus.PENDING,
		},

		{
			kind: ObligationKind.PO_SD_FORM,
			name: "PO-SD obrazac",
			periodLabel: currentYear.toString(),
			dueDate: new Date(currentYear + 1, 1, 28),
			amount: null,
			status: ObligationStatus.PENDING,
		},

		{
			kind: ObligationKind.PDV_FORM,
			name: `PDV obrazac za ${nextPeriod}`,
			periodLabel: nextPeriod,
			dueDate: new Date(nextMonthYear, nextMonth, 20),
			amount: null,
			status: ObligationStatus.PENDING,
		},
	];

	for (const obligation of obligations) {
		await prisma.obligation.create({
			data: {
				userId,

				kind: obligation.kind,
				name: obligation.name,
				periodLabel: obligation.periodLabel,

				dueDate: obligation.dueDate,

				amount: obligation.amount,

				status: obligation.status,
			},
		});
	}

	console.log(`   ✓ Created ${obligations.length} obligations\n`);

	// =========================================================
	// 9. SUMMARY
	// =========================================================

	console.log("==========================================");
	console.log("🌱 INVOX SEED COMPLETED");
	console.log("==========================================");

	console.log(`👤 User:       ${DEMO_EMAIL}`);
	console.log(`🔑 Password:   ${DEMO_PASSWORD}`);
	console.log("");

	console.log(`🏢 Business:   ${business.business_name}`);
	console.log(`👥 Clients:    ${clients.length}`);
	console.log(`📦 Articles:   ${articles.length}`);
	console.log(`🧾 Invoices:   ${invoices.length}`);
	console.log(`📋 Obligations: ${obligations.length}`);

	console.log("==========================================");
}

main()
	.catch((error) => {
		console.error("\n❌ Seed failed:");
		console.error(error);

		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
