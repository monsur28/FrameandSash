import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WindowConfigurator from "./WindowConfigurator/WindowConfigurator"; // Your existing window configurator
import DoorConfigurator from "./DoorConfigurator/DoorConfigurator"; // The new door configurator

export default function ProductConfigurator() {
  const [activeTab, setActiveTab] = useState("windows");

  return (
    <div className="">
      <ToastContainer />

      {/* Tab Navigation */}
      <div className="rounded-lg shadow-md p-4 border border-gray-300">
        <div className="flex border-b">
          <button
            className={`py-3 px-6 font-medium text-lg ${
              activeTab === "windows"
                ? "border-b-2 border-teal-500 text-teal-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("windows")}
          >
            Windows
          </button>
          <button
            className={`py-3 px-6 font-medium text-lg ${
              activeTab === "doors"
                ? "border-b-2 border-teal-500 text-teal-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("doors")}
          >
            Doors
          </button>
        </div>
      </div>

      {/* Conditional Rendering of Configurators */}
      {activeTab === "windows" && <WindowConfigurator />}
      {activeTab === "doors" && <DoorConfigurator />}
    </div>
  );
}
