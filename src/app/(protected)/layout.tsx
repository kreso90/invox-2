import { Toaster } from "@/components/ui/toast";
import { getCurrentBusiness } from "@/features/business/queries";
import { Navigation } from "@/components/navigation";
import { getCurrentUser } from "@/features/dashboard/queries";

export default async function RootLayout({ children }: LayoutProps<"/">) {
	const userBusiness = await getCurrentBusiness();
	const user = await getCurrentUser();
	return (
		<div className="grid grid-cols-1 lg:grid-cols-[16rem_1fr]">
			<Navigation business={userBusiness ?? null} user={user ?? null} />
			<main className="flex-1 pt-10 pb-35 px-2.5 lg:p-10">{children}</main>
			<Toaster />
		</div>
	);
}
