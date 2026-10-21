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
import { createArticle } from "../actions";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Unit } from "@/generated/prisma/client";

interface ArticleFormProps {
	articleData?: Article | null;
}

const unitLabels: Record<Unit, string> = {
	PIECE: "Komad",
	HOUR: "Sat",
	DAY: "Dan",
	MONTH: "Mjesec",
	YEAR: "Godina",
	METER: "Metar",
	SQUARE_METER: "Kvadratni metar",
	CUBIC_METER: "Kubični metar",
	KILOMETER: "Kilometar",
	LITER: "Litra",
	KILOGRAM: "Kilogram",
	GRAM: "Gram",
	TON: "Tona",
	SET: "Set",
	PACKAGE: "Paket",
	SERVICE: "Usluga",
	LICENSE: "Licenca",
};

export default function ArticleForm({ articleData }: ArticleFormProps) {
	const [state, fromAction, isPending] = useActionState(createArticle, null);

	const initialValues = {
		name: articleData?.name || "",
		unit: articleData?.unit || "",
		price: articleData?.price ? articleData.price.toString() : "",
		description: articleData?.description || "",
		lastUsedAt: articleData?.lastUsedAt
			? new Date(articleData.lastUsedAt).toISOString().split("T")[0]
			: "",
	};
	const { formValues, handleInputChange } = useFormValues(initialValues);

	return (
		<form action={fromAction} className="w-full">
			<input type="hidden" name="articleId" value={articleData?.id} />
			<FieldSet className="w-full mb-2">
				<FieldLegend variant="label" className="uppercase text-muted mb-2">
					Osnovni podaci
				</FieldLegend>
				<FieldGroup>
					<Field>
						<FieldLabel htmlFor="name">
							Naziv artikla <span className="text-destructive">*</span>
						</FieldLabel>
						<Input
							id="name"
							name="name"
							type="text"
							placeholder="npr. Studio Marin d.o.o."
							value={formValues.name}
							onChange={handleInputChange}
							required
						/>
					</Field>

					<div className="grid md:grid-cols-2 md:gap-4">
						<Field>
							<FieldLabel htmlFor="unit">
								Jedinica mjere <span className="text-destructive">*</span>
							</FieldLabel>
							<Select id="unit" name="unit" defaultValue={formValues.unit}>
								<SelectTrigger className="w-full">
									<SelectValue>
										{(value: Unit | null) =>
											value ? unitLabels[value] : "Odaberi jedinicu"
										}
									</SelectValue>
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										{Object.values(Unit).map((unit) => (
											<SelectItem key={unit} value={unit}>
												{unitLabels[unit]}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
						</Field>
						<Field>
							<FieldLabel htmlFor="price">Cijena</FieldLabel>
							<Input
								id="price"
								name="price"
								type="number"
								step="0.01"
								min="0"
								value={formValues.price}
								onChange={handleInputChange}
								placeholder="npr. 100.00"
							/>
						</Field>
					</div>
				</FieldGroup>
			</FieldSet>

			<FieldSet className="w-full mt-6 mb-2">
				<FieldGroup>
					<Field>
						<FieldLabel htmlFor="description">Opis</FieldLabel>
						<Textarea
							id="description"
							name="description"
							value={formValues.description}
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
