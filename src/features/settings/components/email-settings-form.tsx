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
import { updateEmailSettings } from "@/features/settings/actions";
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

export default function EmailSettingsForm({ settingsData }: SettingsFormProps) {
	const [state, fromAction, isPending] = useActionState(
		updateEmailSettings,
		null,
	);

	const initialValues = {
		emailSenderName: settingsData?.emailSenderName || "",
		emailReplyTo: settingsData?.emailReplyTo || "",
		emailSubjectTemplate: settingsData?.emailSubjectTemplate || "",
		emailBodyTemplate: settingsData?.emailBodyTemplate || "",
	};
	const { formValues, handleInputChange } = useFormValues(initialValues);

	return (
		<form action={fromAction} className="no-wrapper">
			<Card className="p-6 mb-4">
				<div className="mb-4">
					<div className="font-semibold text-base">Email predložak</div>
					<p className="text-muted text-sm">
						Postavke za slanje računa i ponuda emailom klijentima.
					</p>
				</div>
				<FieldSet>
					<FieldGroup>
						<div className="grid md:grid-cols-2 gap-4">
							<Field>
								<FieldLabel htmlFor="emailSenderName">
									Ime pošiljatelja
								</FieldLabel>
								<Input
									id="emailSenderName"
									name="emailSenderName"
									type="text"
									value={formValues.emailSenderName}
									onChange={handleInputChange}
									placeholder="Ime pošiljatelja"
								/>
							</Field>

							<Field>
								<FieldLabel htmlFor="emailReplyTo">
									Email za odgovore (reply-to)
								</FieldLabel>
								<Input
									id="emailReplyTo"
									name="emailReplyTo"
									type="email"
									value={formValues.emailReplyTo}
									onChange={handleInputChange}
									placeholder="reply@example.com"
								/>
							</Field>
						</div>
						<Field>
							<FieldLabel htmlFor="emailSubjectTemplate">
								Predložak naslova
							</FieldLabel>
							<Input
								id="emailSubjectTemplate"
								name="emailSubjectTemplate"
								type="text"
								value={formValues.emailSubjectTemplate}
								onChange={handleInputChange}
								placeholder="Predložak naslova"
							/>
						</Field>

						<Field>
							<FieldLabel htmlFor="emailBodyTemplate">
								Predložak tijela emaila
							</FieldLabel>
							<Textarea
								id="emailBodyTemplate"
								name="emailBodyTemplate"
								value={formValues.emailBodyTemplate}
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
