import React from "react";
import ReactDOM from "react-dom/client";
import Map from "./pages/map.tsx";
import "./main.css";
import "./font.css";
import { SubjectContext, SubjectContextInitialValue } from "./state/subject-context.ts";

const root = document.getElementById("root");

if (root == null) {
	throw new Error("Can't find root");
}

ReactDOM.createRoot(root).render(
	<React.StrictMode>
		<SubjectContext.Provider value={SubjectContextInitialValue}>
			<Map />
		</SubjectContext.Provider>
	</React.StrictMode>,
);
