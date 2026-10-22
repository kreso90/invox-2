"use client";

import { ChevronDown } from "lucide-react";
import React from "react";

interface InputSelectProps {
	name: string;
	options: { value: string; label: string }[];
	value: string;
	onChange: (value: string) => void;
	inputValue: string;
	onInputChange: (value: string) => void;
}

export default function InputSelect({
	name,
	options,
	value,
	onChange,
	inputValue,
	onInputChange,
}: InputSelectProps) {
	const [isOpen, setIsOpen] = React.useState(false);

	const filteredOptions = options.filter((option) =>
		option.label.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase()),
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
			<div className="relative bg-background h-10 border-border rounded-lg pr-10 before:w-10 before:h-full before:right-0 before:bg-black/20 before:rounded-r-lg before:absolute">
				<input type="hidden" value={value} name={name} />
				<input
					value={inputValue}
					onChange={(e) => {
						onInputChange(e.target.value);
						setIsOpen(false);
					}}
					onFocus={() => setIsOpen(true)}
					placeholder="Odaberi opciju"
					className="w-full h-full px-3 py-2 border-none outline-none bg-transparent text-sm"
				/>
				<ChevronDown
					size={32}
					onClick={() => setIsOpen(!isOpen)}
					className={`pointer-events-all absolute right-1 top-1/2 transform -translate-y-1/2 duration-300 ${isOpen ? "rotate-180" : ""}`}
				/>
			</div>

			{isOpen && (
				<div className="absolute z-10 max-h-45 overflow-auto mt-1 w-full bg-background border border-border rounded-lg p-2">
					{options.map((option) => (
						<div
							key={option.value}
							onMouseDown={() => {
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
