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

  const resultsMessage =
    filteredMaps.length === 1
      ? "Showing 1 map"
      : `Showing ${filteredMaps.length} maps`;

  return (
    <ApiResponseWrapper
      query={mapsQuery}
      emptyMessage="No maps found."
      errorMessage="Oops, something unexpected happened. Please try again later or contact support at 555-5555."
    >
      <main id="main-content" className="flex mx-auto max-w-5xl flex-col gap-6">
        <header className="mt-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome the Urban SDK map viewer!
          </h1>
        </header>

        <div className="flex flex-wrap items-end justify-center gap-4 text-slate-100 [&_label]:text-slate-100">
          <MapFilter
            subLabels={subLabels}
            value={subLabelFilter}
            onValueChange={setSubLabelFilter}
          />
          <MapSorter value={sort} onValueChange={setSort} />
        </div>

        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {resultsMessage}
        </p>

        <MapCardsGrid maps={filteredMaps} />
      </main>
    </ApiResponseWrapper>
  );
};

export default MapsPage;
