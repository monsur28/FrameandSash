import { useState } from "react";
import { ShopCard } from "./ShopCard"; // Ensure this component is defined

export function ShopGrid({ products }) {
  const [sortBy] = useState("default");

  // Handle sorting of products based on the selected criteria
  const sortedProducts = [...products]; // Create a shallow copy to avoid mutating state

  if (sortBy === "priceLowToHigh") {
    sortedProducts.sort(
      (a, b) => a.dimensions[0].price - b.dimensions[0].price
    );
  } else if (sortBy === "priceHighToLow") {
    sortedProducts.sort(
      (a, b) => b.dimensions[0].price - a.dimensions[0].price
    );
  } else if (sortBy === "rating") {
    sortedProducts.sort((a, b) => b.rating - a.rating);
  }

  if (!products || products.length === 0) {
    return <p>No products available in this category.</p>;
  }

  return (
    <div className="flex-1">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
        {sortedProducts.map((product) => (
          <ShopCard {...product} key={product.id} />
        ))}
      </div>
    </div>
  );
}
