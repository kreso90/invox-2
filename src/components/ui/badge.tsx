import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
	"text-xs py-1 px-1.5 -rotate-2 rounded text-center font-medium tracking-wider uppercase w-fit",
	{
		variants: {
			variant: {
				paid: "bg-success-foreground text-success border border-success",
				issued: "bg-warning-foreground text-warning border border-warning",
				overdue:
					"bg-destructive-foreground text-destructive border border-destructive",
				draft: "bg-gray-200 text-gray-800 border border-gray-800",
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
