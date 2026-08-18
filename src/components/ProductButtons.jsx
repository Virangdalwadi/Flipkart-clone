import { useState } from "react";

export default function ProductButtons() {
  // Track the ID of the currently selected button
  const [activeId, setActiveId] = useState(null);

  // Mock array of 10 dynamic products
  const products = Array.from({ length: 10 }, (_, i) => ({
    id: `prod-${i + 1}`,
    name: `Product ${i + 1}`,
  }));

  return (
    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
      {products.map((product) => {
        const isSelected = activeId === product.id;

        return (
          <button
            key={product.id}
            onClick={() => setActiveId(product.id)}
            style={{
              padding: "10px 20px",
              backgroundColor: isSelected ? "blue" : "gray",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            {product.name} {isSelected && "(Active)"}
          </button>
        );
      })}
    </div>
  );
}
