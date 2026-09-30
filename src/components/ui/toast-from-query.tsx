"use client";

import { useEffect, useRef } from "react";
import { toast } from "@/components/ui/toast";

export function ToastFromQuery({ message }: { message: string }) {
	const shown = useRef(false);

	useEffect(() => {
		if (shown.current) return;

		shown.current = true;

		toast.add({
			type: "success",
			description: message,
		});

		window.history.replaceState({}, "", window.location.pathname);
	}, []);

	return null;
}
