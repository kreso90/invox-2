import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function getClientsByUserId(userId: string) {
	return prisma.client.findMany({
		where: {
			userId,
		},
	});
}

export async function getUserClients() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		return null;
	}

	return getClientsByUserId(session.user.id);
}

export async function getClientById(clientId: string) {
	return prisma.client.findUnique({
		where: {
			id: clientId,
		},
	});
}
