"use client";

import "leaflet/dist/leaflet.css";

import { FC, useCallback, useEffect, useMemo, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  useMap,
  type GeoJSONProps,
  type MapContainerProps,
} from "react-leaflet";
import { MapConfig, getTileLayerUrl } from "@models/map-config";
import { MapGeoJSON } from "@models/map-geojson";
import type { Feature } from "geojson";
import L from "leaflet";
import type {
  CircleMarker,
  GeoJSON as LeafletGeoJSON,
  GeoJSONOptions,
  Layer,
  LatLngTuple,
  LeafletMouseEvent,
  MapOptions,
  Path,
  StyleFunction,
} from "leaflet";
import {
  getFeatureLabel,
  getFeatureValue,
  hasPointFeatures,
  isLargeGeoJSON,
  isRouteLineCollection,
} from "./geojson-utils";

type MapLeafletViewProps = {
  mapKey: string;
  geoJson: MapGeoJSON;
  mapConfig: MapConfig;
  valueProperty?: string;
};

const getColor = (value: number | null): string => {
  if (value === null || value === undefined) return "#95a5a6";
  return value > 50
    ? "#800026"
    : value > 40
      ? "#BD0026"
      : value > 30
        ? "#E31A1C"
        : value > 20
          ? "#FC4E2A"
          : value > 10
            ? "#FD8D3C"
            : "#FFEDA0";
};

function isCircleMarker(layer: Layer): layer is CircleMarker {
  return "setRadius" in layer && typeof layer.setRadius === "function";
}

function getPointStyle(feature: Feature, valueProperty?: string) {
  const value = getFeatureValue(feature, valueProperty);
  return {
    radius: 6,
    fillColor: getColor(value),
    color: "#ffffff",
    weight: 1,
    fillOpacity: 0.8,
  };
}

function getRouteLineStyle() {
  return {
    color: "#f97316",
    weight: 2,
    opacity: 0.9,
  };
}

function getPathStyle(feature: Feature, valueProperty?: string) {
  const value = getFeatureValue(feature, valueProperty);
  return {
    fillColor: getColor(value),
    weight: 1,
    opacity: 1,
    color: "#ffffff",
    fillOpacity: 0.7,
  };
}

const FitBounds: FC<{ data: MapGeoJSON }> = ({ data }) => {
  const map = useMap();

  useEffect(() => {
    const layer = L.geoJSON(data);
    const bounds = layer.getBounds();

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [10, 32] });
    }

    return () => {
      layer.remove();
    };
  }, [data, map]);

  return null;
};

const MapLeafletView: FC<MapLeafletViewProps> = ({
  mapKey,
  geoJson,
  mapConfig,
  valueProperty,
}) => {
  const { mapState, mapStyle } = mapConfig.config;
  const mapCenter: LatLngTuple = [mapState.latitude, mapState.longitude];
  const defaultZoom = mapState.zoom;
  const tileLayerUrl = getTileLayerUrl(mapStyle.styleType);
  const geoJsonRef = useRef<LeafletGeoJSON | null>(null);
  const isLargeDataset = isLargeGeoJSON(geoJson);
  const isRouteLines = isRouteLineCollection(geoJson);
  const renderPoints = hasPointFeatures(geoJson);

  const pointToLayer = useCallback<NonNullable<GeoJSONOptions["pointToLayer"]>>(
    (feature, latlng) =>
      L.circleMarker(latlng, getPointStyle(feature as Feature, valueProperty)),
    [valueProperty],
  );

  const geoJsonStyle = useCallback<StyleFunction>(
    (feature) => {
      if (!feature) return {};
      if (isRouteLines) return getRouteLineStyle();
      return getPathStyle(feature as Feature, valueProperty);
    },
    [isRouteLines, valueProperty],
  );

  const onEachFeature = useCallback(
    (feature: Feature, layer: Layer) => {
      const props = feature.properties as Record<string, unknown> | null;

      layer.bindPopup(`
      <div style="font-size: 13px; line-height: 1.4; min-width: 200px;">
        <h4>${getFeatureLabel(props)}</h4>
      </div>
    `);

      if (isLargeDataset) return;

      layer.on({
        mouseover: (e: LeafletMouseEvent) => {
          const target = e.target;
          if (isCircleMarker(target)) {
            target.setRadius(10);
            return;
          }
          (target as Path).setStyle(
            isRouteLines
              ? { weight: 4, opacity: 1, color: "#fb923c" }
              : {
                  fillOpacity: 0.9,
                  weight: 3,
                  color: "#4a5568",
                },
          );
          target.bringToFront();
        },
        mouseout: (e: LeafletMouseEvent) => {
          const target = e.target;
          if (isCircleMarker(target)) {
            target.setStyle(getPointStyle(feature, valueProperty));
            return;
          }
          geoJsonRef.current?.resetStyle(target);
        },
      });
    },
    [isLargeDataset, isRouteLines, valueProperty],
  );

  const mapContainerProps = useMemo(
    () =>
      ({
        center: mapCenter,
        zoom: defaultZoom,
        scrollWheelZoom: true,
        preferCanvas: isLargeDataset,
        className: "h-full w-full",
      }) satisfies MapOptions & Pick<MapContainerProps, "className">,
    [defaultZoom, isLargeDataset, mapCenter],
  );

  const geoJsonProps = useMemo(() => {
    const options: GeoJSONOptions & { data: MapGeoJSON } = {
      data: geoJson,
      ...(renderPoints ? { pointToLayer } : {}),
      style: geoJsonStyle,
      onEachFeature,
    };
    return options;
  }, [geoJson, onEachFeature, pointToLayer, geoJsonStyle, renderPoints]);

  return (
    <div className="h-[min(60vh,600px)] w-full overflow-hidden rounded-lg shadow-md">
      <MapContainer key={mapKey} {...mapContainerProps}>
        <TileLayer url={tileLayerUrl} />
        <GeoJSON
          key={mapKey}
          ref={geoJsonRef}
          {...(geoJsonProps as GeoJSONProps)}
        />
        <FitBounds data={geoJson} />
      </MapContainer>
    </div>
  );
};

export { MapLeafletView };
