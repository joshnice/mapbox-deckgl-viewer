import { Stats } from "@joshnice/map-deck-viewer";
import { createContext, useContext } from "react";
import { Subject, ReplaySubject } from "rxjs";
import { ReplaySubjectReset } from "../rxjs/replay-subject-reset";

interface ISubjectContext {
	$testing: Subject<boolean>;
	$testingResult: Subject<{ modelId: string; result: number }>;
	$renderingSceneFinished: ReplaySubject<number>;
	$modelStatsFinished: ReplaySubject<Stats>;
	$deckGlWarningLog: ReplaySubjectReset<string>;
	$deckGlFailedToLoadModel: ReplaySubjectReset<string>;
	$validationTesting: Subject<boolean>;
}

export const SubjectContextInitialValue = {
	$testing: new Subject<boolean>(),
	$testingResult: new Subject<{ modelId: string; result: number }>(),
	$renderingSceneFinished: new ReplaySubject<number>(),
	$modelStatsFinished: new ReplaySubject<Stats>(),
	$deckGlWarningLog: new ReplaySubjectReset<string>(),
	$deckGlFailedToLoadModel: new ReplaySubjectReset<string>(),
	$validationTesting: new Subject<boolean>(),
};

export const SubjectContext = createContext<ISubjectContext>(SubjectContextInitialValue);

export const useSubjectContext = () => useContext(SubjectContext);
