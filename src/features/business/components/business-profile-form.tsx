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
import { Card } from "@/components/ui/card";

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
		ownerFirstName: businessData?.ownerFirstName || "",
		ownerLastName: businessData?.ownerLastName || "",
		oib: businessData?.oib || "",
		address: businessData?.street || "",
		houseNumber: businessData?.houseNumber || "",
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
		<form action={fromAction} className="no-wrapper">
			<Card className="p-6 mb-4">
				<div className="mb-4">
					<div className="font-semibold text-base">Osnovni podaci</div>
					<p className="text-muted text-sm">
						Prikazuju se u zaglavlju svakog izdanog računa i ponude.
					</p>
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
								<FieldLabel htmlFor="ownerFirstName">
									Ime vlasnika <span className="text-destructive">*</span>
								</FieldLabel>
								<Input
									id="ownerFirstName"
									name="ownerFirstName"
									type="text"
									placeholder="Ivan"
									value={formValues.ownerFirstName}
									onChange={handleInputChange}
									required
								/>
							</Field>
							<Field>
								<FieldLabel htmlFor="ownerLastName">
									Prezime vlasnika <span className="text-destructive">*</span>
								</FieldLabel>
								<Input
									id="ownerLastName"
									name="ownerLastName"
									type="text"
									placeholder="Horvat"
									value={formValues.ownerLastName}
									onChange={handleInputChange}
									required
								/>
							</Field>
						</div>
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
					</FieldGroup>
				</FieldSet>
			</Card>
			<Card className="p-6 mb-4">
				<div className="mb-4">
					<div className="font-semibold text-base">Adresa sjedišta</div>
					<p className="text-muted text-sm">
						Adresa koja se navodi kao sjedište obrta na dokumentima.
					</p>
				</div>
				<FieldSet>
					<FieldGroup>
						<div className="grid md:grid-cols-[2.2fr_1fr] md:gap-4">
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
								<FieldLabel htmlFor="houseNumber">
									Kućni broj <span className="text-destructive">*</span>
								</FieldLabel>
								<Input
									id="houseNumber"
									name="houseNumber"
									type="text"
									placeholder="1"
									value={formValues.houseNumber}
									onChange={handleInputChange}
									required
								/>
							</Field>
						</div>
						<div className="grid md:grid-cols-[1fr_2fr] md:gap-4">
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
					</FieldGroup>
				</FieldSet>
			</Card>

			<Card className="p-6 mb-4">
				<div className="mb-4">
					<div className="font-semibold text-base">Bankovni podaci</div>
					<p className="text-muted text-sm">
						Prikazuju se u podnožju računa kao podaci za uplatu.
					</p>
				</div>
				<FieldSet>
					<FieldGroup>
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
						<div className="grid md:grid-cols-2 md:gap-4">
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
					</FieldGroup>
				</FieldSet>

				<Button
					size="lg"
					type="submit"
					className="ml-auto mt-5"
					disabled={isPending}
				>
					Spremi promjene
				</Button>

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
			</Card>
		</form>
	);
}
