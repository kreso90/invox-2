"use client";
import { useActionState, useEffect } from "react";
import { deleteArticle } from "../actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Article } from "../types";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
interface ArticleDeleteFormProps {
	articleData: Article | null;
	variant?: "destructive" | "ghost";
	size?: "sm" | "md" | "lg";
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export default function ArticleDeleteForm({
	articleData,
	open,
	onOpenChange,
}: ArticleDeleteFormProps) {
	const [state, formAction, isPending] = useActionState(deleteArticle, null);

	const router = useRouter();

	useEffect(() => {
		if (state?.status !== "success") return;

		toast.add({
			type: "success",
			description: `Artikal ${articleData?.name} je uspješno izbrisan.`,
		});

		onOpenChange(false);

		router.refresh();
	}, [state]);
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Izbriši artikal</DialogTitle>

					<DialogDescription>
						Jeste li sigurni da želite izbrisati artikal?
					</DialogDescription>
				</DialogHeader>

				<form action={formAction} className="no-wrapper">
					<input type="hidden" name="articleId" value={articleData?.id ?? ""} />

					<DialogFooter className="mt-4">
						<Button
							type="button"
							size="lg"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Odustani
						</Button>

						<Button
							variant="destructive"
							size="lg"
							type="submit"
							disabled={isPending}
						>
							<Trash2 />
							Izbriši artikal
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
