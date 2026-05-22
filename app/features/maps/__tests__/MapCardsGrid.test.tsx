import { render, screen } from "@testing-library/react";
import { MapCardsGrid } from "../MapCardsGrid";
import { sampleMaps } from "./fixtures";

jest.mock("../MapCard", () => ({
  MapCard: ({ map }: { map: { label: string } }) => (
    <article data-testid="map-card">{map.label}</article>
  ),
}));

describe("MapCardsGrid", () => {
  it("renders a list item for each map", () => {
    render(<MapCardsGrid maps={sampleMaps} />);

    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getAllByTestId("map-card")).toHaveLength(3);
    expect(screen.getByText("Alpha Map")).toBeInTheDocument();
    expect(screen.getByText("Beta Map")).toBeInTheDocument();
    expect(screen.getByText("Gamma Map")).toBeInTheDocument();
  });

  it("renders an empty grid when there are no maps", () => {
    render(<MapCardsGrid maps={[]} />);

    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });
});
