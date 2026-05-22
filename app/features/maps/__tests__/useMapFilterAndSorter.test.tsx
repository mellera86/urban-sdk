import { renderHook, act, waitFor } from "@testing-library/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMapFilterAndSorter } from "../useMapFilterAndSorter";
import { sampleMaps } from "./fixtures";

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

const mockReplace = jest.fn();
const mockUseSearchParams = jest.mocked(useSearchParams);
const mockUseRouter = jest.mocked(useRouter);
const mockUsePathname = jest.mocked(usePathname);

const mockRouter = {
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  push: jest.fn(),
  replace: mockReplace,
  prefetch: jest.fn(),
} satisfies ReturnType<typeof useRouter>;

function setSearchParams(query: string) {
  mockUseSearchParams.mockReturnValue(new URLSearchParams(query) as ReturnType<
    typeof useSearchParams
  >);
}

function getLastReplaceSearchParams() {
  const url = mockReplace.mock.calls.at(-1)?.[0] as string;
  return new URL(url, "http://localhost").searchParams;
}

describe("useMapFilterAndSorter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue(mockRouter);
    mockUsePathname.mockReturnValue("/");
    setSearchParams("");
  });

  it("returns unique sorted subLabels from maps", () => {
    const { result } = renderHook(() => useMapFilterAndSorter(sampleMaps));

    expect(result.current.subLabels).toEqual(["Source A", "Source B"]);
  });

  it("returns all maps when no sources filter is in the URL", () => {
    const { result } = renderHook(() => useMapFilterAndSorter(sampleMaps));

    expect(result.current.subLabelFilter).toEqual([]);
    expect(result.current.filteredMaps).toHaveLength(3);
  });

  it("filters maps by sources from the URL", () => {
    setSearchParams("sources=Source%20A");

    const { result } = renderHook(() => useMapFilterAndSorter(sampleMaps));

    expect(result.current.subLabelFilter).toEqual(["Source A"]);
    expect(result.current.filteredMaps.map((map) => map.id)).toEqual([
      "map-1",
      "map-3",
    ]);
  });

  it("sorts maps by label descending from the URL", () => {
    setSearchParams("sort=label-desc");

    const { result } = renderHook(() => useMapFilterAndSorter(sampleMaps));

    expect(result.current.sort).toBe("label-desc");
    expect(result.current.filteredMaps.map((map) => map.label)).toEqual([
      "Gamma Map",
      "Beta Map",
      "Alpha Map",
    ]);
  });

  it("updates the URL when the source filter changes", () => {
    const { result } = renderHook(() => useMapFilterAndSorter(sampleMaps));

    act(() => {
      result.current.setSubLabelFilter(["Source B"]);
    });

    expect(mockReplace).toHaveBeenCalledWith(expect.stringContaining("?"), {
      scroll: false,
    });
    expect(getLastReplaceSearchParams().get("sources")).toBe("Source B");
  });

  it("omits sort from the URL when it is the default", () => {
    setSearchParams("sources=Source%20A&sort=label-desc");
    const { result } = renderHook(() => useMapFilterAndSorter(sampleMaps));

    act(() => {
      result.current.setSort("label-asc");
    });

    expect(getLastReplaceSearchParams().get("sources")).toBe("Source A");
    expect(getLastReplaceSearchParams().get("sort")).toBeNull();
  });

  it("removes invalid sources from the URL once map data is available", async () => {
    setSearchParams("sources=Unknown,Source%20A");
    renderHook(() => useMapFilterAndSorter(sampleMaps));

    await waitFor(() => {
      expect(getLastReplaceSearchParams().get("sources")).toBe("Source A");
    });
  });
});
