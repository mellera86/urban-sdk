"use client";

import type { Feature } from "geojson";
import { MapGeoJSON } from "@models/map-geojson";
import { formatFeatureValue } from "./map-choropleth-legend";
import { getFeatureLabel, getFeatureValue } from "./geojson-utils";

const TABLE_FEATURE_LIMIT = 100;

type MapFeatureTableProps = {
  geoJson: MapGeoJSON;
  valueProperty?: string;
};

const MapFeatureTable = ({ geoJson, valueProperty }: MapFeatureTableProps) => {
  const features = geoJson.features.slice(0, TABLE_FEATURE_LIMIT);
  const truncated = geoJson.features.length > TABLE_FEATURE_LIMIT;
  const valueHeader = valueProperty ?? "Value";

  if (features.length === 0) {
    return (
      <p className="sr-only" role="status">
        No features to list.
      </p>
    );
  }

  return (
    <div className="sr-only">
      <h3 className="text-sm font-medium text-foreground">Map data table</h3>
      <p className="text-xs text-muted-foreground">
        Keyboard-accessible list of map features. Use Tab to move between rows.
      </p>
      {truncated ? (
        <p className="text-xs text-muted-foreground" role="status">
          Showing first {TABLE_FEATURE_LIMIT} of {geoJson.features.length}{" "}
          features.
        </p>
      ) : null}
      <div className="max-h-48 overflow-auto rounded-lg border border-border">
        <table className="w-full min-w-[20rem] border-collapse text-left text-sm">
          <thead className="sticky top-0 bg-muted">
            <tr>
              <th scope="col" className="px-3 py-2 font-medium">
                Feature
              </th>
              <th scope="col" className="px-3 py-2 font-medium">
                {valueHeader}
              </th>
            </tr>
          </thead>
          <tbody>
            {features.map((feature, index) => (
              <FeatureRow
                key={feature.id ?? `feature-${index}`}
                feature={feature}
                valueProperty={valueProperty}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function FeatureRow({
  feature,
  valueProperty,
}: {
  feature: Feature;
  valueProperty?: string;
}) {
  const props = feature.properties as Record<string, unknown> | null;
  const label = getFeatureLabel(props);
  const value = getFeatureValue(feature, valueProperty);
  const hasValue = value !== null && valueProperty;

  return (
    <tr className="border-t border-border/60">
      <td className="px-3 py-2">{label}</td>
      <td className="px-3 py-2">
        {hasValue ? formatFeatureValue(value, valueProperty) : null}
      </td>
    </tr>
  );
}

export { MapFeatureTable, TABLE_FEATURE_LIMIT };
