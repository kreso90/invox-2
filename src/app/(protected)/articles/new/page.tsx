import ArticleForm from "@/features/articles/components/article-form";
import React from "react";
import Link from "next/link";
import ArticleDeleteForm from "@/features/articles/components/article-delete-form";

export default function NewArticlePage() {
	return (
		<>
			<div className="flex items-end justify-between mb-8">
				<div className="flex flex-col">
					<Link
						href="/articles"
						className="text-muted text-sm mb-1 hover:underline"
					>
						&larr; Povratak na listu artikala
					</Link>
					<h1 className="page-title">Novi artikal</h1>
					<span className="font-mono text-sm">
						Dodaje se u cjenik za buduće račune
					</span>
				</div>
			</div>
			<ArticleForm />
		</>
	);
}
