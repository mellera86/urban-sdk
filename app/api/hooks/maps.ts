"use client";

import { GET_MapsResponse, getMaps, getMapsData } from "@actions/maps";
import { FeatureCollection } from "@features/maps/MapDataVisualization";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@utils/queries";
import { BaseQuery, BaseQueryWithVariables } from "@utils/types";
import { FC } from "react";

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
  FeatureCollection,
  { url: string }
> = ({ options, variables: { url } }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.MAPS_DATA, url],
    queryFn: async () => {
      const response = await getMapsData(url);
      return response.data;
    },
    enabled: !!url,
    ...options,
  });
};

export { useMapsQuery, useMapsDataQuery };
