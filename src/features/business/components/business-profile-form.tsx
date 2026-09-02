"use client";
import {
	Field,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "../../../components/ui/field";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { createBusiness } from "@/features/business/actions";
import { act, useActionState } from "react";
import { Business } from "@/features/business/types";
import { useFormValues } from "@/hooks/use-form-values";

interface businessProfileFormProps {
	businessData?: Business | null;
}

export default function BusinessProfileForm({
	businessData,
}: businessProfileFormProps) {
	const isEditMode = Boolean(businessData);

	const [state, fromAction, isPending] = useActionState(createBusiness, null);

	const initialValues = {
		businessName: businessData?.business_name || "",
		oib: businessData?.oib || "",
		address: businessData?.street || "",
		city: businessData?.city || "",
		postalCode: businessData?.postalCode || "",
		businessCode: businessData?.activity_code || "",
		activityName: businessData?.activity_name || "",
		vatNumber: businessData?.vatId || "",
		email: businessData?.email || "",
		iban: businessData?.iban || "",
		bankName: businessData?.bankName || "",
		swiftCode: businessData?.swiftCode || "",
	};
	const { formValues, handleInputChange } = useFormValues(initialValues);

	return (
		<form action={fromAction} className="w-full">
			<div className="font-semibold text-base">Podaci o obrtu</div>
			<div className="text-muted text-sm mb-5">
				Ovi podaci se prikazuju u zaglavlju svakog izdanog računa.
			</div>

			<FieldSet className="w-full">
				<FieldGroup>
					<Field>
						<FieldLabel htmlFor="businessName">
							Naziv obrta <span className="text-destructive">*</span>
						</FieldLabel>
						<Input
							id="businessName"
							name="businessName"
							type="text"
							placeholder="Maks"
							value={formValues.businessName}
							onChange={handleInputChange}
							required
						/>
					</Field>
					<div className="grid md:grid-cols-2 md:gap-4">
						<Field>
							<FieldLabel htmlFor="email">
								Email <span className="text-destructive">*</span>
							</FieldLabel>
							<Input
								id="email"
								name="email"
								type="text"
								placeholder="example@example.com"
								value={formValues.email}
								onChange={handleInputChange}
								required
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="oib">
								OIB <span className="text-destructive">*</span>
							</FieldLabel>
							<Input
								id="oib"
								name="oib"
								type="text"
								placeholder="12345678901"
								value={formValues.oib}
								onChange={handleInputChange}
								required
							/>
						</Field>
					</div>

					<div className="grid md:grid-cols-3 md:gap-4">
						<Field>
							<FieldLabel htmlFor="address">
								Adresa <span className="text-destructive">*</span>
							</FieldLabel>
							<Input
								id="address"
								name="address"
								type="text"
								placeholder="Ulica 123"
								value={formValues.address}
								onChange={handleInputChange}
								required
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="city">
								Grad <span className="text-destructive">*</span>
							</FieldLabel>
							<Input
								id="city"
								name="city"
								type="text"
								placeholder="Zagreb"
								value={formValues.city}
								onChange={handleInputChange}
								required
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="postalCode">
								Poštanski broj <span className="text-destructive">*</span>
							</FieldLabel>
							<Input
								id="postalCode"
								name="postalCode"
								type="text"
								placeholder="10000"
								value={formValues.postalCode}
								onChange={handleInputChange}
								required
							/>
						</Field>
					</div>

					<div className="grid md:grid-cols-3 md:gap-4">
						<Field>
							<FieldLabel htmlFor="activityName">
								Naziv djelatnosti <span className="text-destructive">*</span>
							</FieldLabel>
							<Input
								id="activityName"
								name="activityName"
								type="text"
								placeholder="Naziv djelatnosti"
								value={formValues.activityName}
								onChange={handleInputChange}
								required
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="businessCode">
								Šifra djelatnosti <span className="text-destructive">*</span>
							</FieldLabel>
							<Input
								id="businessCode"
								name="businessCode"
								type="text"
								placeholder="Šifra djelatnosti"
								value={formValues.businessCode}
								onChange={handleInputChange}
								required
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="vatNumber">PDV broj</FieldLabel>
							<Input
								id="vatNumber"
								name="vatNumber"
								type="text"
								value={formValues.vatNumber}
								onChange={handleInputChange}
								placeholder="12345678901"
							/>
						</Field>
					</div>

					<div className="grid md:grid-cols-3 md:gap-4">
						<Field>
							<FieldLabel htmlFor="bankName">Naziv banke</FieldLabel>
							<Input
								id="bankName"
								name="bankName"
								type="text"
								value={formValues.bankName}
								onChange={handleInputChange}
								placeholder="Zagrebačka banka"
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="iban">IBAN</FieldLabel>
							<Input
								id="iban"
								name="iban"
								type="text"
								value={formValues.iban}
								onChange={handleInputChange}
								placeholder="HR1234567890123456789"
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="swiftCode">SWIFT</FieldLabel>
							<Input
								id="swiftCode"
								name="swiftCode"
								type="text"
								value={formValues.swiftCode}
								onChange={handleInputChange}
								placeholder="ABCDHR2X"
							/>
						</Field>
					</div>

					<Button
						size="lg"
						type="submit"
						className="ml-auto"
						disabled={isPending}
					>
						Spremi promjene
					</Button>
				</FieldGroup>
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
		</form>
	);
}
