type MapSortOption = "label-asc" | "label-desc" | "source-asc" | "source-desc";

const DEFAULT_MAP_SORT: MapSortOption = "label-asc";

const MAP_SORT_OPTIONS: { value: MapSortOption; label: string }[] = [
  { value: "label-asc", label: "Name (A–Z)" },
  { value: "label-desc", label: "Name (Z–A)" },
  { value: "source-asc", label: "Source (A–Z)" },
  { value: "source-desc", label: "Source (Z–A)" },
];

function getSortOptionLabel(value: MapSortOption) {
  return MAP_SORT_OPTIONS.find((option) => option.value === value)?.label ?? "Sort";
}

export {
  DEFAULT_MAP_SORT,
  getSortOptionLabel,
  MAP_SORT_OPTIONS,
  type MapSortOption,
};
