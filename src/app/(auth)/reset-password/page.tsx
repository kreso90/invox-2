import { Loader } from "@/components/loader";
import { ChangePasswordForm } from "@/features/auth/components/change-password-form";
import { Suspense } from "react";

export default async function ResetPasswordPage() {
	return (
		<div className="flex items-center h-screen px-2.5">
			<Suspense fallback={<Loader />}>
				<ChangePasswordForm />
			</Suspense>
		</div>
	);
}
