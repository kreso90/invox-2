import { getUserArticles } from "@/features/articles/queries";
import { Plus } from "lucide-react";
import Link from "next/link";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { ArticleActions } from "@/features/articles/components/article-actions";
import { unitLabelsLong } from "@/features/articles/constants";

export default async function ArticlesPage() {
	const articles = await getUserArticles();

	return (
		<div>
			<div className="flex justify-between mb-4">
				<div className="flex flex-col mb-8">
					<h1 className="page-title">Artikli i usluge</h1>
					<span className="font-mono text-sm">
						{articles?.length} aktivnih artikala
					</span>
				</div>
				<Link
					href="/articles/new"
					className="h-10 mb-4 flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition"
				>
					<Plus />
					Novi artikal
				</Link>
			</div>

			<Card className="p-4">
				<Table>
					<TableHeader>
						<TableRow className="uppercase hover:bg-transparent">
							<TableHead className="w-2/5">Naziv</TableHead>
							<TableHead>Jedinica mjere</TableHead>
							<TableHead>Cijena</TableHead>
							<TableHead className="text-right">Akcije</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{articles?.map((article) => (
							<TableRow key={article.id} className="hover:bg-transparent">
								<TableCell className="font-medium">
									<Link
										href={`/articles/${article.id}`}
										className="text-primary underline"
									>
										{article.name}
									</Link>
								</TableCell>
								<TableCell>{unitLabelsLong[article.unit]}</TableCell>
								<TableCell className="font-mono">€{article.price}</TableCell>
								<TableCell className="text-right">
									<ArticleActions articleData={article} />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Card>
		</div>
	);
}
