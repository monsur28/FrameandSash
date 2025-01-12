import { useState } from "react";
import Swal from "sweetalert2";
import { useLanguage } from "../ContextProvider/LanguageContext";

export default function SiteInfoForm() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    shortDescription:
      "Frame And Sash is one of the best Furniture companies in Bangladesh.",
    copyright: "© 2023 Frame And Sash. All rights reserved.",
    address: "Naogaon, Dhaka, Bangladesh",
    addressMapLink: "",
    email: "official@Frame And Sash.com",
    phone: "+8801645452145",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);

    Swal.fire({
      title: "Success!",
      text: "Your information is saved",
      icon: "success",
      confirmButtonColor: "#6366f1",
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">{t("siteinfo")}</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="shortDescription"
              className="block text-sm font-medium mb-1"
            >
              {t("ShortDescription")}
            </label>
            <input
              type="text"
              id="shortDescription"
              value={formData.shortDescription}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  shortDescription: e.target.value,
                }))
              }
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="copyright"
              className="block text-sm font-medium mb-1"
            >
              {t("Copyright")}
            </label>
            <input
              type="text"
              id="copyright"
              value={formData.copyright}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, copyright: e.target.value }))
              }
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium mb-1">
              {t("address")}
            </label>
            <input
              type="text"
              id="address"
              value={formData.address}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, address: e.target.value }))
              }
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="addressMapLink"
              className="block text-sm font-medium mb-1"
            >
              {t("AddressMapLink")}
            </label>
            <input
              type="url"
              id="addressMapLink"
              value={formData.addressMapLink}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  addressMapLink: e.target.value,
                }))
              }
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              {t("email")}
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              {t("phone")}
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
        </div>

        <div className="text-sm text-gray-500">Fields marked are required</div>

        <button
          type="submit"
          className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
