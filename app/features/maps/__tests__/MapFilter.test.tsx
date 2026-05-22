import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MapFilter } from "../MapFilter";

describe("MapFilter", () => {
  it('shows "All sources" when nothing is selected', () => {
    render(
      <MapFilter subLabels={["Source A", "Source B"]} value={[]} onValueChange={jest.fn()} />,
    );

    expect(screen.getByRole("combobox")).toHaveTextContent("All sources");
  });

  it("shows a single selected source label", () => {
    render(
      <MapFilter
        subLabels={["Source A", "Source B"]}
        value={["Source B"]}
        onValueChange={jest.fn()}
      />,
    );

    expect(screen.getByRole("combobox")).toHaveTextContent("Source B");
  });

  it("shows a count when multiple sources are selected", () => {
    render(
      <MapFilter
        subLabels={["Source A", "Source B"]}
        value={["Source A", "Source B"]}
        onValueChange={jest.fn()}
      />,
    );

    expect(screen.getByRole("combobox")).toHaveTextContent("2 sources selected");
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

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByText("Source B"));

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

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByText("Source A"));

    expect(onValueChange).toHaveBeenCalledWith(["Source B"]);
  });
});
