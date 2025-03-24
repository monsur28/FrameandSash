import { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit,
  FileText,
  Filter,
  RefreshCw,
  Search,
  TrendingUp,
  Truck,
  ChevronDown,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import axiosSecure from "../../../Hooks/AsiosSecure";

export default function AdminOrderManagement() {
  const [activeView, setActiveView] = useState("orders");
  const [selectedOrder, setSelectedOrder] = useState(null);
  console.log(selectedOrder);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [error, setError] = useState(null);
  const [receivedDate, setReceivedDate] = useState("");

  const ordersPerPage = 10;

  // Status mapping for display
  const statusDisplayMap = {
    manufacturer_processing: "Processing",
    manufacturer_ready: "Ready for Pickup",
    "manufacturer pending": "Pending",
    pick_up: "Picked Up",
    delivery: "In Delivery",
    completed: "Delivered",
  };

  // Fetch orders with filters
  const fetchOrders = async (filters = {}) => {
    setIsLoading(true);
    try {
      let url = "/admin/admin-orders";

      // Add query parameters for filters
      const params = new URLSearchParams();

      if (filters.order_status && filters.order_status !== "all") {
        params.append("order_status", filters.order_status);
      }

      if (filters.customer_name) {
        params.append("customer_name", filters.customer_name);
      }

      if (filters.date_range && filters.date_range !== "all") {
        params.append("date_range", filters.date_range);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await axiosSecure.get(url);

      if (response.data.status === "success") {
        setOrders(response.data.data);
        setError(null);
      } else {
        setError("Failed to fetch orders");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to fetch orders. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch shipments
  const fetchShipments = async () => {
    try {
      const response = await axiosSecure.get("/admin/admin-orders/shipments");

      if (response.data.status === "success") {
        setShipments(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching shipments:", err);
    }
  };

  // Replace the handleGenerateReport function with this implementation that actually downloads files
  const handleGenerateReport = async (reportType, format = "pdf") => {
    setIsGeneratingReport(true);

    try {
      // Get filtered orders for the report
      const dataToExport = filteredOrders.map((order) => ({
        "Order ID": `#${order.order_id}`,
        Customer: order.customer_name,
        Date:
          format === "pdf"
            ? format(parseISO(order.order_date), "MMM dd, yyyy")
            : order.order_date,
        "Product Type": order.product_type,
        Quantity: order.quantity,
        "Total Amount": `$${Number.parseFloat(
          order.total_amount
        ).toLocaleString()}`,
        Status: statusDisplayMap[order.order_status] || order.order_status,
        Payment: order.payment_status === "succeeded" ? "Paid" : "Pending",
        "Payment Method": order.payment_method,
      }));

      if (format === "pdf") {
        // Generate PDF
        await generatePDF(
          dataToExport,
          `${reportType}-report-${new Date().toISOString().split("T")[0]}`
        );
      } else {
        // Generate Excel
        await generateExcel(
          dataToExport,
          `${reportType}-report-${new Date().toISOString().split("T")[0]}`
        );
      }

      setIsExportMenuOpen(false);
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report. Please try again.");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const generatePDF = async (data, filename) => {
    try {
      // Import libraries dynamically
      const { jsPDF } = await import("jspdf");
      const html2canvas = await import("html2canvas");

      // Create a temporary table element to render the data
      const tempTable = document.createElement("div");
      tempTable.style.position = "absolute";
      tempTable.style.left = "-9999px";
      tempTable.style.top = "-9999px";

      // ✅ Fix: Ensure `format` is correctly imported before using it
      const formattedDate = format(new Date(), "MMM dd, yyyy");

      // Create table HTML
      const tableHTML = `
        <div style="padding: 20px; font-family: Arial, sans-serif;">
          <h2 style="margin-bottom: 10px;">Order Management Report</h2>
          <p style="margin-bottom: 20px;">Generated on: ${formattedDate}</p>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f3f4f6;">
                ${Object.keys(data[0])
                  .map(
                    (key) =>
                      `<th style="padding: 8px; border: 1px solid #e5e7eb; text-align: left;">${key}</th>`
                  )
                  .join("")}
              </tr>
            </thead>
            <tbody>
              ${data
                .map(
                  (row) => `
                <tr>
                  ${Object.values(row)
                    .map(
                      (value) =>
                        `<td style="padding: 8px; border: 1px solid #e5e7eb;">${value}</td>`
                    )
                    .join("")}
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      `;

      tempTable.innerHTML = tableHTML;
      document.body.appendChild(tempTable);

      // Use html2canvas to capture the table as an image
      const canvas = await html2canvas.default(tempTable);
      document.body.removeChild(tempTable);

      // Create PDF from the canvas
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${filename}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const generateExcel = async (data, filename) => {
    try {
      // Create a CSV string from the data
      const headers = Object.keys(data[0]).join(",");
      const rows = data.map((row) => Object.values(row).join(","));
      const csvContent = [headers, ...rows].join("\n");

      // Create a Blob from the CSV string
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

      // Create a download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}.csv`;

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating Excel:", error);
      alert("Failed to generate Excel file. Please try again.");
    }
  };

  // Add a function to generate and print invoice
  const generateInvoice = (order) => {
    // Create a new window for the invoice
    const invoiceWindow = window.open("", "_blank");

    // Generate invoice HTML
    const invoiceHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice #${order.order_id}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 30px;
          border: 1px solid #eee;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
        }
        .invoice-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }
        .invoice-title {
          font-size: 28px;
          font-weight: bold;
          color: #4f46e5;
        }
        .invoice-details {
          margin-bottom: 40px;
        }
        .invoice-details-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .invoice-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 40px;
        }
        .invoice-table th {
          background-color: #f9fafb;
          text-align: left;
          padding: 12px;
          border-bottom: 1px solid #eee;
        }
        .invoice-table td {
          padding: 12px;
          border-bottom: 1px solid #eee;
        }
        .invoice-total {
          display: flex;
          justify-content: flex-end;
          margin-top: 30px;
          font-size: 18px;
          font-weight: bold;
        }
        .print-button {
          background-color: #4f46e5;
          color: white;
          border: none;
          padding: 10px 20px;
          font-size: 16px;
          cursor: pointer;
          margin-top: 20px;
        }
        @media print {
          .print-button {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="invoice-header">
          <div>
            <div class="invoice-title">INVOICE</div>
            <div>Frame And Sash</div>
            <div>Dhaka, Bangladesh</div>
          </div>
          <div>
            <div><strong>Invoice #:</strong> ${order.order_number}</div>

            <div><strong>Status:</strong> ${
              order.payment_status === "succeeded" ? "Paid" : "Pending"
            }</div>
          </div>
        </div>
        
        <div class="invoice-details">
          <div><strong>Bill To:</strong></div>
          <div>${order.customer_name}</div>
        </div>
        
        <table class="invoice-table">
          <thead>
            <tr>
              <th>Product Type</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${order.product_type}</td>
              <td>${order.quantity}</td>
              <td>$${(
                Number.parseFloat(order.total_amount) / order.quantity
              ).toLocaleString()}</td>
              <td>$${Number.parseFloat(
                order.total_amount
              ).toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="invoice-total">
          <div>
            <div>Total: $${Number.parseFloat(
              order.total_amount
            ).toLocaleString()}</div>
          </div>
        </div>
        
        <button class="print-button" onclick="window.print(); return false;">Print Invoice</button>
      </div>
    </body>
    </html>
  `;

    // Write to the new window
    invoiceWindow.document.open();
    invoiceWindow.document.write(invoiceHTML);
    invoiceWindow.document.close();
  };

  // Update the processShipment function to handle real-time UI updates
  const processShipment = async (orderId) => {
    if (!receivedDate) {
      alert("Please select a received date");
      return;
    }

    try {
      const response = await axiosSecure.post(
        `/admin/admin-orders/${orderId}/process-shipment`,
        {
          received_date: receivedDate,
        }
      );

      if (response.data.status === "success") {
        // Update the order status in the current orders list
        const updatedOrders = orders.map((order) => {
          if (order.order_id === orderId) {
            return { ...order, order_status: "pick_up" };
          }
          return order;
        });

        // Update the selected order if it's the one being modified
        if (selectedOrder && selectedOrder.order_id === orderId) {
          setSelectedOrder({ ...selectedOrder, order_status: "pick_up" });
        }

        // Update the orders state
        setOrders(updatedOrders);

        // Fetch updated shipment data
        fetchShipments();

        // Reset received date
        setReceivedDate("");

        alert("Shipment processed successfully");
      }
    } catch (err) {
      console.error("Error processing shipment:", err);
      alert(
        "Failed to process shipment. " +
          (err.response?.data?.error || "Please try again.")
      );
    }
  };

  // Update the updateDeliveryStatus function to handle real-time UI updates
  const updateDeliveryStatus = async (orderId, status) => {
    try {
      const response = await axiosSecure.put(
        `/admin/admin-orders/${orderId}/shipment-status`,
        {
          status: status,
        }
      );

      if (response.data.status === "success") {
        // Update the order status in the current orders list
        const updatedOrders = orders.map((order) => {
          if (order.order_id === orderId) {
            // If the order is marked as completed or delivered, update payment status to "paid"
            if (status === "completed" || status === "delivery") {
              return {
                ...order,
                order_status: status,
                payment_status: "succeeded", // Update payment status to succeeded (paid)
              };
            }
            return { ...order, order_status: status };
          }
          return order;
        });

        // Update the selected order if it's the one being modified
        if (selectedOrder && selectedOrder.order_id === orderId) {
          if (status === "completed" || status === "delivery") {
            setSelectedOrder({
              ...selectedOrder,
              order_status: status,
              payment_status: "succeeded", // Update payment status to succeeded (paid)
            });
          } else {
            setSelectedOrder({ ...selectedOrder, order_status: status });
          }
        }

        // Update the orders state
        setOrders(updatedOrders);

        alert("Delivery status updated successfully");
      }
    } catch (err) {
      console.error("Error updating delivery status:", err);
      alert(
        "Failed to update delivery status. " +
          (err.response?.data?.error || "Please try again.")
      );
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchOrders();
    fetchShipments();
  }, []);

  // Apply filters
  const applyFilters = () => {
    fetchOrders({
      order_status: statusFilter,
      customer_name: searchTerm,
      date_range: dateRange,
    });
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateRange("all");
    fetchOrders();
  };

  // Filter orders based on search term (client-side filtering as backup)
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        searchTerm === "" ||
        order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.order_id.toString().includes(searchTerm);

      const matchesStatus =
        statusFilter === "all" || order.order_status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  // Paginate orders
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ordersPerPage;
    return filteredOrders.slice(startIndex, startIndex + ordersPerPage);
  }, [filteredOrders, currentPage, ordersPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Handle order selection
  const handleOrderSelect = (order) => {
    // Find shipment details if available
    const shipmentDetails = shipments.find(
      (s) => s.order_id === order.order_id
    );
    setSelectedOrder({ ...order, shipment: shipmentDetails });
    setActiveView("orderDetails");
  };

  // Calculate dashboard metrics
  const dashboardMetrics = useMemo(() => {
    const totalSales = orders.reduce((sum, order) => {
      if (order.total_amount) {
        return sum + Number(order.total_amount);
      }
      return sum;
    }, 0);
    console.log(totalSales);

    const pendingOrders = orders.filter(
      (order) => order.order_status === "manufacturer pending"
    ).length;
    const processingOrders = orders.filter(
      (order) => order.order_status === "manufacturer_processing"
    ).length;
    const readyOrders = orders.filter(
      (order) => order.order_status === "manufacturer_ready"
    ).length;
    const pickedUpOrders = orders.filter(
      (order) => order.order_status === "pick_up"
    ).length;
    const inDeliveryOrders = orders.filter(
      (order) => order.order_status === "delivery"
    ).length;
    const completedOrders = orders.filter(
      (order) => order.order_status === "completed"
    ).length;

    return {
      totalSales,
      pendingOrders,
      processingOrders,
      readyOrders,
      pickedUpOrders,
      inDeliveryOrders,
      completedOrders,
      totalOrders: orders.length,
    };
  }, [orders]);

  // Close export menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsExportMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="rounded-[24px] border-2 border-white bg-white50 backdrop-blur-16.5 min-h-screen">
      {/* Orders View */}
      {activeView === "orders" && (
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Order Management
            </h1>

            <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Total Sales
                    </p>
                    <p className="text-2xl font-semibold">
                      ${dashboardMetrics.totalSales.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Total Orders
                    </p>
                    <p className="text-2xl font-semibold">
                      {dashboardMetrics.totalOrders}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Processing
                    </p>
                    <p className="text-2xl font-semibold">
                      {dashboardMetrics.processingOrders}
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <RefreshCw className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Delivered
                    </p>
                    <p className="text-2xl font-semibold">
                      {dashboardMetrics.completedOrders}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <Truck className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 bg-white rounded-lg shadow-sm">
            <div className="flex flex-col items-start p-4 space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div className="flex items-center w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center px-3 py-2 ml-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </button>
              </div>

              <div className="flex items-center w-full space-x-2 md:w-auto">
                <div className="relative">
                  <button
                    onClick={() => setIsExportMenuOpen((prev) => !prev)}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={isGeneratingReport}
                  >
                    {isGeneratingReport ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Export
                        <ChevronDown className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </button>

                  {isExportMenuOpen && (
                    <div
                      className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                      onMouseDown={(e) => e.stopPropagation()} // Prevents immediate closing
                    >
                      <button
                        onMouseDown={() =>
                          handleGenerateReport("orders", "pdf")
                        }
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Export as PDF
                      </button>
                      <button
                        onMouseDown={() =>
                          handleGenerateReport("orders", "excel")
                        }
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Export as Excel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {showFilters && (
              <div className="p-4 border-t border-gray-200">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="all">All Statuses</option>
                      <option value="manufacturer pending">Pending</option>
                      <option value="manufacturer_processing">
                        Processing
                      </option>
                      <option value="manufacturer_ready">
                        Ready for Pickup
                      </option>
                      <option value="pick_up">Picked Up</option>
                      <option value="delivery">In Delivery</option>
                      <option value="completed">Delivered</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Date Range
                    </label>
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="all">All Time</option>
                      <option value="week">Last Week</option>
                      <option value="month">Last Month</option>
                      <option value="year">Last Year</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end mt-4 space-x-2">
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Reset
                  </button>

                  <button
                    onClick={() => {
                      applyFilters();
                      setShowFilters(false);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-md text-red-800">{error}</div>
          ) : (
            <div className="overflow-hidden bg-white rounded-lg shadow-sm">
              {/* Added overflow-x-auto for horizontal scrolling */}
              <div className="overflow-x-auto lg:overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:px-6"
                      >
                        Order ID
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:px-6"
                      >
                        Customer
                      </th>

                      <th
                        scope="col"
                        className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:px-6"
                      >
                        Type
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:px-6"
                      >
                        Qty
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:px-6"
                      >
                        Total
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:px-6"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:px-6"
                      >
                        Payment Status
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:px-6"
                      >
                        Payment Method
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:px-6"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedOrders.map((order) => (
                      <tr key={order.order_id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-sm font-medium text-indigo-600 whitespace-nowrap sm:px-6">
                          <button
                            onClick={() => handleOrderSelect(order)}
                            className="hover:underline"
                          >
                            #{order.order_number}
                          </button>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap sm:px-6">
                          {order.customer_name}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap capitalize sm:px-6">
                          {order.product_type}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap sm:px-6">
                          {order.quantity}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap sm:px-6">
                          $
                          {Number.parseFloat(
                            order.total_amount
                          ).toLocaleString()}
                        </td>
                        <td className="px-4 py-4 text-sm whitespace-nowrap sm:px-6">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              order.order_status === "completed"
                                ? "bg-green-100 text-green-800"
                                : order.order_status === "delivery"
                                ? "bg-blue-100 text-blue-800"
                                : order.order_status === "pick_up"
                                ? "bg-purple-100 text-purple-800"
                                : order.order_status === "manufacturer_ready"
                                ? "bg-indigo-100 text-indigo-800"
                                : order.order_status ===
                                  "manufacturer_processing"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-orange-100 text-orange-800"
                            }`}
                          >
                            {statusDisplayMap[order.order_status] ||
                              order.order_status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm whitespace-nowrap sm:px-6">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              order.payment_status === "succeeded"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {order.payment_status === "succeeded"
                              ? "Paid"
                              : "Pending"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm whitespace-nowrap sm:px-6">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              order.payment_status === "succeeded"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {order.payment_method === "stripe"
                              ? "Stripe"
                              : order.payment_method === "cod"
                              ? "Cash on Delivery"
                              : "Unknown Payment Method"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-right whitespace-nowrap sm:px-6">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleOrderSelect(order)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing{" "}
                        <span className="font-medium">
                          {(currentPage - 1) * ordersPerPage + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium">
                          {Math.min(
                            currentPage * ordersPerPage,
                            filteredOrders.length
                          )}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium">
                          {filteredOrders.length}
                        </span>{" "}
                        results
                      </p>
                    </div>
                    <div>
                      <nav
                        className="inline-flex -space-x-px rounded-md shadow-sm isolate"
                        aria-label="Pagination"
                      >
                        <button
                          onClick={() =>
                            setCurrentPage(Math.max(1, currentPage - 1))
                          }
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 text-gray-400 rounded-l-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                        >
                          <span className="sr-only">Previous</span>
                          <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                        </button>

                        {Array.from({ length: totalPages }).map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentPage(index + 1)}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                              currentPage === index + 1
                                ? "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                            }`}
                          >
                            {index + 1}
                          </button>
                        ))}

                        <button
                          onClick={() =>
                            setCurrentPage(
                              Math.min(totalPages, currentPage + 1)
                            )
                          }
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 text-gray-400 rounded-r-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                        >
                          <span className="sr-only">Next</span>
                          <ChevronRight
                            className="w-5 h-5"
                            aria-hidden="true"
                          />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Order Details View */}
      {activeView === "orderDetails" && selectedOrder && (
        <div className="p-6">
          <div className="mb-6">
            <button
              onClick={() => setActiveView("orders")}
              className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Orders
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Order Summary */}
            <div className="lg:col-span-2">
              <div className="p-6 bg-white rounded-lg shadow-sm">
                {/* Update the Print button in the Order Details view to use the generateInvoice function */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Order #{selectedOrder.order_id}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => generateInvoice(selectedOrder)}
                      className="px-3 py-1 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200"
                    >
                      Print Invoice
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
                  <div className="p-4 border border-gray-200 rounded-md">
                    <p className="mb-1 text-sm font-medium text-gray-500">
                      Order Date
                    </p>
                    <p className="text-sm font-semibold">
                      {format(
                        parseISO(selectedOrder.order_date),
                        "MMM dd, yyyy HH:mm"
                      )}
                    </p>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-md">
                    <p className="mb-1 text-sm font-medium text-gray-500">
                      Status
                    </p>
                    <span
                      className={`px-2 py-1 text-sm font-medium rounded-md ${
                        selectedOrder.order_status === "completed"
                          ? "bg-green-100 text-green-800"
                          : selectedOrder.order_status === "delivery"
                          ? "bg-blue-100 text-blue-800"
                          : selectedOrder.order_status === "pick_up"
                          ? "bg-purple-100 text-purple-800"
                          : selectedOrder.order_status === "manufacturer_ready"
                          ? "bg-indigo-100 text-indigo-800"
                          : selectedOrder.order_status ===
                            "manufacturer_processing"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {statusDisplayMap[selectedOrder.order_status] ||
                        selectedOrder.order_status}
                    </span>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-md">
                    <p className="mb-1 text-sm font-medium text-gray-500">
                      Payment
                    </p>
                    <div className="flex items-center">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          selectedOrder.payment_status === "succeeded"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedOrder.payment_status === "succeeded"
                          ? "Paid"
                          : "Pending"}
                      </span>
                      <span className="ml-2 text-sm capitalize">
                        {selectedOrder.payment_method}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="mb-4 text-lg font-medium text-gray-800">
                    Order Details
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                          >
                            Product Type
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                          >
                            Quantity
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                          >
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap capitalize">
                            {selectedOrder.product_type}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {selectedOrder.quantity}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                            $
                            {Number.parseFloat(
                              selectedOrder.total_amount
                            ).toLocaleString()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Shipment Management Section */}
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <h3 className="mb-4 text-lg font-medium text-gray-800">
                    Shipment Management
                  </h3>

                  {selectedOrder.order_status === "manufacturer_ready" && (
                    <div className="bg-indigo-50 p-4 rounded-md mb-4">
                      <h4 className="font-medium text-indigo-800 mb-2">
                        Process Shipment
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        This order is ready for pickup. Enter the received date
                        to process the shipment.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="date"
                          value={receivedDate}
                          onChange={(e) => setReceivedDate(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <button
                          onClick={() =>
                            processShipment(selectedOrder.order_id)
                          }
                          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                        >
                          Process Shipment
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedOrder.order_status === "pick_up" && (
                    <div className="bg-purple-50 p-4 rounded-md mb-4">
                      <h4 className="font-medium text-purple-800 mb-2">
                        Update to Delivery
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        This order has been picked up. Mark it as in delivery
                        when it&apos;s on the way to the customer.
                      </p>
                      <button
                        onClick={() =>
                          updateDeliveryStatus(
                            selectedOrder.order_id,
                            "delivery"
                          )
                        }
                        className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
                      >
                        Mark as In Delivery
                      </button>
                    </div>
                  )}

                  {selectedOrder.order_status === "delivery" && (
                    <div className="bg-blue-50 p-4 rounded-md mb-4">
                      <h4 className="font-medium text-blue-800 mb-2">
                        Complete Order
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        This order is being delivered. Mark it as completed when
                        the customer has received it.
                      </p>
                      <button
                        onClick={() =>
                          updateDeliveryStatus(
                            selectedOrder.order_id,
                            "completed"
                          )
                        }
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                      >
                        Mark as Completed
                      </button>
                    </div>
                  )}

                  {selectedOrder.shipment && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-800 mb-2">
                        Shipment Details
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedOrder.shipment.tracking_number && (
                          <div className="p-3 border border-gray-200 rounded-md">
                            <p className="text-sm font-medium text-gray-500">
                              Tracking Number
                            </p>
                            <p className="text-sm">
                              {selectedOrder.shipment.tracking_number}
                            </p>
                          </div>
                        )}

                        {selectedOrder.shipment.shipment_date && (
                          <div className="p-3 border border-gray-200 rounded-md">
                            <p className="text-sm font-medium text-gray-500">
                              Estimated Delivery Date
                            </p>
                            <p className="text-sm">
                              {selectedOrder.shipment.shipment_date}
                            </p>
                          </div>
                        )}

                        {selectedOrder.shipment.received_date && (
                          <div className="p-3 border border-gray-200 rounded-md">
                            <p className="text-sm font-medium text-gray-500">
                              Received Date
                            </p>
                            <p className="text-sm">
                              {selectedOrder.shipment.received_date}
                            </p>
                          </div>
                        )}

                        {selectedOrder.shipment.notes && (
                          <div className="p-3 border border-gray-200 rounded-md md:col-span-2">
                            <p className="text-sm font-medium text-gray-500">
                              Notes
                            </p>
                            <p className="text-sm">
                              {selectedOrder.shipment.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="mb-4 text-lg font-medium text-gray-800">
                  Customer Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="text-sm">{selectedOrder.customer_name}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="mb-4 text-lg font-medium text-gray-800">
                  Order Status Timeline
                </h3>
                <div className="space-y-4">
                  <div className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                      <div className="w-0.5 h-full bg-gray-200"></div>
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-medium text-gray-900">
                        Order Placed
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(
                          parseISO(selectedOrder.order_date),
                          "MMM dd, yyyy HH:mm"
                        )}
                      </p>
                    </div>
                  </div>

                  {selectedOrder.order_status !== "manufacturer pending" && (
                    <div className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-0.5 h-full bg-gray-200"></div>
                      </div>
                      <div className="pb-4">
                        <p className="text-sm font-medium text-gray-900">
                          Processing
                        </p>
                        <p className="text-sm text-gray-500">
                          Order is being processed by manufacturer
                        </p>
                      </div>
                    </div>
                  )}

                  {(selectedOrder.order_status === "manufacturer_ready" ||
                    selectedOrder.order_status === "pick_up" ||
                    selectedOrder.order_status === "delivery" ||
                    selectedOrder.order_status === "completed") && (
                    <div className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                        <div className="w-0.5 h-full bg-gray-200"></div>
                      </div>
                      <div className="pb-4">
                        <p className="text-sm font-medium text-gray-900">
                          Ready for Pickup
                        </p>
                        <p className="text-sm text-gray-500">
                          Order is ready to be picked up
                        </p>
                      </div>
                    </div>
                  )}

                  {(selectedOrder.order_status === "pick_up" ||
                    selectedOrder.order_status === "delivery" ||
                    selectedOrder.order_status === "completed") && (
                    <div className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <div className="w-0.5 h-full bg-gray-200"></div>
                      </div>
                      <div className="pb-4">
                        <p className="text-sm font-medium text-gray-900">
                          Picked Up
                        </p>
                        <p className="text-sm text-gray-500">
                          Order has been picked up
                        </p>
                        {selectedOrder.shipment?.received_date && (
                          <p className="text-sm text-gray-500">
                            Received on: {selectedOrder.shipment.received_date}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {(selectedOrder.order_status === "delivery" ||
                    selectedOrder.order_status === "completed") && (
                    <div className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <div className="w-0.5 h-full bg-gray-200"></div>
                      </div>
                      <div className="pb-4">
                        <p className="text-sm font-medium text-gray-900">
                          In Delivery
                        </p>
                        <p className="text-sm text-gray-500">
                          Order is being delivered
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedOrder.order_status === "completed" && (
                    <div className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Delivered
                        </p>
                        <p className="text-sm text-gray-500">
                          Order has been delivered
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="mb-4 text-lg font-medium text-gray-800">
                  Actions
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <button className="px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                    Contact Customer
                  </button>
                  <button className="px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">
                    Send Invoice
                  </button>
                  <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                    Add Note
                  </button>
                  <button
                    onClick={() => generateInvoice(selectedOrder)}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Print Invoice
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
