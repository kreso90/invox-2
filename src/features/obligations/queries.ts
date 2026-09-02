import { ObligationKind } from "@/generated/prisma/edge";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function getObligationById(obligationId: string) {
	return prisma.user.findUnique({
		where: {
			id: obligationId,
		},
	});
}

async function findObligationsByKind(kinds: ObligationKind[]) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		return null;
	}

	return prisma.obligation.findMany({
		where: {
			userId: session.user.id,
			kind: {
				in: kinds,
			},
		},
		orderBy: {
			dueDate: "asc",
		},
	});
}

export function getUserObligations() {
	return findObligationsByKind(["MIO1", "MIO2", "HEALTH_INSURANCE"]);
}

export function getUserTaxObligations() {
	return findObligationsByKind(["INCOME_TAX"]);
}

export function getUserFormsObligations() {
	return findObligationsByKind(["PDV_FORM", "ZP_FORM"]);
}

export function getOtherObligations() {
	return findObligationsByKind(["OTHER"]);
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
	});

	return dueObligations;
}

export async function getMonthlyObligationsAmount() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		return null;
	}

	const today = new Date();
	const periodLabel = `${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;

	const monthlyObligationsAmount = await prisma.obligation.aggregate({
		_sum: {
			amount: true,
		},
		where: {
			userId: session.user.id,
			periodLabel,
			kind: {
				in: ["MIO1", "MIO2", "HEALTH_INSURANCE"],
			},
		},
	});

	return monthlyObligationsAmount;
}
