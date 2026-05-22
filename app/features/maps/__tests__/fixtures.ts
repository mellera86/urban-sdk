import type { Feature, LineString, Point } from "geojson";
import { MapGeoJSON } from "@models/map-geojson";
import { Map } from "@models/maps";

function createMap(overrides: Partial<Map> = {}): Map {
  return {
    id: "map-1",
    label: "Alpha Map",
    queryType: "type-a",
    imageUrl: "https://cdn.urbansdk.com/example.png",
    description: "First map",
    subLabel: "Source A",
    visible: true,
    dataUrl: "/data/alpha",
    configUrl: "/config/alpha",
    ...overrides,
  };
}

const sampleMaps: Map[] = [
  createMap(),
  createMap({
    id: "map-2",
    label: "Beta Map",
    subLabel: "Source B",
    description: "Second map",
    dataUrl: "/data/beta",
    configUrl: "/config/beta",
  }),
  createMap({
    id: "map-3",
    label: "Gamma Map",
    subLabel: "Source A",
    description: "Third map",
    dataUrl: "/data/gamma",
    configUrl: "/config/gamma",
  }),
];

function createGeoJSON(features: Feature[]): MapGeoJSON {
  return {
    type: "FeatureCollection",
    features,
  };
}

function createGtfsShapePoint(
  shapeId: string,
  sequence: number,
  coordinates: [number, number],
): Feature<Point> {
  return {
    type: "Feature",
    properties: {
      shape_id: shapeId,
      shape_pt_sequence: sequence,
    },
    geometry: {
      type: "Point",
      coordinates,
    },
  };
}

function createLineFeature(
  shapeId: string,
  coordinates: [number, number][],
): Feature<LineString> {
  return {
    type: "Feature",
    properties: { shape_id: shapeId },
    geometry: {
      type: "LineString",
      coordinates,
    },
  };
}

export {
  createGeoJSON,
  createGtfsShapePoint,
  createLineFeature,
  createMap,
  sampleMaps,
};
