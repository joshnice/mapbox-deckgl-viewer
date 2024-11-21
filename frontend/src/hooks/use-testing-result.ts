import { useEffect, useState } from "react";
import { useSubjectContext } from "../state/subject-context";
import { useSubscriptionValue } from "./use-subscription-value";

export function useTestingValue() {
    const { $testingResult } = useSubjectContext();
    return useSubscriptionValue($testingResult);
}

export function useAccumulativeTestingValue() {
    const { $testingResult } = useSubjectContext();
    const [results, setResults] = useState<Record<string, number>>({});

    useEffect(() => {
        const sub = $testingResult.subscribe(({modelId, result}) => {
            setResults((prev) => {
                const newResults = { ...prev };
                newResults[modelId] = result;
                return newResults;
            });
        }) 
        return () => sub.unsubscribe();
    }, []);

    return results;
}