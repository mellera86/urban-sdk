import type { Feature } from "geojson";
import { MapGeoJSON } from "@models/map-geojson";

/** Some responses use lowercase "feature"; Leaflet requires "Feature". */
function normalizeApiGeoJSON(geojson: MapGeoJSON): MapGeoJSON {
  return {
    ...geojson,
    features: geojson.features.map((feature: Feature) =>
      feature.type.toLowerCase() === "feature"
        ? ({ ...feature, type: "Feature" } as Feature)
        : feature,
    ),
  };
}

function getFeatureLabel(properties: Record<string, unknown> | null): string {
  if (!properties) return "No info available";

  return (
    (properties.name as string) ||
    (properties.desc as string) ||
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

export {
  normalizeApiGeoJSON,
  getFeatureLabel,
  getFeatureValue,
  getValueProperty,
};
