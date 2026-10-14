import Link from "next/link";
export default function HomePage() {
	return (
		<div>
			<h1>Dobrodošli na domačo stran</h1>
			<Link href="/login"> Prijava</Link>
		</div>
	);
}
