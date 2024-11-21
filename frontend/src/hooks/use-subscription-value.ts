import { useEffect, useState } from "react";
import { Subject } from "rxjs";

export function useSubscriptionValue<TValue>(subject: Subject<TValue>) {
    const [value, setValue] = useState<TValue | null>(null);

    useEffect(() => {
        const sub = subject.subscribe(setValue);
        return () => sub.unsubscribe();
    }, [subject]);

    return value;
}

