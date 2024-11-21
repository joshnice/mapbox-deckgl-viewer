import { useSubjectContext } from "../state/subject-context";
import { useSubscriptionValue } from "./use-subscription-value";

export function useTestingValue() {
    const { $testing } = useSubjectContext();
    return useSubscriptionValue($testing);
}