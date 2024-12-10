/* eslint-disable react/prop-types */
import { Info } from "lucide-react";

const StatsCard = ({ title, value, showInfo = true }) => {
  return (
    <div className="bg-white rounded-lg p-10 shadow-sm flex justify-between items-center">
      <div className="text-center flex-1">
        <h3 className="text-[#009daa] font-medium text-2xl">{title}</h3>
        <div className="mt-4 text-4xl font-bold tracking-tight">{value}</div>
      </div>

      {/* Info button */}
      <div className="relative -top-[40px] left-4">
        {showInfo && (
          <button
            className="text-gray-300 hover:text-gray-400 transition-colors"
            aria-label="More information"
          >
            <Info className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
