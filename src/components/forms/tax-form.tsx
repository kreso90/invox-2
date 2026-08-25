"use client";
import {
	Field,
	FieldGroup,
	FieldLabel,
	FieldDescription,
	FieldSet,
} from "../ui/field";
import { Button } from "../ui/button";
import { updateAnnualThreshold } from "@/features/business/actions";
import { useActionState } from "react";
import { Business } from "@/features/business/types";
import { useFormValues } from "@/hooks/use-form-values";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from "../ui/input-group";

import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "../ui/separator";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

interface taxFormProps {
	businessData?: Business | null;
}

export default function TaxForm({ businessData }: taxFormProps) {
	const [state, fromAction, isPending] = useActionState(
		updateAnnualThreshold,
		null,
	);

	const initialValues = {
		annualRevenue: String(businessData?.annual_threshold) || "",
		thresholdWarning: String(businessData?.threshold_warning_pct) || "",
	};
	const { formValues, handleInputChange } = useFormValues(initialValues);

	return (
		<form action={fromAction} className="w-full">
			<div className="font-semibold text-base">Paušalno oporezivanje</div>
			<div className="text-muted text-sm mb-5">
				Prati godišnji promet u odnosu na prag paušalnog oporezivanja.
			</div>
			<input type="hidden" name="businessId" value={businessData?.id} />

			<FieldSet className="w-full">
				<FieldGroup>
					<Field
						className="justify-between"
						orientation={useIsMobile() ? "vertical" : "horizontal"}
					>
						<div>
							<FieldLabel htmlFor="annualRevenue">
								Godišnji promet <span className="text-destructive">*</span>
							</FieldLabel>
							<FieldDescription>
								Unesite iznos u kunama (HRK) koji predstavlja vaš godišnji
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

					<Separator className="my-2" />

					<Field
						className="justify-between"
						orientation={useIsMobile() ? "vertical" : "horizontal"}
					>
						<div>
							<FieldLabel htmlFor="thresholdWarning">
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
										<SelectItem value="80">80%</SelectItem>
										<SelectItem value="90">90%</SelectItem>
										<SelectItem value="100">100%</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
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

			{state?.status === "success" && (
				<div className="text-sm text-success mt-2 bg-success-foreground p-2 rounded-lg border border-success">
					<p>{state.message}</p>
				</div>
			)}
		</form>
	);
}
