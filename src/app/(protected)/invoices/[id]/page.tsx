import InvoiceForm from "@/features/invoices/components/invoice-form";
import { getUserInvoice } from "@/features/invoices/queries";
import { getUserClients } from "@/features/clients/queries";
import { getUserArticles } from "@/features/articles/queries";
import { getCurrentBusiness } from "@/features/business/queries";
import { getCurrentUser } from "@/features/dashboard/queries";
import { notFound } from "next/navigation";

export default async function InvoicePage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const [invoice, clients, articles, business, user] = await Promise.all([
		getUserInvoice(id),
		getUserClients(),
		getUserArticles(),
		getCurrentBusiness(),
		getCurrentUser(),
	]);

	if (!invoice) {
		notFound();
	}

	return (
		<InvoiceForm
			invoiceData={invoice}
			clientsData={clients ?? []}
			articlesData={articles ?? []}
			businessData={business}
			userData={user}
			settingsData={null}
		/>
	);
}
