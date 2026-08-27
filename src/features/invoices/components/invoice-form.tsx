"use client";
import { Invoice } from "../types";
import { Article } from "@/features/articles/types";
import { Business } from "@/features/business/types";
import { useFormValues } from "@/hooks/use-form-values";
import {
	Field,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldDescription,
	FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Client } from "@/features/clients/types";
import { PaymentType, User } from "@/generated/prisma";
import { useActionState, useState } from "react";
import { Plus, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { createInvoice } from "../actions";
import InputSelect from "@/components/ui/input-select";
import { Card } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import Link from "next/link";

const paymentLabels: Record<PaymentType, string> = {
	BANK_TRANSFER: "Bankovni transfer",
	CASH: "Gotovina",
};

interface InvoiceFormProps {
	invoiceData: Invoice | null;
	clientsData: Client[];
	articlesData: Article[];
	businessData: Business | null;
	userData: User | null;
	lastInvoiceNumber?: string | null;
}

type DraftInvoiceItem = {
	id: string;
	itemId: string;
	name: string;
	quantity: string;
	unitPrice: string;
};

function formatDateInput(value: Date | string | undefined) {
	return value ? new Date(value).toISOString().split("T")[0] : "";
}

export default function InvoiceForm({
	invoiceData,
	clientsData,
	articlesData,
	businessData,
	userData,
	lastInvoiceNumber,
}: InvoiceFormProps) {
	const [state, formAction, isPending] = useActionState(createInvoice, null);

	const isEdit = Boolean(invoiceData);

	const nextInvoiceNumber =
		invoiceData?.invoiceNumber ??
		(() => {
			const year = new Date().getFullYear();
			const lastNumber = lastInvoiceNumber?.startsWith(`${year}-`)
				? Number(lastInvoiceNumber.slice(5))
				: 0;

			return `${year}-${String(lastNumber + 1).padStart(4, "0")}`;
		})();

	const initialValues = {
		clientId: invoiceData?.clientId || "",
		invoiceNumber: nextInvoiceNumber,
		issueDate: formatDateInput(invoiceData?.issueDate),
		dueDate: formatDateInput(invoiceData?.dueDate),
		status: invoiceData?.status || "",
		totalAmount: invoiceData?.totalAmount?.toString() || "",
		note: invoiceData?.note || "",
		paymentMethod: invoiceData?.paymentMethod || "",
		issuePlace: invoiceData?.issuePlace || "",
	};

	const { formValues, setFormValues, handleInputChange } =
		useFormValues(initialValues);

	const [invoiceItems, setInvoiceItems] = useState<DraftInvoiceItem[]>(
		invoiceData?.invoiceItems.map((item) => ({
			id: item.id,
			itemId: item.itemId ?? "",
			name: item.name,
			quantity: item.quantity.toString(),
			unitPrice: item.unitPrice.toString(),
		})) ?? [
			{
				id: crypto.randomUUID(),
				itemId: "",
				name: "",
				quantity: "1",
				unitPrice: "",
			},
		],
	);

	const handleInvoiceItemChange = (
		id: string,
		field: keyof DraftInvoiceItem,
		value: string,
	) => {
		setInvoiceItems((current) =>
			current.map((item) =>
				item.id === id ? { ...item, [field]: value } : item,
			),
		);
	};

	const handleAddInvoiceItem = () => {
		setInvoiceItems((current) => [
			...current,
			{
				id: crypto.randomUUID(),
				itemId: "",
				name: "",
				quantity: "1",
				unitPrice: "",
			},
		]);
	};

	const handleRemoveInvoiceItem = (id: string) => {
		setInvoiceItems((current) => current.filter((item) => item.id !== id));
	};

	const handleArticleSelect = (id: string, itemId: string) => {
		const article = articlesData.find((article) => article.id === itemId);
		if (!article) return;

		setInvoiceItems((items) =>
			items.map((item) =>
				item.id === id
					? {
							...item,
							itemId,
							name: article.name,
							unitPrice: article.price.toString(),
						}
					: item,
			),
		);
	};

	const selectedClient = clientsData.find(
		(client) => client.id === formValues.clientId,
	);

	return (
		<>
			<div className="flex justify-between items-end mb-8">
				<div className="flex flex-col">
					<Link
						href="/invoices"
						className="text-muted text-sm mb-1 hover:underline"
					>
						&larr; Povratak na listu računa
					</Link>
					<h1 className="page-title">
						{isEdit ? "Uredi račun" : "Novi račun"}
					</h1>
					<span className="font-mono text-sm">
						{isEdit
							? `Račun ${invoiceData?.invoiceNumber}`
							: "Nacrt se sprema automatski"}
					</span>
				</div>
				<div className="flex gap-2">
					<Button
						size="lg"
						type="submit"
						name="status"
						value="DRAFT"
						className="ml-auto"
						disabled={isPending}
						form="invoice-form"
					>
						Spremi nacrt
					</Button>
					<Button
						size="lg"
						type="submit"
						name="status"
						value="ISSUED"
						className="ml-auto"
						disabled={isPending}
						form="invoice-form"
					>
						Izdaj račun
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-4">
				<form action={formAction} className="w-full" id="invoice-form">
					<input type="hidden" name="invoiceId" value={invoiceData?.id ?? ""} />
					<input
						type="hidden"
						name="items"
						value={JSON.stringify(invoiceItems)}
					/>
					<FieldSet className="w-full mb-8">
						<FieldLegend variant="label" className="uppercase text-muted mb-2">
							Podaci o računu
						</FieldLegend>
						<FieldGroup>
							<div className="grid md:grid-cols-2 md:gap-4">
								<Field>
									<FieldLabel htmlFor="invoiceNumber">
										Broj računa
										<span className="text-destructive">*</span>
									</FieldLabel>
									<Input
										id="invoiceNumber"
										name="invoiceNumber"
										type="text"
										value={formValues.invoiceNumber}
										required
										readOnly
									/>
								</Field>
								<Field>
									<FieldLabel htmlFor="clientId">
										Klijent <span className="text-destructive">*</span>
									</FieldLabel>
									<Select
										id="clientId"
										name="clientId"
										value={formValues.clientId}
										onValueChange={(clientId) =>
											setFormValues((current) => ({
												...current,
												clientId: clientId ?? "",
											}))
										}
									>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Odaberi klijenta">
												{(clientId: string | null) => {
													const client = clientsData.find(
														(client) => client.id === clientId,
													);

													return client?.companyName ?? "Odaberi klijenta";
												}}
											</SelectValue>
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												{clientsData?.map((client) => (
													<SelectItem key={client.id} value={client.id}>
														{client.companyName}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
									{formValues.clientId ? (
										<FieldDescription>
											Šalje se na:{" "}
											{
												clientsData.find(
													(client) => client.id === formValues.clientId,
												)?.email
											}
										</FieldDescription>
									) : null}
								</Field>
								<Field>
									<FieldLabel htmlFor="issueDate">
										Datum izdavanja
										<span className="text-destructive">*</span>
									</FieldLabel>
									<Input
										id="issueDate"
										name="issueDate"
										type="date"
										value={formValues.issueDate}
										onChange={handleInputChange}
										required
									/>
								</Field>
								<Field>
									<FieldLabel htmlFor="dueDate">
										Dospijeće <span className="text-destructive">*</span>
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
									<FieldLabel htmlFor="paymentMethod">
										Način plaćanja <span className="text-destructive">*</span>
									</FieldLabel>
									<Select
										id="paymentMethod"
										name="paymentMethod"
										value={formValues.paymentMethod}
										onValueChange={(paymentMethod) =>
											setFormValues((current) => ({
												...current,
												paymentMethod: paymentMethod ?? "",
											}))
										}
									>
										<SelectTrigger className="w-full">
											<SelectValue>
												{(value: PaymentType | null) =>
													value
														? paymentLabels[value]
														: "Odaberi način plaćanja"
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
									<FieldLabel htmlFor="issuePlace">
										Mjesto izdavanja
										<span className="text-destructive">*</span>
									</FieldLabel>
									<Input
										id="issuePlace"
										name="issuePlace"
										type="text"
										value={formValues.issuePlace}
										onChange={handleInputChange}
										required
									/>
								</Field>
							</div>
						</FieldGroup>
					</FieldSet>

					<FieldSet className="w-full mb-8">
						<FieldLegend variant="label" className="uppercase text-muted mb-2">
							Stavke
						</FieldLegend>

						<div className="border border-background rounded-lg">
							<div className="grid grid-cols-[2.4fr_0.7fr_1fr_1fr_24px] rounded-t-lg tracking-wide bg-background text-accent-backgorund uppercase py-2.5 px-3 gap-2.5 text-xs font-medium">
								<div>Naziv artikla / usluge</div>
								<div>Kol.</div>
								<div>Cijena (€)</div>
								<div className="text-center">Iznos</div>
								<div></div>
							</div>
							{invoiceItems?.map((item) => (
								<FieldGroup
									key={item.id}
									className="grid lg:grid-cols-[2.4fr_0.7fr_1fr_1fr_24px] py-2.5 px-3 gap-2.5 border-b border-background last:border-0"
								>
									<Field>
										<InputSelect
											name="itemName"
											options={articlesData.map((article) => ({
												value: article.id,
												label: article.name,
											}))}
											value={item.itemId}
											onChange={(itemId) =>
												handleArticleSelect(item.id, itemId)
											}
										/>
									</Field>
									<Field>
										<Input
											id="quantity"
											name="quantity"
											type="number"
											value={item.quantity}
											onChange={(e) =>
												handleInvoiceItemChange(
													item.id,
													"quantity",
													e.target.value,
												)
											}
											required
										/>
									</Field>
									<Field>
										<Input
											id="price"
											name="price"
											type="number"
											step="0.01"
											min="0"
											value={item.unitPrice}
											onChange={(e) =>
												handleInvoiceItemChange(
													item.id,
													"unitPrice",
													e.target.value,
												)
											}
											required
										/>
									</Field>
									<div className="font-mono flex items-center justify-center text-sm">
										{(
											Number(item.quantity) * Number(item.unitPrice)
										).toLocaleString("hr-HR", {
											style: "currency",
											currency: "EUR",
										})}
									</div>
									<button
										type="button"
										onClick={() => handleRemoveInvoiceItem(item.id)}
										className="text-destructive"
									>
										<X />
									</button>
								</FieldGroup>
							))}
						</div>
						<Button
							size="lg"
							type="button"
							variant="outline"
							onClick={handleAddInvoiceItem}
							className="bg-transparent border-dashed! text-muted"
						>
							<Plus />
							Dodaj stavku
						</Button>
					</FieldSet>

					<FieldSet className="w-full mt-6 mb-2">
						<FieldLegend variant="label" className="uppercase text-muted mb-2">
							Napomena
						</FieldLegend>
						<Field>
							<Textarea
								id="note"
								name="note"
								value={formValues.note}
								onChange={handleInputChange}
							/>
						</Field>
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

				<div>
					<div className="text-xs tracking-wider uppercase mb-2 text-muted">
						Pregled retka na računu
					</div>
					<Card className="p-4">
						<div className="flex justify-between border-b border-border pb-4">
							{businessData ? (
								<div>
									<strong>{businessData?.business_name}</strong>
									<br />
									<span className="text-muted text-sm">
										{userData?.name}, vl. <br />
										{businessData?.street},{businessData?.postalCode}{" "}
										{businessData?.city}
										<br />
										OIB: {businessData?.oib}
										<br />
										PDV Broj: {businessData?.vatId}
										<br />
										IBAN: {businessData?.iban}
										<br />
									</span>
								</div>
							) : null}
							<div>
								<strong>Račun {formValues?.invoiceNumber}</strong>
								<br />
								<span className="text-muted font-mono text-xs">
									Izdano:{" "}
									{formValues.issueDate
										? new Intl.DateTimeFormat("hr-HR", {
												day: "numeric",
												month: "numeric",
												year: "numeric",
											}).format(new Date(`${formValues.issueDate}T00:00:00`))
										: "Datum nije odabran"}
									<br />
									Dospijeće:{" "}
									{formValues.dueDate
										? new Intl.DateTimeFormat("hr-HR", {
												day: "numeric",
												month: "numeric",
												year: "numeric",
											}).format(new Date(`${formValues.dueDate}T00:00:00`))
										: "Datum nije odabran"}
									<br />
									Način plaćanja:{" "}
									{paymentLabels[formValues.paymentMethod as PaymentType] ||
										"Nije odabrano"}
								</span>
							</div>
						</div>
						{selectedClient ? (
							<div className="pb-4">
								<strong>{selectedClient?.companyName}</strong>
								<br />
								<span className="text-muted text-sm">
									{selectedClient?.contactFirstName}{" "}
									{selectedClient?.contactLastName}, vl. <br />
									{selectedClient?.address},{selectedClient?.postalCode}{" "}
									{selectedClient?.city}
									<br />
									OIB: {selectedClient?.oib}
								</span>
							</div>
						) : null}

						{invoiceItems && invoiceItems[0]?.name ? (
							<div className="border-dashed border-b border-border pb-4">
								<Table>
									<TableHeader className="pointer-events-none">
										<TableRow className="uppercase text-xs!">
											<TableHead className="w-3/5">Stavka</TableHead>
											<TableHead>Kol.</TableHead>
											<TableHead className="text-right">Iznos</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{invoiceItems.map((items, index) => (
											<TableRow key={index} className="pointer-events-none">
												<TableCell>{items?.name}</TableCell>
												<TableCell className="font-mono">
													{items?.quantity}
												</TableCell>
												<TableCell className="font-mono text-right">
													€{Number(items?.quantity) * Number(items?.unitPrice)}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
								<div className="text-right mt-6 font-mono font-semibold">
									Ukupno: {"    "}
									{invoiceItems
										.reduce(
											(total, item) =>
												total +
												Number(item?.quantity) * Number(item?.unitPrice),
											0,
										)
										.toLocaleString("hr-HR", {
											style: "currency",
											currency: "EUR",
										})}
								</div>
							</div>
						) : null}
						<div className="text-muted text-xs pb-6">{formValues.note}</div>
					</Card>
				</div>
			</div>
		</>
	);
}
