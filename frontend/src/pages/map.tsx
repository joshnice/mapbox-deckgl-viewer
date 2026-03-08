import {
  MapHandlerComponent,
  type MapHandlerForwardRefProps,
} from "@joshnice/map-deck-viewer";
import { useRef, type DragEvent } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import "./map.css";

const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1Ijoiam9zaG5pY2U5OCIsImEiOiJjanlrMnYwd2IwOWMwM29vcnQ2aWIwamw2In0.RRsdQF3s2hQ6qK-7BH5cKg";

export function MapCompnent() {
  const mapHandlerRef = useRef<MapHandlerForwardRefProps | null>(null);

  const handleModelInput = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const modelFiles = event.dataTransfer.files;
    for (const modelFile of modelFiles) {
      mapHandlerRef.current?.addModel({
        id: crypto.randomUUID(),
        file: modelFile,
        amount: 1,
      });
    }
    mapHandlerRef.current?.updateModelPositions();
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div
      className="map-container"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleModelInput}
    >
      <MapHandlerComponent
        mapboxAccessKey={MAPBOX_ACCESS_TOKEN}
        ref={mapHandlerRef}
      />
    </div>
  );
}
