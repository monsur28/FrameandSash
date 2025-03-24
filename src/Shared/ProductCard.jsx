import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosSecure from "../Hooks/AsiosSecure";

export function ProductCard({
  id,
  title,
  // description,
  rating,
  primary_image,
  dimensions = [],
  final_price,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDimensionIndex, setSelectedDimensionIndex] = useState(null);
  const [quantity, setQuantity] = useState(1);
  // const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (isLoading) return;

    const token = sessionStorage.getItem("jwtToken");
    if (!token) {
      toast.warning("Please login to add items to cart");
      navigate("/register");
      return;
    }

    setIsLoading(true);

    if (selectedDimensionIndex === null) {
      toast.warning("Please select a dimension.");
      setIsLoading(false);
      return;
    }

    const payload = {
      product_type: "pre-made",
      quantity: quantity,
      product_id: id,
      selected_dimension_index: selectedDimensionIndex,
      price: final_price,
    };

    try {
      const response = await axiosSecure.post(`/cart`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.status === "success") {
        toast.success("Item added to cart successfully!");
        setIsModalOpen(false);
        setSelectedDimensionIndex(null);
        setQuantity(1);
      }
    } catch (error) {
      console.error("Cart addition error:", error);
      toast.error(error.response?.data?.error || "Failed to add item to cart");
    } finally {
      setIsLoading(false);
    }
  };

  // const toggleDescription = () => {
  //   setIsDescriptionExpanded(!isDescriptionExpanded);
  // };

  return (
    <div className="flex items-center justify-center overflow-auto my-3">
      <div className="w-80 border border-blue-200 rounded-lg shadow-md p-4">
        <div className="relative">
          <span className="absolute top-2 left-2 bg-orange-400 text-white text-xs font-semibold px-2 py-1 rounded-full">
            -20%
          </span>

          <img
            src={
              primary_image
                ? `${
                    import.meta.env.VITE_REACT_APP_API_BASE_URL
                  }/${primary_image}`
                : "/placeholder.svg"
            }
            alt={title}
            className="object-contain w-full h-[270px]"
          />
        </div>

        <div className="mt-4">
          <Link to={`/shop/${id}`}>
            <h3 className="text-gray-800 font-medium text-base">{title}</h3>
          </Link>
          {/* <p className="text-gray-500 text-sm mt-1">
            {isDescriptionExpanded
              ? description
              : `${description.slice(0, 50)}...`}
            <button className="text-blue-500 ml-1" onClick={toggleDescription}>
              {isDescriptionExpanded ? "See less" : "See more"}
            </button>
          </p> */}
          <div className="flex space-x-1 text-orange-500 text-sm mt-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 ${
                  i < rating ? "fill-current" : "text-gray-300"
                }`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927C9.349 2.2 10.651 2.2 10.951 2.927l1.558 3.779 4.004.37c.85.079 1.194 1.139.572 1.724l-2.922 2.658.87 3.917c.181.816-.68 1.448-1.419 1.034L10 13.01l-3.614 1.96c-.74.414-1.6-.218-1.419-1.034l.87-3.917-2.922-2.658c-.622-.585-.278-1.645.572-1.724l4.004-.37L9.049 2.927z" />
              </svg>
            ))}
          </div>
          <div className="flex items-end justify-between">
            <div className="flex items-baseline space-x-2 mt-2">
              <span className="text-blue-600 text-xl font-semibold">
                ${final_price}
              </span>
              <span className="text-gray-400 text-sm line-through">
                $1500.00
              </span>
            </div>
            <button
              className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow text-white"
              onClick={() => setIsModalOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                <path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                <path d="M17 17h-11v-14h-2" />
                <path d="M6 5l14 1l-1 7h-13" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Select Dimensions</h2>
            {dimensions.length > 0 ? (
              dimensions.map((dimension, index) => (
                <div
                  key={`${dimension.height}-${dimension.width}`}
                  className="flex items-center mb-2"
                >
                  <input
                    type="radio"
                    checked={selectedDimensionIndex === index}
                    onChange={() => setSelectedDimensionIndex(index)}
                    className="mr-2"
                  />
                  <label>
                    {dimension.height} mm x {dimension.width} mm - $
                    {dimension.price}
                  </label>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No dimensions available.</p>
            )}
            <div className="mb-4">
              <label className="block mb-1">Quantity:</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border rounded p-2 w-full"
                min="1"
              />
            </div>
            <div className="flex justify-end">
              <button
                className="mr-2 bg-gray-300 text-black px-4 py-2 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-teal-500 text-white px-4 py-2 rounded"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
