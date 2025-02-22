import type { Subject, ReplaySubject } from "rxjs";

export type DeckGlSubjects = {
	$testing: Subject<boolean>;
	$testingResult: Subject<{ modelId: string; result: number }>;
	$onLumaGlWarning: ReplaySubject<string>;
	$onModelFailedToLoad: ReplaySubject<string>;
	$onModelStatsFinished: ReplaySubject<Stats>;
	$renderingSceneFinished: ReplaySubject<number>;
	$validationTesting: Subject<boolean>;
};

export interface Stats {
	name: string;
	fps?: number;
	sizeMb: number;
	accessor: number;
	material: number;
	mesh: number;
	nodes: number;
}
