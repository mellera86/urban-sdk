import { NO_DATA_COLOR, type ChoroplethBucket } from "./map-choropleth-legend";

type MapLegendProps = {
  valueProperty?: string;
  buckets: ChoroplethBucket[];
};

const MapLegend = ({ valueProperty, buckets }: MapLegendProps) => {
  const title = valueProperty ? `Value: ${valueProperty}` : "Value scale";

  return (
    <div
      className="rounded-lg border border-border/60 bg-background/95 p-3 text-sm shadow-sm"
      role="group"
      aria-label={title}
    >
      <p className="mb-2 font-medium text-foreground">{title}</p>
      <ul className="flex flex-wrap gap-x-4 gap-y-2">
        <li className="flex items-center gap-2">
          <span
            className="size-3 shrink-0 rounded-sm border border-border/80"
            style={{ backgroundColor: NO_DATA_COLOR }}
            aria-hidden
          />
          <span>No data</span>
        </li>
        {buckets.map((bucket) => (
          <li key={bucket.label} className="flex items-center gap-2">
            <span
              className="size-3 shrink-0 rounded-sm border border-border/80"
              style={{ backgroundColor: bucket.color }}
              aria-hidden
            />
            <span>{bucket.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export { MapLegend };
