import { useState } from "react";

const ImageUpload = () => {
  const [images, setImages] = useState([
    // Adding some demo image URLs
    "https://i.ibb.co.com/ZJ9hDdn/Brand-Logo.webp",
    "https://images.squarespace-cdn.com/content/v1/53b599ebe4b08a2784696956/1451882872681-B0PM3YN9RPLLA36MKVI8/image-asset.jpeg?format=500w",
    "https://i.ibb.co.com/G2PV8yB/Logo-white.webp",
  ]);
  const [imagePreview, setImagePreview] = useState(null);

  // Handle image file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL for the selected image
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle uploading the image
  const handleUpload = () => {
    setImages([...images, imagePreview]);
    setImagePreview(null); // Clear preview after upload
  };

  // Handle image removal from gallery
  const handleRemove = (image) => {
    setImages(images.filter((img) => img !== image));
  };

  return (
    <div className="h-screen p-4">
      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="p-2 rounded-md border border-gray-300"
        />
        {imagePreview && (
          <div className="mt-4 flex justify-center">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-md"
            />
            <button
              onClick={handleUpload}
              className="ml-4 p-2 bg-blue-500 text-white rounded-md"
            >
              Upload
            </button>
          </div>
        )}
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative"
            onClick={() => handleRemove(image)}
          >
            <img
              src={image}
              alt={`Gallery Image ${index + 1}`}
              className="w-full h-40 object-cover rounded-lg cursor-pointer hover:opacity-80"
            />
            <button
              className="absolute top-2 right-5 text-white bg-red-500 rounded-full p-1"
              onClick={(e) => {
                e.stopPropagation(); // Prevent image click handler from firing
                handleRemove(image);
              }}
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;
