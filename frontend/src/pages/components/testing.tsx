import { faFlask } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./testing.css";

interface TestingProps {
	disabled: boolean;
	isOpen: boolean;
	onToggle: () => void;
}

export function TestingComponent({ disabled, isOpen, onToggle }: TestingProps) {
	return (
		<div className="testing">
			<button
				className="testing__button"
				type="button"
				aria-label="Open testing"
				aria-expanded={isOpen}
				disabled={disabled}
				onClick={onToggle}
			>
				<FontAwesomeIcon className="testing__icon" icon={faFlask} />
			</button>
			{isOpen && !disabled && (
				<section className="testing__panel" aria-label="Testing panel">
					<h3 className="testing__title">Testing</h3>
					<p className="testing__description">
						Testing controls and results will appear here.
					</p>
				</section>
			)}
		</div>
	);
}
