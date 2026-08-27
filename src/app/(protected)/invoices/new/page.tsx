import React from "react";
import InvoiceForm from "@/features/invoices/components/invoice-form";
import { getUserClients } from "@/features/clients/queries";
import { getUserArticles } from "@/features/articles/queries";
import { getCurrentBusiness } from "@/features/business/queries";
import { getCurrentUser } from "@/features/dashboard/queries";
import { getLastInvoiceNumber } from "@/features/invoices/queries";
export default async function NewInvoicePage() {
	const userClients = await getUserClients();
	const userArticles = await getUserArticles();
	const userBusiness = await getCurrentBusiness();
	const [user, lastInvoiceNumber] = await Promise.all([
		getCurrentUser(),
		getLastInvoiceNumber(),
	]);
	return (
		<div>
			<InvoiceForm
				invoiceData={null}
				clientsData={userClients ?? []}
				articlesData={userArticles ?? []}
				businessData={userBusiness ?? null}
				userData={user ?? null}
				lastInvoiceNumber={lastInvoiceNumber}
			/>
		</div>
	);
}
