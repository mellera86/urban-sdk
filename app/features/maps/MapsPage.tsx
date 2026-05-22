"use client";

import { useMapsQuery } from "@api-hooks/maps";
import { MapCardsGrid } from "./MapCardsGrid";
import { MapFilter } from "./MapFilter";
import { MapSorter } from "./MapSorter";
import { useMapFilterAndSorter } from "./useMapFilterAndSorter";
import { ApiResponseWrapper } from "@components/Pages/ApiResponseWrapper";

const MapsPage = () => {
  const mapsQuery = useMapsQuery();
  const { data: maps } = mapsQuery;
  const {
    subLabels,
    filteredMaps,
    subLabelFilter,
    setSubLabelFilter,
    sort,
    setSort,
  } = useMapFilterAndSorter(maps);

  return (
    <ApiResponseWrapper
      query={mapsQuery}
      emptyMessage="No maps found."
      errorMessage="Oops, something unexpected happened. Please try again later or contact support at 555-5555."
    >
      <div className="flex flex-col gap-6 max-w-5xl mx-auto">
        <div className="flex flex-wrap items-end justify-center gap-4">
          <MapFilter
            subLabels={subLabels}
            value={subLabelFilter}
            onValueChange={setSubLabelFilter}
          />
          <MapSorter value={sort} onValueChange={setSort} />
        </div>
        <MapCardsGrid maps={filteredMaps} />
      </div>
    </ApiResponseWrapper>
  );
};

export default MapsPage;
