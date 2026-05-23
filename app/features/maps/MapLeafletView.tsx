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
import {
  buildChoroplethBucketsFromGeoJson,
  formatFeatureValue,
  getChoroplethColor,
  type ChoroplethBucket,
} from "./map-choropleth-legend";
import { MapFeatureTable } from "./MapFeatureTable";
import { MapLegend } from "./MapLegend";

type MapLeafletViewProps = {
  mapKey: string;
  geoJson: MapGeoJSON;
  mapConfig: MapConfig;
  valueProperty?: string;
};

function isCircleMarker(layer: Layer): layer is CircleMarker {
  return "setRadius" in layer && typeof layer.setRadius === "function";
}

function getPointStyle(
  feature: Feature,
  valueProperty: string | undefined,
  buckets: ChoroplethBucket[],
) {
  const value = getFeatureValue(feature, valueProperty);
  return {
    radius: 6,
    fillColor: getChoroplethColor(value, buckets),
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

function getPathStyle(
  feature: Feature,
  valueProperty: string | undefined,
  buckets: ChoroplethBucket[],
) {
  const value = getFeatureValue(feature, valueProperty);
  return {
    fillColor: getChoroplethColor(value, buckets),
    weight: 1,
    opacity: 1,
    color: "#ffffff",
    fillOpacity: 0.7,
  };
}

function buildPopupContent(
  props: Record<string, unknown> | null,
  feature: Feature,
  valueProperty?: string,
) {
  const label = getFeatureLabel(props);
  const value = getFeatureValue(feature, valueProperty);
  const valueLine =
    value !== null && valueProperty
      ? `<p style="margin: 0.5rem 0 0;">${valueProperty}: ${formatFeatureValue(value, valueProperty)}</p>`
      : "";

  return `
    <div style="font-size: 13px; line-height: 1.4; min-width: 200px;">
      <strong>${label}</strong>
      ${valueLine}
    </div>
  `;
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
  const showChoroplethLegend = !isRouteLines && !!valueProperty;

  const choroplethBuckets = useMemo(
    () => buildChoroplethBucketsFromGeoJson(geoJson, valueProperty),
    [geoJson, valueProperty],
  );

  const pointToLayer = useCallback<NonNullable<GeoJSONOptions["pointToLayer"]>>(
    (feature, latlng) =>
      L.circleMarker(
        latlng,
        getPointStyle(feature as Feature, valueProperty, choroplethBuckets),
      ),
    [valueProperty, choroplethBuckets],
  );

  const geoJsonStyle = useCallback<StyleFunction>(
    (feature) => {
      if (!feature) return {};
      if (isRouteLines) return getRouteLineStyle();
      return getPathStyle(
        feature as Feature,
        valueProperty,
        choroplethBuckets,
      );
    },
    [isRouteLines, valueProperty, choroplethBuckets],
  );

  const onEachFeature = useCallback(
    (feature: Feature, layer: Layer) => {
      const props = feature.properties as Record<string, unknown> | null;

      layer.bindPopup(buildPopupContent(props, feature, valueProperty));

      if (isLargeDataset) return;

      const emphasize = (target: Layer) => {
        if (isCircleMarker(target)) {
          target.setRadius(10);
          return;
        }
        const path = target as Path;
        path.setStyle(
          isRouteLines
            ? { weight: 4, opacity: 1, color: "#fb923c" }
            : {
                fillOpacity: 0.9,
                weight: 3,
                color: "#4a5568",
              },
        );
        path.bringToFront();
      };

      const resetEmphasis = (target: Layer) => {
        if (isCircleMarker(target)) {
          target.setStyle(
            getPointStyle(feature, valueProperty, choroplethBuckets),
          );
          return;
        }
        geoJsonRef.current?.resetStyle(target);
      };

      layer.on({
        mouseover: (e: LeafletMouseEvent) => emphasize(e.target),
        mouseout: (e: LeafletMouseEvent) => resetEmphasis(e.target),
      });

      if ("getElement" in layer && typeof layer.getElement === "function") {
        const element = layer.getElement() as HTMLElement | undefined;
        if (element) {
          element.setAttribute("tabindex", "0");
          element.setAttribute("role", "button");
          const featureValue = getFeatureValue(feature, valueProperty);
          const featureLabel = getFeatureLabel(props);
          element.setAttribute(
            "aria-label",
            featureValue !== null && valueProperty
              ? `${featureLabel}: ${formatFeatureValue(featureValue, valueProperty)}`
              : featureLabel,
          );

          const onFocus = () => emphasize(layer);
          const onBlur = () => resetEmphasis(layer);
          element.addEventListener("focus", onFocus);
          element.addEventListener("blur", onBlur);
          layer.on("remove", () => {
            element.removeEventListener("focus", onFocus);
            element.removeEventListener("blur", onBlur);
          });
        }
      }
    },
    [choroplethBuckets, isLargeDataset, isRouteLines, valueProperty],
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
    <section
      className="flex flex-col gap-4"
      aria-label="Interactive map visualization"
    >
      <p className="text-sm text-muted-foreground">
        Use mouse or touch to pan and zoom.
      </p>

      {showChoroplethLegend && choroplethBuckets.length > 0 ? (
        <MapLegend
          valueProperty={valueProperty}
          buckets={choroplethBuckets}
        />
      ) : null}

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

      <MapFeatureTable geoJson={geoJson} valueProperty={valueProperty} />
    </section>
  );
};

export { MapLeafletView };
