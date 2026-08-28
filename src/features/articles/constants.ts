import { Unit } from "@/generated/prisma";

export const unitLabelsLong: Record<Unit, string> = {
	PIECE: "Komad",
	HOUR: "Sat",
	DAY: "Dan",
	METER: "Metar",
	SQUARE_METER: "Kvadratni metar",
	LITER: "Litar",
	KILOGRAM: "Kilogram",
};

export const unitLabelsShort: Record<Unit, string> = {
	PIECE: "kom",
	HOUR: "h",
	DAY: "d",
	METER: "m",
	SQUARE_METER: "m²",
	LITER: "l",
	KILOGRAM: "kg",
};
