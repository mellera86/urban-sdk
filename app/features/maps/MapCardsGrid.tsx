import { MapCard } from "./MapCard";
import { Map } from "@models/maps";

const MapCardsGrid = ({ maps }: { maps: Map[] }) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {maps.map((map) => (
        <MapCard
          key={`map-card-${map.id}-${map.imageUrl}`}
          map={map}
        />
      ))}
    </div>
  );
};

export { MapCardsGrid };
