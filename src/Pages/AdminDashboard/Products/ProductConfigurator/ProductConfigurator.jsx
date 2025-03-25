import { useState } from "react";
import WindowConfigurator from "./WindowConfigurator/WindowConfigurator"; // Your existing window configurator
import DoorConfigurator from "./DoorConfigurator/DoorConfigurator"; // The new door configurator

export default function ProductConfigurator() {
  const [activeTab, setActiveTab] = useState("windows");

  return (
    <div>
      {/* Tab Navigation */}
      <div className="p-4 flex justify-center">
        <div className="relative w-64 h-12 bg-primary  rounded-full flex items-center p-1 shadow-lg">
          <div
            className={`absolute top-1 left-1 w-28 h-10 bg-teal-500 rounded-full transition-all duration-300 ${
              activeTab === "doors" ? "translate-x-[120%]" : "translate-x-0"
            }`}
          ></div>
          <button
            className={`w-1/2 text-lg font-medium relative z-10 transition-all ${
              activeTab === "windows" ? "text-white" : "text-gray-600"
            }`}
            onClick={() => setActiveTab("windows")}
          >
            Windows
          </button>
          <button
            className={`w-1/2 text-lg font-medium relative z-10 transition-all ${
              activeTab === "doors" ? "text-white" : "text-gray-600"
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
