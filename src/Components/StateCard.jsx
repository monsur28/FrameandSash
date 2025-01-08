import { Info } from "lucide-react";

const StatsCard = ({ title, value, description, icon, showInfo = false }) => {
  return (
    <div className="rounded-[24px] shadow p-6 lg:p-8 flex flex-col items-center justify-center text-center border-2 border-white bg-white50 backdrop-blur-16.5">
      {/* Icon or Stat Figure */}
      {icon && <div className="stat-figure text-primary mb-4">{icon}</div>}

      {/* Stat Details */}
      <div className="">
        <div className="stat-title text-gray-500 text-lg md:text-xl lg:text-xl font-semibold">
          {title}
        </div>
        <div className="stat-value text-primary text-lg md:text-xl lg:text-3xl font-bold">
          {value}
        </div>
        {description && (
          <div className="stat-desc text-gray-400 text-xs md:text-sm mt-2">
            {description}
          </div>
        )}
      </div>

      {/* Optional Info Button */}
      {showInfo && (
        <button
          className="mt-4 text-gray-300 hover:text-gray-400 transition-colors"
          aria-label="More information"
        >
          <Info className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default StatsCard;
