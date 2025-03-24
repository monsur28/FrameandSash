import { useState } from "react";

export function ShopFilters() {
  const [priceRange, setPriceRange] = useState([0, 500]);

  const handlePriceChange = (e) => {
    const value = Number(e.target.value);
    const newRange = [...priceRange];

    // Adjust the range based on the current input
    if (e.target.name === "min") {
      newRange[0] = Math.min(value, newRange[1]); // Ensure min doesn't exceed max
    } else {
      newRange[1] = Math.max(value, newRange[0]); // Ensure max doesn't fall below min
    }

    setPriceRange(newRange);
  };

  return (
    <div className="w-64 p-4 border-r">
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="flex items-center justify-between mb-2">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
        <div className="relative">
          <input
            type="range"
            min="0"
            max="500"
            value={priceRange[1]}
            name="max"
            onChange={handlePriceChange}
            className="w-full h-2 bg-teal-300 rounded-lg cursor-pointer"
            style={{
              position: "absolute",
              top: "0",
              marginTop: "-12px",
              zIndex: 2,
            }} // Overlay effect
          />
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Availability</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded text-teal-500" />
            <span>In Stock</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded text-teal-500" />
            <span>Pre Order</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded text-teal-500" />
            <span>Upcoming</span>
          </label>
        </div>
      </div>
    </div>
  );
}
