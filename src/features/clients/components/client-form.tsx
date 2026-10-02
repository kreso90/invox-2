"use client";
import {
	Field,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/features/clients/actions";
import { useActionState, useEffect } from "react";
import { Client } from "@/features/clients/types";
import { useFormValues } from "@/hooks/use-form-values";
import { Textarea } from "@/components/ui/textarea";
import { allCountries } from "country-region-data";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
interface clientFormProps {
	clientData?: Client | null;
}

export default function ClientForm({ clientData }: clientFormProps) {
	const [state, fromAction, isPending] = useActionState(createClient, null);

	const initialValues = {
		companyName: clientData?.companyName || "",
		oib: clientData?.oib || "",
		address: clientData?.address || "",
		city: clientData?.city || "",
		postalCode: clientData?.postalCode || "",
		vatCountryCode: clientData?.vatCountryCode || "",
		contactFirstName: clientData?.contactFirstName || "",
		contactLastName: clientData?.contactLastName || "",
		vatNumber: clientData?.vatNumber || "",
		email: clientData?.email || "",
		phone: clientData?.phone || "",
		iban: clientData?.iban || "",
		note: clientData?.note || "",
	};
	const { formValues, setFormValues, handleInputChange } =
		useFormValues(initialValues);

	return (
		<form action={fromAction} className="no-wrapper">
			<input type="hidden" name="clientId" value={clientData?.id} />
			<Card className="p-6 mb-4">
				<div className="mb-4">
					<div className="font-semibold text-base">Osnovni podaci</div>
					<p className="text-muted text-sm">
						Unesite osnovne podatke o klijentu.
					</p>
				</div>

				<FieldSet className="w-full">
					<FieldGroup>
						<div className="grid md:grid-cols-2 md:gap-4">
							<Field>
								<FieldLabel htmlFor="companyName">
									Naziv tvrtke / obrta{" "}
									<span className="text-destructive">*</span>
								</FieldLabel>
								<Input
									id="companyName"
									name="companyName"
									type="text"
									placeholder="npr. Studio Marin d.o.o."
									value={formValues.companyName}
									onChange={handleInputChange}
									required
								/>
							</Field>
							<Field>
								<FieldLabel htmlFor="oib">OIB</FieldLabel>
								<Input
									id="oib"
									name="oib"
									type="text"
									placeholder="12345678901"
									value={formValues.oib}
									onChange={handleInputChange}
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

						<div className="grid md:grid-cols-2 md:gap-4">
							<Field>
								<FieldLabel htmlFor="vatCountryCode">
									Država <span className="text-destructive">*</span>
								</FieldLabel>
								<Select
									id="vatCountryCode"
									required
									name="vatCountryCode"
									value={formValues.vatCountryCode}
									onValueChange={(value) =>
										setFormValues((current) => ({
											...current,
											vatCountryCode: value ?? "",
										}))
									}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Odaberi državu">
											{(value: string | null) =>
												allCountries.find((unit) => unit[1] === value)?.[1] ??
												"Odaberi državu"
											}
										</SelectValue>
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											{allCountries.map((unit) => (
												<SelectItem key={unit[1]} value={unit[1]}>
													{unit[0]}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							</Field>
							<Field>
								<FieldLabel htmlFor="vatNumber">
									PDV broj (bez oznake države)
								</FieldLabel>
								<Input
									id="vatNumber"
									name="vatNumber"
									type="text"
									placeholder="npr. 9512345678"
									value={formValues.vatNumber}
									onChange={handleInputChange}
								/>
							</Field>
						</div>

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
					</FieldGroup>
				</FieldSet>
			</Card>

			<Card className="p-6 mb-4">
				<div className="mb-4">
					<div className="font-semibold text-base">Kontakt osoba</div>
					<p className="text-muted text-sm">
						Unesite osnovne podatke o kontakt osobi klijenta.
					</p>
				</div>

				<FieldSet className="w-full">
					<FieldGroup>
						<div className="grid md:grid-cols-2 md:gap-4">
							<Field>
								<FieldLabel htmlFor="contactFirstName">
									Ime kontakt osobe <span className="text-destructive">*</span>
								</FieldLabel>
								<Input
									id="contactFirstName"
									name="contactFirstName"
									type="text"
									placeholder="Maks"
									value={formValues.contactFirstName}
									onChange={handleInputChange}
									required
								/>
							</Field>
							<Field>
								<FieldLabel htmlFor="contactLastName">
									Prezime kontakt osobe{" "}
									<span className="text-destructive">*</span>
								</FieldLabel>
								<Input
									id="contactLastName"
									name="contactLastName"
									type="text"
									value={formValues.contactLastName}
									onChange={handleInputChange}
									placeholder="Maksim"
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
								<FieldLabel htmlFor="phone">Telefon</FieldLabel>
								<Input
									id="phone"
									name="phone"
									type="text"
									value={formValues.phone}
									onChange={handleInputChange}
									placeholder="+385 91 123 4567"
								/>
							</Field>
						</div>
					</FieldGroup>
				</FieldSet>
			</Card>

			<Card className="p-6 mb-4">
				<div className="mb-4">
					<div className="font-semibold text-base">Napomena</div>
					<p className="text-muted text-sm">Unesite napomenu o klijentu.</p>
				</div>

				<FieldSet className="w-full">
					<FieldGroup>
						<Field>
							<Textarea
								id="note"
								name="note"
								value={formValues.note}
								onChange={handleInputChange}
								placeholder="Interna napomena o klijentu, dogovoreni uvjeti i sl."
							/>
						</Field>
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
