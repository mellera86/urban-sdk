import {
  getFeatureLabel,
  getFeatureValue,
  getValueProperty,
  hasPointFeatures,
  isLargeGeoJSON,
  isRouteLineCollection,
  LARGE_DATASET_FEATURE_LIMIT,
  normalizeApiGeoJSON,
  prepareGeoJSONForMap,
} from "../geojson-utils";
import {
  createGeoJSON,
  createGtfsShapePoint,
  createLineFeature,
} from "./fixtures";

describe("geojson-utils", () => {
  describe("normalizeApiGeoJSON", () => {
    it("fixes lowercase feature type for Leaflet", () => {
      const geojson = createGeoJSON([
        {
          type: "feature" as "Feature",
          properties: { name: "Site A" },
          geometry: { type: "Point", coordinates: [0, 0] },
        },
      ]);

      const normalized = normalizeApiGeoJSON(geojson);

      expect(normalized.features[0].type).toBe("Feature");
    });

    it("leaves valid Feature collections unchanged", () => {
      const geojson = createGeoJSON([
        {
          type: "Feature",
          properties: { name: "Site A" },
          geometry: { type: "Point", coordinates: [0, 0] },
        },
      ]);

      expect(normalizeApiGeoJSON(geojson)).toEqual(geojson);
    });
  });

  describe("isLargeGeoJSON", () => {
    it(`returns true when feature count exceeds ${LARGE_DATASET_FEATURE_LIMIT}`, () => {
      const features = Array.from({ length: LARGE_DATASET_FEATURE_LIMIT + 1 }, (_, i) => ({
        type: "Feature" as const,
        properties: { id: i },
        geometry: { type: "Point" as const, coordinates: [i, i] },
      }));

      expect(isLargeGeoJSON(createGeoJSON(features))).toBe(true);
    });

    it(`returns false when feature count is at the limit`, () => {
      const features = Array.from({ length: LARGE_DATASET_FEATURE_LIMIT }, (_, i) => ({
        type: "Feature" as const,
        properties: { id: i },
        geometry: { type: "Point" as const, coordinates: [i, i] },
      }));

      expect(isLargeGeoJSON(createGeoJSON(features))).toBe(false);
    });
  });

  describe("getFeatureLabel", () => {
    it("prefers name, then desc, then shape_id, then cosite", () => {
      expect(getFeatureLabel({ name: "Named" })).toBe("Named");
      expect(getFeatureLabel({ desc: "Described" })).toBe("Described");
      expect(getFeatureLabel({ shape_id: "42" })).toBe("Route 42");
      expect(getFeatureLabel({ cosite: 7 })).toBe("7");
      expect(getFeatureLabel(null)).toBe("No info available");
    });
  });

  describe("getValueProperty", () => {
    it("prefers Percent-prefixed numeric properties", () => {
      const geojson = createGeoJSON([
        {
          type: "Feature",
          properties: { count: 1, PercentOccupied: 0.5 },
          geometry: { type: "Point", coordinates: [0, 0] },
        },
      ]);

      expect(getValueProperty(geojson)).toBe("PercentOccupied");
    });

    it("falls back to the first numeric property", () => {
      const geojson = createGeoJSON([
        {
          type: "Feature",
          properties: { count: 10, label: "x" },
          geometry: { type: "Point", coordinates: [0, 0] },
        },
      ]);

      expect(getValueProperty(geojson)).toBe("count");
    });
  });

  describe("getFeatureValue", () => {
    it("returns numeric property values only", () => {
      const feature = {
        type: "Feature" as const,
        properties: { score: 12, label: "x" },
        geometry: { type: "Point" as const, coordinates: [0, 0] },
      };

      expect(getFeatureValue(feature, "score")).toBe(12);
      expect(getFeatureValue(feature, "label")).toBeNull();
      expect(getFeatureValue(feature)).toBeNull();
    });
  });

  describe("prepareGeoJSONForMap", () => {
    it("converts GTFS shape points into route LineStrings", () => {
      const geojson = createGeoJSON([
        createGtfsShapePoint("route-1", 2, [1, 1]),
        createGtfsShapePoint("route-1", 1, [0, 0]),
        createGtfsShapePoint("route-1", 3, [2, 2]),
      ]);

      const prepared = prepareGeoJSONForMap(geojson);

      expect(prepared.features).toHaveLength(1);
      expect(prepared.features[0].geometry.type).toBe("LineString");
      expect(prepared.features[0].geometry).toMatchObject({
        coordinates: [
          [0, 0],
          [1, 1],
          [2, 2],
        ],
      });
    });

    it("only normalizes non-GTFS collections", () => {
      const geojson = createGeoJSON([
        {
          type: "feature" as "Feature",
          properties: { name: "Site" },
          geometry: { type: "Point", coordinates: [0, 0] },
        },
      ]);

      const prepared = prepareGeoJSONForMap(geojson);

      expect(prepared.features[0].type).toBe("Feature");
      expect(prepared.features[0].geometry.type).toBe("Point");
    });
  });

  describe("geometry helpers", () => {
    it("detects route line collections", () => {
      const lines = createGeoJSON([
        createLineFeature("1", [
          [0, 0],
          [1, 1],
        ]),
      ]);

      expect(isRouteLineCollection(lines)).toBe(true);
      expect(hasPointFeatures(lines)).toBe(false);
    });

    it("detects point features", () => {
      const points = createGeoJSON([
        {
          type: "Feature",
          properties: { name: "A" },
          geometry: { type: "Point", coordinates: [0, 0] },
        },
      ]);

      expect(hasPointFeatures(points)).toBe(true);
      expect(isRouteLineCollection(points)).toBe(false);
    });
  });
});
