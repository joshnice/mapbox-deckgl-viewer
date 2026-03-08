export type TestingMode = "all-models-fps" | "single-model-fps" | "render-time";

interface TestResultBase {
	id: string;
	type: TestingMode;
	time: Date;
}

export interface TestResultAllModels extends TestResultBase {
	type: "all-models-fps";
	result: number;
	models: {
		id: string;
		name: string;
		amount: number;
	}[];
}

export interface TestResultSingleModel extends TestResultBase {
	type: "single-model-fps";
	amount: number;
	models: {
		id: string;
		name: string;
		fps: number;
	}[];
}

export interface TestResultRenderTime extends TestResultBase {
	type: "render-time";
	models: {
		id: string;
		name: string;
		renderTime: number;
	}[];
}

export type TestResult =
	| TestResultAllModels
	| TestResultSingleModel
	| TestResultRenderTime;
