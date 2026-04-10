interface ModelBase {
	id: string;
	type: "glb" | "3dtile";
}

export interface GlbModel extends ModelBase {
	type: "glb";
	file: File;
	amount: number;
}

export interface Tile3DModel extends ModelBase {
	type: "3dtile";
	files: File[];
}

export type Model = GlbModel | Tile3DModel;
