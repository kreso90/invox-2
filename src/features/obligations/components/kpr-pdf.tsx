"use client";
import { Button } from "@/components/ui/button";
import { Invoice, Business, User, Prisma } from "@/generated/prisma";
import {
	Document,
	Page,
	View,
	Text,
	StyleSheet,
	Font,
	PDFDownloadLink,
} from "@react-pdf/renderer";

type InvoiceWithItems = Prisma.InvoiceGetPayload<{
	include: { invoiceItems: true; invoicePayments: true };
}>;

export type KprData = {
	user: User;
	invoices: InvoiceWithItems[];
	business: Business;
	year?: Date | null;
};

Font.register({
	family: "IBM Plex Sans",
	fonts: [
		{ src: "/fonts/IBMPlexSans-Regular.ttf", fontWeight: 400 },
		{ src: "/fonts/IBMPlexSans-SemiBold.ttf", fontWeight: 600 },
		{ src: "/fonts/IBMPlexSans-Bold.ttf", fontWeight: 700 },
	],
});

Font.register({
	family: "IBM Plex Mono",
	fonts: [
		{ src: "/fonts/IBMPlexMono-Regular.ttf", fontWeight: 400 },
		{ src: "/fonts/IBMPlexMono-SemiBold.ttf", fontWeight: 600 },
	],
});

const styles = StyleSheet.create({
	page: {
		size: "A4",
		orientation: "landscape",
		paddingTop: 28,
		paddingBottom: 28,
		paddingHorizontal: 34,
		fontFamily: "IBM Plex Sans",
		fontSize: 8,
		color: "#000",
	},

	header: {
		position: "relative",
		height: 72,
	},

	formNumber: {
		position: "absolute",
		right: 0,
		top: 0,
		fontSize: 8,
	},

	title: {
		textAlign: "center",
		fontSize: 13,
		fontWeight: 600,
		marginTop: 12,
	},

	subtitle: {
		textAlign: "right",
		fontSize: 8,
		fontWeight: 600,
		marginTop: 16,
	},

	sectionTitle: {
		height: 18,
		borderTopWidth: 1.2,
		borderLeftWidth: 1.2,
		borderRightWidth: 1.2,
		borderBottomWidth: 0.6,
		paddingHorizontal: 5,
		justifyContent: "center",
		fontSize: 8.5,
		fontWeight: 600,
	},

	row: {
		flexDirection: "row",
		minHeight: 18,
		borderLeftWidth: 1.2,
		borderRightWidth: 1.2,
		borderBottomWidth: 0.6,
	},

	rowLast: {
		borderBottomWidth: 1.2,
	},

	label: {
		paddingHorizontal: 5,
		justifyContent: "center",
		fontSize: 8,
	},

	value: {
		paddingHorizontal: 5,
		justifyContent: "center",
		fontSize: 8,
	},

	activityRow: {
		flexDirection: "row",
		minHeight: 18,
		borderLeftWidth: 1.2,
		borderRightWidth: 1.2,
		borderBottomWidth: 0.6,
	},

	activityLabel: {
		width: "18%",
		justifyContent: "center",
		paddingHorizontal: 5,
	},

	activityValue: {
		width: "55%",
		justifyContent: "center",
		paddingHorizontal: 5,
		borderLeftWidth: 0.6,
	},

	activityCodeLabel: {
		width: "17%",
		justifyContent: "center",
		paddingHorizontal: 5,
		borderLeftWidth: 0.6,
	},

	activityCodeValue: {
		width: "10%",
		justifyContent: "center",
		paddingHorizontal: 5,
		borderLeftWidth: 0.6,
	},

	fullLabel: {
		width: "28%",
	},

	fullValue: {
		width: "72%",
		borderLeftWidth: 0.6,
	},

	table: {
		marginTop: 0,
		borderTopWidth: 1.2,
		borderLeftWidth: 1.2,
		borderRightWidth: 1.2,
	},

	tableHeader: {
		flexDirection: "row",
		minHeight: 47,
		borderBottomWidth: 0.6,
	},

	columnNumber: {
		width: "7%",
	},

	columnDate: {
		width: "13%",
	},

	columnDocument: {
		width: "16%",
		textAlign: "center",
	},

	columnDescription: {
		width: "19%",
		textAlign: "center",
	},

	columnCash: {
		width: "15%",
		textAlign: "center",
	},

	columnNonCash: {
		width: "15%",
		textAlign: "center",
	},

	columnTotal: {
		width: "15%",
		textAlign: "center",
	},

	headerCell: {
		justifyContent: "center",
		alignItems: "center",
		textAlign: "center",
		paddingHorizontal: 3,
		borderRightWidth: 0.6,
	},

	headerCellLast: {
		borderRightWidth: 0,
	},

	headerText: {
		fontSize: 7.5,
		lineHeight: 1.15,
	},

	headerNumber: {
		marginTop: 5,
		fontSize: 7,
	},

	dataRow: {
		flexDirection: "row",
		height: 21,
		borderBottomWidth: 0.6,
	},

	dataCell: {
		justifyContent: "center",
		paddingHorizontal: 4,
		borderRightWidth: 0.6,
		fontSize: 7.5,
	},

	dataCellLast: {
		borderRightWidth: 0,
	},

	center: {
		textAlign: "center",
	},

	right: {
		textAlign: "right",
	},

	footer: {
		marginTop: 38,
		fontSize: 7.5,
		lineHeight: 1.25,
	},

	footerLine: {
		width: 145,
		borderTopWidth: 0.8,
		marginBottom: 4,
	},

	footerText: {
		maxWidth: 700,
	},
});

