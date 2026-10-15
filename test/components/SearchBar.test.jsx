import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import SearchBar from "../../src/components/SearchBar";

const suggestions = [
  { id: 1, title: "Phone case" },
  { id: 2, title: "Phone charger" },
];

function renderSearchBar(overrides = {}) {
  const props = {
    value: "phone",
    onChange: vi.fn(),
    onSubmitSuccess: vi.fn(),
    onClear: vi.fn(),
    suggestions,
    ...overrides,
  };
  render(<SearchBar {...props} />);
  return props;
}

describe("product search suggestion keyboard navigation", () => {
  test("moves through suggestions with arrow keys and selects with Enter", () => {
    const props = renderSearchBar();
    const input = screen.getByRole("combobox");
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input).toHaveAttribute("aria-activedescendant", "product-suggestion-0");
    expect(screen.getByRole("option", { name: "Phone case" })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input).toHaveAttribute("aria-activedescendant", "product-suggestion-1");
    fireEvent.keyDown(input, { key: "Enter" });

    expect(props.onChange).toHaveBeenCalledWith("Phone charger");
    expect(props.onSubmitSuccess).toHaveBeenCalledWith("Phone charger");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  test("wraps ArrowUp to the last suggestion and Escape closes the list", () => {
    renderSearchBar();
    const input = screen.getByRole("combobox");
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: "ArrowUp" });

    expect(input).toHaveAttribute("aria-activedescendant", "product-suggestion-1");

    fireEvent.keyDown(input, { key: "Escape" });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  test("Enter submits the typed query when no suggestion is selected", () => {
    const props = renderSearchBar();
    const input = screen.getByRole("combobox");
    fireEvent.focus(input);
    fireEvent.submit(input.closest("form"));

    expect(props.onSubmitSuccess).toHaveBeenCalledWith("phone");
  });
});
