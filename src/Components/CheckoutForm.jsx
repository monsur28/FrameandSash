/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axiosSecure from "../Hooks/AsiosSecure";
import { useSweetAlert } from "../ContextProvider/SweetAlertContext";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

const CheckoutForm = ({
  total,
  onSuccess,
  shipping_option,
  shipping_address,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [succeeded, setSucceeded] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [billingDetails, setBillingDetails] = useState({
    email: "",
    name: "",
  });
  const [stripeToken, setStripeToken] = useState(null);
  const { showAlert } = useSweetAlert();

  useEffect(() => {
    // No need for a client secret here, generate token instead
  }, [total, shipping_address, shipping_option]);

  const handleChange = (event) => {
    // Listen for changes in the CardElement
    setCardComplete(event.complete);
    setError(event.error ? event.error.message : "");
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }

    if (error) {
      elements.getElement("card").focus();
      return;
    }

    if (!cardComplete) {
      setError("Please complete your card details.");
      return;
    }

    setProcessing(true);

    try {
      // Create the token from the card details
      const { token, error: tokenError } = await stripe.createToken(
        elements.getElement(CardElement)
      );

      if (tokenError) {
        setError(`Error generating token: ${tokenError.message}`);
        setProcessing(false);
        return;
      }

      setStripeToken(token.id); // Save the token

      // Send the token to your backend to process the payment
      const response = await axiosSecure.post("/checkout/stripe", {
        amount: Math.round(total * 100), // Convert to cents
        stripe_token: token.id, // Send the stripe token
        shipping_address_id: shipping_address,
        shipping_option_id: shipping_option,
      });

      // Handle response from the backend
      if (
        response.status === 200 &&
        response.data.message === "Payment successful"
      ) {
        showAlert("Success", "Payment successful", "success");
        setInterval(() => {
          window.location.href = "/my-orders"; // Redirect to home page
        }, 2000);
        setSucceeded(true);
        setProcessing(false);
        onSuccess(response.data.order_number); // Pass the paymentIntentId to onSuccess
      } else {
        setError("Payment failed.");
        setProcessing(false);
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError("An unexpected error occurred. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-form">
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Name on Card
        </label>
        <input
          id="name"
          type="text"
          required
          className="w-full p-2 border border-gray-300 rounded-md"
          value={billingDetails.name}
          onChange={(e) =>
            setBillingDetails({ ...billingDetails, name: e.target.value })
          }
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="card"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Card Details
        </label>
        <div className="p-2.5 border border-gray-300 rounded-md bg-white">
          <CardElement
            id="card"
            options={CARD_ELEMENT_OPTIONS}
            onChange={handleChange}
          />
        </div>
      </div>

      {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

      <button
        type="submit"
        disabled={!stripe || processing || !cardComplete}
        className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {processing ? "Processing..." : `Pay $${total}`}
      </button>
    </form>
  );
};

export default CheckoutForm;
