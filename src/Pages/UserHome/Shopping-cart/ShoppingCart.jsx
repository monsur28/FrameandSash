import { useState, useEffect } from "react";
import { ShoppingCart, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import axiosSecure from "../../../Hooks/AsiosSecure";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate(); // useNavigate hook to programmatically navigate

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await axiosSecure.get("/cart");
        console.log("Cart data:", response.data);
        if (response.data && response.data.status === "success") {
          setCartItems(response.data.cart);
          calculateTotalPrice(response.data.cart);
        }
      } catch {
        toast.error("Failed to load cart data");
      }
    };

    fetchCartData();
  }, []);

  const calculateTotalPrice = (items) => {
    const total = items.reduce(
      (acc, item) => acc + parseFloat(item.price) * item.quantity,
      0
    );
    setTotalPrice(total);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    const updatedCartItems = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCartItems);
    calculateTotalPrice(updatedCartItems);
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await axiosSecure.delete(`/cart/${itemId}`);
      const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updatedCartItems);
      calculateTotalPrice(updatedCartItems);
      toast.success("Item removed from cart");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error(
        "Your cart is empty. Please add at least one item to proceed."
      );
      return; // Prevent navigation if cart is empty
    }

    navigate("/checkout", { state: { cartTotal: totalPrice } });
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-cyan-500">Shopping Cart</h1>
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-6 h-6" />
          <span className="text-lg">My Cart ({cartItems.length})</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cartItems.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Product Image */}
                <div className="w-full md:w-20 h-20 relative border border-dotted border-blue-200 p-1">
                  <img
                    src={
                      item.primary_image
                        ? `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/${
                            item.primary_image
                          }`
                        : "https://i.ibb.co.com/Y762vTcM/image-45-1.png"
                    }
                    alt={item.title || "Sliding Window"}
                    className="w-20 h-20"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  {/* Product Title and Stock Status */}
                  <div className="flex justify-evenly md:justify-between items-center mb-2">
                    <div className="mb-2">
                      <h3 className="text-lg font-semibold">
                        {item.title || "Window Configurator Product"}
                      </h3>

                      <span className="inline-block text-sm text-red-600 font-medium">
                        In Stock
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Each</div>
                      <div className="text-lg font-semibold">
                        ${item.price || "59.99"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Quantity</div>
                      <div className="text-lg font-semibold">
                        <select
                          className="border rounded-md px-3 py-1 w-20"
                          defaultValue={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(
                              item.id,
                              parseInt(e.target.value)
                            )
                          }
                        >
                          {[...Array(10)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Total</div>
                      <div className="text-lg font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Product Specifications */}
                  <div className="space-y-1 text-sm text-gray-700 mb-4">
                    <p>
                      {item.dimensions?.height}mm x {item.dimensions?.width}mm
                      || {item.dimensions?.thickness}mm
                    </p>
                    <span className="inline-block text-sm text-red-600 font-medium">
                      Product Type: {item.product_type}
                    </span>
                  </div>

                  {/* Actions, Quantity, and Pricing */}
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-4">
                      <button
                        className="text-red-500 hover:underline"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center border-t pt-4">
            <span>{cartItems.length} Items</span>
            <span className="font-semibold">${totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold mb-4">Cart</h2>

            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.title || "Product"}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}

            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between font-semibold">
                <span>Estimated Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-primary text-white py-3 rounded-md hover:bg-cyan-600 transition-colors"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
