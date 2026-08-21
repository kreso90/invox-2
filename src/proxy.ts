import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const protectedRoutes = ["/", "/invoices"];

export async function proxy(request: NextRequest) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const isOnProtectedRoute = protectedRoutes.some(
		(route) =>
			request.nextUrl.pathname === route ||
			request.nextUrl.pathname.startsWith(`${route}/`),
	);

	if (!session && isOnProtectedRoute) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
