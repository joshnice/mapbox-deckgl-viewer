import { useRef, useState } from "react";
import { ModelInputComponent } from "../components/model-input";
import { WarningConsoleComponent } from "../components/warning-console";
import { Map as MapboxModelMap } from "@joshnice/map-deck-viewer"
import githubLogo from "/github.png";
import "mapbox-gl/dist/mapbox-gl.css";
import "./map.css";

const MAPBOX_ACCESS_TOKEN =
	"pk.eyJ1Ijoiam9zaG5pY2U5OCIsImEiOiJjanlrMnYwd2IwOWMwM29vcnQ2aWIwamw2In0.RRsdQF3s2hQ6qK-7BH5cKg";

export default function Map() {

	const viewer = useRef<MapboxModelMap | null>(null);
	const [showModelUpload, setShowModalUpload] = useState(true);
	const [zoomLevel, setZoomLevel] = useState<number>(20);

	const handleModelInput = async (models: File[]) => {
		const ids = [];
		for (const model of models) {
			const id = crypto.randomUUID();
			ids.push(id);
			viewer.current?.addModel({ id, model });
		}
		viewer.current?.generateFeatures(ids.map((id) => ({id, amount: 1})));
		
		for (const id of ids) {
			viewer.current?.addModelToMap(id);
		}

		setShowModalUpload(false);
	};


	const handleGithubClick = () => {
		window.open("https://github.com/joshnice/mapbox-deckgl-viewer", "_blank")?.focus();
	};

	// const handleZoomLevelChange = (zoomLevel: number) => {
	// 	setZoomLevel(zoomLevel);
	// 	viewer?.current?.setZoomLevel(zoomLevel);
	// };

	const renderMap = (element: HTMLDivElement) => {
		if (viewer.current == null) {
			viewer.current = new MapboxModelMap({ container: element, mapboxAccessKey: MAPBOX_ACCESS_TOKEN })

			// viewer.current = new MapModelViewer({
			// 	mapElement: element,
			// 	mapboxAccessKey: MAPBOX_ACCESS_TOKEN,
			// 	subjects: {
			// 		$testing: $testing,
			// 		$testingResult: $testingResult,
			// 		$onLumaGlWarning: $deckGlWarningLog,
			// 		$onModelFailedToLoad: $deckGlFailedToLoadModel,
			// 		$renderingSceneFinished: $renderingSceneFinished,
			// 		$onModelStatsFinished: $modelStatsFinished,
			// 		$validationTesting: $validationTesting,
			// 	},
			// });
		}
	};

	return (
		<div className="map-container">
			<div ref={renderMap} className="map">
				<button type="button" className="github-button">
					<img className="github-logo" onClick={handleGithubClick} src={githubLogo} alt="github logo" />
				</button>
				{!showModelUpload && <WarningConsoleComponent />}
			</div>
			{showModelUpload && <ModelInputComponent onModelInput={handleModelInput} />}
			{/* <ModelSettingsComponent
				showStats={showStats}
				models={models}
				zoomLevel={zoomLevel}
				showOptions={!showModelUpload}
				onAmountChange={handleModelAmountChanged}
				onTestingClicked={handleTestingClicked}
				onChangeModelClick={handleResetModelClicked}
				onZoomLevelChange={handleZoomLevelChange}
				onValidationTestingClicked={handleValidationTestingClicked}
			/> */}
		</div>
	);
}
