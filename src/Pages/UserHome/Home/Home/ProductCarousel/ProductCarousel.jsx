import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axiosSecure from "../../../../../Hooks/AsiosSecure";

export default function ProductCarousel() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosSecure.get("/product-categories");
        setCategories(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Navigation handler
  const handleProductClick = useCallback(
    (categoryId) => {
      navigate(`/shop?category=${categoryId}`);
    },
    [navigate]
  );

  // Image error fallback
  const handleImageError = (e) => {
    e.target.src = "/placeholder.svg";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4" role="alert">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-[#00BCD4]">
        Explore Products
      </h2>

      <div className="relative">
        <button
          onClick={() =>
            setCurrentIndex(
              (prev) => (prev - 1 + categories.length) % categories.length
            )
          }
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg"
          aria-label="Previous products"
        >
          <ChevronLeft className="h-6 w-6 text-gray-600" />
        </button>

        <div className="overflow-hidden w-full">
          <div className="flex gap-6 transition-transform duration-300 ease-in-out">
            {categories.map((category, index) => {
              return (
                <div
                  key={category.id}
                  className="flex-none w-full sm:w-[200px] lg:w-[300px] cursor-pointer"
                  onClick={() => handleProductClick(category.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleProductClick(category.id);
                  }}
                >
                  <div className="relative aspect-square">
                    <img
                      src={`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/${
                        category.category_image
                      }`}
                      alt={category.category_name}
                      className="object-cover w-full h-full rounded-md"
                      loading={index === 0 ? "eager" : "lazy"}
                      onError={handleImageError}
                    />
                  </div>
                  <h3 className="mt-3 text-center text-gray-800 font-medium">
                    {category.category_name}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={() =>
            setCurrentIndex((prev) => (prev + 1) % categories.length)
          }
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg"
          aria-label="Next products"
        >
          <ChevronRight className="h-6 w-6 text-gray-600" />
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {categories.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? "bg-[#00BCD4]" : "bg-gray-300"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
