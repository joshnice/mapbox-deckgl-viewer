export interface TestResultModel {
	id: string;
	name: string;
	amount: number;
}

export interface TestResult {
	id: string;
	time: Date;
	result: number;
	models: TestResultModel[];
}
