import { useSubjectContext } from "../state/subject-context";
import { useSubscriptionValue } from "./use-subscription-value";

export function useTestingResultValue() {
    const { $testingResult } = useSubjectContext();
    return useSubscriptionValue($testingResult);
}