import { Stats } from "@joshnice/map-deck-viewer";
import { createContext, useContext } from "react";
import { Subject, ReplaySubject } from "rxjs";
import { ReplaySubjectReset } from "../rxjs/replay-subject-reset";

interface ISubjectContext {
    $testing: Subject<boolean>;
    $testingResult: Subject<number>;
    $renderingSceneFinished: ReplaySubject<number>;
    $modelStatsFinished: ReplaySubject<Stats>;
    $deckGlWarningLog: ReplaySubjectReset<string>;
    $deckGlFailedToLoadModel: ReplaySubjectReset<string>;
}

export const SubjectContextInitialValue = {
    $testing: new Subject<boolean>(),
    $testingResult: new Subject<number>(),
    $renderingSceneFinished: new ReplaySubject<number>(),
    $modelStatsFinished: new ReplaySubject<Stats>(),
    $deckGlWarningLog: new ReplaySubjectReset<string>(),
    $deckGlFailedToLoadModel: new ReplaySubjectReset<string>(),
}

export const SubjectContext = createContext<ISubjectContext>(SubjectContextInitialValue);

export const useSubjectContext = () => useContext(SubjectContext)