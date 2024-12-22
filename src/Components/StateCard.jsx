/* eslint-disable react/prop-types */
import { Info } from "lucide-react";

const StatsCard = ({ title, value, description, icon, showInfo = false }) => {
  return (
    <div className="stat bg-white rounded-lg shadow p-6 lg:p-8 flex items-center">
      {/* Icon or Stat Figure */}
      {icon && <div className="stat-figure text-primary">{icon}</div>}

      {/* Stat Details */}
      <div>
        <div className="stat-title text-gray-500">{title}</div>
        <div className="stat-value text-primary text-4xl font-bold">
          {value}
        </div>
        {description && (
          <div className="stat-desc text-gray-400">{description}</div>
        )}
      </div>

      {/* Optional Info Button */}
      {showInfo && (
        <button
          className="ml-auto text-gray-300 hover:text-gray-400 transition-colors"
          aria-label="More information"
        >
          <Info className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default StatsCard;
