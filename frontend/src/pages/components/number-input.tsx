import type { ChangeEvent } from "react";
import "./number-input.css";

interface NumberInputProps {
	value: number;
	min?: number;
	step?: number;
	id?: string;
	disabled?: boolean;
	className?: string;
	onValueChange: (value: number) => void;
}

function joinClasses(...classes: Array<string | undefined>) {
	return classes.filter(Boolean).join(" ");
}

export function NumberInputComponent({
	value,
	min = 1,
	step = 1,
	id,
	disabled = false,
	className,
	onValueChange,
}: NumberInputProps) {
	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const rawValue = Number(event.target.value);
		const nextValue = Number.isFinite(rawValue) ? Math.max(min, rawValue) : min;
		onValueChange(Math.floor(nextValue));
	};

	return (
		<input
			className={joinClasses("number-input", className)}
			disabled={disabled}
			id={id}
			min={min}
			onChange={handleChange}
			step={step}
			type="number"
			value={value}
		/>
	);
}
