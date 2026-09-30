"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { articleSchema } from "./schemas";
import { Unit } from "@/generated/prisma/client";
import { redirect } from "next/navigation";

export async function createArticle(prevState: unknown, formData: FormData) {
	const data = Object.fromEntries(formData);

	const result = articleSchema.safeParse(data);

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

	const articleId = get("articleId");

	const articleValues = {
		name: get("name")!,
		unit: get("unit") as Unit,
		price: Number(get("price") || "0"),
		description: get("description") || null,
		lastUsedAt: get("lastUsedAt") ? new Date(get("lastUsedAt")!) : undefined,
	};

	let article;

	try {
		article = articleId
			? await prisma.article.update({
					where: {
						id: articleId,
						userId: session.user.id,
					},
					data: articleValues,
				})
			: await prisma.article.create({
					data: {
						...articleValues,
						userId: session.user.id,
					},
				});
	} catch (err: any) {
		return {
			status: "error",
			messages: ["Došlo je do pogreške. Molimo pokušajte ponovno."],
		};
	}

	if (!articleId) {
		redirect(`/articles/${article.id}?created=true`);
	}

	return {
		status: "success",
		message: "Podaci o klijentu su uspješno spremljeni!",
	};
}

export async function deleteArticle(prevState: any, formData: FormData) {
	const articleId = formData.get("articleId") as string;

	if (!articleId) {
		return {
			status: "error",
			message: "Artikl nije pronađen",
		};
	}

	try {
		await prisma.article.delete({
			where: {
				id: articleId,
			},
		});

		return {
			status: "success",
			message: `Artikal ${articleId} je uspješno izbrisan.`,
		};
	} catch (error) {
		return {
			status: "error",
			message: "Brisanje artikla nije uspjelo.",
		};
	}
}
