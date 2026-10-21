"use client";

import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { resetPasswordRequest } from "@/features/auth/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ResetPasswordForm() {
	const [state, formAction, isPending] = useActionState(
		resetPasswordRequest,
		null,
	);

	return (
		<form action={formAction} className="w-full max-w-105 mx-auto">
			<Image
				src="/logo-dark.svg"
				alt="Logo"
				className="mx-auto mb-4 max-w-50 h-auto"
				width={640}
				height={640}
				loading="eager"
			/>
			<div className="text-center mb-10">
				<h1 className="text-xl font-semibold">Resetiranje lozinke</h1>
				<p>Unesite svoju e-poštu kako biste resetirali lozinku</p>
			</div>
			<FieldSet className="w-full">
				<FieldGroup>
					<Field>
						<FieldLabel htmlFor="email">Email</FieldLabel>
						<Input
							id="email"
							name="email"
							type="email"
							placeholder="email@example.com"
						/>
					</Field>

					<Button size="lg" type="submit" disabled={isPending}>
						Resetiraj lozinku
					</Button>
				</FieldGroup>
			</FieldSet>
			{state?.status === "success" && (
				<div className="text-sm text-success mt-2 bg-success-foreground p-2 rounded-lg border border-success">
					<p>{state.message}</p>
				</div>
			)}

			{state?.status === "error" && (
				<div className="text-sm text-destructive mt-2 bg-destructive-foreground p-2 rounded-lg border border-destructive">
					{state?.message}
				</div>
			)}
		</form>
	);
}
