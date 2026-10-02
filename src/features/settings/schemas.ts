import { z } from "zod";

export const settingsSchema = z.object({
	nextInvoiceNumber: z.string().min(1, "Sljedeći broj računa je obavezan"),
	nextQuoteNumber: z.string().min(1, "Sljedeći broj ponude je obavezan"),
	defaultDueDays: z.string().min(1, "Zadani rok je obavezan"),
	defaultIssuePlace: z.string().min(1, "Zadano mjesto izdavanja je obavezno"),
	defaultPaymentMethod: z.string().min(1, "Zadana metoda plaćanja je obavezna"),
	defaultFooterNote: z.string().optional(),
});

export const emailSettingsSchema = z.object({
	emailSenderName: z.string(),
	emailReplyTo: z.email().or(z.literal("")),
	emailSubjectTemplate: z.string(),
	emailBodyTemplate: z.string(),
});
