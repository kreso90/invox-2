import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
	"flex items-center text-xs py-0.5 px-1 lg:py-1 lg:px-1.5 -rotate-2 rounded text-center font-medium tracking-wider uppercase w-fit",
	{
		variants: {
			variant: {
				paid: "bg-success-foreground text-success border border-success",
				issued: "bg-warning-foreground text-warning border border-warning",
				overdue:
					"bg-destructive-foreground text-destructive border border-destructive",
				draft: "bg-gray-200 text-gray-800 border border-gray-800",
				partially_paid: "bg-blue-200 text-blue-800 border border-blue-800",
				cancelled: "bg-gray-400 text-black-800 border border-black-800",
			},
		},
		defaultVariants: {
			variant: "paid",
		},
	},
);

function Badge({
	className,
	variant = "paid",
	...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
	return (
		<div
			data-slot="button"
			className={cn(badgeVariants({ variant, className }))}
			{...props}
		/>
	);
}

export { Badge, badgeVariants };
