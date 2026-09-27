import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function getSettingsByUserId(userId: string) {
	return prisma.settings.findUnique({
		where: {
			userId,
		},
	});
}

export async function getCurrentSettings() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		return null;
	}

	return getSettingsByUserId(session.user.id);
}
