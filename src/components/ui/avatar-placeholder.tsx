import Image from "next/image";

type AvatarPlaceholderProps = {
	firstname: string;
	surname: string;
	className?: string;
	image?: string;
};

export function AvatarPlaceholder({
	firstname,
	surname,
	className,
	image,
}: AvatarPlaceholderProps) {
	const initials = `${firstname.charAt(0)}${surname.charAt(0)}`.toUpperCase();

	return (
		<div
			className={`flex basis-10 size-10 items-center justify-center rounded-full bg-muted font-medium ${className || ""}`}
		>
			{image ? (
				<Image
					src={image}
					alt="Logo"
					className="border rounded-full"
					width={320}
					height={320}
					loading="eager"
				/>
			) : (
				initials
			)}
		</div>
	);
}
