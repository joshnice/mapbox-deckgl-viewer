import type { FeatureCollection, Feature } from "geojson"; 

interface GridConfig {
  rows: number;
  cols: number;
  spacing?: number;
}

/**
 * Generate a GeoJSON FeatureCollection of points in a grid centered at [0, 0]
 */
export function generateGridGeoJSON(config: GridConfig): FeatureCollection {
  const { rows, cols, spacing = 1.0 } = config;
  const features: Feature[] = [];

  // Calculate offsets to center grid at origin (0,0)
  const xOffset = ((cols - 1) * spacing) / 2;
  const yOffset = ((rows - 1) * spacing) / 2;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Calculate coordinates centered at 0,0
      const x = col * spacing - xOffset;
      const y = row * spacing - yOffset;

      // Determine if this is the center point
      const isCenter = Math.abs(x) < 0.0001 && Math.abs(y) < 0.0001;

      const feature: Feature = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [x, y] // GeoJSON uses [longitude/x, latitude/y]
        },
        properties: {
          row,
          col,
          gridIndex: row * cols + col,
          isCenter,
          spacing,
          // Optional: include original grid dimensions
          gridRows: rows,
          gridCols: cols
        }
      };

      features.push(feature);
    }
  }

  return {
    type: "FeatureCollection",
    features
  };
}
