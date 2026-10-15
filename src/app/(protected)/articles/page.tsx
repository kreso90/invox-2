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
import {
	CustomTable,
	CustomTHead,
	CustomTRItem,
	CustomTRow,
} from "@/components/ui/custom-table";

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
					className="fixed bottom-16 right-2.5 lg:static z-10 h-10 mb-4 flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition"
				>
					<Plus />
					<span className="hidden lg:inline">Novi artikal</span>
				</Link>
			</div>

			<CustomTable
				columns={["1fr", "1fr", "0.5fr", "0.5fr"]}
				mobileColumns={["1fr", "0.35fr", "0.35fr"]}
			>
				<CustomTRow variant="head" className="hidden lg:grid border-0!">
					<CustomTRItem className="w-2/5">Naziv</CustomTRItem>
					<CustomTRItem>Jedinica mjere</CustomTRItem>
					<CustomTRItem>Cijena</CustomTRItem>
					<CustomTRItem className="text-right hidden lg:block">
						Akcije
					</CustomTRItem>
				</CustomTRow>
				{articles?.map((article) => (
					<CustomTRow key={article.id} className="text-sm">
						<CustomTRItem className="font-medium">
							<Link
								href={`/articles/${article.id}`}
								className="text-primary underline"
							>
								{article.name}
							</Link>
						</CustomTRItem>
						<CustomTRItem>{unitLabelsLong[article.unit]}</CustomTRItem>
						<CustomTRItem className="font-mono">€{article.price}</CustomTRItem>
						<CustomTRItem className="text-right hidden lg:block">
							<ArticleActions articleData={article} />
						</CustomTRItem>
					</CustomTRow>
				))}
			</CustomTable>
		</div>
	);
}
