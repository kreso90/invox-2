"use client";

import { useState } from "react";
import Link from "next/link";
import { Edit2, Mail, MoreHorizontalIcon } from "lucide-react";
import type { Business, Invoice, Prisma } from "@/generated/prisma";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
	const [emailModalOpen, setEmailModalOpen] = useState(false);

	console.log("modal:", emailModalOpen);

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

					<DropdownMenuSeparator />

					<DropdownMenuItem
						onClick={() => {
							console.log("EMAIL CLICK");
							setEmailModalOpen(true);
						}}
					>
						<Mail className="mr-2 size-4" />
						Pošalji email
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					<InvoiceDeleteForm invoiceId={invoiceData.id} variant="ghost" />
				</DropdownMenuContent>
			</DropdownMenu>

			<InvoiceEmailFormModal
				invoiceData={invoiceData}
				open={emailModalOpen}
				onOpenChange={setEmailModalOpen}
				settingsData={settingsData}
				businessData={businessData}
			/>
		</>
	);
}
