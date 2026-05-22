"use client";

import { useMapsQuery } from "@api-hooks/maps";
import { MapCardsGrid } from "./MapCardsGrid";
import { MapFilter } from "./MapFilter";
import { useMapFilter } from "./useMapFilter";
import { ApiResponseWrapper } from "@components/Pages/ApiResponseWrapper";

const MapsPage = () => {
  const mapsQuery = useMapsQuery();
  const { data: maps } = mapsQuery;
  const { subLabels, filteredMaps, subLabelFilter, setSubLabelFilter } =
    useMapFilter(maps);

  return (
    <ApiResponseWrapper
      query={mapsQuery}
      emptyMessage="No maps found."
      errorMessage="Oops, something unexpected happened. Please try again later or contact support at 555-5555."
    >
      <div className="flex flex-col gap-6 max-w-5xl mx-auto">
        <MapFilter
          subLabels={subLabels}
          value={subLabelFilter}
          onValueChange={setSubLabelFilter}
        />
        <MapCardsGrid maps={filteredMaps} />
      </div>
    </ApiResponseWrapper>
  );
};

export default MapsPage;
