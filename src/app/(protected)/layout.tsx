import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getCurrentBusiness } from "@/features/business/queries";

export default async function RootLayout({ children }: LayoutProps<"/">) {
	const userBusiness = await getCurrentBusiness();
	return (
		<SidebarProvider>
			<AppSidebar business={userBusiness ?? null} />
			<SidebarTrigger className="absolute" />
			<main className="flex-1 py-10 px-2.5 lg:p-10">{children}</main>
		</SidebarProvider>
	);
}
