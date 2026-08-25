"use client";

import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldSet,
	FieldError,
} from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login } from "@/features/auth/actions";
import { useActionState, useState } from "react";
import { signIn } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";

export default function LoginForm() {
	const [state, formAction, isPending] = useActionState(login, null);
	const [isSocialPending, setIsSocialPending] = useState(false);

	async function handleClick() {
		setIsSocialPending(true);

		await signIn.social({
			provider: "google",
			callbackURL: "/",
			errorCallbackURL: "/auth/login/error",
		});

		setIsSocialPending(false);
	}

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
				<h1 className="text-xl font-semibold">Prijava u Invox</h1>
				<p>Fakturiranje za paušalne obrtnike</p>
			</div>
			<FieldSet className="w-full">
				<FieldGroup>
					<Field>
						<FieldLabel htmlFor="email">Email</FieldLabel>
						<Input
							id="email"
							name="email"
							type="email"
							placeholder="max.leiter@example.com"
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor="password">Lozinka</FieldLabel>
						<Input
							id="password"
							name="password"
							type="password"
							placeholder="Unesite svoju lozinku"
						/>
					</Field>

					<Button size="lg" type="submit" disabled={isPending}>
						Prijavi se
					</Button>
					<div className="text-sm text-muted mt-2 text-center">
						Nemaš račun?{" "}
						<Link href="/register" className="text-primary font-semibold">
							Registriraj se{" "}
						</Link>
					</div>
				</FieldGroup>
			</FieldSet>

			{state?.status === "error" && (
				<div className="text-sm text-destructive mt-2 bg-destructive-foreground p-2 rounded-lg border border-destructive">
					{state?.message}
				</div>
			)}

			<Separator className="mt-4" />
			<Button
				size="lg"
				className="w-full mt-4"
				variant="outline"
				type="button"
				onClick={handleClick}
				disabled={isSocialPending}
			>
				Google prijava
			</Button>
		</form>
	);
}
