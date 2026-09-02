"use client";

import { useEffect, useRef } from "react";
import bwipjs from "@bwip-js/browser";

type Props = {
	value: string;
};

export function Hub3aBarcode({ value }: Props) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (!canvasRef.current) return;

		try {
			bwipjs.toCanvas(canvasRef.current, {
				bcid: "pdf417",
				text: value,
				scale: 2,
				includetext: true,
			});
		} catch (error) {
			console.error("HUB3A barcode generation failed:", error);
		}
	}, [value]);

	return <canvas ref={canvasRef} aria-label="HUB3A kod za plaćanje" />;
}
