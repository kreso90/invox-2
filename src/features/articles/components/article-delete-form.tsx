"use client";
import { useActionState } from "react";
import { deleteArticle } from "../actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function ArticleDeleteForm({
	articleId,
	variant,
	size,
}: {
	articleId: string;
	variant?: "destructive" | "ghost";
	size?: "sm" | "md" | "lg";
}) {
	const [state, formAction, isPending] = useActionState(deleteArticle, null);
	return (
		<form action={formAction} className="button-form">
			<input type="hidden" name="articleId" value={articleId} />
			<Button
				variant={variant || "ghost"}
				size="lg"
				type="submit"
				disabled={isPending}
				className={
					variant === "ghost"
						? "text-destructive hover:bg-destructive/20 hover:text-destructive text-sm font-normal cursor-pointer"
						: ""
				}
			>
				<Trash2 />
				Izbriši artikl
			</Button>
		</form>
	);
}
