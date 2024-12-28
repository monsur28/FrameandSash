import { useState } from "react";
import { Edit, DoorOpen, DoorClosed, ZoomIn, ZoomOut } from "lucide-react";

export default function AddProduct() {
  const [selectedHandle, setSelectedHandle] = useState(null);
  const [selectedFrame, setSelectedFrame] = useState(null);

  const handleOptions = Array(7).fill(null);
  const frameOptions = Array(7).fill(null);

  return (
    <div className="p-6 border-2 border-white bg-white/50 backdrop-blur-[16.5px] rounded-3xl shadow-lg">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,120px] xl:grid-cols-[1fr,300px]  gap-6">
        {/* Left side - Product image and selections */}
        <div className="space-y-8">
          {/* Product Image */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <img
              src="/placeholder.svg"
              alt="Window Frame"
              width={250}
              height={250}
              className="mx-auto max-w-full"
            />
          </div>

          {/* Handle Selection */}
          <div className="space-y-2 rounded-2xl border-2 border-white bg-white/50 backdrop-blur-[16.5px] p-6 shadow-sm">
            <div className="text-xl font-medium">Handle:</div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {handleOptions.map((_, index) => (
                <button
                  key={`handle-${index}`}
                  onClick={() => setSelectedHandle(index)}
                  className={`w-16 h-16 rounded-lg border-2 flex-shrink-0 ${
                    selectedHandle === index
                      ? "border-teal-500 bg-teal-50"
                      : "border-gray-200 bg-gray-100"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Frame Selection */}
          <div className="space-y-2 rounded-2xl border-2 border-white bg-white/50 backdrop-blur-[16.5px] p-6 shadow-sm">
            <div className="text-xl font-medium">Frames:</div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {frameOptions.map((_, index) => (
                <button
                  key={`frame-${index}`}
                  onClick={() => setSelectedFrame(index)}
                  className={`w-16 h-16 rounded-lg border-2 flex-shrink-0 ${
                    selectedFrame === index
                      ? "border-teal-500 bg-teal-50"
                      : "border-gray-200 bg-gray-100"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="space-y-4 flex flex-col sm:flex-row sm:space-y-0 sm:space-x-4 lg:flex-col lg:space-y-4 lg:space-x-0">
          <button className="w-full max-w-[420px] bg-teal-500 text-white rounded-lg p-4 flex items-center justify-center gap-2 hover:bg-teal-600 transition-colors">
            <Edit className="w-5 h-5" />
            <span>Edit</span>
          </button>
          <button className="w-full max-w-[420px] bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
            <DoorOpen className="w-5 h-5" />
            <span>Open</span>
          </button>
          <button className="w-full max-w-[420px] bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
            <DoorClosed className="w-5 h-5" />
            <span>Close</span>
          </button>
          <button className="w-full max-w-[420px] bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
            <ZoomIn className="w-5 h-5" />
            <span>Zoom In</span>
          </button>
          <button className="w-full max-w-[420px] bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
            <ZoomOut className="w-5 h-5" />
            <span>Zoom Out</span>
          </button>
        </div>
      </div>

      {/* Product Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
        {/* Ingredient */}
        <div className="flex flex-col justify-center items-center space-y-4 rounded-2xl border-2 border-white bg-white/50 backdrop-blur-[16.5px] ">
          <h3 className="text-xl text-gray-500">Ingredient</h3>
          <div className="rounded-lg p-6 shadow-sm space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-400" />
              <span>1×1m Contains</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-400" />
              <span>4m of frame</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-400" />
              <span>4m of frame</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-400" />
              <span>1m 2 of glass</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-400" />
              <span>1 set of hardware</span>
            </div>
          </div>
        </div>

        {/* Working Hour */}
        <div className="flex flex-col justify-center items-center space-y-4 rounded-2xl border-2 border-white bg-white/50 backdrop-blur-[16.5px] p-4">
          <h3 className="text-xl text-gray-500">Working Hour</h3>
          <div>
            <div className="text-4xl font-medium text-center">05</div>
          </div>
        </div>

        {/* Wholesale Price */}
        <div className="flex flex-col justify-center items-center space-y-4 rounded-2xl border-2 border-white bg-white/50 backdrop-blur-[16.5px] p-4">
          <h3 className="text-xl text-gray-500">Wholesell Price</h3>
          <div>
            <div className="text-4xl font-medium text-center">$80</div>
          </div>
        </div>

        {/* Market Price */}
        <div className="flex flex-col justify-center items-center space-y-4 rounded-2xl border-2 border-white bg-white/50 backdrop-blur-[16.5px] p-4">
          <h3 className="text-xl text-gray-500">Market Price</h3>
          <div>
            <div className="text-4xl font-medium text-center">$100</div>
          </div>
        </div>
      </div>
    </div>
  );
}
