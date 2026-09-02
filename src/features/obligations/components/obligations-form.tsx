"use client";
import {
	Field,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from "../../../components/ui/field";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { useActionState } from "react";
import { Article } from "@/features/articles/types";
import { useFormValues } from "@/hooks/use-form-values";
import { Textarea } from "../../../components/ui/textarea";
import { createObligation } from "../actions";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Obligation, ObligationKind, Unit } from "@/generated/prisma/client";
import { obligationLabels } from "../constants";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from "@/components/ui/input-group";

interface ObligationFormProps {
	obligationData?: Obligation | null;
}

export default function ObligationForm({
	obligationData,
}: ObligationFormProps) {
	const [state, fromAction, isPending] = useActionState(createObligation, null);

	const initialValues = {
		kind: obligationData?.kind || "",
		name: obligationData?.name || "",
		periodLabel: obligationData?.periodLabel || "",
		dueDate: obligationData?.dueDate
			? new Date(obligationData.dueDate).toISOString().split("T")[0]
			: "",
		amount: obligationData?.amount?.toString() || "",
		paymentModel: obligationData?.paymentModel || "",
		paymentReference: obligationData?.paymentReference || "",
		paymentDescription: obligationData?.paymentDescription || "",
		status: obligationData?.status || "PENDING",
	};
	const { formValues, handleInputChange } = useFormValues(initialValues);

	return (
		<form action={fromAction} className="w-full">
			<input type="hidden" name="obligationId" value={obligationData?.id} />
			<FieldSet className="w-full mb-2">
				<FieldLegend variant="label" className="uppercase text-muted mb-2">
					Podaci o obvezi
				</FieldLegend>
				<FieldGroup>
					<Field>
						<FieldLabel htmlFor="name">
							Naziv obveze <span className="text-destructive">*</span>
						</FieldLabel>
						<Input
							value={formValues.name}
							name="name"
							type="text"
							placeholder="npr. Članarina komori, Turistička pristojba..."
							onChange={handleInputChange}
							required
						/>
					</Field>

					<div className="grid md:grid-cols-2 md:gap-4">
						<Field>
							<FieldLabel htmlFor="kind">
								Vrsta / kategorija <span className="text-destructive">*</span>
							</FieldLabel>
							<Select id="kind" name="kind" defaultValue={formValues.kind}>
								<SelectTrigger className="w-full">
									<SelectValue>
										{(value: ObligationKind | null) =>
											value
												? obligationLabels[value]
												: "Odaberi vrstu / kategoriju"
										}
									</SelectValue>
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										{Object.values(ObligationKind).map((kind) => (
											<SelectItem key={kind} value={kind}>
												{obligationLabels[kind]}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
						</Field>
						<Field>
							<FieldLabel htmlFor="amount">Iznos</FieldLabel>
							<Input
								id="amount"
								name="amount"
								type="number"
								value={formValues.amount}
								onChange={handleInputChange}
								placeholder="npr. 100.00"
							/>
						</Field>
					</div>

					<div className="grid md:grid-cols-2 md:gap-4">
						<Field>
							<FieldLabel htmlFor="dueDate">
								Rok (prvi put) <span className="text-destructive">*</span>
							</FieldLabel>
							<Input
								id="dueDate"
								name="dueDate"
								type="date"
								value={formValues.dueDate}
								onChange={handleInputChange}
								required
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="amount">Iznos</FieldLabel>

							<InputGroup className="w-full h-10 bg-background">
								<InputGroupAddon>
									<InputGroupText className="text-primary">€</InputGroupText>
								</InputGroupAddon>
								<InputGroupInput
									id="amount"
									name="amount"
									type="number"
									placeholder="npr. 100.00"
									step="0.01"
									value={formValues.amount}
									onChange={handleInputChange}
									required
								/>
								<InputGroupAddon align="inline-end">
									<InputGroupText className="text-primary">EUR</InputGroupText>
								</InputGroupAddon>
							</InputGroup>
						</Field>
					</div>
				</FieldGroup>
			</FieldSet>

			<FieldSet className="w-full mt-6 mb-2">
				<FieldGroup>
					<Field>
						<FieldLabel htmlFor="paymentDescription">Opis</FieldLabel>
						<Textarea
							id="paymentDescription"
							name="paymentDescription"
							value={formValues.paymentDescription}
							onChange={handleInputChange}
							placeholder="Interna napomena o klijentu, dogovoreni uvjeti i sl."
						/>
					</Field>
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
