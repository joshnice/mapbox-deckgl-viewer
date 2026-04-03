import { FpsCounter } from "@joshnice/map-deck-viewer";
import { useEffect, useState } from "react";
import "./performance-stats.css";

interface PerformanceMemory {
	usedJSHeapSize: number;
	totalJSHeapSize: number;
	jsHeapSizeLimit: number;
}

interface UserAgentSpecificMemoryResult {
	bytes: number;
}

interface PerformanceWithOptionalMemory extends Performance {
	memory?: PerformanceMemory;
	measureUserAgentSpecificMemory?: () => Promise<UserAgentSpecificMemoryResult>;
}

let globalFpsCounter: FpsCounter | null = null;

const getFpsCounter = () => {
	if (globalFpsCounter == null) {
		globalFpsCounter = new FpsCounter();
	}

	return globalFpsCounter;
};

export function PerformanceStatsComponent() {
	const [fps, setFps] = useState<number | null>(null);
	const [memory, setMemory] = useState<PerformanceMemory | null>(null);
	const [userAgentMemoryBytes, setUserAgentMemoryBytes] = useState<number | null>(
		null,
	);

	const formatMegabytes = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

	useEffect(() => {
		const fpsCounter = getFpsCounter();
		let shouldStop = false;
		let timeoutId: number | null = null;

		const collectFps = () => {
			fpsCounter.start();
			timeoutId = window.setTimeout(async () => {
				if (shouldStop) {
					return;
				}
				const measuredFps = fpsCounter.finish();
				if (!Number.isNaN(measuredFps)) {
					setFps(Math.round(measuredFps));
				}

				const performanceWithMemory = performance as PerformanceWithOptionalMemory;
				setMemory(performanceWithMemory.memory ?? null);

				if (typeof performanceWithMemory.measureUserAgentSpecificMemory === "function") {
					try {
						const result =
							await performanceWithMemory.measureUserAgentSpecificMemory();
						if (!shouldStop) {
							setUserAgentMemoryBytes(result.bytes);
						}
					} catch {
						if (!shouldStop) {
							setUserAgentMemoryBytes(null);
						}
					}
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
		<div className="performance-stats" aria-live="polite" aria-atomic="true">
			<div>FPS: {fps ?? "--"}</div>
			<div>
				Heap Memory (Used / Total):{" "}
				{memory == null
					? "--"
					: `${formatMegabytes(memory.usedJSHeapSize)} / ${formatMegabytes(memory.totalJSHeapSize)}`}
			</div>
			{userAgentMemoryBytes != null && (
				<div>User-Agent Memory Estimate: {formatMegabytes(userAgentMemoryBytes)}</div>
			)}
		</div>
	);
}
