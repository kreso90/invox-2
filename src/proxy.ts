import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "./lib/prisma";

const protectedRoutes = [
	"/",
	"/invoices",
	"/settings",
	"/clients",
	"/articles",
	"/obligations",
	"/dashboard",
];

export async function proxy(request: NextRequest) {
	const pathname = request.nextUrl.pathname;

	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const isOnProtectedRoute = protectedRoutes.some(
		(route) =>
			pathname === route || (route !== "/" && pathname.startsWith(`${route}/`)),
	);

	if (!session) {
		if (isOnProtectedRoute) {
			return NextResponse.redirect(new URL("/login", request.url));
		}

		return NextResponse.next();
	}

	if (pathname === "/") {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	const business = await prisma.business.findUnique({
		where: {
			userId: session.user.id,
		},
		select: {
			id: true,
		},
	});

	const isSettingsRoute =
		pathname === "/settings" || pathname.startsWith("/settings/");

	if (!business && !isSettingsRoute) {
		return NextResponse.redirect(new URL("/settings", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
	],
};
