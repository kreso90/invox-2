"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Business, Invoice, Prisma, Settings } from "@/generated/prisma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useFormValues } from "@/hooks/use-form-values";
import {
	CheckIcon,
	ClockIcon,
	FileCodeIcon,
	FileTextIcon,
	FileWarningIcon,
	RefreshCwIcon,
	X,
	XIcon,
} from "lucide-react";
import {
	Attachment,
	AttachmentAction,
	AttachmentActions,
	AttachmentContent,
	AttachmentDescription,
	AttachmentGroup,
	AttachmentMedia,
	AttachmentTitle,
} from "@/components/ui/attachment";
import { useState, useRef, useActionState, useEffect } from "react";
import { sendInvoiceEmail } from "../actions";
import { toast } from "@/components/ui/toast";

interface InvoiceEmailFormModalProps {
	invoiceData: InvoiceWithRelations;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	settingsData: Settings | null;
	businessData: Business | null;
}

type InvoiceWithRelations = Prisma.InvoiceGetPayload<{
	include: { client: true; invoicePayments: true };
}>;

export function InvoiceEmailFormModal({
	invoiceData,
	open,
	onOpenChange,
	settingsData,
	businessData,
}: InvoiceEmailFormModalProps) {
	const replaceInvoiceVariables = (
		template: string,
		variables: Record<string, string>,
	) => {
		return template.replace(
			/{{\s*([^}]+)\s*}}/g,
			(_, key: string) => variables[key.trim()] ?? "",
		);
	};

	const router = useRouter();

	const initialValues = {
		emailRecipient: invoiceData.client?.email || "",
		emailSenderName: settingsData?.emailSenderName || "",
		emailReplyTo: settingsData?.emailReplyTo || "",
		emailSubjectTemplate: replaceInvoiceVariables(
			settingsData?.emailSubjectTemplate || "",
			{
				broj_racuna: invoiceData.invoiceNumber,
				invoiceNumber: invoiceData.invoiceNumber,
				dueDate: invoiceData.dueDate?.toISOString() || "",
			},
		),
		emailBodyTemplate: replaceInvoiceVariables(
			settingsData?.emailBodyTemplate || "",
			{
				broj_racuna: invoiceData.invoiceNumber,
				iznos: invoiceData?.totalAmount.toLocaleString("hr-HR", {
					style: "currency",
					currency: "EUR",
				}),
				dospijece: new Intl.DateTimeFormat("hr-HR", {
					day: "numeric",
					month: "numeric",
					year: "numeric",
				}).format(new Date(invoiceData.dueDate)),
				ime_obrta: businessData?.business_name || "",
			},
		),
	};

	const [state, formAction, isPending] = useActionState(sendInvoiceEmail, null);
	const [files, setFiles] = useState<File[]>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleRemoveFile = (index: number) => {
		const remainingFiles = files.filter((_, i) => i !== index);
		const dataTransfer = new DataTransfer();

		remainingFiles.forEach((file) => dataTransfer.items.add(file));
		if (fileInputRef.current) {
			fileInputRef.current.files = dataTransfer.files;
		}
		setFiles(remainingFiles);
	};

	const { formValues, handleInputChange } = useFormValues(initialValues);

	useEffect(() => {
		if (state?.status === "success") {
			toast.add({
				type: "success",
				description: "Email je uspješno poslan.",
			});

			onOpenChange(false);
			router.refresh();
		}
	}, [state]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Pošalji emailom</DialogTitle>

					<DialogDescription>
						Račun {invoiceData.invoiceNumber} ·{" "}
						{businessData?.business_name || ""}
					</DialogDescription>
				</DialogHeader>

				<form className="no-wrapper" action={formAction}>
					<input type="hidden" name="invoiceId" value={invoiceData.id} />
					<FieldSet>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="emailRecipient">Prima</FieldLabel>
								<Input
									id="emailRecipient"
									name="emailRecipient"
									type="emailRecipient"
									value={formValues.emailRecipient}
									onChange={handleInputChange}
									placeholder="Primatelj@example.com"
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

							<Field>
								<FieldLabel htmlFor="emailSubjectTemplate">Predmet</FieldLabel>
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
								<FieldLabel htmlFor="emailBodyTemplate">Poruka</FieldLabel>
								<Textarea
									id="emailBodyTemplate"
									name="emailBodyTemplate"
									value={formValues.emailBodyTemplate}
									onChange={handleInputChange}
								/>
							</Field>
							{files.length > 0 && (
								<Field>
									<FieldLabel htmlFor="emailBodyTemplate">Privitci</FieldLabel>
								</Field>
							)}

							<AttachmentGroup className="w-full flex-col p-0">
								{files.map((file, index) => (
									<Attachment
										key={file.name}
										orientation="horizontal"
										className="w-full bg-background"
									>
										<AttachmentContent>
											<AttachmentTitle>{file.name}</AttachmentTitle>

											<AttachmentDescription>
												{(file.size / 1024).toFixed(2)} KB
											</AttachmentDescription>
										</AttachmentContent>

										<AttachmentActions>
											<AttachmentAction
												variant="destructive"
												onClick={() => handleRemoveFile(index)}
											>
												<X />
											</AttachmentAction>
										</AttachmentActions>
									</Attachment>
								))}
							</AttachmentGroup>

							<div className="relative p-1 border border-dashed border-border hover:border-black rounded-lg text-center">
								+ Dodaj privitak
								<input
									id="file"
									name="file"
									ref={fileInputRef}
									type="file"
									multiple
									className="opacity-0 absolute inset-0 w-full h-full"
									onChange={(e) => {
										setFiles(Array.from(e.target.files ?? []));
									}}
								/>
							</div>
							<FieldDescription>Račun je automatski priložen.</FieldDescription>
						</FieldGroup>
					</FieldSet>
					{state?.status === "error" && state.message && (
						<div className="text-sm text-destructive mt-2 bg-destructive-foreground p-2 rounded-lg border border-destructive">
							<p>{state.message}</p>
						</div>
					)}

					<DialogFooter className="mt-4">
						<Button
							type="button"
							size="lg"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Odustani
						</Button>

						<Button type="submit" size="lg" disabled={isPending}>
							Pošalji
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
