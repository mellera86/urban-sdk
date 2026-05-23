import {
  buildChoroplethBuckets,
  getChoroplethColor,
  NO_DATA_COLOR,
} from "../map-choropleth-legend";

const PALETTE = ["#C7D2FE", "#818CF8", "#6366F1", "#4338CA", "#312E81"] as const;

describe("buildChoroplethBuckets", () => {
  it("creates five buckets at 20% increments from min to max", () => {
    const buckets = buildChoroplethBuckets([0, 500, 2000]);

    expect(buckets).toHaveLength(5);
    expect(buckets[0]).toMatchObject({ min: 0, max: 400, color: PALETTE[0] });
    expect(buckets[1]).toMatchObject({ min: 400, max: 800 });
    expect(buckets[4]).toMatchObject({
      min: 1600,
      max: 2000,
      color: PALETTE[4],
    });
    expect(buckets[0].label).toBe("0 – 400");
    expect(buckets[4].label).toBe("1600 – 2000");
  });

  it("returns a single bucket when all values are equal", () => {
    const buckets = buildChoroplethBuckets([42, 42, 42]);

    expect(buckets).toHaveLength(1);
    expect(buckets[0]).toMatchObject({
      min: 42,
      max: 42,
      label: "42 – 42",
      color: PALETTE[4],
    });
  });

  it("appends percent suffix for Percent properties", () => {
    const buckets = buildChoroplethBuckets([0, 100], "PercentOnTime");

    expect(buckets[0].label).toBe("0% – 20%");
    expect(buckets[4].label).toBe("80% – 100%");
  });
});

describe("getChoroplethColor", () => {
  const buckets = buildChoroplethBuckets([0, 100, 2000]);

  it("returns no-data color for null values", () => {
    expect(getChoroplethColor(null, buckets)).toBe(NO_DATA_COLOR);
  });

  it("maps values into the correct palette step", () => {
    expect(getChoroplethColor(0, buckets)).toBe(PALETTE[0]);
    expect(getChoroplethColor(2000, buckets)).toBe(PALETTE[4]);
    expect(getChoroplethColor(1500, buckets)).toBe(PALETTE[3]);
  });
});
