"use client";

import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createUser } from "@/features/auth/actions";
import { useActionState, useEffect, useState } from "react";
import { useFormValues } from "@/hooks/use-form-values";
import { Checkbox } from "../../../components/ui/checkbox";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "@/lib/auth-client";
import { Separator } from "../../../components/ui/separator";

export default function RegisterForm() {
	const [state, formAction, isPending] = useActionState(createUser, null);
	const { formValues, setFormValues, handleInputChange } = useFormValues({
		firstname: "",
		surname: "",
		email: "",
		password: "",
		passwordConfirmation: "",
	});
	const [termsAccepted, setTermsAccepted] = useState(false);

	const [isSocialPending, setIsSocialPending] = useState(false);

	useEffect(() => {
		if (state?.status !== "success") {
			return;
		}

		setFormValues({
			firstname: "",
			surname: "",
			email: "",
			password: "",
			passwordConfirmation: "",
		});
		setTermsAccepted(false);
	}, [state?.status]);

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
				<h1 className="text-xl font-semibold">Kreiraj Invox račun</h1>
				<p>Fakturiranje za paušalne obrtnike</p>
			</div>
			<FieldSet className="w-full">
				<FieldGroup>
					<div className="grid md:grid-cols-2 gap-4">
						<Field>
							<FieldLabel htmlFor="firstname">
								Ime <span className="text-destructive">*</span>
							</FieldLabel>
							<Input
								id="firstname"
								name="firstname"
								type="text"
								placeholder="Maks"
								value={formValues.firstname}
								onChange={handleInputChange}
								required
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="surname">
								Prezime <span className="text-destructive">*</span>
							</FieldLabel>
							<Input
								id="surname"
								name="surname"
								type="text"
								placeholder="Leiter"
								value={formValues.surname}
								onChange={handleInputChange}
								required
							/>
						</Field>
					</div>

					<Field>
						<FieldLabel htmlFor="email">
							E-pošta <span className="text-destructive">*</span>
						</FieldLabel>
						<Input
							id="email"
							name="email"
							type="email"
							placeholder="maks.leiter@example.com"
							value={formValues.email}
							onChange={handleInputChange}
							required
						/>
					</Field>

					<Field>
						<FieldLabel htmlFor="password">
							Lozinka <span className="text-destructive">*</span>
						</FieldLabel>
						<Input
							id="password"
							name="password"
							type="password"
							placeholder="Najmanje 8 znakova"
							value={formValues.password}
							onChange={handleInputChange}
							required
						/>
					</Field>

					<Field>
						<FieldLabel htmlFor="passwordConfirmation">
							Potvrda lozinke <span className="text-destructive">*</span>
						</FieldLabel>
						<Input
							id="passwordConfirmation"
							name="passwordConfirmation"
							type="password"
							placeholder="Potvrdi lozinku"
							value={formValues.passwordConfirmation}
							onChange={handleInputChange}
							required
						/>
					</Field>

					<Field orientation="horizontal">
						<Checkbox
							id="terms"
							name="terms"
							checked={termsAccepted}
							onCheckedChange={setTermsAccepted}
						/>
						<FieldLabel htmlFor="terms" className="font-normal text-sm gap-1">
							Slažem se s
							<span className="font-semibold"> uvjetima korištenja</span>
						</FieldLabel>
					</Field>

					<Field orientation="responsive">
						<Button size="lg" type="submit" disabled={isPending}>
							Kreiraj račun
						</Button>
					</Field>
				</FieldGroup>

				<div className="text-sm text-muted mt-2 text-center">
					Već imate račun?{" "}
					<Link href="/login" className="text-primary font-semibold">
						Prijavite se{" "}
					</Link>
				</div>
			</FieldSet>

			{state?.status === "error" && state.messages && (
				<div className="text-sm text-destructive mt-2 bg-destructive-foreground p-2 rounded-lg border border-destructive">
					{state.messages.map((message, index) => (
						<p key={index}>{message}</p>
					))}
				</div>
			)}

			{state?.status === "success" && (
				<div className="text-sm text-success mt-2 bg-success-foreground p-2 rounded-lg border border-success">
					<p>{state.message}</p>
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
