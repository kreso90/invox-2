import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function getBusinessByUserId(userId: string) {
	return prisma.business.findUnique({
		where: {
			userId,
		},
	});
}

export async function getCurrentBusiness() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		return null;
	}

	return getBusinessByUserId(session.user.id);
}
