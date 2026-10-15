"use client";
import { Business } from "@/generated/prisma";
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

interface AppSidebarProps {
	business: Business | null;
}

export function Navigation({ business }: AppSidebarProps) {
	const pathname = usePathname();
	const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);
	useEffect(() => {
		setIsCollapsibleOpen(false);
	}, [pathname]);
	return (
		<>
			{/* <div className="fixed lg:sticky lg:top-0 bottom-0 left-0 w-full bg-primary z-5 h-16 lg:h-screen border-t border-border lg:py-6 lg:px-2.5">
				<nav>
					<div className="text-xs text-sidebar-foreground/70 px-3 hidden lg:block tracking-wider">
						PREGLED
					</div>
					<ul className="flex lg:flex-col justify-between py-2 lg:py-4">
						<li>
							<Link
								href="/dashboard"
								className={`flex flex-col lg:flex-row items-center text-xs lg:text-sm lg:py-2.5 px-3 gap-1 lg:gap-2 ${pathname === "/dashboard" ? "text-(--sidebar-accent-icon-foreground) font-semibold" : " text-white/70"}`}
							>
								<House size={20} />
								<span>Početna</span>
							</Link>
						</li>
						<li>
							<Link
								href="/invoices"
								className={`flex flex-col lg:flex-row items-center text-xs lg:text-sm lg:py-2.5 px-3 gap-1 lg:gap-2 ${pathname === "/invoices" ? "text-(--sidebar-accent-icon-foreground) font-semibold" : " text-white/70"}`}
							>
								<ReceiptText size={20} />
								<span>Računi</span>
							</Link>
						</li>
						<li>
							<Link
								href="/clients"
								className={`flex flex-col lg:flex-row items-center text-xs lg:text-sm lg:py-2.5 px-3 gap-1 lg:gap-2 ${pathname?.startsWith("/clients") ? "text-(--sidebar-accent-icon-foreground) font-semibold" : "text-white/70"}`}
							>
								<Users size={20} />
								<span>Klijenti</span>
							</Link>
						</li>
						<li>
							<Link
								href="/articles"
								className={`flex flex-col lg:flex-row items-center text-xs lg:text-sm lg:py-2.5 px-3 gap-1 lg:gap-2 ${pathname?.startsWith("/articles") ? "text-(--sidebar-accent-icon-foreground) font-semibold" : "text-white/70"}`}
							>
								<Box size={20} />
								<span>Artikli i usluge</span>
							</Link>
						</li>
						<li>
							<Link
								href="/more"
								className={`flex flex-col lg:flex-row items-center text-xs lg:text-sm lg:py-2.5 px-3 gap-1 lg:gap-2 ${pathname?.startsWith("/more") ? "text-(--sidebar-accent-icon-foreground) font-semibold" : "text-white/70"}`}
							>
								<MoreHorizontal size={20} />
								<span>Više</span>
							</Link>
						</li>
					</ul>
				</nav>
			</div> */}
			<Nav>
				<div className="px-2.5 mb-6 hidden lg:block">
					<Image
						src="/logo-white.svg"
						alt="Logo"
						width={240}
						height={80}
						loading="eager"
					/>
				</div>

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
							className="hidden lg:flex"
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

					<NavMenuHeader className="hidden lg:block mt-4">OSTALO</NavMenuHeader>

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

				<NavMenuFooter>
					<div className="flex items-center gap-3 mb-4 border-t border-">
						<AvatarPlaceholder
							firstname={business?.ownerFirstName ?? ""}
							surname={business?.ownerLastName ?? ""}
							className="group/avatar relative shrink-0 group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:text-xs "
						/>
						<div className="flex flex-col flex-1 opacity-100 delay-150 transition whitespace-nowrap group-data-[collapsible=icon]:absolute group-data-[collapsible=icon]:invisible group-data-[collapsible=icon]:opacity-0">
							<span className="font-semibold text-sm"></span>
							<span className="text-xs text-muted">
								Obrt "{business?.business_name ?? ""}"
							</span>
						</div>
					</div>
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
