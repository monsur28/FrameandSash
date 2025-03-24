import { useState, useEffect } from "react";
import axiosSecure from "../../../../Hooks/AsiosSecure"; // Assuming axiosSecure is set up correctly
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

export default function ConfiguratorLanding() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [manufacturersData, setManufacturersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabCategoryMap, setTabCategoryMap] = useState({
    // Initialize tabCategoryMap
    All: "all", // Special key for "All" tab
    Doors: null,
    Windows: null,
  });
  const [categories, setCategories] = useState([]); // State to store categories from API

  useEffect(() => {
    const fetchCategoriesAndManufacturers = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Fetch Product Categories to build dynamic tabCategoryMap
        const categoriesResponse = await axiosSecure.get("/product-categories"); // Assuming this endpoint returns categories with id and category_name
        const fetchedCategories = categoriesResponse.data;
        setCategories(fetchedCategories); // Store categories for "All" tab logic

        // 2. Build dynamic tabCategoryMap based on fetched categories
        const dynamicTabCategoryMap = {
          All: "all", // Still special key for "All" tab
          Doors:
            fetchedCategories.find((cat) => cat.category_name === "Doors")
              ?.id || null, // Find Doors category ID
          Windows:
            fetchedCategories.find((cat) => cat.category_name === "Windows")
              ?.id || null, // Find Windows category ID
        };
        setTabCategoryMap(dynamicTabCategoryMap);

        let currentCategoryId = dynamicTabCategoryMap[activeTab];

        if (currentCategoryId === "all") {
          // "All" tab logic: Fetch manufacturers for ALL categories
          let allManufacturers = [];
          for (const category of fetchedCategories) {
            const manufacturersResponse = await axiosSecure.get(
              `/configurator-manufacturers/${category.id}`
            );
            allManufacturers = allManufacturers.concat(
              manufacturersResponse.data.manufacturers || []
            ); // Concatenate arrays
          }
          console.log(allManufacturers);
          setManufacturersData(allManufacturers); // Set combined manufacturers data
        } else if (currentCategoryId) {
          // Specific category tab logic (Doors/Windows): Fetch manufacturers for currentCategoryId
          const manufacturersResponse = await axiosSecure.get(
            `/configurator-manufacturers/${currentCategoryId}`
          );
          console.log(manufacturersResponse.data.manufacturers);
          setManufacturersData(manufacturersResponse.data.manufacturers || []);
        } else {
          setManufacturersData([]); // No data for this category (e.g., if category ID is null)
        }

        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
        setLoading(false);
        console.error("Error fetching data:", err);
      }
    };

    fetchCategoriesAndManufacturers();
  }, [activeTab]); // Re-fetch when activeTab changes

  // Filter manufacturers - logic remains the same
  const filteredManufacturers = manufacturersData.filter((manufacturer) => {
    const matchesSearch = manufacturer.company_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    if (activeTab === "All") return matchesSearch;
    return activeTab === "Doors" || activeTab === "Windows"
      ? matchesSearch
      : false;
  });

  if (loading) {
    return <div>Loading Manufacturers...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Frame and Sash | Configurator</title>
      </Helmet>
      {/* Hero Banner - unchanged */}
      <div className="relative h-64 w-full">
        <img
          src="https://i.ibb.co.com/mjMy1bv/image-11.png"
          alt="Manufacturing facility"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30">
          <div className="relative h-full flex items-center">
            <div className="bg-white/80 mx-auto py-6 px-8 max-w-2xl text-center">
              <h1 className="text-3xl font-bold text-teal-600 mb-2">
                Doors & Windows Manufacturer List
              </h1>
              <p className="text-gray-700">
                Superhouse impact windows and Doors widely used for residential
                and commercial projects
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search - unchanged */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex space-x-4 mb-4 md:mb-0">
            {["All", "Doors", "Windows"].map((tab) => (
              <button
                key={tab}
                className={`px-6 py-2 rounded-full ${
                  activeTab === tab
                    ? "bg-gray-800 text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search by Company Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Manufacturer Grid - unchanged */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredManufacturers.map((manufacturer, index) => (
            <div
              key={`${manufacturer.id}-${index}`}
              className="border rounded-lg overflow-hidden bg-white hover:shadow-lg transition-shadow"
            >
              <div className="p-6 border-b flex justify-center items-center h-24">
                <img
                  src={`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/${
                    manufacturer.company_image
                  }`}
                  alt={`${manufacturer.company_name} logo`}
                  width={180}
                  height={80}
                  className="object-contain"
                />
              </div>
              <div className="p-6 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Price Range:</span>
                  <span className="font-medium">
                    {manufacturer.price_range || "$200-$500"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Customization:</span>
                  <span className="font-medium">
                    {manufacturer.customization || "Yes"}
                  </span>
                </div>
                <Link
                  to={`/manufacturer/${manufacturer.company_slug}/configurator-products`}
                >
                  <div className="pt-4">
                    <a
                      href="#"
                      className="inline-flex items-center text-teal-600 hover:text-teal-800"
                    >
                      Calculate Price
                      <svg
                        className="ml-1 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </a>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
