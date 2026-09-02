import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
  PDFDownloadLink,
} from '@react-pdf/renderer';
import { paymentLabels } from "../constants";
import { unitLabelsShort } from "../../articles/constants";

const translations = {
  hr: {
    locale: 'hr-HR',
    fileName: 'racun',
    download: 'Hrvatski',
    invoice: 'Račun',
    email: 'Email',
    vatNumber: 'PDV broj',
    bank: 'Banka',
    issuedAt: 'Mjesto izdavanja',
    issued: 'Izdano',
    dueDate: 'Dospijeće',
    paymentMethod: 'Način plaćanja',
    item: 'Stavka',
    quantity: 'Kol.',
    price: 'Cijena',
    unit: 'JM',
    amount: 'Iznos',
    total: 'Ukupno',
    issuedBy: 'Izdao/la',
    reference: 'poziv na broj',
    vatExemption: 'Obrtnik nije u sustavu PDV-a (čl. 90. st. 2. Zakona o PDV-u).',
    paymentLabels,
    unitLabelsShort,
  },
  en: {
    locale: 'en-GB',
    fileName: 'invoice',
    download: 'Engleski',
    invoice: 'Invoice',
    email: 'Email',
    vatNumber: 'VAT number',
    bank: 'Bank',
    issuedAt: 'Place of issue',
    issued: 'Issue date',
    dueDate: 'Due date',
    paymentMethod: 'Payment method',
    item: 'Item',
    quantity: 'Qty.',
    price: 'Price',
    unit: 'Unit',
    amount: 'Amount',
    total: 'Total',
    issuedBy: 'Issued by',
    reference: 'reference number',
    vatExemption: 'The business is not registered for VAT.',
    paymentLabels: {
      CASH: 'Cash',
      BANK_TRANSFER: 'Bank transfer',
    },
    unitLabelsShort: {
      PIECE: 'pcs',
      HOUR: 'hr',
      DAY: 'day',
      METER: 'm',
      SQUARE_METER: 'm²',
      LITER: 'l',
      KILOGRAM: 'kg',
    },
  },
};
Font.register({
  family: 'IBM Plex Sans',
  fonts: [
    { src: '/fonts/IBMPlexSans-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/IBMPlexSans-SemiBold.ttf', fontWeight: 600 },
    { src: '/fonts/IBMPlexSans-Bold.ttf', fontWeight: 700 },
  ],
});

Font.register({
  family: 'IBM Plex Mono',
  fonts: [
    { src: '/fonts/IBMPlexMono-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/IBMPlexMono-SemiBold.ttf', fontWeight: 600 },
  ],
});

const COLORS = {
  ink: '#1B2233',
  inkSoft: '#5B6478',
  inkFaint: '#8B917F',
  line: '#D6D4C6',
};

const styles = StyleSheet.create({
  page: {
    padding: 42,
    fontSize: 9,
    fontFamily: 'IBM Plex Sans',
    backgroundColor: '#FFFFFF',
  },
  label: {
    fontFamily: 'IBM Plex Sans',
    fontWeight: 600,
    fontSize: 10,
    color: COLORS.ink,
  },

  toName: {
    fontFamily: 'IBM Plex Sans',
    fontWeight: 700,
    fontSize: 10.5,
    color: COLORS.ink,
    marginBottom: 3,
  },

  table: { width: '100%' },
  tableHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
    paddingBottom: 7,
    marginBottom: 2,
  },
  tableHeaderCell: {
    fontSize: 7.5,
    fontFamily: 'IBM Plex Sans',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    color: COLORS.inkFaint,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.2,
    borderBottomColor: COLORS.line,
    paddingVertical: 8,
  },
  colName: { flex: 3.2 },
  colQty: { flex: 0.6, textAlign: 'center' },
  colPrice: { flex: 1, textAlign: 'right', fontFamily: 'IBM Plex Mono' },
  colAmount: { flex: 1, textAlign: 'right', fontFamily: 'IBM Plex Mono' },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 26,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'baseline',
    marginTop: 12,
    paddingTop: 4,
  },
  totalLabel: {
    fontSize: 10.5,
    fontFamily: 'IBM Plex Sans',
    fontWeight: 700,
    color: COLORS.ink,
    marginRight: 18,
  },
  totalAmount: {
    fontSize: 14,
    fontFamily: 'IBM Plex Mono',
    fontWeight: 600,
    color: COLORS.ink,
  },

  footer: {
    marginTop: 30,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.line,
    borderTopStyle: 'dashed',
    fontSize: 7.5,
    color: COLORS.inkFaint,
    lineHeight: 1.7,
  },

  pageFootNote: {
    position: 'absolute',
    bottom: 28,
    left: 42,
    right: 42,
    fontSize: 7,
    color: COLORS.inkFaint,
    textAlign: 'center',
  },
});

