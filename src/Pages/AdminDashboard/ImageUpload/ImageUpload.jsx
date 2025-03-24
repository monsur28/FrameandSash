import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useLanguage } from "../../../ContextProvider/LanguageContext";
import axiosSecure from "../../../Hooks/AsiosSecure";

export default function PhotoManagement() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [photos, setPhotos] = useState([]);
  const { t } = useLanguage();

  // Fetch photos on component mount
  useEffect(() => {
    // Fetch all photos from /user-image
    const fetchPhotos = async () => {
      try {
        const response = await axiosSecure.get("/user-image");
        console.log("Fetched photos:", response.data);
        setPhotos(response.data); // assuming the API returns an array of photos
      } catch (error) {
        console.error("Error fetching photos:", error);
      }
    };

    fetchPhotos();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedFile) {
      const formData = new FormData();
      formData.append("image", selectedFile);

      try {
        // POST the image to /user-image
        const response = await axiosSecure.post("/user-image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("Response:", response.data); // Log the server response

        setPhotos((prevPhotos) => [...prevPhotos, response.data]);
        setSelectedFile(null); // Reset file input
      } catch (error) {
        console.error(
          "Error uploading photo:",
          error.response?.data || error.message
        );
      }
    } else {
      console.error("No file selected");
    }
  };

  const copyImageLink = (url) => {
    navigator.clipboard.writeText(url);
  };

  const handleDeletePhoto = async (photoId) => {
    try {
      // DELETE the photo from /user-image
      await axiosSecure.delete(`/user-image/${photoId}`);
      setPhotos((prevPhotos) =>
        prevPhotos.filter((photo) => photo.id !== photoId)
      );
    } catch (error) {
      console.error("Error deleting photo:", error);
    }
  };

  return (
    <div className="p-6">
      {/* Add Photo Form */}
      <div className="rounded-[24px] border-2 border-white bg-white50 backdrop-blur-16.5 shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">{t("addPhoto")}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
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
              style={{ minHeight: "300px" }} // Minimum height for each item to keep rows even
            >
              <div
                className="relative w-full"
                style={{ paddingBottom: "100%" }}
              >
                <img
                  src={`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/${
                    photo.url
                  }`}
                  alt="Uploaded photo"
                  className="absolute inset-0 w-full h-full rounded-lg"
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
                  <button className="p-1 text-primary hover:text-blue-700">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="p-1 text-red-600 hover:text-red-700"
                  >
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
