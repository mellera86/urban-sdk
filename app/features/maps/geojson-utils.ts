import type { Feature, LineString, Point, Position } from "geojson";
import { MapGeoJSON } from "@models/map-geojson";

const LARGE_DATASET_FEATURE_LIMIT = 1000;

/** Some responses use lowercase "feature"; Leaflet requires "Feature". */
function normalizeApiGeoJSON(geojson: MapGeoJSON): MapGeoJSON {
  const needsFix = geojson.features.some(
    (feature) => feature.type.toLowerCase() === "feature",
  );

  if (!needsFix) return geojson;

  return {
    ...geojson,
    features: geojson.features.map((feature: Feature) =>
      feature.type.toLowerCase() === "feature"
        ? ({ ...feature, type: "Feature" } as Feature)
        : feature,
    ),
  };
}

function isLargeGeoJSON(geojson: MapGeoJSON) {
  return geojson.features.length > LARGE_DATASET_FEATURE_LIMIT;
}

function getFeatureLabel(properties: Record<string, unknown> | null): string {
  if (!properties) return "No info available";

  return (
    (properties.name as string) ||
    (properties.desc as string) ||
    (properties.shape_id != null ? `Route ${properties.shape_id}` : null) ||
    String(properties.cosite ?? "No info available")
  );
}

function getValueProperty(geojson: MapGeoJSON): string | undefined {
  const properties = geojson.features[0]?.properties;
  if (!properties || typeof properties !== "object") return undefined;

  const entries = Object.entries(properties as Record<string, unknown>);
  const percentKey = entries.find(
    ([key, value]) =>
      key.startsWith("Percent") && typeof value === "number" && value !== null,
  )?.[0];

  if (percentKey) return percentKey;

  return entries.find(([, value]) => typeof value === "number")?.[0];
}

function getFeatureValue(
  feature: Feature,
  valueProperty?: string,
): number | null {
  if (!valueProperty || !feature.properties) return null;

  const value = (feature.properties as Record<string, unknown>)[valueProperty];
  return typeof value === "number" ? value : null;
}

/** GTFS shape files ship one Point per vertex (shape_id + shape_pt_sequence). */
function isGtfsShapePointCollection(geojson: MapGeoJSON): boolean {
  if (!geojson.features.length) return false;

  const sample = geojson.features.slice(0, 20);
  return sample.every((feature) => {
    if (feature.geometry?.type !== "Point") return false;
    const props = feature.properties as Record<string, unknown> | null;
    return (
      props != null && props.shape_id != null && props.shape_pt_sequence != null
    );
  });
}

function shapePointsToRouteLines(geojson: MapGeoJSON): MapGeoJSON {
  const byShape = new Map<string, Array<{ seq: number; coord: Position }>>();

  for (const feature of geojson.features) {
    if (feature.geometry?.type !== "Point") continue;
    const props = feature.properties as Record<string, unknown>;
    const shapeId = String(props.shape_id);
    const seq = Number(props.shape_pt_sequence);
    const coord = (feature.geometry as Point).coordinates;

    const vertices = byShape.get(shapeId) ?? [];
    vertices.push({ seq, coord });
    byShape.set(shapeId, vertices);
  }

  const features: Feature<LineString>[] = [];
  for (const [shapeId, vertices] of byShape) {
    vertices.sort((a, b) => a.seq - b.seq);
    if (vertices.length < 2) continue;

    features.push({
      type: "Feature",
      properties: { shape_id: shapeId },
      geometry: {
        type: "LineString",
        coordinates: vertices.map((v) => v.coord),
      },
    });
  }

  return { ...geojson, features };
}

function isRouteLineCollection(geojson: MapGeoJSON): boolean {
  return (
    geojson.features.length > 0 &&
    geojson.features.every(
      (feature) =>
        feature.geometry?.type === "LineString" &&
        (feature.properties as Record<string, unknown> | null)?.shape_id !=
          null,
    )
  );
}

function hasPointFeatures(geojson: MapGeoJSON): boolean {
  return geojson.features.some((feature) => feature.geometry?.type === "Point");
}

function prepareGeoJSONForMap(geojson: MapGeoJSON): MapGeoJSON {
  const normalized = normalizeApiGeoJSON(geojson);
  if (isGtfsShapePointCollection(normalized)) {
    return shapePointsToRouteLines(normalized);
  }
  return normalized;
}

export {
  hasPointFeatures,
  isLargeGeoJSON,
  isRouteLineCollection,
  normalizeApiGeoJSON,
  prepareGeoJSONForMap,
  getFeatureLabel,
  getFeatureValue,
  getValueProperty,
  LARGE_DATASET_FEATURE_LIMIT,
};
