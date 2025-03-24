import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosSecure from "../Hooks/AsiosSecure";
import { Loader } from "lucide-react";

export default function ProductPreview() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axiosSecure.get(`/admin/products/${id}`);
        setProduct(response.data.product);
      } catch (err) {
        setError(err.message || "Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="w-10 h-10 animate-spin text-primary" />
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 text-lg font-semibold">
        Error: {error}
      </div>
    );

  if (!product)
    return (
      <div className="text-center text-gray-700 text-lg font-semibold">
        No product found.
      </div>
    );

  return (
    <div className=" p-6  rounded-[24px] border-2 border-white bg-white50 backdrop-blur-16.5 shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Product Preview
      </h2>

      {/* Main Card */}
      <div className="bg-gray-100 p-6 rounded-xl shadow-md flex flex-col md:flex-row gap-6">
        {/* Product Image */}
        <div className="flex justify-center items-center">
          {product.primary_image && (
            <img
              src={`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/${
                product.primary_image
              }`}
              alt={product.title}
              className="w-72 h-72  rounded-xl shadow-lg transition-transform hover:scale-105"
            />
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 space-y-4">
          <h3 className="text-2xl font-semibold text-gray-900">
            {product.title}
          </h3>
          <p className="text-gray-600">{product.description}</p>

          {/* SKU & Quantity */}
          <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow-sm">
            <div>
              <span className="text-gray-500 text-sm">SKU</span>
              <p className="text-lg font-medium text-gray-800">{product.sku}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Quantity</span>
              <p className="text-lg font-medium text-gray-800">
                {product.quantity}
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="text-lg font-medium mb-2 text-gray-900">Features</h4>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {product?.features?.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Product Info Table */}
      <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-md">
        <h4 className="text-xl font-semibold mb-4 text-gray-900">
          Additional Product Info
        </h4>
        <table className="w-full border-collapse bg-white shadow-sm rounded-lg">
          <thead className="bg-teal-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Total Hours
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Fast Option
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Extra Cost
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr className="bg-gray-50 hover:bg-gray-100">
              <td className="px-4 py-3 text-sm text-gray-600">
                {product.total_hour} hrs
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {product.fast_option}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                ${product.extra_cost}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Dimensions Table */}
      <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-md">
        <h4 className="text-xl font-semibold mb-4 text-gray-900">Dimensions</h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-sm rounded-lg">
            <thead className="bg-teal-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Height
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Width
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Unit
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Wholesale Price
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {product.dimensions.map((dim, index) => (
                <tr key={index} className="bg-gray-50 hover:bg-gray-100">
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {dim.height}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {dim.width}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {dim.unit}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    ${dim.price}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    ${dim.wholesale_price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gallery */}
      {product.images.length > 0 && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-xl font-semibold mb-4 text-gray-900">
            Gallery Images
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/${img}`}
                alt={`Gallery ${index}`}
                className="w-full h-64  rounded-lg shadow-md hover:scale-105 transition-transform"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
