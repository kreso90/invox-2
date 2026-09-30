"use client";

import { useState } from "react";
import Link from "next/link";
import { Edit2, Mail, MoreHorizontalIcon, Trash2 } from "lucide-react";
import type { Article } from "@/generated/prisma";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ArticleDeleteForm from "./article-delete-form";

export function ArticleActions({
	articleData,
}: {
	articleData: Article | null;
}) {
	const [modalOpen, setModalOpen] = useState({
		emailModalOpen: false,
		deleteModalOpen: false,
	});

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger
					render={
						<Button variant="ghost" size="icon" className="size-8">
							<MoreHorizontalIcon />
							<span className="sr-only">Otvori izbornik</span>
						</Button>
					}
				/>

				<DropdownMenuContent align="end">
					<DropdownMenuItem
						render={
							<Link
								href={`/articles/${articleData?.id}`}
								className="flex items-center"
							>
								<Edit2 className="mr-2 size-4" />
								Uredi
							</Link>
						}
					/>

					<DropdownMenuSeparator />

					<DropdownMenuItem
						className="text-destructive"
						onClick={() => {
							setModalOpen({ ...modalOpen, deleteModalOpen: true });
						}}
					>
						<Trash2 className="mr-2 size-4" />
						Izbriši artikal
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<ArticleDeleteForm
				articleData={articleData ?? null}
				open={modalOpen.deleteModalOpen}
				onOpenChange={(open) =>
					setModalOpen({ ...modalOpen, deleteModalOpen: open })
				}
			/>
		</>
	);
}
