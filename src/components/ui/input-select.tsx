"use client";

import { ChevronDown } from "lucide-react";
import React from "react";

interface InputSelectProps {
	name: string;
	options: { value: string; label: string }[];
	value: string;
	onChange: (value: string) => void;
}

export default function InputSelect({
	name,
	options,
	value,
	onChange,
}: InputSelectProps) {
	const [isOpen, setIsOpen] = React.useState(false);
	const selectedOption = options.find((option) => option.value === value);
	const [search, setSearch] = React.useState(selectedOption?.label ?? "");

	React.useEffect(() => {
		setSearch(selectedOption?.label ?? "");
	}, [selectedOption?.label]);

	const filteredOptions = options.filter((option) =>
		option.label.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
	);

	const ref = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		function handleClickOutside(event: PointerEvent) {
			if (!ref.current?.contains(event.target as Node)) {
				setIsOpen(false);
			}
		}

		if (isOpen) {
			document.addEventListener("pointerdown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("pointerdown", handleClickOutside);
		};
	}, [isOpen]);

	return (
		<div className="relative" ref={ref}>
			<div className="relative bg-background h-10 border-border rounded-lg pr-10">
				<input type="hidden" value={value} name={name} />
				<input
					value={search}
					onChange={(e) => {
						setSearch(e.target.value);
						setIsOpen(true);
					}}
					onFocus={() => setIsOpen(true)}
					placeholder="Odaberi opciju"
					className="w-full h-full px-3 py-2 border-none outline-none bg-transparent text-sm"
				/>
				<ChevronDown
					onClick={() => setIsOpen(!isOpen)}
					className={`pointer-events-all absolute right-2 top-1/2 transform -translate-y-1/2 duration-300 ${isOpen ? "rotate-180" : ""}`}
				/>
			</div>

			{isOpen && (
				<div className="absolute z-10 mt-1 w-full bg-background border border-border rounded-lg p-2">
					{filteredOptions.map((option) => (
						<div
							key={option.value}
							onMouseDown={() => {
								setSearch(option.label);
								onChange(option.value);
								setIsOpen(false);
							}}
							className="px-3 py-2 cursor-pointer hover:bg-muted rounded-lg text-sm"
						>
							{option.label}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
