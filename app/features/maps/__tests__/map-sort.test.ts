import {
  DEFAULT_MAP_SORT,
  getSortOptionLabel,
  MAP_SORT_OPTIONS,
} from "../map-sort";

describe("map-sort", () => {
  it("exposes a default sort of label ascending", () => {
    expect(DEFAULT_MAP_SORT).toBe("label-asc");
  });

  it("maps each sort option to a display label", () => {
    for (const option of MAP_SORT_OPTIONS) {
      expect(getSortOptionLabel(option.value)).toBe(option.label);
    }
  });
});
