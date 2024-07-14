import React from "react";
import ReactDOM from "react-dom/client";
import Map from "./pages/map.tsx";
import "./main.css";
import "./font.css";

const root = document.getElementById("root");

if (root == null) {
	throw new Error("Can't find root");
}

ReactDOM.createRoot(root).render(
	<React.StrictMode>
		<Map />
	</React.StrictMode>,
);
