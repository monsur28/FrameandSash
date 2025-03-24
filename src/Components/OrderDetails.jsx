import {
  ChevronDown,
  ChevronLeft,
  ExternalLink,
  FileText,
  Printer,
} from "lucide-react";
import { useState } from "react";

// Order Details Component
export default function OrderDetails({
  order,
  onClose,
  onStatusChange,
  onTrackingUpdate,
  formatStatus,
  getStatusBadgeColor,
  formatDate,
  getNextStatus,
}) {
  const [activeTab, setActiveTab] = useState("details");
  const [trackingInfo, setTrackingInfo] = useState(order.tracking_number);
  const [shippingOption, setShippingOption] = useState(
    order.shipping_option || ""
  );
  const [expandedItem, setExpandedItem] = useState(null);

  // Toggle item expansion for mobile view
  const toggleItemExpansion = (index) => {
    if (expandedItem === index) {
      setExpandedItem(null);
    } else {
      setExpandedItem(index);
    }
  };

  // Handle status update
  const handleStatusUpdate = () => {
    const nextStatus = getNextStatus(order.order_status);
    if (nextStatus !== order.order_status) {
      onStatusChange(order.order_id, nextStatus);
    }
  };

  // Handle tracking submit
  const handleTrackingSubmit = () => {
    onTrackingUpdate(order.order_id, trackingInfo, shippingOption);
  };

  return (
    <div className="bg-white rounded-lg">
      {/* Header with Back Button */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="flex items-center">
          <button
            onClick={onClose}
            className="mr-3 p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5 text-gray-500" />
          </button>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Order {order.order_number}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Placed on {formatDate(order.order_date)}
            </p>
          </div>
        </div>
        <div className="flex space-x-2 ml-10 sm:ml-0">
          <button
            onClick={() => window.print()}
            className="flex items-center px-2 sm:px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            <Printer className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline text-sm">Print</span>
          </button>
          <button className="flex items-center px-2 sm:px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            <FileText className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline text-sm">Invoice</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6 overflow-x-auto">
        <div className="flex space-x-4 sm:space-x-8 min-w-max">
          <button
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "details"
                ? "border-[#00A99D] text-[#00A99D]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("details")}
          >
            Order Details
          </button>
          <button
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "status"
                ? "border-[#00A99D] text-[#00A99D]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("status")}
          >
            Update Status
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mb-6">
        {activeTab === "details" && (
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-800">Order Summary</h3>
                <span
                  className={`px-3 py-1 inline-flex text-xs sm:text-sm font-semibold rounded-full ${getStatusBadgeColor(
                    order.order_status
                  )}`}
                >
                  {formatStatus(order.order_status)}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-medium">{order.order_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-medium">{formatDate(order.order_date)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="font-medium">
                    $ {Number.parseFloat(order.total_amount).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">
                Payment Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Payment Status</p>
                  <p
                    className={`font-medium ${
                      order.payment_status.toLowerCase() === "succeeded" ||
                      order.payment_status.toLowerCase() === "paid"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {order.payment_status.charAt(0).toUpperCase() +
                      order.payment_status.slice(1)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium uppercase">
                    {order.payment_method}
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">
                Customer Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{order.customer_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">
                    {order.shipping_address?.phone || "Not provided"}
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">
                Shipping Information
              </h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium whitespace-pre-line">
                    {order.shipping_address?.address || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Shipping Method</p>
                  <p className="font-medium">
                    {order.shipping_option || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tracking Number</p>
                  <div className="flex items-center">
                    <p className="font-medium">
                      {order.tracking_number || "Not available yet"}
                    </p>
                    {order.tracking_number && (
                      <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <span className="text-sm">Track</span>
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-4">Order Items</h3>

              {/* Desktop View - Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        img
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dimensions
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        QTY
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {order.order_items &&
                      order.order_items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.product_details?.product_name ||
                              "Product Name"}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <img
                              src={
                                item.product_details?.product_img ||
                                "/placeholder.svg?height=80&width=80"
                              }
                              alt={
                                item.product_details?.product_name || "Product"
                              }
                              width={40}
                              height={40}
                              className="rounded-md object-cover"
                            />
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 capitalize">
                            {item.product_type}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {item.dimensions
                              ? `${item.dimensions.width} × ${item.dimensions.height} ${item.dimensions.unit}`
                              : "N/A"}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            $ {Number.parseFloat(item.price).toLocaleString()}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            ${" "}
                            {Number.parseFloat(
                              item.total_price
                            ).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td
                        colSpan="6"
                        className="px-4 py-2 text-right font-medium"
                      >
                        Total
                      </td>
                      <td className="px-4 py-2 font-bold">
                        ${" "}
                        {Number.parseFloat(order.total_amount).toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Mobile View - Accordion */}
              <div className="sm:hidden">
                {order.order_items &&
                  order.order_items.map((item, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg mb-3"
                    >
                      <div
                        className="flex justify-between items-center p-3 cursor-pointer"
                        onClick={() => toggleItemExpansion(index)}
                      >
                        <div className="flex items-center">
                          <img
                            src={
                              item.product_details?.product_img ||
                              "/placeholder.svg?height=80&width=80"
                            }
                            alt={
                              item.product_details?.product_name || "Product"
                            }
                            width={40}
                            height={40}
                            className="rounded-md object-cover mr-3"
                          />
                          <div>
                            <p className="font-medium text-sm">
                              {item.product_details?.product_name ||
                                "Product Name"}
                            </p>
                            <p className="text-xs text-gray-500 capitalize">
                              {item.product_type}
                            </p>
                          </div>
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            expandedItem === index ? "rotate-180" : ""
                          }`}
                        />
                      </div>

                      {expandedItem === index && (
                        <div className="p-3 pt-0 border-t border-gray-200">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-gray-500">Dimensions:</p>
                              <p>
                                {item.dimensions
                                  ? `${item.dimensions.width} × ${item.dimensions.height} ${item.dimensions.unit}`
                                  : "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500">QTY:</p>
                              <p>{item.quantity}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Unit Price:</p>
                              <p>
                                ${" "}
                                {Number.parseFloat(item.price).toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500">Total:</p>
                              <p className="font-medium">
                                ${" "}
                                {Number.parseFloat(
                                  item.total_price
                                ).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
                  <span className="font-medium">Total Amount:</span>
                  <span className="font-bold">
                    $ {Number.parseFloat(order.total_amount).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "status" && (
          <div className="space-y-6">
            {/* Current Status */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-4">Current Status</h3>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getStatusBadgeColor(
                    order.order_status
                  )}`}
                >
                  {formatStatus(order.order_status)}
                </span>
              </div>
            </div>

            {/* Update Status */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-4">Update Status</h3>
              <div className="space-y-4">
                {(order.order_status === "manufacturer pending" ||
                  order.order_status === "manufacturer_pending") && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      This order is currently pending. You can mark it as
                      processing when you start working on it.
                    </p>
                    <button
                      onClick={handleStatusUpdate}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Mark as Processing
                    </button>
                  </div>
                )}

                {order.order_status === "manufacturer_processing" && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      This order is being processed. You can mark it as ready
                      when the manufacturing is complete.
                    </p>
                    <button
                      onClick={handleStatusUpdate}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Mark as Ready
                    </button>
                  </div>
                )}

                {order.order_status === "manufacturer_ready" && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      This order is ready for pickup. No further status updates
                      are needed from the manufacturer.
                    </p>
                    <button
                      disabled
                      className="px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed"
                    >
                      Order Ready for Pickup
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Tracking Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-4">
                Tracking Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shipping Method
                  </label>
                  <select
                    value={shippingOption}
                    onChange={(e) => setShippingOption(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00A99D]"
                  >
                    <option value="">Select Shipping Method</option>
                    <option value="DHL International">DHL International</option>
                    <option value="Pathao">Pathao</option>
                    <option value="Paperfly">Paperfly</option>
                    <option value="eCourier">eCourier</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    value={trackingInfo}
                    onChange={(e) => setTrackingInfo(e.target.value)}
                    placeholder="Enter tracking number"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00A99D]"
                  />
                </div>
                <button
                  onClick={handleTrackingSubmit}
                  className="px-4 py-2 bg-[#00A99D] text-white rounded-lg hover:bg-[#0077B6] transition-colors"
                >
                  Update Tracking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
