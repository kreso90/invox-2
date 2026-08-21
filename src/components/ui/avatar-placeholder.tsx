type AvatarPlaceholderProps = {
	firstname: string;
	surname: string;
	className?: string;
};

export function AvatarPlaceholder({
	firstname,
	surname,
	className,
}: AvatarPlaceholderProps) {
	const initials = `${firstname.charAt(0)}${surname.charAt(0)}`.toUpperCase();

	return (
		<div
			className={`flex size-10 items-center justify-center rounded-full bg-muted font-medium ${className || ""}`}
		>
			{initials}
		</div>
	);
}
