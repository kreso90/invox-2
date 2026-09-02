import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarTrigger className="absolute" />
			<main className="flex-1 py-10 px-2.5 lg:p-10">{children}</main>
		</SidebarProvider>
	);
}
