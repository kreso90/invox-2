import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function getUserById(userId: string) {
	return prisma.user.findUnique({
		where: {
			id: userId,
		},
	});
}

export async function getCurrentUser() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		return null;
	}

	return getUserById(session.user.id);
}
