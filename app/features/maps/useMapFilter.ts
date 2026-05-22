"use client";

import { Map } from "@models/maps";
import { useMemo, useState } from "react";

function useMapFilter(maps: Map[] | undefined) {
  const [subLabelFilter, setSubLabelFilter] = useState<string[]>([]);

  const subLabels = useMemo(
    () => [...new Set((maps ?? []).map((map) => map.subLabel))].sort(),
    [maps],
  );

  const filteredMaps = useMemo(() => {
    if (subLabelFilter.length === 0) return maps ?? [];
    return (maps ?? []).filter((map) => subLabelFilter.includes(map.subLabel));
  }, [maps, subLabelFilter]);

  return {
    subLabels,
    filteredMaps,
    subLabelFilter,
    setSubLabelFilter,
  };
}

export { useMapFilter };
