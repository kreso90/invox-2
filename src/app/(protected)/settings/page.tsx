import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BusinessProfileForm from "@/features/business/components/business-profile-form";
import TaxForm from "@/features/business/components/tax-form";
import { getCurrentBusiness } from "@/features/business/queries";
import { userAgentFromString } from "next/server";
import { headers } from "next/headers";

export default async function SettingsPage() {
	const businessData = await getCurrentBusiness();
	async function isServerMobile() {
		const headersList = headers();
		const userAgent = (await headersList).get("user-agent");
		const { device } = userAgentFromString(userAgent || undefined);

		return device.type === "mobile" || device.type === "tablet";
	}

	return (
		<>
			<div className="flex flex-col mb-8">
				<h1 className="page-title">Postavke</h1>
				<span className="font-mono text-sm">{businessData?.business_name}</span>
			</div>

			<Tabs
				defaultValue="business_profile"
				orientation={(await isServerMobile()) ? "horizontal" : "vertical"}
				className="grid lg:grid-cols-[200px_1fr] gap-4"
			>
				<TabsList>
					<TabsTrigger value="business_profile">Podaci o obrtu</TabsTrigger>
					<TabsTrigger value="tax">Paušalno oporezivanje</TabsTrigger>
					<TabsTrigger value="notifications">Obavijesti</TabsTrigger>
				</TabsList>

				<TabsContent value="business_profile">
					<BusinessProfileForm businessData={businessData} />
				</TabsContent>
				<TabsContent value="tax">
					<TaxForm businessData={businessData} />
				</TabsContent>
			</Tabs>
		</>
	);
}
