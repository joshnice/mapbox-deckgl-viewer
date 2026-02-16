import { ChangeEvent, useRef, useState } from "react";
import "./model-input.css";

interface ModelInputProps {
	onModelInput: (modelPath: File[]) => void;
}

export function ModelInputComponent({ onModelInput }: ModelInputProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [loading, setLoading] = useState(false);

	const onFileInputted = (event: ChangeEvent<HTMLInputElement>) => {
		setLoading(true);
		if (event.target.files != null) {
			onModelInput(Array.from(event.target.files));
		}
		setLoading(false);
	};

	const onFileUploadButtonClick = () => {
		inputRef.current?.click();
	};

	return (
		<dialog>
			{loading && <h1>Loading model...</h1>}
			{!loading && (
				<>
					<h1>Get started by pick a model</h1>
					<button onClick={onFileUploadButtonClick}>Choose a file</button>
					<input ref={inputRef} type="file" accept=".glb" onChange={onFileInputted} multiple />
				</>
			)}
		</dialog>
	);
}
