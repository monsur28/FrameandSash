import { useState, useEffect } from "react";
import { Edit, Trash2, PlusCircle } from "lucide-react";
import { useSweetAlert } from "../../../ContextProvider/SweetAlertContext";
import axiosSecure from "../../../Hooks/AsiosSecure";
import { useLanguage } from "../../../ContextProvider/LanguageContext";
import Swal from "sweetalert2";

export default function Discount() {
  const [activeTab, setActiveTab] = useState("discounts");
  const [discounts, setDiscounts] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [products, setProducts] = useState([]);
  const [modalType, setModalType] = useState(null); // "discount" or "coupon"
  const [showModal, setShowModal] = useState(false);

  // Form states for discounts
  const [newDiscount, setNewDiscount] = useState({
    code: "",
    description: "",
    product_id: "",
    discount_type: "percentage",
    discount_value: "",
    start_date: "",
    end_date: "",
    active: false,
  });

  // Form states for coupons
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    description: "",
    coupon_type: "percentage",
    coupon_value: "",
    minimum_order_value: "",
    usage_limit: "",
    start_date: "",
    end_date: "",
    active: false,
  });

  const { t } = useLanguage();
  const { showAlert } = useSweetAlert();

  const [editingDiscount, setEditingDiscount] = useState(null);
  const [editingCoupon, setEditingCoupon] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [discountsRes, couponsRes, productsRes] = await Promise.all([
          axiosSecure.get("/admin/discounts"),
          axiosSecure.get("/admin/coupons"),
          axiosSecure.get("/products"),
        ]);

        setDiscounts(discountsRes.data.discounts);
        setCoupons(couponsRes.data.coupons);
        setProducts(productsRes.data.products);
      } catch (error) {
        console.error("Error fetching data:", error.response || error.message);
        showAlert("Error!", "Failed to fetch data.", "error");
      }
    };

    fetchData();
  }, [showAlert]);

  const handleAddDiscount = async (e) => {
    e.preventDefault();
    if (validateDiscount(newDiscount)) {
      try {
        let response;

        // Format dates to "yyyy-MM-dd"
        const startDateFormatted = new Date(newDiscount.start_date)
          .toISOString()
          .split("T")[0];
        const endDateFormatted = new Date(newDiscount.end_date)
          .toISOString()
          .split("T")[0];

        const discountData = {
          ...newDiscount,
          start_date: startDateFormatted,
          end_date: endDateFormatted,
        };

        if (editingDiscount) {
          // Update existing discount
          response = await axiosSecure.put(
            `/admin/discounts/${editingDiscount.id}`,
            discountData,
            {
              headers: { "Content-Type": "application/json" },
            }
          );

          setDiscounts((prev) =>
            prev.map((item) =>
              item.id === editingDiscount.id ? response.data : item
            )
          );
          showAlert("Success!", "Discount updated successfully.", "success");
        } else {
          // Add new discount
          response = await axiosSecure.post("/admin/discounts", discountData, {
            headers: { "Content-Type": "application/json" },
          });

          setDiscounts((prev) => [...prev, response.data]);
          showAlert("Success!", "Discount added successfully.", "success");
        }

        resetDiscountForm();
        setEditingDiscount(null);
        setShowModal(false);
      } catch (error) {
        console.error("Error with discount:", error.response || error.message);
        showAlert(
          "Error!",
          error.response?.data?.message || "Operation failed.",
          "error"
        );
      }
    }
  };

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    if (validateCoupon(newCoupon)) {
      try {
        let response;

        // Format dates to "yyyy-MM-dd"
        const startDateFormatted = new Date(newCoupon.start_date)
          .toISOString()
          .split("T")[0];
        const endDateFormatted = new Date(newCoupon.end_date)
          .toISOString()
          .split("T")[0];

        const couponData = {
          ...newCoupon,
          start_date: startDateFormatted,
          end_date: endDateFormatted,
        };

        if (editingCoupon) {
          // Update existing coupon
          response = await axiosSecure.put(
            `/admin/coupons/${editingCoupon.id}`,
            couponData,
            {
              headers: { "Content-Type": "application/json" },
            }
          );

          setCoupons((prev) =>
            prev.map((item) =>
              item.id === editingCoupon.id ? response.data : item
            )
          );
          showAlert("Success!", "Coupon updated successfully.", "success");
        } else {
          // Add new coupon
          response = await axiosSecure.post("/admin/coupons", couponData, {
            headers: { "Content-Type": "application/json" },
          });

          setCoupons((prev) => [...prev, response.data]);
          showAlert("Success!", "Coupon added successfully.", "success");
        }

        resetCouponForm();
        setEditingCoupon(null);
        setShowModal(false);
      } catch (error) {
        console.error("Error with coupon:", error.response || error.message);
        showAlert(
          "Error!",
          error.response?.data?.message || "Operation failed.",
          "error"
        );
      }
    }
  };

  // Delete discount
  const handleDeleteDiscount = async (id) => {
    Swal.fire({
      title: t("AreYouSure"),
      text: t("DeleteDiscountWarning"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("Yes"),
      cancelButtonText: t("No"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/admin/discounts/${id}`);
          setDiscounts((prev) => prev.filter((discount) => discount.id !== id));
          showAlert("Success!", "Discount deleted successfully.", "success");
        } catch (error) {
          console.error(
            "Error deleting discount:",
            error.response || error.message
          );
          showAlert("Error!", "Failed to delete discount.", "error");
        }
      }
    });
  };

  // Delete coupon
  const handleDeleteCoupon = async (id) => {
    Swal.fire({
      title: t("AreYouSure"),
      text: t("DeleteCouponWarning"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("Yes"),
      cancelButtonText: t("No"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/admin/coupons/${id}`);
          setCoupons((prev) => prev.filter((coupon) => coupon.id !== id));
          showAlert("Success!", "Coupon deleted successfully.", "success");
        } catch (error) {
          console.error(
            "Error deleting coupon:",
            error.response || error.message
          );
          showAlert("Error!", "Failed to delete coupon.", "error");
        }
      }
    });
  };

  // Edit discount
  const handleEditDiscount = (discount) => {
    setEditingDiscount(discount);
    setNewDiscount({
      code: discount.code,
      description: discount.description,
      product_id: discount.product_id,
      discount_type: discount.discount_type,
      discount_value: discount.discount_value,
      start_date: discount.start_date,
      end_date: discount.end_date,
      active: discount.active,
    });
    setModalType("discount");
    setShowModal(true);
  };

  // Edit coupon
  const handleEditCoupon = (coupon) => {
    setEditingCoupon(coupon);
    setNewCoupon({
      code: coupon.code,
      description: coupon.description,
      coupon_type: coupon.coupon_type,
      coupon_value: coupon.coupon_value,
      minimum_order_value: coupon.minimum_order_value,
      usage_limit: coupon.usage_limit,
      start_date: coupon.start_date,
      end_date: coupon.end_date,
      active: coupon.active,
    });
    setModalType("coupon");
    setShowModal(true);
  };

  // Validation for Discount
  const validateDiscount = (discount) => {
    const errors = {};
    // if (!discount.code) errors.code = t("Discount code is required.");
    if (!discount.discount_type)
      errors.discount_type = t("Discount type is required.");
    if (discount.discount_value <= 0)
      errors.discount_value = t("Discount value must be greater than zero.");
    if (!discount.start_date) errors.start_date = t("Start date is required.");
    if (!discount.end_date) errors.end_date = t("End date is required.");
    if (new Date(discount.end_date) <= new Date(discount.start_date)) {
      errors.end_date = t("End date must be after the start date.");
    }
    return Object.keys(errors).length === 0;
  };

  // Validation for Coupon
  const validateCoupon = (coupon) => {
    const errors = {};
    if (!coupon.code) errors.code = t("Coupon code is required.");
    if (!coupon.coupon_type) errors.coupon_type = t("Coupon type is required.");
    if (coupon.coupon_value <= 0)
      errors.coupon_value = t("Coupon value must be greater than zero.");
    if (coupon.minimum_order_value < 0)
      errors.minimum_order_value = t("Minimum order value cannot be negative.");
    if (coupon.usage_limit < 1)
      errors.usage_limit = t("Usage limit must be at least one.");
    if (!coupon.start_date) errors.start_date = t("Start date is required.");
    if (!coupon.end_date) errors.end_date = t("End date is required.");
    if (new Date(coupon.end_date) < new Date(coupon.start_date)) {
      errors.end_date = t("End date must be after or equal to start date.");
    }
    return Object.keys(errors).length === 0;
  };

  const resetDiscountForm = () => {
    setNewDiscount({
      code: "",
      description: "",
      product_id: "",
      discount_type: "percentage",
      discount_value: "",
      start_date: "",
      end_date: "",
      active: false,
    });
    setEditingDiscount(null);
  };

  const resetCouponForm = () => {
    setNewCoupon({
      code: "",
      description: "",
      coupon_type: "percentage",
      coupon_value: "",
      minimum_order_value: "",
      usage_limit: "",
      start_date: "",
      end_date: "",
      active: false,
    });
    setEditingCoupon(null);
  };

  return (
    <div className="p-4 md:p-6 h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 rounded-[24px] border-2 border-white bg-white50 backdrop-blur-16.5 p-6">
        <h1 className="text-2xl font-semibold text-gray-700">
          {t("ManageDiscountsAndCoupons")}
        </h1>
        {/* Tab Navigation */}
        <div className="flex">
          {activeTab === "discounts" && (
            <button
              onClick={() => {
                setModalType("discount");
                setShowModal(true);
              }}
              className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              <PlusCircle className="mr-2" />
              {t("AddDiscount")}
            </button>
          )}
          {activeTab === "coupons" && (
            <button
              onClick={() => {
                setModalType("coupon");
                setShowModal(true);
              }}
              className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 ml-2"
            >
              <PlusCircle className="mr-2" />
              {t("AddCoupon")}
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-6">
        <button
          className={`px-4 py-2 mx-2 font-medium rounded ${
            activeTab === "discounts"
              ? "bg-primary text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("discounts")}
        >
          {t("Discounts")}
        </button>
        <button
          className={`px-4 py-2 mx-2 font-medium rounded ${
            activeTab === "coupons"
              ? "bg-primary text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("coupons")}
        >
          {t("Coupons")}
        </button>
      </div>

      {/* Discount Tab Content */}
      {activeTab === "discounts" && (
        <>
          {/* Discount Table */}
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full rounded-[24px]  bg-white50 backdrop-blur-16.5 shadow-md divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2">Id</th>
                  <th className="px-4 py-2">{t("Product")}</th>
                  <th className="px-4 py-2">{t("DiscountType")}</th>
                  <th className="px-4 py-2">{t("DiscountValue")}</th>
                  <th className="px-4 py-2">{t("StartDate")}</th>
                  <th className="px-4 py-2">{t("EndDate")}</th>
                  <th className="px-4 py-2">{t("Active")}</th>
                  <th className="px-4 py-2">{t("Actions")}</th>
                </tr>
              </thead>
              <tbody>
                {discounts.map((discount, index) => (
                  <tr key={discount.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">
                      {products.find((p) => p.id === discount.product_id)
                        ?.title || t("N/A")}
                    </td>
                    <td className="px-4 py-2">{discount.discount_type}</td>
                    <td className="px-4 py-2">{discount.discount_value}</td>
                    <td className="px-4 py-2">{discount.start_date}</td>
                    <td className="px-4 py-2">{discount.end_date}</td>
                    <td className="px-4 py-2">
                      {discount.active ? t("Yes") : t("No")}
                    </td>
                    <td className="px-4 py-2">
                      <button onClick={() => handleEditDiscount(discount)}>
                        <Edit />
                      </button>
                      <button onClick={() => handleDeleteDiscount(discount.id)}>
                        <Trash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Coupon Tab Content */}
      {activeTab === "coupons" && (
        <>
          {/* Coupon Table */}
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full rounded-b-[24px] bg-white50 backdrop-blur-16.5 shadow-md  divide-y divide-gray-200">
              <thead className="">
                <tr>
                  <th className="px-4 py-2">{t("Code")}</th>
                  <th className="px-4 py-2">{t("CouponType")}</th>
                  <th className="px-4 py-2">{t("CouponValue")}</th>
                  <th className="px-4 py-2">{t("MinimumOrderValue")}</th>
                  <th className="px-4 py-2">{t("UsageLimit")}</th>
                  <th className="px-4 py-2">{t("StartDate")}</th>
                  <th className="px-4 py-2">{t("EndDate")}</th>
                  <th className="px-4 py-2">{t("Active")}</th>
                  <th className="px-4 py-2">{t("Actions")}</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-2">{coupon.code}</td>
                    <td className="px-4 py-2">{coupon.coupon_type}</td>
                    <td className="px-4 py-2">{coupon.coupon_value}</td>
                    <td className="px-4 py-2">{coupon.minimum_order_value}</td>
                    <td className="px-4 py-2">{coupon.usage_limit}</td>
                    <td className="px-4 py-2">{coupon.start_date}</td>
                    <td className="px-4 py-2">{coupon.end_date}</td>
                    <td className="px-4 py-2">
                      {coupon.active ? t("Yes") : t("No")}
                    </td>
                    <td className="px-4 py-2">
                      <button onClick={() => handleEditCoupon(coupon)}>
                        <Edit />
                      </button>
                      <button onClick={() => handleDeleteCoupon(coupon.id)}>
                        <Trash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modal for Adding or Editing Discount */}
      {showModal && modalType === "discount" && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/3 p-6">
            <h2 className="text-lg font-semibold mb-4">
              {editingDiscount ? t("EditDiscount") : t("AddNewDiscount")}
            </h2>
            <form
              onSubmit={handleAddDiscount}
              className="grid grid-cols-2 gap-4"
            >
              {/* Discount Code - Full width */}
              {/* <div className="col-span-2">
                <label className="block mb-1">{t("DiscountCode")}</label>
                <input
                  type="text"
                  placeholder={t("DiscountCode")}
                  value={newDiscount.code}
                  onChange={(e) =>
                    setNewDiscount({ ...newDiscount, code: e.target.value })
                  }
                  className="px-4 py-2 border rounded-md w-full"
                  required
                />
              </div> */}

              {/* Product */}
              <div>
                <label className="block mb-1">{t("Product")}</label>
                <select
                  value={newDiscount.product_id}
                  onChange={(e) =>
                    setNewDiscount({
                      ...newDiscount,
                      product_id: e.target.value,
                    })
                  }
                  className="px-4 py-2 border rounded-md w-full"
                >
                  <option value="">{t("SelectProduct")}</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Discount Type */}
              <div>
                <label className="block mb-1">{t("DiscountType")}</label>
                <select
                  value={newDiscount.discount_type}
                  onChange={(e) =>
                    setNewDiscount({
                      ...newDiscount,
                      discount_type: e.target.value,
                    })
                  }
                  className="px-4 py-2 border rounded-md w-full"
                >
                  <option value="percentage">{t("Percentage")}</option>
                  <option value="fixed">{t("Fixed")}</option>
                </select>
              </div>

              {/* Discount Value */}
              <div>
                <label className="block mb-1">{t("DiscountValue")}</label>
                <input
                  type="number"
                  placeholder={t("DiscountValue")}
                  value={newDiscount.discount_value}
                  onChange={(e) =>
                    setNewDiscount({
                      ...newDiscount,
                      discount_value: e.target.value,
                    })
                  }
                  className="px-4 py-2 border rounded-md w-full"
                  required
                />
              </div>

              {/* Active Checkbox */}
              <div className="flex items-center mt-6">
                <input
                  type="checkbox"
                  checked={newDiscount.active}
                  onChange={(e) =>
                    setNewDiscount({ ...newDiscount, active: e.target.checked })
                  }
                  className="h-4 w-4"
                />
                <span className="ml-2">{t("Active")}</span>
              </div>

              {/* Start Date */}
              <div>
                <label className="block mb-1">{t("StartDate")}</label>
                <input
                  type="date"
                  value={newDiscount.start_date}
                  onChange={(e) =>
                    setNewDiscount({
                      ...newDiscount,
                      start_date: e.target.value,
                    })
                  }
                  className="px-4 py-2 border rounded-md w-full"
                  required
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block mb-1">{t("EndDate")}</label>
                <input
                  type="date"
                  value={newDiscount.end_date}
                  onChange={(e) =>
                    setNewDiscount({ ...newDiscount, end_date: e.target.value })
                  }
                  className="px-4 py-2 border rounded-md w-full"
                  required
                />
              </div>

              {/* Buttons - Full Width */}
              <div className="col-span-2 flex justify-end mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetDiscountForm();
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
                >
                  {t("Cancel")}
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded-md"
                >
                  {editingDiscount ? t("UpdateDiscount") : t("AddDiscount")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Adding or Editing Coupon */}
      {showModal && modalType === "coupon" && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/3 p-6">
            <h2 className="text-lg font-semibold mb-4">
              {editingCoupon ? t("EditCoupon") : t("AddNewCoupon")}
            </h2>
            <form onSubmit={handleAddCoupon} className="grid grid-cols-2 gap-4">
              {/* Coupon Code - Full width */}
              <div className="col-span-2">
                <label className="block mb-1">{t("CouponCode")}</label>
                <input
                  type="text"
                  placeholder={t("CouponCode")}
                  value={newCoupon.code}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, code: e.target.value })
                  }
                  className="px-4 py-2 border rounded-md w-full"
                  required
                />
              </div>

              {/* Coupon Type */}
              <div>
                <label className="block mb-1">{t("CouponType")}</label>
                <select
                  value={newCoupon.coupon_type}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, coupon_type: e.target.value })
                  }
                  className="px-4 py-2 border rounded-md w-full"
                >
                  <option value="percentage">{t("Percentage")}</option>
                  <option value="fixed">{t("Fixed")}</option>
                </select>
              </div>

              {/* Coupon Value */}
              <div>
                <label className="block mb-1">{t("CouponValue")}</label>
                <input
                  type="number"
                  placeholder={t("CouponValue")}
                  value={newCoupon.coupon_value}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, coupon_value: e.target.value })
                  }
                  className="px-4 py-2 border rounded-md w-full"
                  required
                />
              </div>

              {/* Minimum Order Value */}
              <div>
                <label className="block mb-1">{t("MinimumOrderValue")}</label>
                <input
                  type="number"
                  placeholder={t("MinimumOrderValue")}
                  value={newCoupon.minimum_order_value}
                  onChange={(e) =>
                    setNewCoupon({
                      ...newCoupon,
                      minimum_order_value: e.target.value,
                    })
                  }
                  className="px-4 py-2 border rounded-md w-full"
                />
              </div>

              {/* Usage Limit */}
              <div>
                <label className="block mb-1">{t("UsageLimit")}</label>
                <input
                  type="number"
                  placeholder={t("UsageLimit")}
                  value={newCoupon.usage_limit}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, usage_limit: e.target.value })
                  }
                  className="px-4 py-2 border rounded-md w-full"
                />
              </div>

              {/* Start Date */}
              <div>
                <label className="block mb-1">{t("StartDate")}</label>
                <input
                  type="date"
                  value={newCoupon.start_date}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, start_date: e.target.value })
                  }
                  className="px-4 py-2 border rounded-md w-full"
                  required
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block mb-1">{t("EndDate")}</label>
                <input
                  type="date"
                  value={newCoupon.end_date}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, end_date: e.target.value })
                  }
                  className="px-4 py-2 border rounded-md w-full"
                  required
                />
              </div>

              {/* Active Checkbox */}
              <div className="flex items-center mt-6">
                <input
                  type="checkbox"
                  checked={newCoupon.active}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, active: e.target.checked })
                  }
                  className="h-4 w-4"
                />
                <span className="ml-2">{t("Active")}</span>
              </div>

              {/* Buttons - Full Width */}
              <div className="col-span-2 flex justify-end mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetCouponForm();
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
                >
                  {t("Cancel")}
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded-md"
                >
                  {editingCoupon ? t("UpdateCoupon") : t("AddCoupon")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
