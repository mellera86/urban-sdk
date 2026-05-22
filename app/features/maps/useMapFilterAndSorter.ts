"use client";

import { Map } from "@models/maps";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import { DEFAULT_MAP_SORT, type MapSortOption } from "./map-sort";

const SOURCES_PARAM = "sources";
const SORT_PARAM = "sort";

const MAP_SORT_VALUES = new Set<MapSortOption>([
  "label-asc",
  "label-desc",
  "source-asc",
  "source-desc",
]);

function parseSourcesParam(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => decodeURIComponent(item.trim()))
    .filter(Boolean);
}

function serializeSourcesParam(sources: string[]): string {
  return sources.map(encodeURIComponent).join(",");
}

function parseSortParam(value: string | null): MapSortOption {
  if (value && MAP_SORT_VALUES.has(value as MapSortOption)) {
    return value as MapSortOption;
  }
  return DEFAULT_MAP_SORT;
}

function readSourcesFromSearchParams(searchParams: URLSearchParams): string[] {
  return parseSourcesParam(searchParams.get(SOURCES_PARAM));
}

function readSortFromSearchParams(
  searchParams: URLSearchParams,
): MapSortOption {
  return parseSortParam(searchParams.get(SORT_PARAM));
}

function searchParamsWithUpdates(
  params: URLSearchParams,
  update: { sources?: string[]; sort?: MapSortOption },
): URLSearchParams {
  const next = new URLSearchParams(params.toString());

  if (update.sources !== undefined) {
    next.delete(SOURCES_PARAM);
    if (update.sources.length > 0) {
      next.set(SOURCES_PARAM, serializeSourcesParam(update.sources));
    }
  }

  if (update.sort !== undefined) {
    next.delete(SORT_PARAM);
    if (update.sort !== DEFAULT_MAP_SORT) {
      next.set(SORT_PARAM, update.sort);
    }
  }

  return next;
}

function sortMaps(maps: Map[], sort: MapSortOption): Map[] {
  const list = [...maps];

  switch (sort) {
    case "label-asc":
      return list.sort((a, b) => a.label.localeCompare(b.label));
    case "label-desc":
      return list.sort((a, b) => b.label.localeCompare(a.label));
    case "source-asc":
      return list.sort((a, b) => a.subLabel.localeCompare(b.subLabel));
    case "source-desc":
      return list.sort((a, b) => b.subLabel.localeCompare(a.subLabel));
  }
}

function useMapFilterAndSorter(maps: Map[] | undefined) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const subLabels = useMemo(
    () => [...new Set((maps ?? []).map((map) => map.subLabel))].sort(),
    [maps],
  );

  const subLabelFilter = useMemo(() => {
    const fromUrl = readSourcesFromSearchParams(searchParams);
    if (subLabels.length === 0) return fromUrl;
    return fromUrl.filter((source) => subLabels.includes(source));
  }, [searchParams, subLabels]);

  const sort = useMemo(
    () => readSortFromSearchParams(searchParams),
    [searchParams],
  );

  const updateUrl = useCallback(
    (next: URLSearchParams) => {
      const query = next.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  const setSubLabelFilter = useCallback(
    (value: string[]) => {
      updateUrl(searchParamsWithUpdates(searchParams, { sources: value }));
    },
    [searchParams, updateUrl],
  );

  const setSort = useCallback(
    (value: MapSortOption) => {
      updateUrl(searchParamsWithUpdates(searchParams, { sort: value }));
    },
    [searchParams, updateUrl],
  );

  useEffect(() => {
    if (subLabels.length === 0) return;

    const fromUrl = readSourcesFromSearchParams(searchParams);
    if (fromUrl.length === 0) return;

    const valid = fromUrl.filter((source) => subLabels.includes(source));
    if (valid.length !== fromUrl.length) {
      setSubLabelFilter(valid);
    }
  }, [searchParams, setSubLabelFilter, subLabels]);

  const filteredMaps = useMemo(() => {
    const filtered =
      subLabelFilter.length === 0
        ? (maps ?? [])
        : (maps ?? []).filter((map) => subLabelFilter.includes(map.subLabel));

    return sortMaps(filtered, sort);
  }, [maps, subLabelFilter, sort]);

  return {
    subLabels,
    filteredMaps,
    subLabelFilter,
    setSubLabelFilter,
    sort,
    setSort,
  };
}

export { useMapFilterAndSorter };
