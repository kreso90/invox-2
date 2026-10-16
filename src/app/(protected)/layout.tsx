import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toast";
import { getCurrentBusiness } from "@/features/business/queries";
import { Navigation } from "@/components/navigation";
import { Suspense } from "react";
import { LoaderCircle } from "lucide-react";

export default async function RootLayout({ children }: LayoutProps<"/">) {
	const userBusiness = await getCurrentBusiness();
	return (
		<div className="grid grid-cols-1 lg:grid-cols-[16rem_1fr]">
			{/* <AppSidebar business={userBusiness ?? null} /> */}
			{/* <SidebarTrigger className="absolute hidden lg:block" /> */}
			<Navigation business={userBusiness ?? null} />
			<main className="flex-1 pt-10 pb-35 px-2.5 lg:p-10">{children}</main>
			<Toaster />
		</div>
	);
}
