"use client";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupAction,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import {
	Box,
	Home,
	House,
	LogOut,
	Plus,
	ReceiptText,
	Settings,
	User,
	User2,
	Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { signOut } from "@/features/auth/actions";
import { Separator } from "./ui/separator";
import { AvatarPlaceholder } from "./ui/avatar-placeholder";

export function AppSidebar() {
	const pathname = usePathname();

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				<Image
					src="/logo-white.svg"
					alt="Logo"
					width={240}
					height={80}
					loading="eager"
				/>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<nav>
						<SidebarMenu className="gap-2">
							<SidebarMenuItem>
								<SidebarMenuButton
									render={<Link href="/dashboard" />}
									isActive={pathname === "/dashboard"}
								>
									<House
										className={
											pathname === "/dashboard"
												? "text-(--sidebar-accent-icon-foreground)"
												: ""
										}
										data-active={pathname === "/dashboard"}
									/>
									<span>Nadzorna ploča</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton
									render={<Link href="/invoices" />}
									isActive={pathname === "/invoices"}
								>
									<ReceiptText
										className={
											pathname === "/invoices"
												? "text-(--sidebar-accent-icon-foreground)"
												: ""
										}
										data-active={pathname === "/invoices"}
									/>
									<span>Računi</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton
									render={<Link href="/clients" />}
									isActive={pathname?.startsWith("/clients")}
								>
									<Users
										className={
											pathname?.startsWith("/clients")
												? "text-(--sidebar-accent-icon-foreground)"
												: ""
										}
										data-active={pathname?.startsWith("/clients")}
									/>
									<span>Klijenti</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton
									render={<Link href="/articles" />}
									isActive={pathname?.startsWith("/articles")}
								>
									<Box
										className={
											pathname?.startsWith("/articles")
												? "text-(--sidebar-accent-icon-foreground)"
												: ""
										}
										data-active={pathname?.startsWith("/articles")}
									/>
									<span>Artikli i usluge</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton
									render={<Link href="/settings" />}
									isActive={pathname === "/settings"}
								>
									<Settings
										className={
											pathname === "/settings"
												? "text-(--sidebar-accent-icon-foreground)"
												: ""
										}
										data-active={pathname === "/settings"}
									/>
									<span>Postavke</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</nav>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<Separator className="my-4" />
					</SidebarMenuItem>
					<SidebarMenuItem>
						<div className="flex items-center gap-3 mb-4">
							<AvatarPlaceholder
								firstname="K"
								surname="Šelendić"
								className="group/avatar relative shrink-0 group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:text-xs "
							/>
							<div className="flex flex-col flex-1 opacity-100 delay-150 transition whitespace-nowrap group-data-[collapsible=icon]:absolute group-data-[collapsible=icon]:invisible group-data-[collapsible=icon]:opacity-0">
								<span className="font-semibold text-sm">Krešimir Šelendić</span>
								<span className="text-xs text-muted">Obrt "KS Dev"</span>
							</div>
						</div>
					</SidebarMenuItem>
					<SidebarMenuItem>
						<SidebarMenuButton
							onClick={signOut}
							variant="outline"
							className="text-center justify-center text-primary font-semibold"
						>
							<LogOut />
							<span>Odjava</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
