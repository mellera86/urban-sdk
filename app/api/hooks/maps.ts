"use client";

import { GET_MapsResponse, getMaps } from "@actions/maps";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@utils/queries";
import { BaseQuery } from "@utils/types";

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

export { useMapsQuery };
