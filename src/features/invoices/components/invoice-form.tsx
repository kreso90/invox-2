"use client";
import { Invoice } from "../types";
import { Article } from "@/features/articles/types";
import { Business } from "@/features/business/types";
import { Settings } from "@/features/settings/types";
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
import { PaymentType, Prisma, Unit, User } from "@/generated/prisma";
import { useActionState, useEffect, useState } from "react";
import { ArrowDownToLine, Plus, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { createInvoice, enterPayment, deletePayment } from "../actions";
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
import { getEffectiveStatus } from "../utils";
import { statusLabels, paymentLabels } from "../constants";
import { Badge } from "@/components/ui/badge";
import { Progress, ProgressValue } from "@/components/ui/progress";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from "@/components/ui/input-group";
import { DownloadInvoiceButton } from "@/features/invoices/components/invoice-pdf";
import { unitLabelsShort } from "@/features/articles/constants";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

interface InvoiceFormProps {
	invoiceData: InvoiceWithClient | null;
	clientsData: Client[];
	articlesData: Article[];
	businessData: Business | null;
	userData: User | null;
	settingsData: Settings | null;
}

type DraftInvoiceItem = {
	id: string;
	itemId: string;
	name: string;
	quantity: string;
	unit?: Unit;
	unitPrice: string;
};

type InvoiceWithClient = Prisma.InvoiceGetPayload<{
	include: { client: true; invoicePayments: true; invoiceItems: true };
}>;

function formatDateInput(value: Date | string | undefined) {
	return value ? new Date(value).toISOString().split("T")[0] : "";
}

export default function InvoiceForm({
	invoiceData,
	clientsData,
	articlesData,
	businessData,
	userData,
	settingsData,
}: InvoiceFormProps) {
	const [state, formAction, isPending] = useActionState(createInvoice, null);
	const [paymentState, formPaymentAction, isPaymentPending] = useActionState(
		enterPayment,
		null,
	);
	const [deletePaymentState, formDeletePaymentAction, isDeletePaymentPending] =
		useActionState(deletePayment, null);

	const isEdit = Boolean(invoiceData);

	const [paymentMethod, setPaymentMethod] = useState<PaymentType>(
		(invoiceData?.paymentMethod || settingsData?.defaultPaymentMethod) ??
			"BANK_TRANSFER",
	);

	const [dueDate, setDueDate] = useState(
		invoiceData?.dueDate
			? formatDateInput(invoiceData.dueDate)
			: new Date(
					Date.now() +
						(settingsData?.defaultDueDays ?? 0) * 24 * 60 * 60 * 1000,
				)
					.toISOString()
					.split("T")[0],
	);

	const initialValues = {
		clientId: invoiceData?.clientId || "",
		invoiceNumber:
			(invoiceData?.invoiceNumber || settingsData?.nextInvoiceNumber) ??
			"1/1/1",
		issueDate:
			formatDateInput(invoiceData?.issueDate) ||
			new Date().toISOString().split("T")[0],
		dueDate: dueDate,
		status: invoiceData?.status || "",
		totalAmount: invoiceData?.totalAmount?.toString() || "",
		note: invoiceData?.note || settingsData?.defaultFooterNote || "",
		paymentMethod: paymentMethod || "",
		issuePlace:
			settingsData?.defaultIssuePlace || invoiceData?.issuePlace || "",
	};

	const { formValues, setFormValues, handleInputChange } =
		useFormValues(initialValues);

	const [paymentEntry, setPaymentEntry] = useState(false);

	const [paymentDate, setPaymentDate] = useState("");
	const [paymentAmount, setPaymentAmount] = useState(
		invoiceData?.totalAmount?.toString() ?? "0",
	);

	const [invoiceItems, setInvoiceItems] = useState<DraftInvoiceItem[]>(
		invoiceData?.invoiceItems.map((item) => ({
			id: item.id,
			itemId: item.itemId ?? "",
			name: item.name,
			quantity: item.quantity.toString(),
			unit: item.unit ?? undefined,
			unitPrice: item.unitPrice.toString(),
		})) ?? [
			{
				id: "draft-item-0",
				itemId: "",
				name: "",
				unit: undefined,
				quantity: "1",
				unitPrice: "",
			},
		],
	);

	useEffect(() => {
		setPaymentDate(new Date().toISOString().split("T")[0]);
	}, []);

	const handleInvoiceItemChange = (
		id: string,
		field: "name" | "quantity" | "unitPrice" | "unit",
		value: string | undefined,
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
							unit: article.unit ?? undefined,
							unitPrice: article.price.toString(),
						}
					: item,
			),
		);
	};

	const selectedClient = clientsData.find(
		(client) => client.id === formValues.clientId,
	);

	const totalPaid =
		invoiceData?.invoicePayments.reduce(
			(sum, payment) => sum + payment.amount,
			0,
		) ?? 0;

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
					{invoiceData &&
						invoiceData?.status != "DRAFT" &&
						invoiceData?.status != "CANCELLED" && (
							<Button
								size="lg"
								type="submit"
								variant="destructive"
								name="status"
								value="CANCELLED"
								className="ml-auto"
								disabled={isPending}
								form="invoice-form"
							>
								Storniraj
							</Button>
						)}
					{(invoiceData && invoiceData?.status === "DRAFT") ||
						(!invoiceData && (
							<Button
								size="lg"
								type="submit"
								variant="outline"
								name="status"
								value="DRAFT"
								className="ml-auto"
								disabled={isPending}
								form="invoice-form"
							>
								Spremi nacrt
							</Button>
						))}
					{invoiceData?.status !== "PAID" && (
						<Button
							size="lg"
							type="submit"
							name="status"
							value="ISSUED"
							className="ml-auto"
							disabled={isPending}
							form="invoice-form"
						>
							{invoiceData?.status === "ISSUED" ||
							invoiceData?.status === "PARTIALLY_PAID" ||
							invoiceData?.status === "OVERDUE"
								? "Izmijeni račun"
								: "Izdaj račun"}
						</Button>
					)}
					{invoiceData &&
						businessData &&
						selectedClient &&
						invoiceData?.status !== "DRAFT" &&
						invoiceData?.status !== "CANCELLED" && (
							<Popover>
								<PopoverTrigger
									render={
										<Button size="lg" className="w-fit">
											<ArrowDownToLine className="h-4 w-4" />
											Preuzmi račun
										</Button>
									}
								/>
								<PopoverContent align="start" className="w-34">
									<DownloadInvoiceButton
										invoice={invoiceData}
										business={businessData}
										client={selectedClient}
										user={userData}
										language="hr"
									/>
									<DownloadInvoiceButton
										invoice={invoiceData}
										business={businessData}
										client={selectedClient}
										user={userData}
										language="en"
									/>
								</PopoverContent>
							</Popover>
						)}
				</div>
			</div>

			<div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-4">
				<div>
					<form action={formAction} className="w-full" id="invoice-form">
						<input
							type="hidden"
							name="invoiceId"
							value={invoiceData?.id ?? ""}
						/>
						<input
							type="hidden"
							name="items"
							value={JSON.stringify(invoiceItems)}
						/>
						<FieldSet className="w-full mb-8">
							<FieldLegend
								variant="label"
								className="uppercase text-muted mb-2"
							>
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
											onChange={(e) => {
												handleInputChange(e);
												setDueDate(
													new Date(
														new Date(e.target.value).getTime() +
															15 * 24 * 60 * 60 * 1000,
													)
														.toISOString()
														.split("T")[0],
												);
											}}
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
											value={dueDate}
											onChange={(e) => setDueDate(e.target.value)}
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
											value={paymentMethod}
											onValueChange={(paymentMethod) =>
												paymentMethod &&
												setPaymentMethod(paymentMethod as PaymentType)
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
							<FieldLegend
								variant="label"
								className="uppercase text-muted mb-2"
							>
								Stavke
							</FieldLegend>

							<div className="border border-background rounded-lg">
								<div className="grid grid-cols-[2.4fr_0.7fr_80px_1fr_1fr_24px] rounded-t-lg tracking-wide bg-background text-accent-backgorund uppercase py-2.5 px-3 gap-2.5 text-xs font-medium">
									<div>Naziv artikla / usluge</div>
									<div>Kol.</div>
									<div>JM</div>
									<div>Cijena (€)</div>
									<div className="text-center">Iznos</div>
									<div></div>
								</div>
								{invoiceItems?.map((item) => (
									<FieldGroup
										key={item.id}
										className="grid lg:grid-cols-[2.4fr_0.7fr_80px_1fr_1fr_24px] py-2.5 px-3 gap-2.5 border-b border-background last:border-0"
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
											<Select
												id={`unit-${item.id}`}
												name="unit"
												value={item.unit ?? null}
												onValueChange={(unit) =>
													setInvoiceItems((current) =>
														current.map((currentItem) =>
															currentItem.id === item.id
																? {
																		...currentItem,
																		unit: (unit as Unit | null) ?? undefined,
																	}
																: currentItem,
														),
													)
												}
											>
												<SelectTrigger className="w-full">
													<SelectValue>
														{(value: Unit | null) =>
															value
																? unitLabelsShort[value]
																: "Odaberi jedinicu"
														}
													</SelectValue>
												</SelectTrigger>
												<SelectContent>
													<SelectGroup>
														{Object.values(Unit).map((unit) => (
															<SelectItem key={unit} value={unit}>
																{unitLabelsShort[unit]}
															</SelectItem>
														))}
													</SelectGroup>
												</SelectContent>
											</Select>
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
							<FieldLegend
								variant="label"
								className="uppercase text-muted mb-2"
							>
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
				</div>

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
							<div className="relative">
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
								{invoiceData ? (
									<Badge
										className="ml-auto mt-5 bg-transparent"
										variant={`${
											getEffectiveStatus(invoiceData).toLowerCase() as
												| "paid"
												| "issued"
												| "draft"
												| "overdue"
										}`}
									>
										{statusLabels[getEffectiveStatus(invoiceData)]}
									</Badge>
								) : null}
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
									{selectedClient?.oib && (
										<>
											OIB: {selectedClient?.oib}
											<br />
										</>
									)}
									{selectedClient?.vatNumber && (
										<>
											PDV: {selectedClient?.vatNumber}
											<br />
										</>
									)}
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
											<TableHead className="text-center">JM</TableHead>
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
												<TableCell className="font-mono text-center">
													{items?.unit ? unitLabelsShort[items?.unit] : "-"}
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
					{invoiceData && invoiceData?.status != "DRAFT" && (
						<div className="mt-8">
							<div className="text-xs tracking-wider uppercase mb-2 text-muted">
								Pregled uplata
							</div>
							<Card className="p-4 gap-1">
								<strong className="block mb-2">Praćenje uplata</strong>
								<div className="flex justify-between border-b border-border pb-1">
									<span>Ukupan iznos računa</span>
									<span className="font-mono">
										{invoiceData?.totalAmount.toLocaleString("hr-HR", {
											style: "currency",
											currency: "EUR",
										})}
									</span>
								</div>
								<div className="flex justify-between pb-1">
									<span>Preostalo za platiti</span>
									<span className="font-mono">
										{(
											(invoiceData?.totalAmount ?? 0) - totalPaid
										).toLocaleString("hr-HR", {
											style: "currency",
											currency: "EUR",
										})}
									</span>
								</div>

								<Progress
									value={
										((totalPaid ?? 0) / (invoiceData?.totalAmount ?? 1)) * 100
									}
									locale="hr-HR"
									className="mt-4"
									trackClassName="h-2 relative"
								>
									<ProgressValue className="absolute left-0 -bottom-5" />
								</Progress>

								<div className="my-8">
									<div className="tracking-wider uppercase text-muted text-xs mb-2">
										Plaćeno do sada
									</div>

									<InputGroup className="w-full">
										<InputGroupAddon>
											<InputGroupText className="text-primary">
												€
											</InputGroupText>
										</InputGroupAddon>
										<InputGroupInput
											placeholder="0.00"
											value={totalPaid}
											readOnly
										/>
										<InputGroupAddon align="inline-end">
											<InputGroupText className="text-primary">
												EUR
											</InputGroupText>
										</InputGroupAddon>
									</InputGroup>
									<span className="text-muted text-xs">
										Status se automatski mijenja u "Plaćeno" kad uneseni iznos
										dosegne ukupan iznos računa.
									</span>
								</div>

								<div className="mb-4">
									<div className="tracking-wider uppercase text-muted text-xs mb-2">
										Povijest uplata
									</div>
									{invoiceData?.invoicePayments?.length ? (
										<ul>
											{invoiceData?.invoicePayments.map((payment) => (
												<li
													key={payment.id}
													className="flex justify-between mb-2"
												>
													<div className="flex flex-col">
														<span>
															{payment.method == "BANK_TRANSFER"
																? "Uplata na transakcijski račun"
																: "Gotovinska uplata"}
														</span>
														<span className="text-muted text-xs">
															{new Date(payment.paidAt).toLocaleDateString(
																"hr-HR",
															)}
														</span>
													</div>
													<div className="flex gap-2">
														<span className="font-mono">
															{payment.amount.toLocaleString("hr-HR", {
																style: "currency",
																currency: "EUR",
															})}
														</span>

														<form
															action={formDeletePaymentAction}
															className="no-wrapper"
														>
															<input
																type="hidden"
																name="paymentId"
																value={payment.id}
															/>
															<input
																type="hidden"
																name="invoiceId"
																value={invoiceData?.id ?? ""}
															/>
															<button
																type="submit"
																disabled={isDeletePaymentPending}
																className="p-1 hover:bg-destructive/10 rounded cursor-pointer"
															>
																<X className="w-4 h-4 text-destructive" />
															</button>
														</form>
													</div>
												</li>
											))}
										</ul>
									) : (
										<p className="text-muted text-xs">Nema uplata za prikaz.</p>
									)}
								</div>
								<Button
									size="lg"
									type="button"
									variant="outline"
									onClick={() => setPaymentEntry(true)}
									className={`bg-transparent border-dashed! text-muted mt-4 ${!paymentEntry ? "flex" : "hidden"}`}
								>
									<Plus />
									Dodaj uplatu
								</Button>
								<form
									className={paymentEntry ? "block" : "hidden"}
									action={formPaymentAction}
								>
									<input
										type="hidden"
										name="invoiceId"
										value={invoiceData?.id ?? ""}
									/>
									<FieldSet>
										<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
											<Field>
												<FieldLabel htmlFor="issuePlace">
													Datum
													<span className="text-destructive">*</span>
												</FieldLabel>
												<Input
													id="date"
													name="date"
													type="date"
													value={paymentDate}
													onChange={(event) =>
														setPaymentDate(event.target.value)
													}
													required
												/>
											</Field>
											<Field>
												<FieldLabel htmlFor="paymentMethod">
													Način plaćanja
													<span className="text-destructive">*</span>
												</FieldLabel>
												<Select
													id="paymentMethod"
													name="paymentMethod"
													value={paymentMethod}
													onValueChange={(value) =>
														setPaymentMethod(value as PaymentType)
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
													Iznos
													<span className="text-destructive">*</span>
												</FieldLabel>
												<InputGroup className="w-full h-10 bg-background">
													<InputGroupAddon>
														<InputGroupText className="text-primary">
															€
														</InputGroupText>
													</InputGroupAddon>
													<InputGroupInput
														id="amount"
														name="amount"
														type="number"
														step="0.01"
														value={paymentAmount}
														onChange={(event) =>
															setPaymentAmount(event.target.value)
														}
														required
													/>
													<InputGroupAddon align="inline-end">
														<InputGroupText className="text-primary">
															EUR
														</InputGroupText>
													</InputGroupAddon>
												</InputGroup>
											</Field>
										</div>
									</FieldSet>
									<div className="flex justify-end gap-4 mt-2">
										<Button
											size="lg"
											variant="outline"
											type="button"
											className="mt-4"
											onClick={() => setPaymentEntry(false)}
										>
											Odustani
										</Button>
										<Button size="lg" type="submit" className="mt-4">
											Dodaj uplatu
										</Button>
									</div>
									{paymentState?.message}
								</form>
							</Card>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
