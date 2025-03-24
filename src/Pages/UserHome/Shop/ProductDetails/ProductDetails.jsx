/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom"; // Import useParams to get the product ID
import { ChevronLeft, ChevronRight, Home, Share2 } from "lucide-react";
import axiosSecure from "../../../../Hooks/AsiosSecure"; // Ensure this is correctly configured

export default function ShopDetails() {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null); // State to hold product details
  const [relatedProducts, setRelatedProducts] = useState([]); // State to hold related products
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState("750 mm x 450 mm"); // Default size
  const [quantity, setQuantity] = useState(1); // Quantity starts from 1
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [categorizedProducts, setCategorizedProducts] = useState({});
  const [categories, setCategories] = useState({});

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch product details
        const productResponse = await axiosSecure.get(`/products/${id}`);
        const productData = productResponse.data.product;
        setProduct(productData);

        // Fetch all products
        const relatedResponse = await axiosSecure.get(`/products`);
        const allProducts = Array.isArray(relatedResponse.data.products)
          ? relatedResponse.data.products
          : [];

        // Filter related products to match the same category
        const filteredProducts = allProducts.filter((p) => {
          return (
            p.id !== parseInt(id) && p.category_id === productData.category_id
          );
        });

        setRelatedProducts(filteredProducts);
        // Fetch categories
        const categoryResponse = await axiosSecure.get(`/product-categories`);

        const categoriesMap = categoryResponse.data.reduce((acc, cat) => {
          acc[cat.id] = cat.category_name.toLowerCase();
          return acc;
        }, {});
        setCategories(categoriesMap);

        // Categorize products
        categorizeProducts(filteredProducts, categoriesMap);
        categorizeProducts(filteredProducts, categories);
      } catch (error) {
        setError("Failed to fetch product details: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  // Function to categorize products based on category_id
  const categorizeProducts = (products, categories) => {
    const categorized = {};

    products.forEach((product) => {
      const categoryName = categories[product.category_id] || "Uncategorized";
      if (!categorized[categoryName]) {
        categorized[categoryName] = [];
      }
      categorized[categoryName].push(product);
    });

    setCategorizedProducts(categorized);
  };

  // Destructure product details for easier access
  const {
    title,
    description,
    primary_image,
    features = [],
    dimensions = [], // Default to empty array to avoid undefined
    manufacturer = {},
  } = product || {}; // Ensure product is not null before destructuring

  // Set default selected size if dimensions are available
  useEffect(() => {
    if (dimensions.length > 0) {
      setSelectedSize(`${dimensions[0].width} mm x ${dimensions[0].height} mm`);
    }
  }, [dimensions]);

  // Handle loading, error, and product not found states
  if (loading) {
    return <div>Loading...</div>; // Loading state
  }

  if (error) {
    return <p>{error}</p>; // Display error message
  }

  if (!product) {
    return <p>Product not found.</p>; // Handle case where product is not found
  }

  // Get the price based on the selected dimension
  const selectedDimension = dimensions.find(
    (dim) => `${dim.width} mm x ${dim.height} mm` === selectedSize
  );
  const price = selectedDimension ? parseFloat(selectedDimension.price) : 0; // Parse the price as a number

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm mb-8 text-gray-500">
        <Home size={16} />
        <span>You are here:</span>
        <span>Home</span>
        <span>/</span>
        <span>Products</span>
        <span>/</span>
        <span className="text-gray-900">{title}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square border rounded-lg">
            <img
              src={
                primary_image
                  ? `${
                      import.meta.env.VITE_REACT_APP_API_BASE_URL
                    }/${primary_image}`
                  : "/placeholder.svg"
              }
              alt={title}
              className="rounded-lg w-full h-96"
            />
            <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow">
              <Share2 size={20} />
            </button>
          </div>

          {/* Thumbnails */}
          <div className="relative">
            <div className="flex space-x-4 overflow-x-auto py-2">
              {dimensions.map((dim, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-24 aspect-square border rounded-lg"
                >
                  <img
                    src={
                      primary_image
                        ? `${
                            import.meta.env.VITE_REACT_APP_API_BASE_URL
                          }/${primary_image}`
                        : "/placeholder.svg"
                    }
                    alt={`Thumbnail ${index + 1}`}
                    className="rounded-lg"
                  />
                </div>
              ))}
            </div>
            <button className="absolute left-0 top-1/2 -translate-y-1/2 p-1 bg-white rounded-full shadow">
              <ChevronLeft size={20} />
            </button>
            <button className="absolute right-0 top-1/2 -translate-y-1/2 p-1 bg-white rounded-full shadow">
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="flex flex-col justify-center sm:flex-row gap-4">
            <Link to={`/configurator/doors`}>
              <button className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600">
                Configure Now
              </button>
            </Link>
            <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
              Add to Cart
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div className="border-b pb-6">
            <h1 className="text-3xl font-bold mb-4">{title}</h1>
            <p className="text-gray-600">{description}</p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Key Features:</h3>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-teal-500 mr-2">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Standard Sizes</h3>
            <div className="space-y-2">
              {dimensions.map((dim) => (
                <label key={dim.height} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="size"
                    value={`${dim.width} mm x ${dim.height} mm`}
                    checked={
                      selectedSize === `${dim.width} mm x ${dim.height} mm`
                    }
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="text-teal-500"
                  />
                  <span>{`${dim.width} mm x ${dim.height} mm`}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <h3 className="font-semibold">Quantity</h3>
              <div className="flex items-center border rounded">
                <button
                  className="px-3 py-1 border-r"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className="px-4">{quantity}</span>
                <button
                  className="px-3 py-1 border-l"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-2xl font-bold">
            <span className="text-gray-400 line-through">$40.00</span>
            <span>${price.toFixed(2)}</span>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-lg font-semibold mb-1">Sold by</h3>
                <p className="text-xl">{manufacturer.company_name}</p>
              </div>
              <button className="flex items-center text-blue-600 gap-2">
                <span className="i-[message-square] w-5 h-5" />
                Chat Now
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div>
                <div className="text-xl font-bold mb-1">85%</div>
                <div className="text-sm text-gray-600">
                  Positive Seller Ratings
                </div>
              </div>
              <div>
                <div className="text-xl font-bold mb-1">99%</div>
                <div className="text-sm text-gray-600">Ship On Time</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Not Enough data</div>
                <div className="text-sm text-gray-600">Chat Response Rate</div>
              </div>
            </div>

            <button className="w-full py-2 text-blue-600 font-medium">
              GO TO STORE
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        {Object.entries(categorizedProducts).map(([category, products]) => (
          <div key={category} className="mb-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {products.map((relatedProduct) => (
                <Link
                  to={`/shop/${relatedProduct.id}`}
                  key={relatedProduct.id}
                  className="group"
                >
                  {" "}
                  <div
                    key={relatedProduct.id}
                    className="border rounded-lg p-4 w-48 h-64 flex flex-col"
                  >
                    <div className="w-full h-36 relative mb-4">
                      <img
                        src={
                          relatedProduct.primary_image
                            ? `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/${
                                relatedProduct.primary_image
                              }`
                            : "/placeholder.svg"
                        }
                        alt={relatedProduct.title}
                        className="rounded-lg"
                      />
                    </div>
                    <h3 className="font-semibold mb-2 text-center flex-grow">
                      {relatedProduct.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 line-through">$40.00</span>
                      <span className="font-bold">
                        ${relatedProduct.dimensions[0].price}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Product Reviews</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="text-4xl font-bold">4.5</div>
              <div className="flex text-yellow-400">
                {"★★★★☆".split("").map((star, i) => (
                  <span key={i}>{star}</span>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-4">
                  <span className="w-4">{rating}</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full"
                      style={{
                        width:
                          rating === 5 ? "80%" : rating === 4 ? "15%" : "5%",
                      }}
                    />
                  </div>
                  <span className="w-8 text-sm text-gray-500">
                    {rating === 5 ? "2623" : rating === 4 ? "38" : "4"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="flex space-x-4 mb-6">
              {["All Reviews", "With Photo & Video", "With Description"].map(
                (tab) => (
                  <button
                    key={tab}
                    className={`px-4 py-2 rounded-full ${
                      activeTab === tab.toLowerCase().replace(/\s+/g, "-")
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100"
                    }`}
                    onClick={() =>
                      setActiveTab(tab.toLowerCase().replace(/\s+/g, "-"))
                    }
                  >
                    {tab}
                  </button>
                )
              )}
            </div>

            <div className="space-y-6">
              {[1, 2, 3].map((review) => (
                <div key={review} className="border-b pb-6">
                  <div className="flex text-yellow-400 mb-2">
                    {"★★★★★".split("").map((star, i) => (
                      <span key={i}>{star}</span>
                    ))}
                  </div>
                  <p className="mb-4">This is an amazing product I have.</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full" />
                      <span>John Steward</span>
                    </div>
                    <span>January 2, 2025 03:29 PM</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center space-x-2 mt-6">
              <button className="p-2 border rounded">
                <ChevronLeft size={16} />
              </button>
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  className={`w-8 h-8 rounded ${
                    currentPage === page ? "bg-gray-900 text-white" : "border"
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button className="p-2 border rounded">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
