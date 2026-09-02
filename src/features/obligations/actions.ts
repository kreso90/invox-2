"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { obligationSchema } from "@/features/obligations/schemas";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ObligationKind, ObligationStatus } from "@/generated/prisma/edge";

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
		periodLabel,
		dueDate: new Date(dueDate),
		amount: get("amount") ? parseFloat(get("amount")!) : undefined,
		paymentModel: get("paymentModel"),
		paymentReference: get("paymentReference"),
		paymentDescription: get("paymentDescription"),
		status: get("status") as ObligationStatus | undefined,
	};

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

	await prisma.obligation.update({
		where: { id: obligationId },
		data: { status: "SUBMITTED" },
	});

	redirect("/obligations");
}
