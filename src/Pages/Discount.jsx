import { useState, useEffect } from "react";
import { Edit, Trash2, PlusCircle, Check, X } from "lucide-react";
import { useLanguage } from "../ContextProvider/LanguageContext";
import { useSweetAlert } from "../ContextProvider/SweetAlertContext";
import axiosSecure from "../Hooks/AsiosSecure";
import Swal from "sweetalert2";

export default function Discount() {
  const [discounts, setDiscounts] = useState([]);
  const [newDiscount, setNewDiscount] = useState({
    code: "",
    description: "",
    expiry_date: "",
  });
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [codeExists, setCodeExists] = useState(false); // For checking if the code exists
  const { t } = useLanguage();
  const { showAlert } = useSweetAlert();

  // Fetch discounts from API
  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await axiosSecure.get("/discounts");
        setDiscounts(response.data);
      } catch (error) {
        console.error(
          "Error fetching discounts:",
          error.response || error.message
        );
        showAlert("Error!", "Failed to fetch discounts.", "error");
      }
    };
    fetchDiscounts();
  }, []); // Empty array means this effect runs only once

  // Add discount
  const handleAddDiscount = async () => {
    try {
      // Check if the code already exists
      const existingDiscount = discounts.find(
        (discount) => discount.code === newDiscount.code
      );
      if (existingDiscount) {
        setCodeExists(true);
        return;
      }
      // Proceed to add the new discount
      const response = await axiosSecure.post("/discounts", newDiscount, {
        headers: { "Content-Type": "application/json" },
      });

      if (
        response.data?.message === "Discount created successfully." &&
        response.data?.data
      ) {
        showAlert("Success!", "Discount added successfully.", "success");
        setDiscounts((prevDiscounts) => [...prevDiscounts, response.data.data]);
        setNewDiscount({ code: "", description: "", expiry_date: "" }); // Reset form
        setCodeExists(false); // Reset the codeExists flag
      } else {
        console.error("Unexpected response:", response.data);
      }
    } catch (error) {
      console.error("Error adding discount:", error.response || error.message);
      showAlert(
        "Error!",
        error.response?.data?.message || "Failed to add discount.",
        "error"
      );
    }
  };

  // Delete discount
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This discount will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/discounts/${id}`);
        setDiscounts(discounts.filter((discount) => discount.id !== id));
      } catch (error) {
        console.error(
          "Error deleting discount:",
          error.response || error.message
        );
        showAlert("Error!", "Failed to delete discount.", "error");
      }
    }
  };

  // Edit discount
  const handleEdit = (discount) => {
    setEditingDiscount(discount);
  };

  // Update discount
  const handleUpdateDiscount = async () => {
    const updatedDiscount = { ...editingDiscount };

    setDiscounts(
      discounts.map((discount) =>
        discount.id === updatedDiscount.id
          ? { ...discount, ...updatedDiscount }
          : discount
      )
    );

    try {
      const response = await axiosSecure.put(
        `/discounts/${updatedDiscount.id}`,
        updatedDiscount
      );

      setDiscounts(
        discounts.map((discount) =>
          discount.id === updatedDiscount.id ? response.data : discount
        )
      );

      setEditingDiscount(null);
    } catch (error) {
      console.error(
        "Error updating discount:",
        error.response || error.message
      );
      showAlert("Error!", "Failed to update discount.", "error");
    }
  };

  return (
    <div className="p-6 h-screen">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 rounded-[24px] border-2 border-white bg-white50 backdrop-blur-16.5 p-6">
          <h1 className="text-2xl font-semibold text-gray-700">
            {t("ManageDiscounts")}
          </h1>
        </div>

        {/* Discount Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-100 rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                  {t("Code")}
                </th>
                <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                  {t("Description")}
                </th>
                <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                  {t("ExpiryDate")}
                </th>
                <th className="px-4 py-2 text-center text-gray-600 font-semibold">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {discounts.map((discount) => (
                <tr key={discount.id} className="bg-white hover:bg-gray-50">
                  {editingDiscount && editingDiscount.id === discount.id ? (
                    <>
                      <td className="px-4 py-2 border">
                        <input
                          type="text"
                          value={editingDiscount.code}
                          onChange={(e) =>
                            setEditingDiscount({
                              ...editingDiscount,
                              code: e.target.value,
                            })
                          }
                          className="px-2 py-1 border rounded-md"
                        />
                      </td>
                      <td className="px-4 py-2 border">
                        <input
                          type="text"
                          value={editingDiscount.description}
                          onChange={(e) =>
                            setEditingDiscount({
                              ...editingDiscount,
                              description: e.target.value,
                            })
                          }
                          className="px-2 py-1 border rounded-md"
                        />
                      </td>
                      <td className="px-4 py-2 border">
                        <input
                          type="date"
                          value={editingDiscount.expiry_date}
                          onChange={(e) =>
                            setEditingDiscount({
                              ...editingDiscount,
                              expiry_date: e.target.value,
                            })
                          }
                          className="px-2 py-1 border rounded-md"
                        />
                      </td>
                      <td className="px-4 py-2 border text-center">
                        <button
                          className="text-green-500 hover:text-green-700 mx-2"
                          onClick={handleUpdateDiscount}
                        >
                          <Check size={18} />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700 mx-2"
                          onClick={() => setEditingDiscount(null)}
                        >
                          <X size={18} />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-2 border">{discount.code}</td>
                      <td className="px-4 py-2 border">
                        {discount.description}
                      </td>
                      <td className="px-4 py-2 border">
                        {discount.expiry_date}
                      </td>
                      <td className="px-4 py-2 border text-center">
                        <button
                          className="text-green-500 hover:text-green-700 mx-2"
                          onClick={() => handleEdit(discount)}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700 mx-2"
                          onClick={() => handleDelete(discount.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Discount Form */}
        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-600 mb-4">
            {t("AddNewDiscount")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder={t("DiscountCode")}
              value={newDiscount.code}
              onChange={(e) =>
                setNewDiscount({ ...newDiscount, code: e.target.value })
              }
              className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder={t("Description")}
              value={newDiscount.description}
              onChange={(e) =>
                setNewDiscount({ ...newDiscount, description: e.target.value })
              }
              className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              value={newDiscount.expiry_date}
              onChange={(e) =>
                setNewDiscount({ ...newDiscount, expiry_date: e.target.value })
              }
              className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddDiscount}
              className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center"
            >
              <PlusCircle size={20} className="mr-2" />
              {t("AddDiscount")}
            </button>
          </div>
          {codeExists && (
            <p className="mt-2 text-red-500">{t("DiscountCodeExists")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
