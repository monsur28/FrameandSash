import { useEffect, useState } from "react";

export default function SweetAlert({
  show,
  title,
  message,
  type = "",
  onClose,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [animateClass, setAnimateClass] = useState("");

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setAnimateClass("animate-slide-in");
    } else {
      setAnimateClass("animate-slide-out");
      setTimeout(() => setIsVisible(false), 300); // Match animation duration
    }
  }, [show]);

  const handleClose = () => {
    setAnimateClass("animate-slide-out");
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300); // Match animation duration
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 bg-[rgba(0,89,97,0.80)] flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-xl w-full max-w-md relative overflow-hidden ${animateClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon Container with Teal Background */}
        <div className="bg-teal-500 h-32 flex items-center justify-center relative">
          {type === "success" && (
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <img
                src="https://i.ibb.co.com/Wy25CD3/7361b7fc8afb8967cde95738ba8c2d04.png"
                alt=""
                className="w-16 h-16"
              />
            </div>
          )}

          {/* Wave Shape */}
          <div className="absolute left-0 right-0 bottom-0 h-10 overflow-hidden">
            <svg
              viewBox="0 0 1440 320"
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              <path
                fill="white"
                d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>
        </div>
      </div>
    </div>
  );
}
