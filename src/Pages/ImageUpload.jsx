import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useLanguage } from "../ContextProvider/LanguageContext";

export default function PhotoManagement() {
  const [order, setOrder] = useState("0");
  const [selectedFile, setSelectedFile] = useState(null);
  const [photos, setPhotos] = useState([
    { id: 1, url: "https://i.ibb.co.com/ZJ9hDdn/Brand-Logo.webp", order: 1 },
    {
      id: 2,
      url: "https://images.squarespace-cdn.com/content/v1/53b599ebe4b08a2784696956/1451882872681-B0PM3YN9RPLLA36MKVI8/image-asset.jpeg?format=500w",
      order: 2,
    },
    { id: 3, url: "https://i.ibb.co.com/G2PV8yB/Logo-white.webp", order: 3 },
  ]);
  const { t } = useLanguage();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedFile) {
      const newPhoto = {
        id: photos.length + 1,
        url: URL.createObjectURL(selectedFile), // Generate a temporary URL
        order: parseInt(order, 10),
      };

      setPhotos((prevPhotos) => [...prevPhotos, newPhoto]);
      setSelectedFile(null); // Reset file input
      setOrder("0"); // Reset order input
    }
  };

  const copyImageLink = (url) => {
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="p-6">
      {/* Add Photo Form */}
      <div className="rounded-[24px] border-2 border-white bg-white50 backdrop-blur-16.5 shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">{t("addPhoto")}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="order"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("orders")}
            </label>
            <input
              type="number"
              id="order"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image (.svg, .jpg, .jpeg, .png){" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <label className="block">
                <span className="sr-only">{t("chooseFile")}</span>
                <input
                  type="file"
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-gray-50 file:text-gray-700
                    hover:file:bg-gray-100"
                  accept=".svg,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            {t("submit")}
          </button>
        </form>
      </div>

      {/* Photos Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-6">Photos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="rounded-[24px] border-2 border-white bg-white50 backdrop-blur-16.5 shadow-sm p-4 space-y-4"
            >
              <div className="relative aspect-video">
                <img
                  src={photo.url}
                  alt="Uploaded photo"
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={photo.url}
                    readOnly
                    className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => copyImageLink(photo.url)}
                    className="w-full bg-teal-500 text-white px-4 py-2 rounded-md text-sm hover:bg-teal-600 transition-colors"
                  >
                    {t("copyImageLink")}
                  </button>
                </div>
                <div className="flex items-center justify-end space-x-2">
                  <button className="p-1 text-blue-600 hover:text-blue-700">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
