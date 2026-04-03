import { FpsCounter } from "@joshnice/map-deck-viewer";
import { useEffect, useState } from "react";
import "./fps-counter.css";

let globalFpsCounter: FpsCounter | null = null;

const getFpsCounter = () => {
	if (globalFpsCounter == null) {
		globalFpsCounter = new FpsCounter();
	}

	return globalFpsCounter;
};

export function FpsCounterComponent() {
	const [fps, setFps] = useState<number | null>(null);

	useEffect(() => {
		const fpsCounter = getFpsCounter();
		let shouldStop = false;
		let timeoutId: number | null = null;

		const collectFps = () => {
			fpsCounter.start();
			timeoutId = window.setTimeout(() => {
				if (shouldStop) {
					return;
				}
				const measuredFps = fpsCounter.finish();
				if (!Number.isNaN(measuredFps)) {
					setFps(Math.round(measuredFps));
				}
				collectFps();
			}, 1000);
		};

		collectFps();

		return () => {
			shouldStop = true;
			if (timeoutId != null) {
				window.clearTimeout(timeoutId);
			}
		};
	}, []);

	return (
		<div className="fps-counter" aria-live="polite" aria-atomic="true">
			FPS: {fps ?? "--"}
		</div>
	);
}
