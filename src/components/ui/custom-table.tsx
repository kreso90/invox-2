"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const customTableRowVariants = cva("items-center", {
	variants: {
		variant: {
			default: "text-base",
			head: "font-medium uppercase text-xs text-muted",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

type CustomTableProps = React.ComponentProps<"div"> & {
	columns: string[];
	mobileColumns?: string[];
};

type CustomTRItemProps = React.ComponentProps<"div"> & {
	hideOnMobile?: boolean;
};
function CustomTable({
	className,
	columns,
	mobileColumns = ["1fr"],
	style,
	...props
}: CustomTableProps) {
	return (
		<div
			className={cn(
				"w-full lg:p-4 lg:bg-white lg:rounded-lg lg:border lg:border-foreground/10",
				className,
			)}
			style={
				{
					...style,
					"--table-columns": columns.join(" "),
					"--mobile-table-columns": mobileColumns.join(" "),
				} as React.CSSProperties
			}
			{...props}
		/>
	);
}

function CustomTHead({ className, ...props }: React.ComponentProps<"div">) {
	return <div className={className} {...props} />;
}

function CustomTRow({
	className,
	variant,
	...props
}: React.ComponentProps<"div"> & VariantProps<typeof customTableRowVariants>) {
	return (
		<div
			className={cn(
				"grid gap-1 lg:gap-2 grid-cols-(--mobile-table-columns) lg:grid-cols-(--table-columns) bg-white rounded-lg lg:rounded-none border mb-2.5 lg:mb-0 p-4 lg:p-2 lg:border-x-0 lg:border-y-0 lg:border-t border-border first:border-0",
				customTableRowVariants({ variant }),
				className,
			)}
			{...props}
		/>
	);
}

function CustomTRItem({
	className,
	hideOnMobile = false,
	...props
}: CustomTRItemProps) {
	return (
		<div
			className={cn(hideOnMobile && "hidden lg:block", className)}
			{...props}
		/>
	);
}

export { CustomTable, CustomTRow, CustomTRItem, CustomTHead };
