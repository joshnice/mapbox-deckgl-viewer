import { useSubjectContext } from "../state/subject-context";
import { useSubscriptionValue } from "./use-subscription-value";

export function useRenderingTimeValue() {
    const { $renderingSceneFinished } = useSubjectContext();
    return useSubscriptionValue($renderingSceneFinished);
}