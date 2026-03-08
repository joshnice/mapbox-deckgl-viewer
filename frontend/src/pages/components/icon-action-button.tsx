import type { MouseEventHandler, ReactNode } from "react";
import "./icon-action-button.css";

interface IconActionButtonProps {
	ariaLabel: string;
	children: ReactNode;
	className?: string;
	disabled?: boolean;
	isExpanded?: boolean;
	onClick?: MouseEventHandler<HTMLButtonElement>;
}

function joinClasses(...classes: Array<string | undefined>) {
	return classes.filter(Boolean).join(" ");
}

export function IconActionButton({
	ariaLabel,
	children,
	className,
	disabled = false,
	isExpanded,
	onClick,
}: IconActionButtonProps) {
	const classes = joinClasses("icon-action-button", className);

	return (
		<button
			aria-expanded={isExpanded}
			aria-label={ariaLabel}
			className={classes}
			disabled={disabled}
			onClick={onClick}
			type="button"
		>
			{children}
		</button>
	);
}
