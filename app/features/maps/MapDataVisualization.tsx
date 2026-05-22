"use client";

import { MapConfig } from "@models/map-config";
import { MapGeoJSON } from "@models/map-geojson";
import { FC } from "react";
import { normalizeApiGeoJSON, getValueProperty } from "./geojson-utils";
import { MapLeafletView } from "./MapLeafletView";

type MapDataVisualizationProps = {
  geoJsonData?: MapGeoJSON;
  mapConfig: MapConfig;
};

const MapDataVisualization: FC<MapDataVisualizationProps> = ({
  geoJsonData,
  mapConfig,
}) => {
  const leafletGeoJson = geoJsonData
    ? normalizeApiGeoJSON(geoJsonData)
    : undefined;

  const valueProperty = leafletGeoJson
    ? getValueProperty(leafletGeoJson)
    : undefined;

  if (!leafletGeoJson) {
    return (
      <div className="flex h-[min(60vh,600px)] w-full items-center justify-center rounded-lg bg-muted/30 text-sm text-muted-foreground">
        No map data to display.
      </div>
    );
  }

  return (
    <MapLeafletView
      geoJson={leafletGeoJson}
      mapConfig={mapConfig}
      valueProperty={valueProperty}
    />
  );
};

export default MapDataVisualization;
