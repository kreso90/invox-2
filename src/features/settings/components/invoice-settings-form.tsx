"use client";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "../../../components/ui/field";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Card } from "../../../components/ui/card";
import { useActionState } from "react";
import { useState } from "react";
import { updateSettings } from "@/features/settings/actions";
import { useFormValues } from "@/hooks/use-form-values";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from "@/components/ui/input-group";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { paymentLabels } from "@/features/invoices/constants";
import { PaymentType, Settings } from "@/generated/prisma";
import { Textarea } from "@/components/ui/textarea";

interface SettingsFormProps {
	settingsData: Settings | null;
}

export default function InvoiceSettingsForm({
	settingsData,
}: SettingsFormProps) {
	const [state, fromAction, isPending] = useActionState(updateSettings, null);

	const initialValues = {
		nextInvoiceNumber: settingsData?.nextInvoiceNumber || "",
		nextQuoteNumber: settingsData?.nextQuoteNumber || "",
		defaultDueDays: settingsData?.defaultDueDays?.toString() || "",
		defaultIssuePlace: settingsData?.defaultIssuePlace || "",
		defaultPaymentMethod: settingsData?.defaultPaymentMethod || "",
		defaultFooterNote: settingsData?.defaultFooterNote || "",
	};
	const { formValues, setFormValues, handleInputChange } =
		useFormValues(initialValues);

	const [paymentMethod, setPaymentMethod] = useState<PaymentType>(
		settingsData?.defaultPaymentMethod ?? "BANK_TRANSFER",
	);

	return (
		<form action={fromAction} className="no-wrapper">
			<Card className="p-6 mb-4">
				<div className="mb-4">
					<div className="font-semibold text-base">Numeriranje računa</div>
					<p className="text-muted text-sm">
						Redni broj / oznaka poslovnog prostora / oznaka naplatnog uređaja —
						isto kao na fiskaliziranom računu.
					</p>
				</div>
				<FieldSet>
					<FieldGroup>
						<div className="grid md:grid-cols-2 md:gap-4">
							<Field>
								<FieldLabel htmlFor="nextInvoiceNumber">
									Sljedeći broj računa
								</FieldLabel>
								<Input
									id="nextInvoiceNumber"
									name="nextInvoiceNumber"
									type="text"
									value={formValues.nextInvoiceNumber}
									onChange={handleInputChange}
									placeholder="1/1/1"
								/>
								<FieldDescription>
									Sljedeći izdani račun dobit će ovaj broj, a nakon toga se
									redni dio automatski povećava (npr. 6/1/1, 7/1/1...).
								</FieldDescription>
							</Field>

							<Field>
								<FieldLabel htmlFor="nextQuoteNumber">
									Sljedeći broj ponude
								</FieldLabel>
								<Input
									id="nextQuoteNumber"
									name="nextQuoteNumber"
									type="text"
									value={formValues.nextQuoteNumber}
									onChange={handleInputChange}
									placeholder="P-1/1/1"
								/>
							</Field>
						</div>
					</FieldGroup>
				</FieldSet>
			</Card>

			<Card className="p-6 mb-4">
				<div className="mb-4">
					<div className="font-semibold text-base">Zadane vrijednosti</div>
					<p className="text-muted text-sm">
						Popunjavaju se automatski na svakom novom računu — po potrebi ih
						uvijek možeš promijeniti pojedinačno.
					</p>
				</div>
				<FieldSet>
					<FieldGroup>
						<div className="grid md:grid-cols-2 md:gap-4">
							<Field>
								<FieldLabel htmlFor="defaultDueDays">
									Zadani rok dospijeća
								</FieldLabel>
								<InputGroup>
									<InputGroupInput
										id="defaultDueDays"
										name="defaultDueDays"
										type="text"
										placeholder="1"
										value={formValues.defaultDueDays}
										onChange={handleInputChange}
									/>
									<InputGroupAddon align="inline-end">
										<InputGroupText>Dana</InputGroupText>
									</InputGroupAddon>
								</InputGroup>
							</Field>

							<Field>
								<FieldLabel htmlFor="defaultIssuePlace">
									Zadano mjesto izdavanja
								</FieldLabel>
								<Input
									id="defaultIssuePlace"
									name="defaultIssuePlace"
									type="text"
									value={formValues.defaultIssuePlace}
									onChange={handleInputChange}
									placeholder="Zagreb"
								/>
							</Field>
						</div>
						<Field>
							<FieldLabel htmlFor="defaultPaymentMethod">
								Zadani način plaćanja
							</FieldLabel>
							<Select
								id="defaultPaymentMethod"
								name="defaultPaymentMethod"
								value={paymentMethod}
								onValueChange={(value) =>
									setPaymentMethod(value as PaymentType)
								}
							>
								<SelectTrigger className="w-full">
									<SelectValue>
										{(value: PaymentType | null) =>
											value ? paymentLabels[value] : "Odaberi način plaćanja"
										}
									</SelectValue>
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										{Object.values(PaymentType).map((unit) => (
											<SelectItem key={unit} value={unit}>
												{paymentLabels[unit]}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
						</Field>

						<Field>
							<FieldLabel htmlFor="defaultFooterNote">
								Zadana napomena
							</FieldLabel>
							<Textarea
								id="defaultFooterNote"
								name="defaultFooterNote"
								value={formValues.defaultFooterNote}
								onChange={handleInputChange}
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
