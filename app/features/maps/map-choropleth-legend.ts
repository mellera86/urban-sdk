import type { Feature } from "geojson";
import { MapGeoJSON } from "@models/map-geojson";
import { getFeatureValue } from "./geojson-utils";

type ChoroplethBucket = {
  label: string;
  color: string;
  min: number;
  max: number;
};

const NO_DATA_COLOR = "#CBD5E1";
const CHOROPLETH_PALETTE = [
  "#C7D2FE",
  "#818CF8",
  "#6366F1",
  "#4338CA",
  "#312E81",
] as const;
const BUCKET_COUNT = CHOROPLETH_PALETTE.length;
const BUCKET_FRACTION = 1 / BUCKET_COUNT;

function formatBucketBound(value: number): string {
  if (Number.isInteger(value) || Math.abs(value - Math.round(value)) < 1e-6) {
    return String(Math.round(value));
  }
  return value.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

function formatRangeLabel(
  min: number,
  max: number,
  valueProperty?: string,
): string {
  const suffix = valueProperty?.startsWith("Percent") ? "%" : "";
  return `${formatBucketBound(min)}${suffix} – ${formatBucketBound(max)}${suffix}`;
}

function getBucketIndex(value: number, min: number, max: number): number {
  if (min === max) return 0;
  const normalized = (value - min) / (max - min);
  return Math.min(
    BUCKET_COUNT - 1,
    Math.max(0, Math.floor(normalized * BUCKET_COUNT)),
  );
}

function buildChoroplethBuckets(
  values: number[],
  valueProperty?: string,
): ChoroplethBucket[] {
  if (values.length === 0) {
    return [];
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;

  if (min === max) {
    return [
      {
        label: formatRangeLabel(min, max, valueProperty),
        color: CHOROPLETH_PALETTE[BUCKET_COUNT - 1],
        min,
        max,
      },
    ];
  }

  return CHOROPLETH_PALETTE.map((color, index) => {
    const bucketMin = min + range * BUCKET_FRACTION * index;
    const bucketMax =
      index === BUCKET_COUNT - 1
        ? max
        : min + range * BUCKET_FRACTION * (index + 1);

    return {
      label: formatRangeLabel(bucketMin, bucketMax, valueProperty),
      color,
      min: bucketMin,
      max: bucketMax,
    };
  });
}

function buildChoroplethBucketsFromGeoJson(
  geoJson: MapGeoJSON,
  valueProperty?: string,
): ChoroplethBucket[] {
  if (!valueProperty) return [];

  const values = geoJson.features
    .map((feature) => getFeatureValue(feature as Feature, valueProperty))
    .filter((value): value is number => value !== null);

  return buildChoroplethBuckets(values, valueProperty);
}

function getChoroplethColor(
  value: number | null | undefined,
  buckets: ChoroplethBucket[],
): string {
  if (value === null || value === undefined) return NO_DATA_COLOR;
  if (buckets.length === 0) return NO_DATA_COLOR;

  const min = buckets[0].min;
  const max = buckets[buckets.length - 1].max;
  const index = getBucketIndex(value, min, max);
  return buckets[index]?.color ?? NO_DATA_COLOR;
}

function formatFeatureValue(
  value: number | null,
  valueProperty?: string,
): string {
  if (value === null || value === undefined) return "No data";
  const suffix = valueProperty?.startsWith("Percent") ? "%" : "";
  return `${value}${suffix}`;
}

export {
  buildChoroplethBuckets,
  buildChoroplethBucketsFromGeoJson,
  formatFeatureValue,
  getChoroplethColor,
  NO_DATA_COLOR,
  type ChoroplethBucket,
};
