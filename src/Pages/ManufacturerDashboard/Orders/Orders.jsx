import { useState, useRef, useEffect, useCallback } from "react";
// ... other imports (same as before) ...
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit,
  Search,
  X,
  LayoutGrid,
  TableIcon,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import axiosSecure from "../../../Hooks/AsiosSecure"; // Corrected relative path
import OrderPreview from "../../../Components/OrderPreview"; // Corrected relative path

export default function ManufacturerDashboard() {
  // --- State Variables ---
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRangeFilter, setDateRangeFilter] = useState({
    start: "",
    end: "",
  });
  const [productTypeFilter, setProductTypeFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "order_date",
    direction: "descending",
  });
  const [isEditingTracking, setIsEditingTracking] = useState(null);
  const [tempTrackingInfo, setTempTrackingInfo] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]); // Main order data
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [exportType, setExportType] = useState("pdf");
  const [viewMode, setViewMode] = useState("card");
  const trackingInputRef = useRef(null);
  const ordersPerPage = 5;

  // --- Utility Functions (outside useEffect) ---

  // Check if device is mobile (same as before)
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Fetch orders from API (same as before)
  // --- Fetch Orders (Refactored into a separate function) ---
  const fetchOrders = useCallback(async () => {
    // useCallback for stability
    setIsLoading(true);
    try {
      const response = await axiosSecure.get("/manufacturer-orders");
      console.log(response.data);
      if (response.data.status === "success") {
        setOrders(response.data.data);
      } else {
        console.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  }, []); // Add axiosSecure to dependencies. Important!

  // Fetch orders from API (using the function)
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]); // Dependency on the fetchOrders function

  // Fetch order details (same as before, but now uses fetchOrders)
  const fetchOrderDetails = useCallback(
    async (orderId) => {
      if (selectedOrder?.order_id === orderId) return;
      try {
        setIsLoading(true);
        const response = await axiosSecure.get(
          `/manufacturer-orders/${orderId}`
        );
        if (response.data.status === "success") {
          setSelectedOrder(response.data.data);
        } else {
          console.error("Failed to fetch order details");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedOrder?.order_id]
  ); // Correct dependencies.

  const handleStatusChange = useCallback(
    async (orderId, newStatus) => {
      try {
        const response = await axiosSecure.put(
          `/manufacturer-orders/${orderId}/update-status`,
          { status: newStatus }
        );

        if (response.data.status === "success") {
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order.order_id === orderId
                ? { ...order, order_status: newStatus }
                : order
            )
          );

          if (selectedOrder && selectedOrder.order_id === orderId) {
            setSelectedOrder((prevSelectedOrder) => ({
              ...prevSelectedOrder,
              order_status: newStatus,
            }));
          }
          setCurrentPage(1);
        } else {
          console.error("Failed to update order status");
        }
      } catch (error) {
        console.error("Error updating order status:", error);
      }
    },
    [selectedOrder, setOrders, setCurrentPage] // Correct dependencies
  );

  const handleTrackingUpdate = useCallback(
    async (orderId, trackingNumber, shippingOption = "") => {
      try {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.order_id === orderId
              ? { ...order, tracking_number: trackingNumber }
              : order
          )
        );

        if (selectedOrder && selectedOrder.order_id === orderId) {
          setSelectedOrder((prevSelectedOrder) => ({
            ...prevSelectedOrder,
            tracking_number: trackingNumber,
            shipping_option:
              shippingOption || prevSelectedOrder.shipping_option,
          }));
        }

        setIsEditingTracking(null);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error updating tracking info:", error);
      }
    },
    [selectedOrder, setOrders, setCurrentPage, setIsEditingTracking] // Correct dependencies
  );
  // Start editing tracking info (same as before)
  const startEditingTracking = (orderId, currentTracking) => {
    setIsEditingTracking(orderId);
    setTempTrackingInfo(currentTracking);
    setTimeout(() => {
      if (trackingInputRef.current) {
        trackingInputRef.current.focus();
      }
    }, 0);
  };

  // Format date (same as before)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  // Get unique product types for filter
  const productTypes = [
    "all",
    ...new Set(orders.flatMap((order) => order.product_types || [])),
  ];

  // --- DERIVED STATE (useEffect) ---
  useEffect(() => {
    // 1. Filter
    const filtered = orders.filter((order) => {
      const matchesSearch =
        order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.order_number.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || order.order_status === statusFilter;
      const orderDate = new Date(order.order_date);
      const matchesDateRange =
        (dateRangeFilter.start === "" ||
          new Date(dateRangeFilter.start) <= orderDate) &&
        (dateRangeFilter.end === "" ||
          new Date(dateRangeFilter.end) >= orderDate);
      const matchesProductType =
        productTypeFilter === "all" ||
        (order.product_types &&
          order.product_types.includes(productTypeFilter));
      return (
        matchesSearch && matchesStatus && matchesDateRange && matchesProductType
      );
    });

    // 2. Sort
    const sorted = [...filtered].sort((a, b) => {
      if (!sortConfig.key) return 0;
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      return sortConfig.direction === "ascending"
        ? aValue > bValue
          ? 1
          : -1
        : bValue > aValue
        ? 1
        : -1;
    });

    // 3. Paginate
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = sorted.slice(indexOfFirstOrder, indexOfLastOrder);
    const calculatedTotalPages = Math.ceil(sorted.length / ordersPerPage);

    filteredOrdersRef.current = currentOrders;
    totalPagesRef.current = calculatedTotalPages;
  }, [
    orders, // Key dependency.
    searchTerm,
    statusFilter,
    dateRangeFilter,
    productTypeFilter,
    sortConfig,
    currentPage,
    ordersPerPage,
  ]);
  const filteredOrdersRef = useRef([]);
  const totalPagesRef = useRef(0);

  // Request sort
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to page 1 on sort
  };

  // Close order details (same as before)
  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  // Get status badge color (same as before)
  const getStatusBadgeColor = (status) => {
    // ... (switch statement - same as before) ...
    switch (status) {
      case "manufacturer pending":
      case "manufacturer_pending":
        return "bg-yellow-100 text-yellow-800";
      case "manufacturer_processing":
        return "bg-blue-100 text-blue-800";
      case "manufacturer_ready":
        return "bg-orange-100 text-orange-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format status (same as before)
  const formatStatus = (status) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Get next status (same as before)
  const getNextStatus = (currentStatus) => {
    // ... (switch statement - same as before) ...
    switch (currentStatus) {
      case "manufacturer pending":
      case "manufacturer_pending":
        return "manufacturer_processing";
      case "manufacturer_processing":
        return "manufacturer_ready";
      default:
        return currentStatus;
    }
  };

  // --- Render Functions (using local variables) ---
  // All render functions (renderOrderCard, renderMobileTable, and the main return)
  // should now use `filteredOrdersRef.current` and `totalPagesRef.current`.

  const handleExport = () => {
    const table = document.getElementById("order-table");

    // Export as PDF using jsPDF and html2canvas
    const exportAsPDF = () => {
      html2canvas(table, { scale: 2 }).then((canvas) => {
        const pdf = new jsPDF("l", "mm", "a4"); // 'l' for landscape
        const imgData = canvas.toDataURL("image/png");

        // Add title to PDF
        pdf.setFontSize(16);
        pdf.text(
          "Manufacturer Orders Report",
          pdf.internal.pageSize.getWidth() / 2,
          10,
          { align: "center" }
        );
        pdf.setFontSize(12);
        pdf.text(
          `Generated on: ${new Date().toLocaleDateString()}`,
          pdf.internal.pageSize.getWidth() / 2,
          18,
          {
            align: "center",
          }
        );

        // Get the dimensions of the canvas
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        // Get the dimensions of one A4 page in landscape
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight() - 25; // Subtract space for title

        // Calculate the scale needed to fit the content to one page
        const scaleX = pageWidth / imgWidth;
        const scaleY = pageHeight / imgHeight;
        const scale = Math.min(scaleX, scaleY);

        // Calculate the new width and height based on the scale
        const scaledWidth = imgWidth * scale;
        const scaledHeight = imgHeight * scale;

        // Center the image on the page
        const x = (pageWidth - scaledWidth) / 2;
        const y = (pageHeight - scaledHeight) / 2 + 25; // Add offset for title

        pdf.addImage(imgData, "PNG", x, y, scaledWidth, scaledHeight);
        pdf.save("manufacturer_orders.pdf");
      });
    };

    // Export as Excel using xlsx
    const exportAsExcel = () => {
      if (!table) {
        console.error("Table element not found!");
        return;
      }

      // Prepare data for Excel
      const data = [];

      // Add title row
      data.push(["Manufacturer Orders Report"]);
      data.push(["Generated on:", new Date().toLocaleDateString()]);
      data.push([]); // Empty row for spacing

      // Add headers
      const headers = [
        "Order #",
        "Customer",
        "Date",
        "Status",
        "Tracking",
        "Total",
        "Payment Status",
        "Payment Method",
        "QTY",
      ];
      data.push(headers);

      // Add order data
      filteredOrdersRef.current.forEach((order) => {
        // Use filteredOrders here
        const row = [
          order.order_number,
          order.customer_name,
          formatDate(order.order_date),
          formatStatus(order.order_status),
          order.tracking_number || "Not available",
          `$${Number.parseFloat(order.total_amount).toLocaleString()}`,
          order.payment_status.charAt(0).toUpperCase() +
            order.payment_status.slice(1),
          order.payment_method.toUpperCase(),
          order.total_items,
        ];
        data.push(row);
      });

      // Create worksheet
      const ws = XLSX.utils.aoa_to_sheet(data);

      // Set column widths
      const wscols = [
        { wch: 15 }, // Order #
        { wch: 20 }, // Customer
        { wch: 12 }, // Date
        { wch: 20 }, // Status
        { wch: 20 }, // Tracking
        { wch: 10 }, // Total
        { wch: 15 }, // Payment Status
        { wch: 15 }, // Payment Method
        { wch: 8 }, // QTY
      ];
      ws["!cols"] = wscols;

      // Merge cells for title
      ws["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 1 } },
      ];

      // Style the title
      ws.A1 = {
        t: "s",
        v: "Manufacturer Orders Report",
        s: { font: { bold: true, sz: 16 } },
      };

      // Create workbook and add worksheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Orders");

      // Write to file
      XLSX.writeFile(wb, "manufacturer_orders.xlsx");
    };

    // Call the appropriate export function based on exportType
    if (exportType === "pdf") {
      exportAsPDF();
    } else {
      exportAsExcel();
    }
  };

  // Render mobile card view for orders
  const renderOrderCard = (order) => {
    return (
      <div
        key={order.order_id}
        className="bg-white rounded-lg shadow-sm p-4 mb-4 border border-gray-100"
        onClick={() => fetchOrderDetails(order.order_id)}
      >
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-[#00A99D] font-medium">{order.order_number}</h3>
            <p className="text-sm text-gray-500">
              {formatDate(order.order_date)}
            </p>
          </div>
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
              order.order_status
            )}`}
          >
            {formatStatus(order.order_status)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
          <div>
            <p className="text-gray-500">Customer:</p>
            <p className="font-medium">{order.customer_name}</p>
          </div>
          <div>
            <p className="text-gray-500">Total:</p>
            <p className="font-medium">
              $ {Number.parseFloat(order.total_amount).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-gray-50 p-2 rounded-md mb-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-gray-500">Payment Status:</p>
              <div className="flex items-center">
                <span
                  className={`inline-block w-2 h-2 rounded-full mr-1 ${
                    order.payment_status.toLowerCase() === "succeeded" ||
                    order.payment_status.toLowerCase() === "paid"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                ></span>
                <span className="capitalize">{order.payment_status}</span>
              </div>
            </div>
            <div>
              <p className="text-gray-500">Payment Method:</p>
              <p className="uppercase">{order.payment_method}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <div className="flex items-center">
            <span className="text-xs text-gray-500 mr-3">
              QTY: {order.total_items}
            </span>
            <span className="text-xs text-gray-500 capitalize">
              {order.product_types && order.product_types.join(", ")}
            </span>
          </div>
          <button className="text-xs text-[#00A99D] flex items-center">
            View Details
            <ChevronRight className="h-3 w-3 ml-1" />
          </button>
        </div>
      </div>
    );
  };

  // Render mobile table view for orders
  const renderMobileTable = () => {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order #
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                QTY
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrdersRef.current.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-4 text-center text-gray-500">
                  No orders found matching your filters.
                </td>
              </tr>
            ) : (
              filteredOrdersRef.current.map((order) => (
                <tr
                  key={order.order_number}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => fetchOrderDetails(order.order_id)}
                >
                  <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-[#00A99D]">
                    {order.order_number}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusBadgeColor(
                        order.order_status
                      )}`}
                    >
                      {formatStatus(order.order_status)}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                    ${Number.parseFloat(order.total_amount).toLocaleString()}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                    {order.total_items}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="min-h-screen rounded-[24px] border-2 border-white bg-white50 backdrop-blur-16.5">
      {/* Main Content Area */}
      <main className="p-3 sm:p-6 overflow-hidden min-h-screen">
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          {!selectedOrder ? (
            <>
              {/* Header with Title and Export Options */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Order Management
                </h1>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Toggle Filters Button */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm font-medium transition-colors"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    {showFilters ? "Hide Filters" : "Show Filters"}
                  </button>

                  {/* Mobile View Toggle */}
                  {isMobile && (
                    <div className="flex rounded-lg overflow-hidden border border-gray-200">
                      <button
                        onClick={() => setViewMode("card")}
                        className={`flex items-center px-2 py-2 text-sm ${
                          viewMode === "card"
                            ? "bg-[#00A99D] text-white"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        <LayoutGrid className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setViewMode("table")}
                        className={`flex items-center px-2 py-2 text-sm ${
                          viewMode === "table"
                            ? "bg-[#00A99D] text-white"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        <TableIcon className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {/* Export Type Selection */}
                  <select
                    value={exportType}
                    onChange={(e) => setExportType(e.target.value)}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm font-medium transition-colors"
                  >
                    <option value="pdf">Export as PDF</option>
                    <option value="excel">Export as Excel</option>
                  </select>

                  {/* Export Button */}
                  <button
                    onClick={handleExport}
                    className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm font-medium transition-colors"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </button>
                </div>
              </div>

              {/* Advanced Filtering */}
              {showFilters && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6 animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Search */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Search
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                          type="text"
                          placeholder="Order # or customer..."
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#00A99D]"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Status Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00A99D]"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="all">All Statuses</option>
                        <option value="manufacturer pending">
                          Manufacturer Pending
                        </option>
                        <option value="manufacturer_pending">
                          Manufacturer Pending
                        </option>
                        <option value="manufacturer_processing">
                          Manufacturer Processing
                        </option>
                        <option value="manufacturer_ready">
                          Manufacturer Ready
                        </option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    {/* Date Range */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date Range
                      </label>
                      <div className="flex space-x-2">
                        <div className="relative flex-1">
                          <input
                            type="date"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00A99D]"
                            value={dateRangeFilter.start}
                            onChange={(e) =>
                              setDateRangeFilter({
                                ...dateRangeFilter,
                                start: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="relative flex-1">
                          <input
                            type="date"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00A99D]"
                            value={dateRangeFilter.end}
                            onChange={(e) =>
                              setDateRangeFilter({
                                ...dateRangeFilter,
                                end: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Product Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Type
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00A99D]"
                        value={productTypeFilter}
                        onChange={(e) => setProductTypeFilter(e.target.value)}
                      >
                        {productTypes.map((type) => (
                          <option key={type} value={type}>
                            {type === "all"
                              ? "All Types"
                              : type === "pre-made"
                              ? "Pre-made"
                              : "Custom"}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Active Filters Display */}
                  {(searchTerm ||
                    statusFilter !== "all" ||
                    dateRangeFilter.start ||
                    dateRangeFilter.end ||
                    productTypeFilter !== "all") && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {searchTerm && (
                        <div className="bg-[#00A99D]/10 text-[#00A99D] px-3 py-1 rounded-full text-sm flex items-center">
                          Search: {searchTerm}
                          <button
                            onClick={() => setSearchTerm("")}
                            className="ml-2 text-[#00A99D] hover:text-[#0077B6]"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )}

                      {statusFilter !== "all" && (
                        <div className="bg-[#00A99D]/10 text-[#00A99D] px-3 py-1 rounded-full text-sm flex items-center">
                          Status: {formatStatus(statusFilter)}
                          <button
                            onClick={() => setStatusFilter("all")}
                            className="ml-2 text-[#00A99D] hover:text-[#0077B6]"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )}

                      {(dateRangeFilter.start || dateRangeFilter.end) && (
                        <div className="bg-[#00A99D]/10 text-[#00A99D] px-3 py-1 rounded-full text-sm flex items-center">
                          Date:{" "}
                          {dateRangeFilter.start
                            ? new Date(
                                dateRangeFilter.start
                              ).toLocaleDateString()
                            : "Any"}
                          {" - "}
                          {dateRangeFilter.end
                            ? new Date(dateRangeFilter.end).toLocaleDateString()
                            : "Any"}
                          <button
                            onClick={() =>
                              setDateRangeFilter({ start: "", end: "" })
                            }
                            className="ml-2 text-[#00A99D] hover:text-[#0077B6]"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )}

                      {productTypeFilter !== "all" && (
                        <div className="bg-[#00A99D]/10 text-[#00A99D] px-3 py-1 rounded-full text-sm flex items-center">
                          Type:{" "}
                          {productTypeFilter === "pre-made"
                            ? "Pre-made"
                            : "Custom"}
                          <button
                            onClick={() => setProductTypeFilter("all")}
                            className="ml-2 text-[#00A99D] hover:text-[#0077B6]"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )}

                      {(searchTerm ||
                        statusFilter !== "all" ||
                        dateRangeFilter.start ||
                        dateRangeFilter.end ||
                        productTypeFilter !== "all") && (
                        <button
                          onClick={() => {
                            setSearchTerm("");
                            setStatusFilter("all");
                            setDateRangeFilter({ start: "", end: "" });
                            setProductTypeFilter("all");
                            setCurrentPage(1); // Reset to page 1 when clearing filters.
                          }}
                          className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-300"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Orders Table/Cards */}
              {isLoading ? (
                <div className="flex justify-center items-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#00A99D]"></div>
                </div>
              ) : (
                <>
                  {/* Mobile View - Cards or Table based on viewMode */}
                  <div className="md:hidden">
                    {filteredOrdersRef.current.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No orders found matching your filters.
                      </div>
                    ) : viewMode === "card" ? (
                      filteredOrdersRef.current.map((order) =>
                        renderOrderCard(order)
                      )
                    ) : (
                      renderMobileTable()
                    )}
                  </div>

                  {/* Desktop View - Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                      <div className="overflow-hidden border border-gray-200 rounded-lg">
                        <table
                          id="order-table"
                          className="min-w-full divide-y divide-gray-200"
                        >
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => requestSort("order_number")}
                              >
                                <div className="flex items-center">
                                  Order #
                                  <ArrowUpDown className="ml-1 h-4 w-4" />
                                </div>
                              </th>
                              <th
                                scope="col"
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => requestSort("customer_name")}
                              >
                                <div className="flex items-center">
                                  Customer
                                  <ArrowUpDown className="ml-1 h-4 w-4" />
                                </div>
                              </th>
                              <th
                                scope="col"
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => requestSort("order_date")}
                              >
                                <div className="flex items-center">
                                  Date
                                  <ArrowUpDown className="ml-1 h-4 w-4" />
                                </div>
                              </th>
                              <th
                                scope="col"
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Status
                              </th>
                              <th
                                scope="col"
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Tracking
                              </th>
                              <th
                                scope="col"
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => requestSort("total_amount")}
                              >
                                <div className="flex items-center">
                                  Total
                                  <ArrowUpDown className="ml-1 h-4 w-4" />
                                </div>
                              </th>
                              <th
                                scope="col"
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Payment Status
                              </th>
                              <th
                                scope="col"
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Payment Method
                              </th>
                              <th
                                scope="col"
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                QTY
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {filteredOrdersRef.current.length === 0 ? (
                              <tr>
                                <td
                                  colSpan={8}
                                  className="px-4 py-10 text-center text-gray-500"
                                >
                                  No orders found matching your filters.
                                </td>
                              </tr>
                            ) : (
                              filteredOrdersRef.current.map((order) => (
                                <tr
                                  key={order.order_id}
                                  className="hover:bg-gray-50"
                                >
                                  <td
                                    className="px-4 py-3 whitespace-nowrap text-sm font-medium text-[#00A99D] hover:underline cursor-pointer"
                                    onClick={() =>
                                      fetchOrderDetails(order.order_id)
                                    }
                                  >
                                    {order.order_number}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                    {order.customer_name}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(order.order_date)}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="flex flex-col items-start space-y-1">
                                      <span
                                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                                          order.order_status
                                        )}`}
                                      >
                                        {formatStatus(order.order_status)}
                                      </span>
                                      {order.order_status ===
                                        "manufacturer pending" ||
                                      order.order_status ===
                                        "manufacturer_pending" ? (
                                        <button
                                          className="text-xs border border-gray-300 rounded-md px-2 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleStatusChange(
                                              order.order_id,
                                              "manufacturer_processing"
                                            );
                                          }}
                                        >
                                          → Processing
                                        </button>
                                      ) : order.order_status ===
                                        "manufacturer_processing" ? (
                                        <button
                                          className="text-xs border border-gray-300 rounded-md px-2 py-1 bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleStatusChange(
                                              order.order_id,
                                              "manufacturer_ready"
                                            );
                                          }}
                                        >
                                          → Ready
                                        </button>
                                      ) : null}
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                    {isEditingTracking === order.order_id ? (
                                      <div className="flex items-center space-x-2">
                                        <input
                                          ref={trackingInputRef}
                                          type="text"
                                          className="border border-gray-300 rounded-md px-2 py-1 text-xs w-28"
                                          value={tempTrackingInfo}
                                          onChange={(e) =>
                                            setTempTrackingInfo(e.target.value)
                                          }
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                              handleTrackingUpdate(
                                                order.order_id,
                                                tempTrackingInfo
                                              );
                                            } else if (e.key === "Escape") {
                                              setIsEditingTracking(null);
                                            }
                                          }}
                                          onClick={(e) => e.stopPropagation()}
                                        />
                                        <button
                                          className="text-green-600 hover:text-green-800"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleTrackingUpdate(
                                              order.order_id,
                                              tempTrackingInfo
                                            );
                                          }}
                                        >
                                          ✓
                                        </button>
                                        <button
                                          className="text-red-600 hover:text-red-800"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setIsEditingTracking(null);
                                          }}
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="flex items-center">
                                        <span
                                          className={
                                            order.tracking_number
                                              ? "truncate max-w-[120px]"
                                              : "text-gray-400 italic"
                                          }
                                        >
                                          {order.tracking_number ||
                                            "Not available"}
                                        </span>
                                        <button
                                          className="ml-2 text-[#00A99D] hover:text-[#0077B6]"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            startEditingTracking(
                                              order.order_id,
                                              order.tracking_number
                                            );
                                          }}
                                        >
                                          <Edit className="h-4 w-4" />
                                        </button>
                                      </div>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                    ${" "}
                                    {Number.parseFloat(
                                      order.total_amount
                                    ).toLocaleString()}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="flex flex-col space-y-1">
                                      <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                          order.payment_status.toLowerCase() ===
                                            "succeeded" ||
                                          order.payment_status.toLowerCase() ===
                                            "paid"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                        }`}
                                      >
                                        {order.payment_status
                                          .charAt(0)
                                          .toUpperCase() +
                                          order.payment_status.slice(1)}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                    <span className="text-xs text-gray-500 uppercase">
                                      {order.payment_method}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                    {order.total_items}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Pagination */}
              {totalPagesRef.current > 1 && (
                <div className="flex justify-center mt-6">
                  <nav className="flex items-center">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded-md mr-2 bg-gray-100 text-gray-600 disabled:opacity-50"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    {!isMobile ? (
                      // Desktop pagination with page numbers
                      Array.from(
                        { length: totalPagesRef.current },
                        (_, i) => i + 1
                      ).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 rounded-md mx-1 ${
                            currentPage === page
                              ? "bg-[#00A99D] text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {page}
                        </button>
                      ))
                    ) : (
                      // Mobile pagination with current/total indicator
                      <span className="px-3 py-1 text-sm text-gray-600">
                        Page {currentPage} of {totalPagesRef.current}
                      </span>
                    )}

                    <button
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, totalPagesRef.current)
                        )
                      }
                      disabled={currentPage === totalPagesRef.current}
                      className="px-3 py-1 rounded-md ml-2 bg-gray-100 text-gray-600 disabled:opacity-50"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              )}
            </>
          ) : (
            <OrderPreview
              order={selectedOrder}
              onClose={closeOrderDetails}
              onStatusChange={handleStatusChange}
              onTrackingUpdate={handleTrackingUpdate}
              formatStatus={formatStatus}
              getStatusBadgeColor={getStatusBadgeColor}
              formatDate={formatDate}
              isMobile={isMobile}
              getNextStatus={getNextStatus}
            />
          )}
        </div>
      </main>
    </div>
  );
}
