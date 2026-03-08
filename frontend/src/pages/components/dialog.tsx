/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <explanation> */
import { type ReactNode, useEffect } from "react";
import "./dialog.css";

interface DialogProps {
	title: string;
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
}

export function DialogComponent({
	title,
	isOpen,
	onClose,
	children,
}: DialogProps) {
	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		};

		window.addEventListener("keydown", handleEscape);
		return () => window.removeEventListener("keydown", handleEscape);
	}, [isOpen, onClose]);

	if (!isOpen) {
		return null;
	}

	return (
		<div className="dialog" role="presentation" onClick={onClose}>
			<section
				aria-label={title}
				aria-modal="true"
				className="dialog__panel"
				onClick={(event) => event.stopPropagation()}
				role="dialog"
			>
				<div className="dialog__header">
					<h3 className="dialog__title">{title}</h3>
					<button
						className="dialog__close-button"
						onClick={onClose}
						type="button"
					>
						Close
					</button>
				</div>
				<div className="dialog__body">{children}</div>
			</section>
		</div>
	);
}
