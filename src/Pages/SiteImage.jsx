import { useState } from "react";
import { useLanguage } from "../ContextProvider/LanguageContext";

export default function ImageUploadForm() {
  const { t } = useLanguage();
  const [previews, setPreviews] = useState([
    {
      src: "https://i.ibb.co.com/ZJ9hDdn/Brand-Logo.webp",
      width: 196,
      height: 196,
    }, // Default demo image with its dimensions
    {
      src: "https://i.ibb.co.com/G2PV8yB/Logo-white.webp",
      width: 328,
      height: 90,
    },
    {
      src: "https://i.ibb.co.com/G2PV8yB/Logo-white.webp",
      width: 114,
      height: 90,
    },
    {
      src: "https://i.ibb.co.com/ZJ9hDdn/Brand-Logo.webp",
      width: 196,
      height: 61,
    },
    {
      src: "https://i.ibb.co.com/ZJ9hDdn/Brand-Logo.webp",
      width: 196,
      height: 61,
    },
  ]);

  const handleFileChange = (e, index) => {
    const files = e.target.files;
    if (files && files[0]) {
      const newPreview = URL.createObjectURL(files[0]);
      const img = new Image();
      img.onload = () => {
        const updatedPreviews = previews.map((preview, i) =>
          i === index
            ? { src: newPreview, width: img.width, height: img.height }
            : preview
        );
        setPreviews(updatedPreviews);
      };
      img.src = newPreview;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{t("SiteImages")}</h1>

      <div className="space-y-6">
        {[
          { label: "Favicon (size 196 x 196)", accept: ".jpg,.jpeg,.png,.gif" },
          {
            label: "Admin Logo (size 328 x 90)",
            accept: ".jpg,.jpeg,.png,.gif",
          },
          {
            label: "Admin Small Logo (size 114 x 90)",
            accept: ".jpg,.jpeg,.png,.gif",
          },
          {
            label: "Site White Logo (196 x 61)",
            accept: ".jpg,.jpeg,.png,.gif",
          },
          {
            label: "Site Colored Logo (196 x 61)",
            accept: ".jpg,.jpeg,.png,.gif",
          },
        ].map((item, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex flex-col gap-4">
              <label className="font-medium">{item.label}</label>

              <div
                className="mx-auto overflow-hidden bg-white"
                style={{
                  width: `${previews[index].width}px`,
                  height: `${previews[index].height}px`,
                }}
              >
                <img
                  src={previews[index].src}
                  alt={`Preview ${index + 1}`}
                  className="object-contain"
                  style={{ width: "100%", height: "100%" }}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept={item.accept}
                  onChange={(e) => handleFileChange(e, index)}
                  className="hidden"
                  id={`file-${index}`}
                />
                <button
                  onClick={() =>
                    document.getElementById(`file-${index}`)?.click()
                  }
                  className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                >
                  Choose File
                </button>
                <span className="text-sm text-gray-500">
                  {previews[index].src === "/demo-logo.png"
                    ? "No file chosen"
                    : "File selected"}
                </span>
              </div>

              <p className="text-xs text-gray-500">
                You do not need to use the recommended sizes. However, images
                can be recommended sizes for your site design to look its best.
              </p>
            </div>
          </div>
        ))}

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
