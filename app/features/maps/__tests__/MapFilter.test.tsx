import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MapFilter } from "../MapFilter";

describe("MapFilter", () => {
  it('shows "All sources" when nothing is selected', () => {
    render(
      <MapFilter subLabels={["Source A", "Source B"]} value={[]} onValueChange={jest.fn()} />,
    );

    expect(
      screen.getByRole("button", { name: "Filter By: All sources" }),
    ).toBeInTheDocument();
  });

  it("shows a single selected source label", () => {
    render(
      <MapFilter
        subLabels={["Source A", "Source B"]}
        value={["Source B"]}
        onValueChange={jest.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Filter By: Source B" }),
    ).toBeInTheDocument();
  });

  it("shows a count when multiple sources are selected", () => {
    render(
      <MapFilter
        subLabels={["Source A", "Source B"]}
        value={["Source A", "Source B"]}
        onValueChange={jest.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Filter By: 2 sources selected" }),
    ).toBeInTheDocument();
  });

  it("adds a source when an option is selected", async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();

    render(
      <MapFilter
        subLabels={["Source A", "Source B"]}
        value={["Source A"]}
        onValueChange={onValueChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Filter By: Source A" }));
    await user.click(screen.getByRole("option", { name: "Source B" }));

    expect(onValueChange).toHaveBeenCalledWith(["Source A", "Source B"]);
  });

  it("removes a source when a selected option is toggled", async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();

    render(
      <MapFilter
        subLabels={["Source A", "Source B"]}
        value={["Source A", "Source B"]}
        onValueChange={onValueChange}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "Filter By: 2 sources selected" }),
    );
    await user.click(screen.getByRole("option", { name: "Source A" }));

    expect(onValueChange).toHaveBeenCalledWith(["Source B"]);
  });
});
