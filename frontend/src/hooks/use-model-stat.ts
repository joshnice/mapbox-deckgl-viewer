import { useSubjectContext } from "../state/subject-context";
import { useSubscriptionValue } from "./use-subscription-value";

export function useModelStats() {
    const { $modelStatsFinished } = useSubjectContext();
    return useSubscriptionValue($modelStatsFinished);
}