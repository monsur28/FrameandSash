import { Link } from "react-router-dom";
import { ProductCard } from "../../../../../Shared/ProductCard";
import axiosSecure from "../../../../../Hooks/AsiosSecure";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";

export default function BestSellingProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true); // Start loading
        const response = await axiosSecure.get("/products");
        setProducts(response.data.products); // Assuming response data is an array of products
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchProducts();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) {
    return (
      <>
        <Loader />
      </>
    );
  }

  if (error) {
    return <p>Error loading products: {error}</p>;
  }
  return (
    <div className=" px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Best Selling Products
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our best-selling doors and windows, trusted for their
          exceptional quality, modern design, and lasting durability. Perfect
          for enhancing any space.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>

      <div className="text-center mt-12">
        <Link to="/shop">
          <button className="text-primary hover:text-blue-700 font-medium inline-flex items-center">
            View All Products
            <svg
              className="w-4 h-4 ml-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </Link>
      </div>
    </div>
  );
}
