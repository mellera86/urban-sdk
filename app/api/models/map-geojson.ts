import type { FeatureCollection } from "geojson";

export type MapGeoJSON = FeatureCollection & {
  label?: string;
};
