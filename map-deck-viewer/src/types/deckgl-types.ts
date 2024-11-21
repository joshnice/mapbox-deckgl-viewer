import type { Subject, ReplaySubject } from "rxjs";

export type DeckGlSubjects = {
	$testing: Subject<boolean>;
	$testingResult: Subject<number>;
	$onLumaGlWarning: ReplaySubject<string>;
	$onModelFailedToLoad: ReplaySubject<string>;
	$onModelStatsFinished: ReplaySubject<Stats>;
	$renderingSceneFinished: ReplaySubject<number>;
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