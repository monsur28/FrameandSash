import { Download } from "lucide-react";

const Manufacturer = () => {
  return (
    <div>
      <div className="bg-[#DDDDDD] p-5 rounded-md flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Manufacturer</h1>
          <div className="flex space-x-4 mt-4">
            <button className="bg-teal-500 text-white px-4 py-2 rounded">
              This Year
            </button>
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded">
              Last Year
            </button>
          </div>
        </div>
        <div>
          <button className="bg-teal-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <span>+</span>
            <span>Add Manufacture</span>
          </button>
          <button className="bg-cyan-400 text-white px-4 py-2 mt-4 rounded-lg flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Manufacturer;
