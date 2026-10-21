import { ChangePasswordForm } from "@/features/auth/components/change-password-form";

export default async function ResetPasswordPage() {
	return (
		<div className="flex items-center h-screen px-2.5">
			<ChangePasswordForm />
		</div>
	);
}
