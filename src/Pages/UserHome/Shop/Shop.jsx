import { useState, useEffect } from "react";
import { ShopGrid } from "../../../Shared/ShopGrid";
import axiosSecure from "../../../Hooks/AsiosSecure";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function Shop() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const initialCategory = params.get("category") || "all";
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [maxPrice, setMaxPrice] = useState(500);
  const [showFilters, setShowFilters] = useState(false);

  const handlePriceChange = (e) => {
    const value = Number(e.target.value);
    const newRange = [...priceRange];

    if (e.target.name === "min") {
      newRange[0] = Math.min(value, newRange[1]);
    } else {
      newRange[1] = Math.max(value, newRange[0]);
    }

    setPriceRange(newRange);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          axiosSecure.get("/products"),
          axiosSecure.get("/product-categories"),
        ]);
        setProducts(productsResponse.data.products);
        setCategories(categoriesResponse.data);

        const allPrices = productsResponse.data.products.flatMap((product) =>
          product.dimensions.map((dimension) => Number(dimension.price))
        );
        setMaxPrice(Math.max(...allPrices, 500));
        setPriceRange([0, Math.max(...allPrices, 500)]);
      } catch (error) {
        setError("Failed to fetch data: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  const filteredProducts = products.filter((product) => {
    const categoryMatches =
      selectedCategory === "all" ||
      String(product.category_id) === selectedCategory;

    const priceMatches = product.dimensions.some((dimension) => {
      const price = Number(dimension.price);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    return categoryMatches && priceMatches;
  });

  if (loading) return <div className="text-center py-6">Loading...</div>;
  if (error) return <p className="text-center py-6 text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-6">
      <Helmet>
        <title>Shop | Frame and Sash</title>
      </Helmet>
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between w-full py-4 px-4">
        {/* Breadcrumb Navigation - Left Aligned */}
        <nav aria-label="breadcrumb" className="flex items-center">
          <ol className="flex h-8 space-x-2 text-gray-600">
            <li className="flex items-center">
              <a
                rel="noopener noreferrer"
                href="/"
                title="Back to homepage"
                className="hover:underline flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5 pr-1 text-gray-400"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
                Home
              </a>
            </li>
            <li className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                aria-hidden="true"
                fill="currentColor"
                className="w-2 h-2 mt-1 transform rotate-90 fill-current text-gray-600"
              >
                <path d="M32 30.031h-32l16-28.061z"></path>
              </svg>
              <a
                rel="noopener noreferrer"
                href="#"
                className="flex items-center px-1 capitalize hover:underline cursor-default"
              >
                Shop
              </a>
            </li>
          </ol>
        </nav>

        {/* Title - Centered */}
        <h1 className="text-xl font-semibold text-center absolute left-1/2 transform -translate-x-1/2">
          Shop Our Products
        </h1>

        {/* Empty div for spacing */}
        <div className="w-40"></div>
      </div>

      {/* Title and Categories in One Row */}
      <div className="flex flex-wrap items-center justify-between py-2 px-2">
        {/* Categories in the Center */}
        <div className="flex overflow-x-auto gap-2 py-4 px-4 whitespace-nowrap flex-1 justify-center">
          <button
            key="all"
            className={`px-6 py-3 text-lg font-semibold rounded-lg transition duration-200 ${
              selectedCategory === "all"
                ? "bg-teal-500 text-white"
                : "hover:bg-teal-200"
            }`}
            onClick={() => setSelectedCategory("all")}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`px-6 py-3 text-lg font-semibold rounded-lg transition duration-200 ${
                selectedCategory === String(category.id)
                  ? "bg-teal-500 text-white"
                  : "hover:bg-teal-200"
              }`}
              onClick={() => setSelectedCategory(String(category.id))}
            >
              {category.category_name}
            </button>
          ))}
        </div>
      </div>

      {/* Toggle Filters for Mobile */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="md:hidden block bg-teal-500 text-white px-4 py-2 rounded-md m-4 transition duration-200"
      >
        {showFilters ? "Hide Filters" : "Show Filters"}
      </button>

      {/* Main Shop Layout */}
      <div className="flex flex-col md:flex-row">
        {/* Sidebar Filters */}
        <div
          className={`w-full md:w-64 p-6 border-r bg-white md:block ${
            showFilters ? "block" : "hidden"
          } transition-all duration-300`}
        >
          <div className="mb-6">
            <h3 className="font-semibold text-xl mb-3">Price Range</h3>
            <div className="flex items-center justify-between mb-2">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
            <input
              type="range"
              min="0"
              max={maxPrice}
              value={priceRange[1]}
              name="max"
              onChange={handlePriceChange}
              className="w-full h-2 bg-teal-300 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <h3 className="font-semibold text-xl mb-3">Availability</h3>
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

        {/* Products Grid */}
        <div className="flex-1 px-4">
          <ShopGrid products={filteredProducts} />
        </div>
      </div>
    </div>
  );
}
