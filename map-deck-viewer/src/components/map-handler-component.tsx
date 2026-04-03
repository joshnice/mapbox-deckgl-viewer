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
	updateModelPositions: () => Promise<void>;
	updateModelAmount: (
		modelAmount: Pick<Model, "id" | "amount">,
	) => Promise<void>;
	getModelRenderTime: (modelId: string) => Promise<number | null>;
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
		updateModelPositions: async () => {
			await mapHandlerInstance.current?.updateModelPositions();
		},
		updateModelAmount: async (modelAmount) => {
			await mapHandlerInstance.current?.changeModelAmount(modelAmount);
		},
		getModelRenderTime: async (modelId) => {
			return new Promise((res) => {
				const MAX_COUNT = 20;
				let count = 0;

				const intervalId = setInterval(() => {
					const model = mapHandlerInstance.current?.getModel(modelId);
					count++;

					if (count >= MAX_COUNT) {
						res(null);
					}

					if (model?.totalRenderingTime != null) {
						res(model.totalRenderingTime);
						clearInterval(intervalId);
					}

				}, 500)
			});
		}
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
