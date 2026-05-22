import { Map } from "@models/maps";
import { urbanApiFetch, UrbanApiResponse } from "../fetchers/urban-api-fetcher";
import { HTTP_METHODS } from "../fetchers/http";
import { MapConfig } from "@models/map-config";
import { MapGeoJSON } from "@models/map-geojson";

export type GET_MapsResponse = Map[];

export async function getMaps(): Promise<UrbanApiResponse<GET_MapsResponse>> {
  return await urbanApiFetch<GET_MapsResponse>(`/exampledata/samples.json`, {
    method: HTTP_METHODS.GET,
  });
}

export async function getMapsData(
  mapsDataUrl: string,
): Promise<UrbanApiResponse<MapGeoJSON>> {
  return await urbanApiFetch(mapsDataUrl, {
    method: HTTP_METHODS.GET,
  });
}

export async function getMapsConfig(
  configUrl: string,
): Promise<UrbanApiResponse<MapConfig>> {
  return await urbanApiFetch(configUrl, {
    method: HTTP_METHODS.GET,
  });
}
