import Link from "next/link";

function Nav({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			className={`fixed flex lg:flex-col lg:sticky lg:top-0 bottom-0 left-0 w-full bg-primary z-5 h-16 lg:h-screen border-t border-border lg:py-6 lg:px-2.5 ${className ?? ""}`}
			{...props}
		/>
	);
}

function NavMenu({ className, ...props }: React.ComponentProps<"nav">) {
	return <nav className={className} {...props} />;
}

function NavMenuHeader({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			className={`text-xs text-sidebar-foreground/70 px-3 hidden lg:block tracking-wider ${className ?? ""}`}
			{...props}
		/>
	);
}

function NavMenuList({ className, ...props }: React.ComponentProps<"ul">) {
	return (
		<ul
			className={`flex lg:flex-col lg:gap-1 justify-around py-2 lg:py-4 ${className ?? ""}`}
			{...props}
		/>
	);
}

function NavMenuLink({
	href,
	children,
	pathname,
	className,
	trigger,
	...props
}: React.ComponentProps<"a"> & {
	href?: string;
	pathname: string;
	children: React.ReactNode;
	className?: string;
	trigger?: () => void;
}) {
	const linkClassName = `flex flex-col lg:flex-row items-center text-xs lg:text-sm lg:py-2.5 px-3 gap-1 lg:gap-2 hover:bg-black/20 rounded-lg ${
		pathname === href
			? "text-(--sidebar-accent-icon-foreground) font-semibold lg:bg-black/20"
			: "text-white/70"
	}`;

	return (
		<li className={className}>
			{trigger ? (
				<button type="button" onClick={trigger} className={linkClassName}>
					{children}
				</button>
			) : (
				<Link href={href ?? "#"} className={linkClassName} {...props}>
					{children}
				</Link>
			)}
		</li>
	);
}

function NavMenuFooter({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			className={`mt-auto px-3 py-4 hidden lg:block ${className ?? ""}`}
			{...props}
		/>
	);
}

function NavMenuCollapsible({
	className,
	open,
	...props
}: React.ComponentProps<"div"> & { open?: boolean }) {
	return (
		<div
			className={`fixed top-0 bg-background pt-10 pb-25 px-2.5 h-screen z-4 w-full lg:hidden overflow-auto ${open ? "block" : "hidden"} ${className ?? ""}`}
			{...props}
		/>
	);
}

export {
	NavMenu,
	Nav,
	NavMenuHeader,
	NavMenuList,
	NavMenuLink,
	NavMenuFooter,
	NavMenuCollapsible,
};
