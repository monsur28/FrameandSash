import { useState } from "react";

const SiteImage = () => {
  const [hasError, setHasError] = useState(false);

  const src = "https://i.ibb.co.com/ZJ9hDdn/Brand-Logo.webp"; // Your image source
  const fallbackSrc = "https://i.ibb.co.com/ZJ9hDdn/Brand-Logo.webp"; // Fallback image URL
  const alt = "Image"; // Image alt text

  return (
    <div className="relative w-full h-screen flex justify-center items-center">
      {hasError ? (
        <img
          src={fallbackSrc}
          alt={alt}
          className="w-full h-full object-cover"
        />
      ) : (
        <img
          src={src}
          alt={alt}
          onError={() => setHasError(true)}
          className="w-[500px] h-64 object-cover"
          loading="lazy"
        />
      )}
    </div>
  );
};

export default SiteImage;
