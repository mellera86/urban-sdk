"use client";

import {
  GET_MapsResponse,
  getMaps,
  getMapsConfig,
  getMapsData,
} from "@actions/maps";
import { MapConfig } from "@models/map-config";
import { MapGeoJSON } from "@models/map-geojson";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@utils/queries";
import { BaseQuery, BaseQueryWithVariables } from "@utils/types";

const useMapsQuery: BaseQuery<GET_MapsResponse> = ({ options } = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.MAPS],
    queryFn: async () => {
      const response = await getMaps();
      return response.data;
    },
    ...options,
  });
};

const useMapsDataQuery: BaseQueryWithVariables<
  MapGeoJSON,
  { url: string }
> = ({ options, variables: { url } }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.MAPS_DATA, url],
    queryFn: async () => {
      const response = await getMapsData(url);
      if (response.error || !response.data) {
        throw new Error(
          typeof response.error === "string"
            ? response.error
            : "Failed to load map data",
        );
      }
      return response.data;
    },
    enabled: !!url,
    gcTime: 0,
    ...options,
  });
};

const useMapsConfigQuery: BaseQueryWithVariables<
  MapConfig,
  { url: string }
> = ({ options, variables: { url } }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.MAPS_CONFIG, url],
    queryFn: async () => {
      const response = await getMapsConfig(url);
      if (response.error || !response.data) {
        throw new Error(
          typeof response.error === "string"
            ? response.error
            : "Failed to load map config",
        );
      }
      return response.data;
    },
    enabled: !!url,
    gcTime: 0,
    ...options,
  });
};

export { useMapsQuery, useMapsDataQuery, useMapsConfigQuery };