export function InvoicePDF({ invoice, business, client, user, language }) {
  const labels = translations[language];
  const formatDate = (date) => new Intl.DateTimeFormat(labels.locale).format(new Date(date));
  const formatAmount = (amount) => amount.toLocaleString(labels.locale, { style: 'currency', currency: 'EUR' });

  return (
    <Document title={`${labels.invoice} ${invoice.invoiceNumber}`}>
      <Page size="A4" style={styles.page}>

        <View style={{ marginBottom: 20 }}>
          <Text style={styles.toName}>{business.business_name}, vl. {user?.name}</Text>
          <Text>{business.street}, {business.postalCode} {business.city}</Text>
          <Text><Text style={styles.label}>{labels.email}:</Text> {business?.email}</Text>
          {business.vatId && <Text><Text style={styles.label}>{labels.vatNumber}:</Text> {business.vatId}</Text>}
          {business.bank && <Text><Text style={styles.label}>{labels.bank}:</Text> {business.bank}</Text>}
          {business.iban && <Text><Text style={styles.label}>IBAN:</Text> {business.iban}</Text>}
          {business.swift && <Text><Text style={styles.label}>SWIFT/BIC:</Text> {business.swift}</Text>}
        </View>

        <View style={styles.headerRow}>
          <View>
            <Text style={styles.toName}>{client.companyName}</Text>
            <Text>{[client.address, [client.postalCode, client.city].filter(Boolean).join(' ')].filter(Boolean).join(', ')}</Text>
            <Text><Text style={styles.label}>OIB:</Text> {client.oib ?? '-'}</Text>
            {client.vatNumber && <Text><Text style={styles.label}>{labels.vatNumber}:</Text> {client.vatNumber}</Text>}
          </View>
      
          <View>
            <Text style={styles.toName}>{labels.invoice} {invoice.invoiceNumber}</Text>
            <Text>{labels.issuedAt}: {invoice.issuePlace}</Text>
            <Text>{labels.issued}: {formatDate(invoice.issueDate)}</Text>
            <Text>{labels.dueDate}: {formatDate(invoice.dueDate)}</Text>
            <Text>{labels.paymentMethod}: {labels.paymentLabels[invoice.paymentMethod]}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableHeaderCell, styles.colName]}>{labels.item}</Text>
            <Text style={[styles.tableHeaderCell, styles.colQty]}>{labels.quantity}</Text>
            <Text style={[styles.tableHeaderCell, styles.colQty]}>{labels.unit}</Text>
            <Text style={[styles.tableHeaderCell, styles.colPrice]}>{labels.price}</Text>
            <Text style={[styles.tableHeaderCell, styles.colAmount]}>{labels.amount}</Text>
          </View>

          {invoice.invoiceItems.map((item) => (
            <View style={styles.tableRow} key={item.id}>
              <Text style={styles.colName}>{item.name}</Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colQty}>{labels.unitLabelsShort[item.unit] ?? '-'}</Text>
              <Text style={styles.colPrice}>{formatAmount(item.unitPrice)}</Text>
              <Text style={styles.colAmount}>{formatAmount(item.amount)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>{labels.total}:</Text>
          <Text style={styles.totalAmount}>{formatAmount(invoice.totalAmount)}</Text>
        </View>

        <View style={styles.footer}>
          <Text>{labels.vatExemption}</Text>
          <Text>
            IBAN: {business.iban ?? '-'} — {labels.reference}: {invoice.invoiceNumber}
          </Text>
          {invoice.note ? <Text style={{ marginTop: 4 }}>{invoice.note}</Text> : null}
        </View>

        <View style={{ textAlign: 'right' }}>
          <Text>{labels.issuedBy}: {user?.name ?? '-'}</Text>
        </View>

        <Text style={styles.pageFootNote}>
          {business.business_name} · OIB: {business.oib}
        </Text>
      </Page>
    </Document>
  );
}


export function DownloadInvoiceButton({ invoice, business, client, user, language }) {
  const labels = translations[language];

   return (
     <PDFDownloadLink
      document={<InvoicePDF invoice={invoice} business={business} client={client} user={user} language={language} />}
      fileName={`${labels.fileName}-${invoice.invoiceNumber}.pdf`}
     >
       {({ loading }) => (loading ? 'Priprema PDF...' :  <button className="w-full py-1 hover:bg-background cursor-pointer rounded-lg font-medium">{labels.download}</button>)}
     </PDFDownloadLink>
   );
 }


