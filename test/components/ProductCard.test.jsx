import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";

function ProductCard() {
  return <h2>iPhone 15</h2>;
}

describe("ProductCard", () => {
  test("displays product name", () => {
    render(<ProductCard />);

    expect(screen.getByText("iPhone 15")).toBeInTheDocument();
  });
});
