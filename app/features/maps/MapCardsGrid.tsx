"use client";

import { MapCard } from "./MapCard";
import { Map } from "@models/maps";

const MapCardsGrid = ({ maps }: { maps: Map[] }) => {
  return (
    <div role="list" className="flex flex-wrap justify-center gap-6">
      {maps.map((map) => (
        <div
          role="listitem"
          key={`map-card-${map.id}-${map.imageUrl}`}
          className="min-w-0 w-[clamp(16rem,100%,18rem)]"
        >
          <MapCard map={map} />
        </div>
      ))}
    </div>
  );
};

export { MapCardsGrid };
