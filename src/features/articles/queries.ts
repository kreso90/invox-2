import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function getArticlesByUserId(userId: string) {
	return prisma.article.findMany({
		where: {
			userId,
		},
	});
}

export async function getUserArticles() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		return null;
	}

	return getArticlesByUserId(session.user.id);
}

export async function getArticleById(articleId: string) {
	return prisma.article.findUnique({
		where: {
			id: articleId,
		},
	});
}
