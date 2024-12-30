import { useState } from "react";

export default function SiteInfo() {
  const [siteInfo, setSiteInfo] = useState({
    siteName: "Fame and Sash",
    logoUrl: "https://i.ibb.co.com/ZJ9hDdn/Brand-Logo.webp", // Replace with your site logo URL
    description: "A brief description of the website.",
    status: "Active", // Active or Inactive
    contactEmail: "admin@example.com",
    contactPhone: "+1234567890",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSiteInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Logic to save changes (e.g., API call)
    console.log("Saved site info:", siteInfo);
  };

  return (
    <div className="p-6 rounded-[24px] border-2 border-white bg-white/50 backdrop-blur-[16.5px] shadow">
      <h2 className="text-2xl font-bold mb-4">Site Information</h2>
      <div className="space-y-6">
        {/* Site Logo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Logo
          </label>
          {isEditing ? (
            <input
              type="text"
              name="logoUrl"
              value={siteInfo.logoUrl}
              onChange={handleChange}
              className="block w-full p-2 border border-gray-300 rounded-md"
            />
          ) : (
            <img
              src={siteInfo.logoUrl}
              alt="Site Logo"
              className="w-96 h-96 rounded-md"
            />
          )}
        </div>

        {/* Site Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Site Name
          </label>
          {isEditing ? (
            <input
              type="text"
              name="siteName"
              value={siteInfo.siteName}
              onChange={handleChange}
              className="block w-full p-2 border border-gray-300 rounded-md"
            />
          ) : (
            <p className="text-lg font-medium">{siteInfo.siteName}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          {isEditing ? (
            <textarea
              name="description"
              value={siteInfo.description}
              onChange={handleChange}
              rows="4"
              className="block w-full p-2 border border-gray-300 rounded-md"
            ></textarea>
          ) : (
            <p>{siteInfo.description}</p>
          )}
        </div>

        {/* Site Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          {isEditing ? (
            <select
              name="status"
              value={siteInfo.status}
              onChange={handleChange}
              className="block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          ) : (
            <p
              className={`px-3 py-1 inline-block rounded-md text-sm font-medium ${
                siteInfo.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {siteInfo.status}
            </p>
          )}
        </div>

        {/* Contact Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Email
          </label>
          {isEditing ? (
            <input
              type="email"
              name="contactEmail"
              value={siteInfo.contactEmail}
              onChange={handleChange}
              className="block w-full p-2 border border-gray-300 rounded-md"
            />
          ) : (
            <p>{siteInfo.contactEmail}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Phone
          </label>
          {isEditing ? (
            <input
              type="text"
              name="contactPhone"
              value={siteInfo.contactPhone}
              onChange={handleChange}
              className="block w-full p-2 border border-gray-300 rounded-md"
            />
          ) : (
            <p>{siteInfo.contactPhone}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-teal-500 text-white rounded-md"
              >
                Save
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-teal-500 text-white rounded-md"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
