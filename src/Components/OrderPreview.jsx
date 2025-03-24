import {
  ChevronDown,
  ChevronLeft,
  Download,
  ExternalLink,
  FileText,
  Printer,
} from "lucide-react";
import { useState } from "react";

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
  console.log(order);
  const [activeTab, setActiveTab] = useState("details");
  const [trackingInfo, setTrackingInfo] = useState(order.tracking_number || "");
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

  // Function to generate and download invoice
  const generateInvoice = () => {
    // Create a new window for the invoice
    const invoiceWindow = window.open("", "_blank");

    // Generate invoice HTML content
    const invoiceContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${order.order_number}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
          }
          .invoice-header {
            text-align: center;
            margin-bottom: 30px;
          }
          .invoice-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .invoice-subtitle {
            font-size: 16px;
            color: #666;
          }
          .section {
            margin-bottom: 20px;
          }
          .section-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
          }
          .info-item {
            margin-bottom: 5px;
          }
          .info-label {
            font-weight: bold;
            margin-right: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          .total-row {
            font-weight: bold;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 14px;
            color: #666;
          }
          @media print {
            .no-print {
              display: none;
            }
            body {
              padding: 30px;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-header">
          <div class="invoice-title">INVOICE</div>
          <div class="invoice-subtitle">Order #${order.order_number}</div>
        </div>
        
        <div class="section">
          <div class="section-title">Invoice Details</div>
          <div class="info-grid">
            <div>
              <div class="info-item"><span class="info-label">Invoice Date:</span> ${new Date().toLocaleDateString()}</div>
              <div class="info-item"><span class="info-label">Order Date:</span> ${formatDate(
                order.order_date
              )}</div>
              <div class="info-item"><span class="info-label">Payment Status:</span> ${
                order.payment_status.charAt(0).toUpperCase() +
                order.payment_status.slice(1)
              }</div>
              <div class="info-item"><span class="info-label">Payment Method:</span> ${order.payment_method.toUpperCase()}</div>
            </div>
            <div>
              <div class="info-item"><span class="info-label">Order Status:</span> ${formatStatus(
                order.order_status
              )}</div>
              <div class="info-item"><span class="info-label">Tracking Number:</span> ${
                order.tracking_number || "N/A"
              }</div>
              <div class="info-item"><span class="info-label">Shipping Method:</span> ${
                order.shipping_option || "N/A"
              }</div>
            </div>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Customer Information</div>
          <div class="info-grid">
            <div>
              <div class="info-item"><span class="info-label">Name:</span> ${
                order.customer_name
              }</div>
              <div class="info-item"><span class="info-label">Phone:</span> ${
                order.shipping_address?.phone || "N/A"
              }</div>
            </div>
            <div>
              <div class="info-item"><span class="info-label">Shipping Address:</span> ${
                order.shipping_address?.address || "N/A"
              }</div>
            </div>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Order Items</div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Type</th>
                <th>Dimensions</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${
                order.order_items &&
                order.order_items
                  .map(
                    (item) => `
                <tr>
                  <td>${item.product_details?.product_name || "Product"}</td>
                  <td>${item.product_type}</td>
                  <td>${
                    item.dimensions
                      ? `${item.dimensions.width} × ${item.dimensions.height} ${item.dimensions.unit}`
                      : "N/A"
                  }</td>
                  <td>${item.quantity}</td>
                  <td>$ ${Number.parseFloat(item.price).toLocaleString()}</td>
                  <td>$ ${Number.parseFloat(
                    item.total_price
                  ).toLocaleString()}</td>
                </tr>
              `
                  )
                  .join("")
              }
            </tbody>
            <tfoot>
              <tr class="total-row">
                <td colspan="5" style="text-align: right;">Total</td>
                <td>$ ${Number.parseFloat(
                  order.total_amount
                ).toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        <div class="footer">
          <p>Thank you for your business!</p>
          <p>For any questions regarding this invoice, please contact us at support@example.com</p>
        </div>
        
        <div class="no-print" style="margin-top: 30px; text-align: center;">
          <button onclick="window.print()" style="padding: 10px 20px; background-color: #00A99D; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Print Invoice
          </button>
        </div>
      </body>
      </html>
    `;

    // Write the content to the new window
    invoiceWindow.document.open();
    invoiceWindow.document.write(invoiceContent);
    invoiceWindow.document.close();
  };

  // Function to generate and download shipping label
  const generateShippingLabel = () => {
    // Create a new window for the shipping label
    const labelWindow = window.open("", "_blank");

    // Generate shipping label HTML content
    const labelContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Shipping Label - ${order.order_number}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 10px;
            color: #333;
          }
          .label-container {
            width: 4in;
            height: 6in;
            border: 1px solid #000;
            margin: 20px auto;
            padding: 0.25in;
            box-sizing: border-box;
            position: relative;
          }
          .label-header {
            text-align: center;
            margin-bottom: 0.25in;
            border-bottom: 2px solid #000;
            padding-bottom: 0.1in;
          }
          .company-name {
            font-size: 18px;
            font-weight: bold;
          }
          .label-section {
            margin-bottom: 0.2in;
          }
          .section-title {
            font-weight: bold;
            margin-bottom: 0.05in;
            text-transform: uppercase;
            font-size: 12px;
          }
          .address {
            font-size: 14px;
            line-height: 1.3;
          }
          .order-info {
            margin-top: 0.2in;
            font-size: 12px;
          }
          .barcode {
            text-align: center;
            margin-top: 0.2in;
            font-family: 'Courier New', monospace;
            font-size: 16px;
            letter-spacing: 2px;
          }
          .barcode-text {
            font-size: 14px;
            margin-top: 0.05in;
            text-align: center;
          }
          .shipping-method {
            position: absolute;
            bottom: 0.25in;
            right: 0.25in;
            font-weight: bold;
            border: 2px solid #000;
            padding: 0.1in;
            text-align: center;
            font-size: 14px;
          }
          @media print {
            .no-print {
              display: none;
            }
            body {
              padding: 0;
            }
            .label-container {
              border: none;
              margin: 0;
              padding: 0.25in;
              width: 100%;
              height: auto;
            }
          }
        </style>
      </head>
      <body>
        <div class="label-container">
          <div class="label-header">
            <div class="company-name">Frame And Sash</div>
            <div>www.frameandsash.com</div>
          </div>
          
          <div class="label-section">
            <div class="section-title">Ship To:</div>
            <div class="address">
              <strong>${order.customer_name}</strong><br>
              ${order.shipping_address?.address || "Address not available"}<br>
              Phone: ${order.shipping_address?.phone || "Phone not available"}
            </div>
          </div>
          
          <div class="label-section">
            <div class="section-title">Order Information:</div>
            <div class="order-info">
              <div><strong>Order #:</strong> ${order.order_number}</div>
              <div><strong>Date:</strong> ${formatDate(order.order_date)}</div>
              ${
                order.tracking_number
                  ? `<div><strong>Tracking #:</strong> ${order.tracking_number}</div>`
                  : ""
              }
              ${
                order.shipping_option
                  ? `<div><strong>Shipping Method:</strong> ${order.shipping_option}</div>`
                  : ""
              }
            </div>
          </div>
          
          <div class="barcode">
            ||||| ||| |||||||| ||| |||||
          </div>
          <div class="barcode-text">${
            order.tracking_number || order.order_number
          }</div>
          
          <div class="shipping-method">
            ${order.shipping_option || "STANDARD SHIPPING"}
          </div>
        </div>
        
        <div class="no-print" style="margin: 20px; text-align: center;">
          <button onclick="window.print()" style="padding: 10px 20px; background-color: #00A99D; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Print Shipping Label
          </button>
        </div>
      </body>
      </html>
    `;

    // Write the content to the new window
    labelWindow.document.open();
    labelWindow.document.write(labelContent);
    labelWindow.document.close();
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
            className="flex items-center px-2 sm:px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Printer className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline text-sm">Print</span>
          </button>
          <button
            onClick={generateInvoice}
            className="flex items-center px-2 sm:px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FileText className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline text-sm">Invoice</span>
          </button>
          <button
            onClick={generateShippingLabel}
            className="flex items-center px-2 sm:px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Download className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline text-sm">Label</span>
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
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Item
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Image
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Type
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Dimensions
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            QTY
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Price
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
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
                                    item.product_details?.product_image ||
                                    "/placeholder.svg?height=80&width=80"
                                  }
                                  alt={
                                    item.product_details?.product_name ||
                                    "Product"
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
                                ${" "}
                                {Number.parseFloat(item.price).toLocaleString()}
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
                            {Number.parseFloat(
                              order.total_amount
                            ).toLocaleString()}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
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
                              item.product_details?.product_image ||
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
                  <input type="text" name="" id="" />
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
