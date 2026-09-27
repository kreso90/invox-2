import InvoiceForm from "@/features/invoices/components/invoice-form";
import { getUserClients } from "@/features/clients/queries";
import { getUserArticles } from "@/features/articles/queries";
import { getCurrentBusiness } from "@/features/business/queries";
import { getCurrentUser } from "@/features/dashboard/queries";
import { getCurrentSettings } from "@/features/settings/queries";

export default async function NewInvoicePage() {
	const [user, userBusiness, userArticles, userClients, settingsData] =
		await Promise.all([
			getCurrentUser(),
			getCurrentBusiness(),
			getUserArticles(),
			getUserClients(),
			getCurrentSettings(),
		]);
	return (
		<div>
			<InvoiceForm
				invoiceData={null}
				clientsData={userClients ?? []}
				articlesData={userArticles ?? []}
				businessData={userBusiness ?? null}
				userData={user ?? null}
				settingsData={settingsData}
			/>
		</div>
	);
}
