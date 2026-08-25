import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { getCurrentBusiness } from "@/features/business/queries";
import { getCurrentUser } from "@/features/dashboard/queries";
import Link from "next/link";

export default async function DashboardPage() {
	const userData = await getCurrentUser();
	const businessData = await getCurrentBusiness();
	const currentAnnualThreshold = 80;
	const thresholdLeft = businessData?.annual_threshold
		? businessData.annual_threshold - currentAnnualThreshold
		: 0;

	const unpaidAmount = 120; // Replace with actual logic to calculate unpaid amount
	const billsWaitingForPayment = 3; // Replace with actual logic to calculate the number of bills waiting for payment
	const currentMonthPaidAmount = 50; // Replace with actual logic to calculate current month paid amount

	const currentDate = new Intl.DateTimeFormat("hr-HR", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric",
	}).format(new Date());

	const currentMonth = new Intl.DateTimeFormat("hr-HR", {
		month: "long",
	}).format(new Date());

	return (
		<div>
			<div className="flex flex-col mb-8">
				<span className="font-semibold text-xl">Pozdrav, {userData?.name}</span>
				<span className="font-mono text-sm">{currentDate}</span>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
				<Card>
					<CardHeader>
						<CardTitle className="font-mono uppercase text-muted text-xs tracking-wider">
							Fakturirano — {currentMonth}
						</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col">
						<span className="font-mono text-2xl font-semibold">
							{currentMonthPaidAmount.toLocaleString("hr-HR", {
								style: "currency",
								currency: "EUR",
							})}
						</span>
						<span className="text-muted text-xs font-normal">
							↑ 12% u odnosu na srpanj
						</span>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="font-mono uppercase text-muted text-xs tracking-wider">
							Neplaćeno
						</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col">
						<span className="font-mono text-2xl font-semibold">
							{unpaidAmount.toLocaleString("hr-HR", {
								style: "currency",
								currency: "EUR",
							})}
						</span>
						<span className="text-muted text-xs font-normal">
							{billsWaitingForPayment} računa čekaju uplatu
						</span>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="font-mono uppercase text-muted text-xs tracking-wider">
							Godišnji prag paušalnog oporezivanja
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-center justify-between">
							<div className="font-mono text-xl font-semibold">
								{currentAnnualThreshold.toLocaleString("hr-HR", {
									style: "currency",
									currency: "EUR",
								})}{" "}
								/{" "}
								<span className="text-muted text-sm font-normal">
									{businessData?.annual_threshold?.toLocaleString("hr-HR", {
										style: "currency",
										currency: "EUR",
									})}
								</span>
							</div>
							<div className="text-muted text-xs">
								preostalo{" "}
								{thresholdLeft.toLocaleString("hr-HR", {
									style: "currency",
									currency: "EUR",
								})}
							</div>
						</div>
						<Progress
							value={currentAnnualThreshold}
							locale="hr-HR"
							className="h-5 mt-4"
						></Progress>
						<div className="flex justify-between text-xxs text-muted mt-1 font-mono">
							<span>
								{(0).toLocaleString("hr-HR", {
									style: "currency",
									currency: "EUR",
								})}
							</span>
							<span>
								{(businessData?.annual_threshold
									? businessData.annual_threshold / 2
									: 0
								).toLocaleString("hr-HR", {
									style: "currency",
									currency: "EUR",
								})}
							</span>
							<span>
								{businessData?.annual_threshold?.toLocaleString("hr-HR", {
									style: "currency",
									currency: "EUR",
								})}
							</span>
						</div>
					</CardContent>
				</Card>
			</div>
			<div className="lg:grid lg:grid-cols-[1.7fr_1fr] gap-4">
				<Card className="p-4">
					<div className="flex items-center justify-between mb-4">
						<span className="font-semibold">Nedavni računi</span>
						<Link href="/invoices" className="text-muted text-xs font-semibold">
							Svi računi →
						</Link>
					</div>
					<Table>
						<TableHeader>
							<TableRow className="uppercase">
								<TableHead className="w-[100px]">Broj</TableHead>
								<TableHead>Klijenti</TableHead>
								<TableHead>Datum</TableHead>
								<TableHead className="text-right">Iznos</TableHead>
								<TableHead className="text-right">Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							<TableRow>
								<TableCell className="font-medium font-mono">
									2026-0041
								</TableCell>
								<TableCell>Ivan Horvat</TableCell>
								<TableCell className="font-mono">12.06.2026.</TableCell>
								<TableCell className="text-right font-mono">€250.00</TableCell>
								<TableCell className="text-right">Plačeno</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</Card>

				<Card className="p-4">
					<div className="font-semibold">Rokovi</div>
					<ul className="mt-4 space-y-2">
						<li className="flex items-center justify-between border-b border-border pb-2">
							<div className="flex flex-col">
								<span className="font-semibold">
									Petra Vidović — račun 0040
								</span>
								<span className="text-muted text-xxs font-mono">
									dospijeva 22.08.2026.
								</span>
							</div>
							<span className="text-destructive bg-destructive-foreground px-2 py-1 text-sm rounded-xs">
								3 dana
							</span>
						</li>
					</ul>
				</Card>
			</div>
		</div>
	);
}
