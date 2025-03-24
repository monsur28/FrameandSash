import { useState, useEffect } from "react";

const PushNotification = ({ message, type, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Trigger notification visibility on new message
  useEffect(() => {
    if (message) {
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false);
      }, duration);
    }
  }, [message, duration]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg transition-transform duration-300 ease-in-out ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
      style={{ transform: isVisible ? "translateY(0)" : "translateY(100%)" }}
    >
      <div className="text-white font-medium">{message}</div>
    </div>
  );
};

export default PushNotification;
