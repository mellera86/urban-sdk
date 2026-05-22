"use client";

import { FC, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import Leaflet from "leaflet";

// Typing the specific feature geometry format (MultiPolygon in this dataset)
type Feature = {
  type: "Feature";
  geometry: {
    type: "MultiPolygon";
    coordinates: number[][][][];
  };
  properties: any;
};

export type FeatureCollection = {
  type: "FeatureCollection";
  label?: string;
  features: Feature[];
};

type MapProps = {
  geoJsonData?: FeatureCollection;
};

const MapDataVisualization: FC<MapProps> = ({ geoJsonData }) => {
  // Center coordinates targeting the Jacksonville/Clay County area
  const mapCenter: [number, number] = [30.1, -81.9];
  const defaultZoom = 9;

  // Using a component ref to safely track the GeoJSON layer instance across mouse events
  const geoJsonRef = useRef<Leaflet.GeoJSON>(null);

  const getColor = (value: number | null): string => {
    if (value === null || value === undefined) return "#95a5a6"; // Gray fallback for null data
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

  // Layout injection and mouse handlers for every tract polygon rendered
  const onEachFeature = (feature: GeoJSON.Feature, layer: Leaflet.Layer) => {
    const props = feature.properties;

    const popupContent = `
      <div style="font-family: system-ui, sans-serif; font-size: 13px; line-height: 1.4; min-width: 200px;">
        <h4 style="margin: 0 0 8px 0; color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 6px;">
          ${props.name || "Unknown Census Tract"}
        </h4>
      </div>
    `;

    layer.bindPopup(popupContent);

    // Interaction animations
    layer.on({
      mouseover: (e: Leaflet.LeafletMouseEvent) => {
        const targetLayer = e.target as Leaflet.Polygon;
        targetLayer.setStyle({
          fillOpacity: 0.9,
          weight: 3,
          color: "#4a5568",
        });
        targetLayer.bringToFront();
      },
      mouseout: (e: Leaflet.LeafletMouseEvent) => {
        if (geoJsonRef.current) {
          geoJsonRef.current.resetStyle(e.target);
        }
      },
    });
  };

  return (
    <div
      style={{
        height: "600px",
        width: "100%",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}
    >
      <MapContainer
        center={mapCenter}
        zoom={defaultZoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <GeoJSON
          data={geoJsonData as any} // Cast needed due to slight variance between primitive GeoJSON typing frameworks
          onEachFeature={onEachFeature}
          ref={geoJsonRef}
        />
      </MapContainer>
    </div>
  );
};

export default MapDataVisualization;
