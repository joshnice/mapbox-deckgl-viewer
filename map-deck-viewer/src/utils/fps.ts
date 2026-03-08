export class FpsCounter {
	private fpsTimes: number[] = [];

	private record = false;

	constructor() {
		this.measureFPS();
	}

	private measureFPS() {
		const times: number[] = [];

		const refreshLoop = () => {
			window.requestAnimationFrame(() => {
				const now = performance.now();
				while (times.length > 0 && (times[0] ?? 0) <= now - 1000) {
					times.shift();
				}
				times.push(now);
				if (this.record) {
					this.fpsTimes.push(times.length);
				}
				refreshLoop();
			});
		};

		refreshLoop();
	}

	public start() {
		this.fpsTimes = [];
		this.record = true;
	}

	public finish() {
		this.record = false;
		const sum = this.fpsTimes.reduce((sum, val) => (sum += val), 0);
		return sum / this.fpsTimes.length;
	}
}
