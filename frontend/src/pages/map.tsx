import { useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { EngineType, MapModelViewer } from "@joshnice/map-deck-viewer";
import { ModelInputComponent } from "../components/model-input";
import { ModelSettingsComponent } from "../components/model-settings";
import { WarningConsoleComponent } from "../components/warning-console";
import githubLogo from "/github.png";
import "mapbox-gl/dist/mapbox-gl.css";
import "./map.css";
import { useSubjectContext } from "../state/subject-context";

const MAPBOX_ACCESS_TOKEN =
	"pk.eyJ1Ijoiam9zaG5pY2U5OCIsImEiOiJjanlrMnYwd2IwOWMwM29vcnQ2aWIwamw2In0.RRsdQF3s2hQ6qK-7BH5cKg";

export default function Map() {

	const { $testing, $deckGlFailedToLoadModel, $deckGlWarningLog, $modelStatsFinished, $renderingSceneFinished, $testingResult } = useSubjectContext()

	const viewer = useRef<MapModelViewer | null>(null);
	const [showModelUpload, setShowModalUpload] = useState(true);
	const [showStats, setShowStats] = useState(false);
	const [models, setModels] = useState<Record<string, File>>({});
	const [zoomLevel, setZoomLevel] = useState<number>(20);

	const handleModelInput = async (models: File[], engine: EngineType) => {
		const modelsState: Record<string, File> = {};
		models.forEach((model) => {
			modelsState[uuid()] = model;
		});
		viewer.current?.setEngine(engine);
		await viewer.current?.addModels(modelsState);
		setShowStats(engine === "deckgl" && models.length === 1);
		setModels(modelsState);
		setShowModalUpload(false);
	};

	const handleTestingClicked = (singleModelTest: boolean, amount: number) => {
		viewer.current?.startTesting(singleModelTest, amount);
	};

	const handleResetModelClicked = () => {
		viewer.current?.removeModel();

		$deckGlWarningLog.reset();
		$deckGlFailedToLoadModel.reset();

		setShowModalUpload(true);
	};

	const handleModelAmountChanged = (id: string, amount: number) => {
		viewer.current?.changeModelAmount(id, amount);
	};

	const handleGithubClick = () => {
		window.open("https://github.com/joshnice/mapbox-deckgl-viewer", "_blank")?.focus();
	};

	const handleZoomLevelChange = (zoomLevel: number) => {
		setZoomLevel(zoomLevel);
		viewer?.current?.setZoomLevel(zoomLevel);
	};

	const renderMap = (element: HTMLDivElement) => {
		if (viewer.current == null) {
			viewer.current = new MapModelViewer({
				mapElement: element,
				mapboxAccessKey: MAPBOX_ACCESS_TOKEN,
				subjects: {
					$testing: $testing,
					$testingResult: $testingResult,
					$onLumaGlWarning: $deckGlWarningLog,
					$onModelFailedToLoad: $deckGlFailedToLoadModel,
					$renderingSceneFinished: $renderingSceneFinished,
					$onModelStatsFinished: $modelStatsFinished,
				},
			});
		}
	};

	return (
		<div className="map-container">
			<div ref={renderMap} className="map">	
				<button type="button" className="github-button">
					<img className="github-logo" onClick={handleGithubClick} src={githubLogo} alt="github logo" />
				</button>
				{!showModelUpload && (<WarningConsoleComponent />)}
			</div>
			{showModelUpload && <ModelInputComponent onModelInput={handleModelInput} />}
				<ModelSettingsComponent
					showStats={showStats}
					models={models}
					zoomLevel={zoomLevel}
					showOptions={!showModelUpload}
					onAmountChange={handleModelAmountChanged}
					onTestingClicked={handleTestingClicked}
					onChangeModelClick={handleResetModelClicked}
					onZoomLevelChange={handleZoomLevelChange}
				/>
		</div>
	);
}
