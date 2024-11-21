import "./warning-console.css";
import { useEffect, useState } from "react";
import { useSubjectContext } from "../state/subject-context";


export function WarningConsoleComponent() {
	const [messages, setMessages] = useState<{ message: string; type: "error" | "warning" }[]>([]);

	const { $deckGlFailedToLoadModel, $deckGlWarningLog} = useSubjectContext()
	
	useEffect(() => {
		const warningSubscription = $deckGlWarningLog.subscribe((warning) => {
			setMessages((latestMessages) =>
				latestMessages.some((m) => m.message === warning)
					? latestMessages
					: [...latestMessages, { message: warning, type: "warning" }],
			);
		});

		const errorSubscription = $deckGlFailedToLoadModel.subscribe((error) => {
			setMessages((latestMessages) =>
				latestMessages.some((m) => m.message === error)
					? latestMessages
					: [...latestMessages, { message: error, type: "error" }],
			);
		});

		return () => {
			warningSubscription.unsubscribe();
			errorSubscription.unsubscribe();
		};
	}, []);

	if (messages.length === 0) {
		return <></>;
	}

	return (
		<div className="warning-console">
			<h3>Warning and Errors</h3>
			<ul>
				{messages.map((message) => (
					<ul key={message.message} className={message.type}>
						<span className="type">{message.type}:</span>
						{message.message}
					</ul>
				))}
			</ul>
		</div>
	);
}
