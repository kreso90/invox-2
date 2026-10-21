import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function VerificationSuccessPage() {
	return (
		<div className="flex items-center h-screen px-2.5">
			<div className="flex flex-col items-center justify-center w-full max-w-105 mx-auto bg-white py-6 px-4 rounded-lg shadow-md">
				<Image
					src="/logo-dark.svg"
					alt="Logo"
					className="mx-auto mb-4 max-w-50 h-auto"
					width={640}
					height={640}
					loading="eager"
				/>
				<div className="text-center my-8 font-mono animate-(--animation-stamp-in) -rotate-5 px-4 py-2.5 bg-success-foreground border-success border-2 text-success rounded-lg">
					<Check size={36} className="mx-auto" />
					<span className="ml-2 text-sm font-semibold uppercase tracking-wider">
						Potvrđeno
					</span>
				</div>
				<h1 className="text-lg lg:text-2xl font-bold text-center">
					Email je uspješno potvrđen
				</h1>
				<p className="mt-2 text-gray-600 text-sm lg:text-base text-center">
					Tvoj Invox račun je spreman za korištenje.
				</p>
				<Link
					href="/"
					className="bg-primary text-white p-2.5 rounded-lg text-center mt-4 w-full hover:bg-primary/80"
				>
					Nastavi na Invox
				</Link>
			</div>
		</div>
	);
}
