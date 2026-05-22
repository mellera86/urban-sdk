"use client";

import "leaflet/dist/leaflet.css";

import { FC, useEffect, useRef } from "react";
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
import { getFeatureLabel, getFeatureValue } from "./geojson-utils";

type MapLeafletViewProps = {
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
  }, [data, map]);

  return null;
};

const MapLeafletView: FC<MapLeafletViewProps> = ({
  geoJson,
  mapConfig,
  valueProperty,
}) => {
  const { mapState, mapStyle } = mapConfig.config;
  const mapCenter: LatLngTuple = [mapState.latitude, mapState.longitude];
  const defaultZoom = mapState.zoom;
  const tileLayerUrl = getTileLayerUrl(mapStyle.styleType);
  const geoJsonRef = useRef<LeafletGeoJSON | null>(null);

  const pointToLayer: NonNullable<GeoJSONOptions["pointToLayer"]> = (
    feature,
    latlng,
  ) => L.circleMarker(latlng, getPointStyle(feature as Feature, valueProperty));

  const geoJsonStyle: StyleFunction = (feature) =>
    feature ? getPathStyle(feature as Feature, valueProperty) : {};

  const onEachFeature = (feature: Feature, layer: Layer) => {
    const props = feature.properties as Record<string, unknown> | null;

    const popupContent = `
      <div style="font-size: 13px; line-height: 1.4; min-width: 200px;">
        <h4>
          ${getFeatureLabel(props)}
        </h4>
      </div>
    `;

    layer.bindPopup(popupContent);

    layer.on({
      mouseover: (e: LeafletMouseEvent) => {
        const target = e.target;
        if (isCircleMarker(target)) {
          target.setRadius(10);
          return;
        }
        (target as Path).setStyle({
          fillOpacity: 0.9,
          weight: 3,
          color: "#4a5568",
        });
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
  };

  const mapContainerProps = {
    center: mapCenter,
    zoom: defaultZoom,
    scrollWheelZoom: true,
    className: "h-full w-full",
  } satisfies MapOptions & Pick<MapContainerProps, "className">;

  const geoJsonProps = {
    data: geoJson,
    pointToLayer,
    style: geoJsonStyle,
    onEachFeature,
  } satisfies GeoJSONOptions & { data: MapGeoJSON };

  return (
    <div className="h-[min(60vh,600px)] w-full overflow-hidden rounded-lg shadow-md">
      <MapContainer {...mapContainerProps}>
        <TileLayer url={tileLayerUrl} />
        <GeoJSON
          key={geoJson.features.length}
          ref={geoJsonRef}
          {...geoJsonProps}
        />
        <FitBounds data={geoJson} />
      </MapContainer>
    </div>
  );
};

export { MapLeafletView };
