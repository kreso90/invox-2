import { z } from "zod";

export const settingsSchema = z.object({
	nextInvoiceNumber: z.string().min(1, "Next invoice number is required"),
	nextQuoteNumber: z.string().min(1, "Next quote number is required"),
	defaultDueDays: z.string().min(1, "Default due days is required"),
	defaultIssuePlace: z.string().min(1, "Default issue place is required"),
	defaultPaymentMethod: z.string().min(1, "Default payment method is required"),
	defaultFooterNote: z.string().optional(),
	emailSenderName: z.string().optional(),
	emailReplyTo: z.string().optional(),
	emailSubjectTemplate: z.string().optional(),
	emailBodyTemplate: z.string().optional(),
});
