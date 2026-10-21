"use client";
import {
	Field,
	FieldGroup,
	FieldLabel,
	FieldDescription,
	FieldSet,
} from "../../../components/ui/field";
import { Button } from "../../../components/ui/button";
import { updateAnnualThreshold } from "@/features/business/actions";
import { useActionState } from "react";
import { Business } from "@/features/business/types";
import { useFormValues } from "@/hooks/use-form-values";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from "../../../components/ui/input-group";

import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "../../../components/ui/separator";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../../components/ui/select";
import { TaxClass } from "@/generated/prisma/edge";
import { taxClassContributions, taxClassLabels } from "../constants";

interface taxFormProps {
	businessData?: Business | null;
}

export default function TaxForm({ businessData }: taxFormProps) {
	const [state, fromAction, isPending] = useActionState(
		updateAnnualThreshold,
		null,
	);

	const initialValues = {
		annualRevenue: businessData?.annual_threshold?.toString() ?? "",
		thresholdWarning: businessData?.threshold_warning_pct?.toString() ?? "",
		taxClass: businessData?.taxClass || "",
		mio1MonthlyAmount: businessData?.mio1MonthlyAmount?.toString() ?? "",
		mio2MonthlyAmount: businessData?.mio2MonthlyAmount?.toString() ?? "",
		healthInsuranceMonthly:
			businessData?.healthInsuranceMonthly?.toString() ?? "",
		incomeTaxQuarterly: businessData?.incomeTaxQuarterly?.toString() ?? "",
	};

	const { formValues, setFormValues, handleInputChange } =
		useFormValues(initialValues);
	const annualRevenue = Number(formValues.annualRevenue);
	const warningAmount = (percentage: number) =>
		Number.isFinite(annualRevenue)
			? ((annualRevenue * percentage) / 100).toFixed(2)
			: "0.00";

	return (
		<form action={fromAction} className="no-wrapper">
			<input type="hidden" name="businessId" value={businessData?.id} />

			<FieldSet className="w-full p-6 bg-white rounded-[var(--radius)] border mb-4">
				<div>
					<div className="font-semibold text-base">Paušalno oporezivanje</div>
					<div className="text-muted text-sm mb-5">
						Prati godišnji promet u odnosu na prag paušalnog oporezivanja.
					</div>
				</div>
				<FieldGroup>
					<Field
						className="justify-between"
						orientation={useIsMobile() ? "vertical" : "horizontal"}
					>
						<div>
							<FieldLabel htmlFor="annualRevenue" className="text-black">
								Godišnji promet <span className="text-destructive">*</span>
							</FieldLabel>
							<FieldDescription>
								Unesite iznos u eurima (EUR) koji predstavlja vaš godišnji
								promet.
							</FieldDescription>
						</div>
						<InputGroup className="w-1/5">
							<InputGroupAddon>
								<InputGroupText className="text-primary">€</InputGroupText>
							</InputGroupAddon>
							<InputGroupInput
								type="number"
								id="annualRevenue"
								name="annualRevenue"
								placeholder="0.00"
								value={formValues.annualRevenue}
								onChange={handleInputChange}
								required
							/>
							<InputGroupAddon align="inline-end">
								<InputGroupText className="text-primary">EUR</InputGroupText>
							</InputGroupAddon>
						</InputGroup>
					</Field>

					{/*<Separator className="my-2" />

					 <Field
						className="justify-between"
						orientation={useIsMobile() ? "vertical" : "horizontal"}
					>
						<div>
							<FieldLabel htmlFor="thresholdWarning" className="text-black">
								Upozori pri približavanju pragu
							</FieldLabel>
							<FieldDescription>
								Primi obavijest kad promet dosegne postotak praga.
							</FieldDescription>
						</div>

						<div className="w-1/5">
							<Select
								id="thresholdWarning"
								name="thresholdWarning"
								defaultValue={formValues.thresholdWarning}
							>
								<SelectTrigger className="w-full">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectItem value={warningAmount(80)}>
											€{warningAmount(80)}
										</SelectItem>
										<SelectItem value={warningAmount(90)}>
											€{warningAmount(90)}
										</SelectItem>
										<SelectItem value={warningAmount(100)}>
											€{warningAmount(100)}
										</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
					</Field> */}
				</FieldGroup>
			</FieldSet>

			<FieldSet className="w-full p-6 bg-white rounded-[var(--radius)] border mb-4">
				<div>
					<div className="font-semibold text-base">Razred i doprinosi</div>
					<div className="text-muted text-sm mb-5">
						Odaberi razred prema procijenjenom godišnjem prometu — iznosi
						doprinosa i poreza popunit će se automatski, a po potrebi ih možeš
						ručno prilagoditi.
					</div>
				</div>
				<FieldGroup>
					<Field>
						<FieldLabel htmlFor="taxClass">
							Razred paušalnog oporezivanja
						</FieldLabel>
						<Select
							id="taxClass"
							name="taxClass"
							value={formValues.taxClass}
							onValueChange={(value) => {
								const selectedTaxClass = value as TaxClass;
								const contributions = taxClassContributions[selectedTaxClass];

								setFormValues((prev) => ({
									...prev,
									taxClass: selectedTaxClass,
									annualRevenue: String(contributions.annualRevenue),
									mio1MonthlyAmount: String(contributions.mio1MonthlyAmount),
									mio2MonthlyAmount: String(contributions.mio2MonthlyAmount),
									healthInsuranceMonthly: String(
										contributions.healthInsuranceMonthly,
									),
									incomeTaxQuarterly: String(contributions.incomeTaxQuarterly),
								}));
							}}
						>
							<SelectTrigger className="w-full">
								<SelectValue>
									{(value: TaxClass | null) =>
										value ? taxClassLabels[value] : "Odaberi razred"
									}
								</SelectValue>
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									{Object.values(TaxClass).map((unit) => (
										<SelectItem key={unit} value={unit}>
											{taxClassLabels[unit]}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
						<FieldDescription className="text-xs">
							Okvirne granice i iznosi — provjeri točne vrijednosti za tekuću
							godinu na stranicama Porezne uprave prije spremanja.
						</FieldDescription>
					</Field>

					<div className="grid md:grid-cols-2 gap-4">
						<Field>
							<FieldLabel htmlFor="issuePlace">
								1. Mirovinski stup — mjesečni iznos
								<span className="text-destructive">*</span>
							</FieldLabel>
							<InputGroup className="w-full h-10 bg-background">
								<InputGroupAddon>
									<InputGroupText className="text-primary">€</InputGroupText>
								</InputGroupAddon>
								<InputGroupInput
									id="mio1MonthlyAmount"
									name="mio1MonthlyAmount"
									type="text"
									step="0.01"
									value={formValues.mio1MonthlyAmount}
									onChange={handleInputChange}
									required
								/>
								<InputGroupAddon align="inline-end">
									<InputGroupText className="text-primary">EUR</InputGroupText>
								</InputGroupAddon>
							</InputGroup>
						</Field>
						<Field>
							<FieldLabel htmlFor="mio2MonthlyAmount">
								2. Mirovinski stup — mjesečni iznos
								<span className="text-destructive">*</span>
							</FieldLabel>
							<InputGroup className="w-full h-10 bg-background">
								<InputGroupAddon>
									<InputGroupText className="text-primary">€</InputGroupText>
								</InputGroupAddon>
								<InputGroupInput
									id="mio2MonthlyAmount"
									name="mio2MonthlyAmount"
									type="text"
									step="0.01"
									value={formValues.mio2MonthlyAmount}
									onChange={handleInputChange}
									required
								/>
								<InputGroupAddon align="inline-end">
									<InputGroupText className="text-primary">EUR</InputGroupText>
								</InputGroupAddon>
							</InputGroup>
						</Field>
						<Field>
							<FieldLabel htmlFor="mio3MonthlyAmount">
								Zdravstveno osiguranje — mjesečni iznos
								<span className="text-destructive">*</span>
							</FieldLabel>
							<InputGroup className="w-full h-10 bg-background">
								<InputGroupAddon>
									<InputGroupText className="text-primary">€</InputGroupText>
								</InputGroupAddon>
								<InputGroupInput
									id="healthInsuranceMonthly"
									name="healthInsuranceMonthly"
									type="text"
									step="0.01"
									value={formValues.healthInsuranceMonthly}
									onChange={handleInputChange}
									required
								/>
								<InputGroupAddon align="inline-end">
									<InputGroupText className="text-primary">EUR</InputGroupText>
								</InputGroupAddon>
							</InputGroup>
						</Field>
						<Field>
							<FieldLabel htmlFor="incomeTaxQuarterly">
								Porez na dohodak — kvartalni iznos
								<span className="text-destructive">*</span>
							</FieldLabel>
							<InputGroup className="w-full h-10 bg-background">
								<InputGroupAddon>
									<InputGroupText className="text-primary">€</InputGroupText>
								</InputGroupAddon>
								<InputGroupInput
									id="incomeTaxQuarterly"
									name="incomeTaxQuarterly"
									type="text"
									step="0.01"
									value={formValues.incomeTaxQuarterly}
									onChange={handleInputChange}
									required
								/>
								<InputGroupAddon align="inline-end">
									<InputGroupText className="text-primary">EUR</InputGroupText>
								</InputGroupAddon>
							</InputGroup>
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

			{state?.status === "success" && (
				<div className="text-sm text-success mt-2 bg-success-foreground p-2 rounded-lg border border-success">
					<p>{state.message}</p>
				</div>
			)}
		</form>
	);
}