function formatAmount(value: number): string {
	return new Intl.NumberFormat("hr-HR", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(value);
}

function GeneralData({ data }: { data: KprData }) {
	return (
		<>
			{/* I. OPĆI PODACI */}
			<View style={styles.sectionTitle}>
				<Text>I. OPĆI PODACI O POREZNOM OBVEZNIKU</Text>
			</View>

			{/* 1. NAZIV DJELATNOSTI + ŠIFRA */}
			<View style={styles.activityRow}>
				<View style={styles.activityLabel}>
					<Text>1. NAZIV DJELATNOSTI</Text>
				</View>

				<View style={styles.activityValue}>
					<Text>{data.business?.activity_name ?? ""}</Text>
				</View>

				<View style={styles.activityCodeLabel}>
					<Text>ŠIFRA DJELATNOSTI</Text>
				</View>

				<View style={styles.activityCodeValue}>
					<Text>{data.business?.activity_code ?? ""}</Text>
				</View>
			</View>

			{/* 2. IME I PREZIME */}
			<View style={styles.row}>
				<View style={[styles.label, styles.fullLabel]}>
					<Text>
						2. IME I PREZIME PODUZETNIKA / NOSITELJA ZAJEDNIČKE DJELATNOSTI
					</Text>
				</View>

				<View style={[styles.value, styles.fullValue]}>
					<Text>{data.user?.name}</Text>
				</View>
			</View>

			{/* 3. ADRESA */}
			<View style={styles.row}>
				<View style={[styles.label, styles.fullLabel]}>
					<Text>3. ADRESA PREBIVALIŠTA/UOBIČAJENOG BORAVIŠTA</Text>
				</View>

				<View style={[styles.value, styles.fullValue]}>
					<Text>
						{data.business?.street ?? ""} {data.business?.city ?? ""}{" "}
						{data.business?.postalCode ?? ""}
					</Text>
				</View>
			</View>

			{/* 4. OIB */}
			<View style={[styles.row, styles.rowLast]}>
				<View style={[styles.label, styles.fullLabel]}>
					<Text>4. OIB PODUZETNIKA/NOSITELJA ZAJEDNIČKE DJELATNOSTI</Text>
				</View>

				<View style={[styles.value, styles.fullValue]}>
					<Text>{data.business?.oib ?? ""}</Text>
				</View>
			</View>

			{/* II. POSLOVNA JEDINICA */}
			<View style={styles.sectionTitle}>
				<Text>II. PODACI O POSLOVNOJ JEDINICI</Text>
			</View>

			{/* 1. NAZIV */}
			<View style={styles.row}>
				<View style={[styles.label, styles.fullLabel]}>
					<Text>1. NAZIV</Text>
				</View>

				<View style={[styles.value, styles.fullValue]}>
					<Text>{data.business?.business_name ?? ""}</Text>
				</View>
			</View>

			{/* 2. ADRESA */}
			<View style={[styles.row, styles.rowLast]}>
				<View style={[styles.label, styles.fullLabel]}>
					<Text>2. ADRESA</Text>
				</View>

				<View style={[styles.value, styles.fullValue]}>
					<Text>
						{data.business?.street ?? ""} {data.business?.city ?? ""}{" "}
						{data.business?.postalCode ?? ""}
					</Text>
				</View>
			</View>
		</>
	);
}

function KprTable({
	invoices,
	year,
}: {
	invoices: InvoiceWithItems[];
	year?: Date | null;
}) {
	return (
		<View style={styles.table}>
			{/* HEADER */}
			<View style={styles.tableHeader}>
				<View style={[styles.headerCell, styles.columnNumber]}>
					<Text style={styles.headerText}>R. BR.</Text>
					<Text style={styles.headerNumber}>1</Text>
				</View>

				<View style={[styles.headerCell, styles.columnDate]}>
					<Text style={styles.headerText}>NADNEVAK</Text>
					<Text style={styles.headerNumber}>2</Text>
				</View>

				<View style={[styles.headerCell, styles.columnDocument]}>
					<Text style={styles.headerText}>BROJ TEMELJNICE</Text>
					<Text style={styles.headerNumber}>3</Text>
				</View>

				<View style={[styles.headerCell, styles.columnDescription]}>
					<Text style={styles.headerText}>OPIS ISPRAVA O</Text>
					<Text style={styles.headerText}>PRIMICIMA U GOTOVINI</Text>
					<Text style={styles.headerNumber}>4</Text>
				</View>

				<View style={[styles.headerCell, styles.columnCash]}>
					<Text style={styles.headerText}>IZNOS NAPLAĆEN</Text>
					<Text style={styles.headerText}>U GOTOVINI /</Text>
					<Text style={styles.headerText}>ČEKOVIMA</Text>
					<Text style={styles.headerNumber}>5</Text>
				</View>

				<View style={[styles.headerCell, styles.columnNonCash]}>
					<Text style={styles.headerText}>IZNOS NAPLAĆEN</Text>
					<Text style={styles.headerText}>BEZGOTOVINSKIM</Text>
					<Text style={styles.headerText}>PUTEM¹</Text>
					<Text style={styles.headerNumber}>6</Text>
				</View>

				<View
					style={[styles.headerCell, styles.columnTotal, styles.headerCellLast]}
				>
					<Text style={styles.headerText}>UKUPNO</Text>
					<Text style={styles.headerText}>NAPLAĆENI</Text>
					<Text style={styles.headerText}>IZNOS</Text>
					<Text style={styles.headerNumber}>7 (5+6)</Text>
				</View>
			</View>

			{invoices
				.sort(
					(a, b) =>
						new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime(),
				)
				.filter(
					(entry) =>
						entry.status !== "DRAFT" &&
						(!year ||
							new Date(entry.issueDate).getFullYear() === year.getFullYear()),
				)
				.map((entry, index) => (
					<View style={styles.dataRow} key={`${entry.invoiceNumber}-${index}`}>
						<View style={[styles.dataCell, styles.columnNumber, styles.center]}>
							<Text>{index + 1}</Text>
						</View>

						<View style={[styles.dataCell, styles.columnDate, styles.center]}>
							<Text>
								{new Date(entry.issueDate).toLocaleDateString("hr-HR")}
							</Text>
						</View>

						<View style={[styles.dataCell, styles.columnDocument]}>
							<Text>{entry.invoiceNumber}</Text>
						</View>

						<View style={[styles.dataCell, styles.columnDescription]}>
							<Text>
								{entry.invoicePayments.filter((item) => item.method === "CASH")
									.length > 0
									? "Blagajnički izvještaj"
									: ""}
							</Text>
						</View>

						<View style={[styles.dataCell, styles.columnCash]}>
							<Text>
								{formatAmount(
									entry.invoicePayments
										.filter((item) => item.method === "CASH")
										.reduce((sum, item) => sum + item.amount, 0),
								)}
							</Text>
						</View>

						<View style={[styles.dataCell, styles.columnNonCash]}>
							<Text>
								{formatAmount(
									entry.invoicePayments
										.filter((item) => item.method === "BANK_TRANSFER")
										.reduce((sum, item) => sum + item.amount, 0),
								)}
							</Text>
						</View>

						<View
							style={[styles.dataCell, styles.columnTotal, styles.dataCellLast]}
						>
							<Text>
								{formatAmount(
									entry.invoiceItems.reduce(
										(sum, item) => sum + item.amount,
										0,
									),
								)}
							</Text>
						</View>
					</View>
				))}
		</View>
	);
}

function KprFooter() {
	return (
		<View style={styles.footer}>
			<View style={styles.footerLine} />

			<Text style={styles.footerText}>
				¹ Popunjava porezni obveznik koji porez na dohodak od samostalne
				djelatnosti plaća u paušalnom iznosu u skladu s Pravilnikom o paušalnom
				oporezivanju samostalnih djelatnosti
			</Text>
		</View>
	);
}

export function KprDocument({ data }: { data: KprData }) {
	return (
		<Document
			title="Knjiga prometa"
			author="Invox"
			subject="Obrazac KPR - Knjiga prometa"
		>
			<Page size="A4" orientation="landscape" style={styles.page}>
				<View style={styles.header}>
					<Text style={styles.formNumber}>Obrazac KPR</Text>

					<Text style={styles.title}>KNJIGA PROMETA</Text>

					<Text style={styles.subtitle}>- iznosi u eurima i centima -</Text>
				</View>

				<GeneralData data={data} />

				<KprTable invoices={data.invoices} year={data.year} />

				<KprFooter />
			</Page>
		</Document>
	);
}

export function DownloadKpr({ data }: { data: KprData }) {
	return (
		<PDFDownloadLink
			document={<KprDocument data={data} />}
			fileName={
				data.year ? `KPR-${data.year.getFullYear()}.pdf` : "KPR-sve-godine.pdf"
			}
		>
			{({ loading }) => (
				<Button size="lg" className="h-full">
					{loading ? "KPR ažurira..." : "Preuzmi KPR"}
				</Button>
			)}
		</PDFDownloadLink>
	);
}
