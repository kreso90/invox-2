import { LoaderCircle } from "lucide-react";

export function Loader() {
	return (
		<div className="flex justify-center items-center h-[calc(100vh-64px)] lg:h-screen">
			<LoaderCircle size={50} className="animate-spin" />
		</div>
	);
}
