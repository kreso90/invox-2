import { Resend } from "resend";
import { URL } from "url";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Email templates
 */
const emailTemplates = {
	verify: {
		en: {
			subject: "Confirm your email address",
			html: (link: string) => `
        <p>Hello,</p>
        <p>Thank you for registering! Please confirm your email address by clicking the button below:</p>
        <p><a href="${link}" style="padding:10px 20px;background:#4f46e5;color:white;text-decoration:none;border-radius:5px;">Confirm Email</a></p>
        <p>If you did not sign up for this account, you can safely ignore this email.</p>
        <p>Thanks,<br>The Team</p>
      `,
		},
		hr: {
			subject: "Potvrdite svoju e-poštu",
			html: (link: string) => `
        <p>Bok,</p>
        <p>Hvala što ste se registrirali! Potvrdite svoju e-poštu klikom na gumb ispod:</p>
        <p><a href="${link}" style="padding:10px 20px;background:#4f46e5;color:white;text-decoration:none;border-radius:5px;">Potvrdi e-poštu</a></p>
        <p>Ako se niste registrirali, ovu poruku možete ignorirati.</p>
        <p>Hvala,<br>Tim</p>
      `,
		},
	},
	reset: {
		en: {
			subject: "Reset your password",
			html: (link: string) => `
        <p>Hello,</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <p><a href="${link}" style="padding:10px 20px;background:#4f46e5;color:white;text-decoration:none;border-radius:5px;">Reset Password</a></p>
        <p>If you did not request a password reset, you can safely ignore this email.</p>
        <p>Thanks,<br>The Team</p>
      `,
		},
		hr: {
			subject: "Resetiranje lozinke",
			html: (link: string) => `
        <p>Bok,</p>
        <p>Primili smo zahtjev za resetiranje vaše lozinke. Kliknite gumb ispod kako biste postavili novu lozinku:</p>
        <p><a href="${link}" style="padding:10px 20px;background:#4f46e5;color:white;text-decoration:none;border-radius:5px;">Resetiraj lozinku</a></p>
        <p>Ako niste tražili resetiranje lozinke, ovu poruku možete ignorirati.</p>
        <p>Hvala,<br>Tim</p>
      `,
		},
	},
};

export const sendVerificationEmail = async (
	email: string,
	link: URL,
	locale: "en" | "hr" = "en",
) => {
	const template = emailTemplates.verify[locale];

	await resend.emails.send({
		from: "onboarding@resend.dev",
		to: email,
		subject: template.subject,
		html: template.html(link as unknown as string),
	});
};

export const sendResetEmail = async (
	email: string,
	link: URL,
	locale: "en" | "hr" = "en",
) => {
	const template = emailTemplates.reset[locale];

	await resend.emails.send({
		from: "onboarding@resend.dev",
		to: email,
		subject: template.subject,
		html: template.html(link as unknown as string),
	});
};
