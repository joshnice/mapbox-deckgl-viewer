import { createContext, useContext } from "react";
import { ReplaySubject, Subject } from "rxjs";

interface ISubjectContext {
	$testing: Subject<boolean>;
	$testingResult: Subject<{ modelId: string; result: number }>;
	$renderingSceneFinished: ReplaySubject<number>;
	$validationTesting: Subject<boolean>;
}

export const SubjectContextInitialValue = {
	$testing: new Subject<boolean>(),
	$testingResult: new Subject<{ modelId: string; result: number }>(),
	$renderingSceneFinished: new ReplaySubject<number>(),
	$validationTesting: new Subject<boolean>(),
};

export const SubjectContext = createContext<ISubjectContext>(
	SubjectContextInitialValue,
);

export const useSubjectContext = () => useContext(SubjectContext);
