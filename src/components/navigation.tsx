"use client";
import { Business, User } from "@/generated/prisma";
import { useEffect, useState } from "react";
import {
	House,
	ReceiptText,
	Users,
	MoreHorizontal,
	Box,
	Settings,
	CalendarClock,
	LogOut,
} from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
	Nav,
	NavMenu,
	NavMenuCollapsible,
	NavMenuFooter,
	NavMenuHeader,
	NavMenuLink,
	NavMenuList,
} from "./ui/navigation-menu";
import { AvatarPlaceholder } from "./ui/avatar-placeholder";
import Link from "next/link";
import { signOut } from "@/features/auth/actions";
import { Button } from "./ui/button";

interface NavigationProps {
	user: User | null;
	business: Business | null;
}

export function Navigation({ business, user }: NavigationProps) {
	const pathname = usePathname();
	const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);
	useEffect(() => {
		setIsCollapsibleOpen(false);
	}, [pathname]);
	return (
		<>
			<Nav>
				<Link href="/" className="px-2.5 mb-6 hidden lg:block">
					<Image
						src="/logo-white.svg"
						alt="Logo"
						width={240}
						height={80}
						loading="eager"
					/>
				</Link>

				{business && (
					<NavMenu className="w-full">
						<NavMenuHeader>PREGLED</NavMenuHeader>
						<NavMenuList>
							<NavMenuLink href="/dashboard" pathname={pathname}>
								<House size={20} />
								<span>Početna</span>
							</NavMenuLink>

							<NavMenuLink href="/invoices" pathname={pathname}>
								<ReceiptText size={20} />
								<span>Računi</span>
							</NavMenuLink>

							<NavMenuLink href="/clients" pathname={pathname}>
								<Users size={20} />
								<span>Klijenti</span>
							</NavMenuLink>

							<NavMenuLink
								href="/articles"
								pathname={pathname}
								className="hidden lg:block"
							>
								<Box size={20} />
								<span>Artikli i usluge</span>
							</NavMenuLink>

							<NavMenuLink
								trigger={() => setIsCollapsibleOpen((prev) => !prev)}
								className="lg:hidden"
								pathname={""}
							>
								<MoreHorizontal size={20} />
								<span>Više</span>
							</NavMenuLink>
						</NavMenuList>

						<NavMenuHeader className="hidden lg:block mt-4">
							OSTALO
						</NavMenuHeader>

						<NavMenuList className="hidden p-0 lg:block">
							<NavMenuLink href="/obligations" pathname={pathname}>
								<CalendarClock size={20} />
								<span>Obveze</span>
							</NavMenuLink>
							<NavMenuLink href="/settings" pathname={pathname}>
								<Settings size={20} />
								<span>Postavke</span>
							</NavMenuLink>
						</NavMenuList>
					</NavMenu>
				)}

				<NavMenuFooter>
					{business && (
						<div className="flex items-center gap-3 pt-4 border-t border-">
							<AvatarPlaceholder
								firstname={business?.ownerFirstName ?? ""}
								surname={business?.ownerLastName ?? ""}
								className="group/avatar relative shrink-0 group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:text-xs "
								image={user?.image ?? ""}
							/>
							<div className="flex flex-col flex-1 opacity-100 delay-150 transition whitespace-nowrap group-data-[collapsible=icon]:absolute group-data-[collapsible=icon]:invisible group-data-[collapsible=icon]:opacity-0">
								<span className="font-semibold text-sm"></span>
								<span className="text-xs text-muted">
									Obrt "{business?.business_name ?? ""}"
								</span>
								<span className="text-xs text-muted">
									{business?.ownerFirstName ?? ""}{" "}
									{business?.ownerLastName ?? ""}
								</span>
							</div>
						</div>
					)}
					<Button
						onClick={() => signOut()}
						variant="destructive"
						className="w-full mt-4"
					>
						<LogOut />
						<span>Odjava</span>
					</Button>
				</NavMenuFooter>
			</Nav>
			<NavMenuCollapsible open={isCollapsibleOpen}>
				<div className="text-lg font-semibold mb-4">Više</div>
				<div className="bg-white rounded-lg px-6 py-2 border border-border">
					<ul>
						<li>
							<Link
								href="/obligations"
								className="flex items-center gap-2 py-2.5 text-sm"
							>
								<CalendarClock size={18} />
								<span>Obveze</span>
							</Link>
						</li>
						<li>
							<Link
								href="/settings"
								className="flex items-center gap-2 py-2.5 border-t border-border text-sm"
							>
								<Settings size={18} />
								<span>Postavke</span>
							</Link>
						</li>
					</ul>
				</div>
				<div className="bg-white rounded-lg px-6 py-2 mt-4 border border-border">
					<button
						onClick={() => signOut()}
						className="flex items-center text-sm gap-2 py-2.5 w-full text-destructive font-medium"
					>
						<LogOut size={18} />
						Odjava
					</button>
				</div>
			</NavMenuCollapsible>
		</>
	);
}
