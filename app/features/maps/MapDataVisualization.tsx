"use client";

import { MapConfig } from "@models/map-config";
import { MapGeoJSON } from "@models/map-geojson";
import { FC, useMemo } from "react";
import { getValueProperty, prepareGeoJSONForMap } from "./geojson-utils";
import { MapLeafletView } from "./MapLeafletView";

type MapDataVisualizationProps = {
  geoJsonData?: MapGeoJSON;
  mapConfig: MapConfig;
  mapKey: string;
};

const MapDataVisualization: FC<MapDataVisualizationProps> = ({
  geoJsonData,
  mapConfig,
  mapKey,
}) => {
  const leafletGeoJson = useMemo(
    () => (geoJsonData ? prepareGeoJSONForMap(geoJsonData) : undefined),
    [geoJsonData],
  );

  const valueProperty = useMemo(
    () => (leafletGeoJson ? getValueProperty(leafletGeoJson) : undefined),
    [leafletGeoJson],
  );

  if (!leafletGeoJson) {
    return (
      <div className="flex h-[min(60vh,600px)] w-full items-center justify-center rounded-lg bg-muted/30 text-sm text-muted-foreground">
        No map data to display.
      </div>
    );
  }

  return (
    <MapLeafletView
      mapKey={mapKey}
      geoJson={leafletGeoJson}
      mapConfig={mapConfig}
      valueProperty={valueProperty}
    />
  );
};

export default MapDataVisualization;
