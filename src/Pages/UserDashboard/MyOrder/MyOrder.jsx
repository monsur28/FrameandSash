import { useState, useRef, useEffect } from "react";
import {
  Search,
  Home,
  ChevronRight,
  Package,
  MessageCircle,
  X,
  ChevronDown,
  Filter,
  Download,
  FileText,
  Printer,
  MapPin,
  Phone,
  Truck, // For pending steps
} from "lucide-react";
import axiosSecure from "../../../Hooks/AsiosSecure";
import OrderDetails from ".././../../Components/OrderDetails";
import Invoice from "../../../Components/Invoice";
import { format } from "date-fns"; // Import date-fns
import { useSweetAlert } from "../../../ContextProvider/SweetAlertContext";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function OrderPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [timeFilter, setTimeFilter] = useState("past-3-months");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [activeOrder, setActiveOrder] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState(null);
  const [invoiceData, setInvoiceData] = useState(null); // State to store invoice data
  const invoiceRef = useRef(null);
  const [orders, setOrders] = useState([]); // Store fetched orders here
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state\
  const { showAlert } = useSweetAlert();
  const navigate = useNavigate();

  // Fetch orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosSecure.get("/orders");
        setOrders(response.data.data);
      } catch (error) {
        setError(error.message || "Failed to fetch orders.");
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders based on active tab, search query, and time filter
  const filteredOrders = orders.filter((order) => {
    // Filter by tab
    if (
      activeTab === "active" &&
      order.order_status.toLowerCase() === "cancelled"
    )
      // Use toLowerCase()
      return false;
    if (
      activeTab === "cancelled" &&
      order.order_status.toLowerCase() !== "cancelled"
    )
      // Use toLowerCase()
      return false;

    // Filter by search
    if (
      searchQuery &&
      !order.order_number.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;

    // Time filter (using date-fns)
    if (timeFilter !== "all-time") {
      const orderDate = new Date(order.order_date);
      let pastDate;

      switch (timeFilter) {
        case "past-3-months":
          pastDate = new Date(new Date().setMonth(new Date().getMonth() - 3));
          break;
        case "past-6-months":
          pastDate = new Date(new Date().setMonth(new Date().getMonth() - 6));
          break;
        case "past-year":
          pastDate = new Date(
            new Date().setFullYear(new Date().getFullYear() - 1)
          );
          break;
        default:
          pastDate = new Date(0); // Default to the beginning of time (epoch)
      }

      if (orderDate < pastDate) {
        return false;
      }
    }

    return true;
  });

  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
  };

  const handleBackToList = () => {
    setSelectedOrder(null);
  };

  const handleViewInvoice = async (order) => {
    setInvoiceOrder(order); // Set the order for which invoice is shown.  ESSENTIAL.
    setInvoiceData(null); // Clear previous invoice data
    setShowInvoice(true); // Show the modal *before* fetching.

    try {
      const response = await axiosSecure.get(
        `/orders/${order.order_id}/receipt`
      );
      setInvoiceData(response.data);
      console.log("Invoice data fetched", response.data);
    } catch (error) {
      console.error("error fetching invoice ", error);
      showAlert("error", "Failed to load invoice");
      setShowInvoice(false); // Hide modal on error
    }
  };

  const handleCloseInvoice = () => {
    setShowInvoice(false);
    setInvoiceData(null); // Clear invoice data on close. Good practice.
  };

  const handlePrintInvoice = () => {
    const printContent = invoiceRef.current;

    if (printContent) {
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice #${invoiceOrder.order_number}</title>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            <style>
              @media print {
                body { 
                  print-color-adjust: exact; 
                  -webkit-print-color-adjust: exact;
                  font-family: Arial, sans-serif;
                }
                .print-container {
                  max-width: 100%;
                  margin: 0;
                  padding: 20px;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                }
                table th, table td {
                  padding: 4px;
                  border: 1px solid #e2e8f0;
                }
                table thead th {
                  background-color: #f8fafc !important;
                  font-weight: bold;
                }
                .border {
                  border: 1px solid #e2e8f0 !important;
                }
                .rounded-md {
                  border-radius: 6px;
                }
                .bg-gray-50, .bg-gray-100 {
                  background-color: #f9fafb !important;
                }
                .text-gray-500 {
                  color: #6b7280 !important;
                }
                .text-gray-600 {
                  color: #4b5563 !important;
                }
                .text-gray-700 {
                  color: #374151 !important;
                }
                .font-medium {
                  font-weight: 500 !important;
                }
                .font-bold {
                  font-weight: 700 !important;
                }
                .text-sm {
                  font-size: 0.875rem !important;
                }
                .mb-8 {
                  margin-bottom: 2rem !important;
                }
                .grid {
                  display: grid !important;
                }
                .md\\:grid-cols-2 {
                  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                }
                .gap-8 {
                  gap: 1rem !important;
                }
                .p-4 {
                  padding: 1rem !important;
                }
              }
            </style>
          </head>
          <body>
            <div class="print-container">
              ${printContent.outerHTML}
            </div>
          </body>
        </html>
      `);

      printWindow.document.close();

      // Wait for CSS to load before printing
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 1000);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
      case "delivered": // Handle lowercase as well
        return "bg-green-100 text-green-800";
      case "Processing":
      case "manufacturer_processing":
        return "bg-blue-100 text-blue-800";
      case "Shipped":
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "Cancelled":
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const cancelReasons = [
    "Changed my mind",
    "Found a better price elsewhere",
    "Ordered by mistake",
    "Other reason",
  ];

  const handleCancelOrder = async () => {
    if (!cancelReason) {
      alert("Please select a reason for cancellation.");
      return;
    }

    try {
      // Send cancellation request to the API
      await axiosSecure.post(`/orders/${activeOrder.order_id}/cancel`, {
        // Use order_id
        reason: cancelReason,
      });

      // Refresh the orders list
      const response = await axiosSecure.get("/orders");
      setOrders(response.data.data);

      setShowCancelDialog(false);
      setCancelReason("");
      setActiveOrder(null);
      showAlert(
        "success",
        "Order cancellation request submitted successfully!"
      );
    } catch (error) {
      console.error("Error cancelling order:", error);
      showAlert(`error`, `${error.response.data.error}`);
    }
  };

  const handleDownloadInvoice = async () => {
    const input = invoiceRef.current;

    if (!input) {
      showAlert("error", "Invoice content not found.");
      return;
    }

    try {
      const canvas = await html2canvas(input, {
        scale: 2, // Adjust scale as needed.  2 is a good starting point.
        logging: false,
        dpi: 300, // Good for print quality
        useCORS: true, // Important if you have images from other domains
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Get A4 dimensions in mm
      const a4Width = 210;
      const a4Height = 297;

      // Margins (in mm)
      const marginTop = 10;
      const marginLeft = 10;
      const marginRight = 10;
      const marginBottom = 10;

      // Usable page width and height (taking margins into account)
      const pageWidth = a4Width - marginLeft - marginRight;
      const pageHeight = a4Height - marginTop - marginBottom;

      // Calculate the image dimensions, maintaining aspect ratio
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight); // Scale to fit *within* the page
      const pdfImgWidth = imgWidth * ratio;
      const pdfImgHeight = imgHeight * ratio;

      // Calculate the remaining height on the current page
      let currentY = marginTop; // Start at the top margin

      // Function to add the image to the PDF, handling page breaks
      const addImageToPDF = (data, width, height) => {
        if (currentY + height > pageHeight) {
          // Image would overflow, add a new page
          pdf.addPage();
          currentY = marginTop; // Reset Y position for the new page
        }
        pdf.addImage(data, "PNG", marginLeft, currentY, width, height);
        currentY += height; // Update the current Y position
      };

      addImageToPDF(imgData, pdfImgWidth, pdfImgHeight);
      pdf.save(`Invoice_${invoiceOrder.order_number}.pdf`);
    } catch (error) {
      setError("Failed to generate PDF.", error);
    }
  };

  const orderStatusMap = {
    manufacturer_processing: "Manufacturer Processing",
    manufacturer_ready: "Manufacturer Ready",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 mb-8 text-gray-600">
        <Home className="h-5 w-5 text-teal-500" />
        <span>You are here:</span>
        <span className="font-medium">Home</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-teal-500">My Orders</span>
      </nav>

      {selectedOrder ? (
        <OrderDetails
          order={selectedOrder}
          filteredOrders={filteredOrders}
          onBack={handleBackToList}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          setShowCancelDialog={setShowCancelDialog}
          onViewInvoice={() => handleViewInvoice(selectedOrder)}
        />
      ) : (
        <>
          {/* Page Title */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">My Orders</h1>
            {/* <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              <Download className="h-4 w-4" />
              Export Orders
            </button> */}
          </div>

          {/* Tabs and Search */}
          <div className="bg-gray-100 p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex bg-white rounded-md p-1 shadow-sm">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === "all"
                    ? "bg-teal-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                All Orders
              </button>
              <button
                onClick={() => setActiveTab("active")}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === "active"
                    ? "bg-teal-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setActiveTab("cancelled")}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === "cancelled"
                    ? "bg-teal-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Cancelled
              </button>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <input
                  type="text"
                  placeholder="Search by order ID"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full md:w-64 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
              <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                <Filter className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Orders List */}
          {loading ? (
            <div className="text-center py-12">Loading orders...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">Error: {error}</div>
          ) : filteredOrders.length > 0 ? (
            <div className="grid gap-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.order_id} // Use order_id as key
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm"
                >
                  <div className="p-4 pb-2">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                      <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          Order #{order.order_number} {/* Use order_number */}
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              order.order_status
                            )}`}
                          >
                            {orderStatusMap[order.order_status] ||
                              order.order_status
                                .replace(/_/g, " ") // Replace underscores with spaces
                                .replace(/\b\w/g, (char) => char.toUpperCase())}
                          </span>
                        </h3>
                        <p className="text-sm text-gray-500">
                          Placed on {format(new Date(order.order_date), "PP")}{" "}
                          {/* Format date */}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <p className="mt-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-base font-medium 
        ${
          order.payment_status === "paid"
            ? "bg-green-100 text-green-800"
            : order.payment_status === "pending"
            ? "bg-yellow-100 text-yellow-800"
            : "text-gray-800"
        }`}
                          >
                            {order.payment_status === "paid"
                              ? "Paid"
                              : order.payment_status === "pending"
                              ? "Cash On Delivery"
                              : "Unknown"}
                          </span>
                        </p>

                        <button
                          onClick={() => handleOrderSelect(order)}
                          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleViewInvoice(order)}
                          className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                          <FileText className="h-4 w-4" />
                          Invoice
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="h-px bg-gray-200 mx-4"></div>
                  <div className="p-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2">
                          Order Summary
                        </h4>
                        <div className="flex flex-col gap-2">
                          {order.items.slice(0, 2).map((item) => (
                            <div
                              key={item.product_name} //Use a unique key, like a combination if no id.
                              className="flex items-center gap-3"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {item.product_name} {/* Use product_name */}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {item.price} × {item.quantity}
                                </p>
                              </div>
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <p className="text-sm text-gray-500">
                              +{order.items.length - 2} more items
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="p-4 shadow-sm bg-white">
                        <h4 className="font-medium text-sm mb-3">
                          Shipping Information
                        </h4>

                        {/* Billing Address */}
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">
                              Billing Address :{" "}
                              {[
                                order.shipping_address.address,
                                order.shipping_address.city.name,
                                order.shipping_address.country.name,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </h4>
                          </div>
                        </div>

                        {/* Phone Number */}
                        <div className="flex items-center gap-2 mt-3">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">
                              Phone Number: {order.shipping_address.phone}
                            </h4>
                          </div>
                        </div>

                        {/* Tracking Number */}
                        {order.tracking_number && (
                          <div className="flex items-center gap-2 text-sm mt-3">
                            <Truck className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-500">Tracking:</span>
                            <span className="font-medium">
                              {order.tracking_number || "Not Available"}
                            </span>
                            <span className="text-gray-500">
                              ({order.shipping_option})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="border-t bg-gray-50 p-4 flex justify-between">
                    <div className="text-sm">
                      <span className="text-gray-500">Total:</span>
                      <span className="font-bold ml-1">
                        {order.total_amount}
                      </span>{" "}
                      {/* Use total_amount */}
                    </div>
                    <div className="flex gap-2">
                      {/* Conditionally render the Cancel Order button */}
                      {order.order_status.toLowerCase() !== "cancelled" &&
                        order.order_status.toLowerCase() !== "delivered" && (
                          <button
                            onClick={() => {
                              setActiveOrder(order);
                              setShowCancelDialog(true);
                            }}
                            className="px-3 py-1.5 text-sm font-medium text-red-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            disabled={
                              order.order_status.toLowerCase() === "cancelled"
                            } // Disable if already cancelled
                          >
                            Cancel Order
                          </button>
                        )}
                      {order.order_status.toLowerCase() === "delivered" && (
                        <button className="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                          Return Item
                        </button>
                      )}
                      <button
                        onClick={() => navigate(`/contact-us`)}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>Contact</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No orders found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery
                  ? "No orders match your search criteria. Try a different search term."
                  : `Looks like you haven't placed any orders in the selected time period.`}
              </p>
              <button className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors">
                Start Shopping
              </button>
            </div>
          )}
        </>
      )}

      {/* Cancel Order Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">
                Cancel Order #{activeOrder?.order_number}{" "}
                {/* Use order_number */}
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                Are you sure you want to cancel this order? This action cannot
                be undone.
              </p>
            </div>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Reason for cancellation
                </label>
                <div className="relative">
                  <select
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">Select a reason</option>
                    {cancelReasons.map((reason) => (
                      <option key={reason} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none h-4 w-4" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Additional comments (optional)
                </label>
                <textarea
                  placeholder="Please provide any additional details..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowCancelDialog(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCancelOrder}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {showInvoice && invoiceOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-auto">
          <div className="bg-white rounded-lg max-w-4xl w-full p-6 max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                Invoice #{invoiceOrder.order_number}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={handlePrintInvoice}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
                >
                  <Printer className="h-4 w-4" />
                  Print
                </button>
                <button
                  onClick={handleDownloadInvoice} // Added Download Button
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
                <button
                  onClick={handleCloseInvoice}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <X className="h-4 w-4" />
                  Close
                </button>
              </div>
            </div>
            {/* invoice data load and show */}
            {invoiceData ? (
              <div
                ref={invoiceRef}
                className="bg-white p-6 border border-gray-200 rounded-lg"
              >
                <Invoice order={invoiceData} />
              </div>
            ) : (
              <div className="text-center py-12">Loading invoice...</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
