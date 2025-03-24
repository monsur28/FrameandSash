import { useEffect, useState, useMemo } from "react";
import { Edit3, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Loader from "../../../Shared/Loader";
import { useSweetAlert } from "../../../ContextProvider/SweetAlertContext";
import Swal from "sweetalert2";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const paymentsPerPage = 5;
  const { showAlert } = useSweetAlert();

  // Sample payment data for testing
  const samplePayments = [
    {
      id: 1,
      customerName: "John Doe",
      amount: 500,
      paymentDate: "2025-02-18",
      status: "Completed",
    },
    {
      id: 2,
      customerName: "Jane Smith",
      amount: 150,
      paymentDate: "2025-02-19",
      status: "Pending",
    },
    {
      id: 3,
      customerName: "Alice Johnson",
      amount: 300,
      paymentDate: "2025-02-20",
      status: "Completed",
    },
    // Add more sample payments as needed
  ];

  useEffect(() => {
    // Simulate loading of payment data
    setPayments(samplePayments);
    setLoading(false); // Simulate loading completion
  }, []);

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) =>
      payment.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [payments, searchTerm]);

  const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);
  const currentPayments = useMemo(() => {
    return filteredPayments.slice(
      (currentPage - 1) * paymentsPerPage,
      currentPage * paymentsPerPage
    );
  }, [filteredPayments, currentPage, paymentsPerPage]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    setPayments(payments.filter((payment) => payment.id !== id));
    showAlert("Success!", "Payment record deleted successfully.", "success");
  };

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 rounded-[24px] border-2 border-white bg-white50 backdrop-blur-16.5 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <input
          type="text"
          placeholder="Search by customer name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <PaymentTableContent
        payments={currentPayments}
        handleDelete={handleDelete}
      />
      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

function PaymentTableContent({ payments, handleDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full rounded-[24px] border-2 border-white bg-white50 backdrop-blur-16.5 overflow-hidden">
        <thead className="bg-[#00A99D] text-white">
          <tr>
            <th className="px-4 py-3 text-left">Payment ID</th>
            <th className="px-4 py-3 text-left">Customer Name</th>
            <th className="px-4 py-3 text-left">Amount</th>
            <th className="px-4 py-3 text-left">Payment Date</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {payments.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4 text-gray-500">
                No payments available.
              </td>
            </tr>
          ) : (
            payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{payment.id}</td>
                <td className="px-4 py-3">{payment.customerName}</td>
                <td className="px-4 py-3">${payment.amount.toFixed(2)}</td>
                <td className="px-4 py-3">{payment.paymentDate}</td>
                <td className="px-4 py-3">{payment.status}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      to={`/adminDashboard/payment/edit-payment/${payment.id}`}
                      className="text-[#00A99D] hover:underline"
                    >
                      <Edit3 className="w-6 h-6" />
                    </Link>
                    <button
                      onClick={() => handleDelete(payment.id)}
                      className="text-red-500 hover:underline"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function PaginationControls({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex justify-center mt-6">
      <nav className="inline-flex -space-x-px">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-4 py-2 border ${
                currentPage === page
                  ? "bg-[#00A99D] text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {page}
            </button>
          )
        )}
      </nav>
    </div>
  );
}

export default PaymentHistory;
