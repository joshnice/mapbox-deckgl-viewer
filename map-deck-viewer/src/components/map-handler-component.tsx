import { type Ref, useImperativeHandle, useRef } from "react";
import { MapHandler } from "../mapbox/map-handler";
import type { Model } from "../types/model-type";

export interface MapHandlerProps {
	mapboxAccessKey: string;
	ref: Ref<MapHandlerForwardRefProps> | null;
}

export interface MapHandlerForwardRefProps {
	addModel: (model: Model) => void;
	startTesting: () => Promise<number>;
	updateModelPositions: () => void;
	updateModelAmount: (modelAmount: Pick<Model, "id" | "amount">) => void;
}

export function MapHandlerComponent({ mapboxAccessKey, ref }: MapHandlerProps) {
	const mapHandlerInstance = useRef<MapHandler | null>(null);

	useImperativeHandle(ref, () => ({
		addModel: (model) => {
			mapHandlerInstance.current?.addModel(model);
		},
		startTesting: async () => {
			const result = await mapHandlerInstance.current?.startTesting();

			if (result == null) {
				throw new Error("Testing failed to produce a result");
			}

			return result;
		},
		updateModelPositions: () => {
			mapHandlerInstance.current?.updateModelPositions();
		},
		updateModelAmount: (modelAmount) => {
			mapHandlerInstance.current?.changeModelAmount(modelAmount);
		},
	}));

	const onMapContainerRender = (container: HTMLDivElement) => {
		if (mapHandlerInstance.current == null) {
			mapHandlerInstance.current = new MapHandler({
				container,
				mapboxAccessKey,
			});
		}
	};

	return (
		<div style={{ height: "100%", width: "100%" }} ref={onMapContainerRender} />
	);
}
