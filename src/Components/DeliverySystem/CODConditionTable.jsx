import Swal from "sweetalert2";
import { useSweetAlert } from "../../ContextProvider/SweetAlertContext";
import axiosSecure from "../../Hooks/AsiosSecure";
import { Trash2, Edit } from "lucide-react";

const CODConditionTable = ({ codConditions, onEdit, fetchData, setError }) => {
  const { showAlert } = useSweetAlert();

  const handleDeleteCodCondition = async (id) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        confirmButtonColor: "#d33",
        cancelButtonText: "No, cancel!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axiosSecure.delete(`/admin/shipping/cod-conditions/${id}`);
            showAlert(
              "Success",
              "COD Condition deleted successfully.",
              "success"
            );
            fetchData();
          } catch (err) {
            setError(err.message || "Failed to delete COD Condition");
          }
        }
      });
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse rounded-lg shadow-md">
        <thead className="bg-primary text-white">
          <tr>
            <th className="border border-gray-300 px-4 py-2">#</th>
            <th className="border border-gray-300 px-4 py-2">Min Quantity</th>
            <th className="border border-gray-300 px-4 py-2">
              Min Total Price
            </th>
            <th className="border border-gray-300 px-4 py-2">COD Fee</th>
            <th className="border border-gray-300 px-4 py-2">Shipping Zone</th>
            <th className="border border-gray-300 px-4 py-2">Enabled</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {codConditions.length === 0 ? ( // Check for empty array
            <tr>
              <td colSpan="5" className="text-center py-4">
                No COD conditions available now.
              </td>
            </tr>
          ) : (
            codConditions.map((condition, index) => (
              <tr key={condition.id} className="text-center">
                <td className="border border-gray-300 px-4 py-2">
                  {index + 1}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {condition.min_quantity || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {condition.min_total_price || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {condition.cod_fee || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {condition.shipping_zone?.name || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <span
                    className={`px-3 py-1 rounded-full ${
                      condition.is_enabled
                        ? "bg-green-500 text-white"
                        : "bg-gray-500 text-white"
                    }`}
                  >
                    {condition.is_enabled ? "Enabled" : "Disabled"}
                  </span>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="flex justify-center gap-2">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => onEdit(condition)}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteCodCondition(condition.id)}
                    >
                      <Trash2 size={16} />
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
};

export default CODConditionTable;
