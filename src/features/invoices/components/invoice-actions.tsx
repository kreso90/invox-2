"use client";

import { useState } from "react";
import Link from "next/link";
import { Edit2, Mail, MoreHorizontalIcon, Trash2, X } from "lucide-react";
import type { Business, Invoice, Prisma } from "@/generated/prisma";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DownloadInvoiceButton } from "@/features/invoices/components/invoice-pdf";
import InvoiceDeleteForm from "./invoice-delete-form";
import { InvoiceEmailFormModal } from "./invoice-email-form";
import { Settings } from "@/generated/prisma";

interface InvoiceActionsProps {
	invoiceData: InvoiceWithClient;
	settingsData: Settings | null;
	businessData: Business | null;
}

type InvoiceWithClient = Prisma.InvoiceGetPayload<{
	include: { client: true; invoicePayments: true };
}>;

export function InvoiceActions({
	invoiceData,
	settingsData,
	businessData,
}: InvoiceActionsProps) {
	const [modalOpen, setModalOpen] = useState({
		emailModalOpen: false,
		deleteModalOpen: false,
	});

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger
					render={
						<Button variant="ghost" size="icon" className="size-8">
							<MoreHorizontalIcon />
							<span className="sr-only">Otvori izbornik</span>
						</Button>
					}
				/>

				<DropdownMenuContent align="end">
					<DropdownMenuItem
						render={
							<Link
								href={`/invoices/${invoiceData.id}`}
								className="flex items-center"
							>
								<Edit2 className="mr-2 size-4" />
								Uredi
							</Link>
						}
					/>

					<DropdownMenuItem
						onClick={() => {
							setModalOpen({ ...modalOpen, emailModalOpen: true });
						}}
					>
						<Mail className="mr-2 size-4" />
						{invoiceData.isEmailSent
							? "Ponovno pošalji email"
							: "Pošalji email"}
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					<DropdownMenuItem
						className="text-destructive"
						onClick={() => {
							setModalOpen({ ...modalOpen, deleteModalOpen: true });
						}}
					>
						<Trash2 className="mr-2 size-4" />
						Izbriši račun
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<InvoiceEmailFormModal
				invoiceData={invoiceData}
				open={modalOpen.emailModalOpen}
				onOpenChange={(open) =>
					setModalOpen({ ...modalOpen, emailModalOpen: open })
				}
				settingsData={settingsData}
				businessData={businessData}
			/>

			<InvoiceDeleteForm
				invoiceData={invoiceData}
				variant="ghost"
				open={modalOpen.deleteModalOpen}
				onOpenChange={(open) =>
					setModalOpen({ ...modalOpen, deleteModalOpen: open })
				}
			/>
		</>
	);
}
