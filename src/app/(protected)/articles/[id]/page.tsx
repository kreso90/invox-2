import { Card, CardContent } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ToastFromQuery } from "@/components/ui/toast-from-query";
import ArticleDeleteForm from "@/features/articles/components/article-delete-form";
import ArticleForm from "@/features/articles/components/article-form";
import { getArticleById } from "@/features/articles/queries";
import { Unit } from "@/generated/prisma/edge";
import Link from "next/link";

const unitLabels: Record<Unit, string> = {
	PIECE: "Komad",
	HOUR: "Sat",
	DAY: "Dan",
	METER: "Metar",
	SQUARE_METER: "Kvadratni metar",
	LITER: "Litar",
	KILOGRAM: "Kilogram",
};

export default async function ArticlePage({
	params,
	searchParams,
}: {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ created?: string }>;
}) {
	const [{ id }, { created }] = await Promise.all([params, searchParams]);
	const article = await getArticleById(id);
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
					<h1 className="page-title">Artikal</h1>
				</div>
			</div>
			<div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-4">
				<ArticleForm articleData={article} />
				<div>
					<div className="text-xs tracking-wider uppercase mb-2 text-muted">
						Pregled retka na računu
					</div>
					<Card className="p-4">
						<Table>
							<TableHeader>
								<TableRow className="uppercase">
									<TableHead className="w-2/5">Naziv</TableHead>
									<TableHead>Jedinica mjere</TableHead>
									<TableHead>Cijena</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								<TableRow>
									<TableCell className="font-medium">{article?.name}</TableCell>
									<TableCell>
										{article?.unit ? unitLabels[article?.unit] : ""}
									</TableCell>
									<TableCell className="font-mono">€{article?.price}</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</Card>
				</div>
			</div>
			{created === "true" && (
				<ToastFromQuery message={"Artikal je uspješno kreiran!"} />
			)}
		</>
	);
}
