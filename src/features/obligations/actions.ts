"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { obligationSchema } from "@/features/obligations/schemas";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ObligationKind, ObligationStatus, Prisma } from "@/generated/prisma";

export async function createObligation(prevState: unknown, formData: FormData) {
	const data = Object.fromEntries(formData);

	const result = obligationSchema.safeParse(data);

	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user?.id) {
		return { status: "error", message: "Korisnik nije logiran" };
	}

	if (!result.success) {
		return {
			status: "error",
			messages: result.error.issues.map((issue) => issue.message),
		};
	}

	const get = (key: string) => (data[key] as string) || undefined;

	const obligationId = get("obligationId");
	const periodLabel = get("periodLabel");
	const dueDate = get("dueDate");

	if (!periodLabel || !dueDate) {
		return {
			status: "error",
			message: "Razdoblje i rok dospijeća su obavezni.",
		};
	}

	const obligationValues = {
		kind: get("kind") as ObligationKind,
		name: get("name")!,
		periodLabel: periodLabel,
		dueDate: new Date(dueDate),
		amount: get("amount") ? parseFloat(get("amount")!) : undefined,
		paymentModel: get("paymentModel") || "",
		paymentReference: get("paymentReference"),
		paymentDescription: get("paymentDescription"),
	};

	const existingObligation = await prisma.obligation.findUnique({
		where: {
			userId_kind_periodLabel: {
				userId: session.user.id,
				kind: result.data.kind,
				periodLabel: result.data.periodLabel,
			},
		},
	});

	if (existingObligation) {
		return {
			status: "error",
			messages: [`Obveza za razdoblje ${result.data.periodLabel} već postoji.`],
		};
	}

	try {
		const obligation = obligationId
			? await prisma.obligation.update({
					where: {
						id: obligationId,
						userId: session.user.id,
					},
					data: obligationValues,
				})
			: await prisma.obligation.create({
					data: {
						...obligationValues,
						userId: session.user.id,
						status: "PENDING",
					},
				});

		if (obligation) {
			return {
				status: "success",
				message: "Podaci o obvezi su uspješno spremljeni!",
			};
		}
	} catch (err: any) {
		return {
			status: "error",
			messages: ["Došlo je do pogreške. Molimo pokušajte ponovno."],
		};
	}
}

export async function updateObligationStatus(
	prevState: any,
	formData: FormData,
) {
	const obligationId = formData.get("obligationId") as string;

	if (!obligationId) {
		return {
			status: "error",
			message: "Obveza nije pronađena",
		};
	}

	const obligation = await prisma.obligation.findUnique({
		where: { id: obligationId },
	});

	if (!obligation) {
		return {
			status: "error",
			message: "Obveza nije pronađena",
		};
	}

	await prisma.obligation.update({
		where: { id: obligationId },
		data: {
			status: obligation?.status !== "SUBMITTED" ? "SUBMITTED" : "PENDING",
		},
	});

	revalidatePath("/obligations");
	return {
		status: "success",
		message:
			obligation?.status !== "SUBMITTED"
				? "Obveza je uspješno ažurirana."
				: "Obveza je poništena.",
	};
}

export async function getDueObligations() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		return null;
	}

	const dueObligations = await prisma.obligation.findMany({
		where: {
			userId: session.user.id,
			status: "PENDING",
		},
		orderBy: { dueDate: "asc" },
		take: 5,
		include: { user: true },
	});

	return dueObligations;
}

export async function deleteObligation(prevState: unknown, formData: FormData) {
	const obligationId = formData.get("obligationId") as string;

	const obligation = await prisma.obligation.findUnique({
		where: { id: obligationId },
	});

	if (!obligationId || !obligation) {
		return {
			status: "error",
			message: "Obveza nije pronađena.",
		};
	}

	try {
		await prisma.obligation.delete({
			where: {
				id: obligationId,
			},
		});

		revalidatePath("/obligations");

		return {
			status: "success",
			message: `Obveza ${obligation?.name} za period ${obligation.periodLabel} je uspješno izbrisana.`,
		};
	} catch (error) {
		return {
			status: "error",
			message: "Brisanje obveze nije uspjelo.",
		};
	}
}
