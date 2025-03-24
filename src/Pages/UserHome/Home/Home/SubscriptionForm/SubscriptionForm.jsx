import { useState } from "react";

export default function SubscriptionForm() {
  const [formData, setFormData] = useState({
    email: "",
    zipCode: "",
    customerType: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  return (
    <div className="bg-gray-50 p-8 mb-5">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <h2 className="text-2xl font-bold text-gray-700 mb-4 md:mb-6">
                Get inspiration <br /> and offers
              </h2>
              <div className="flex-1">
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  required
                  placeholder="Zip Code"
                  value={formData.zipCode}
                  onChange={(e) =>
                    setFormData({ ...formData, zipCode: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div className="flex-1">
                <select
                  value={formData.customerType}
                  onChange={(e) =>
                    setFormData({ ...formData, customerType: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none"
                >
                  <option value="">Please Select...</option>
                  <option value="individual">Individual</option>
                  <option value="business">Business</option>
                </select>
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-teal-500 text-white font-medium rounded hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors"
              >
                SUBMIT
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
