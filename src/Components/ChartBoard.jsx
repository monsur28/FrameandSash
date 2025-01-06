import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register the necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ChartBoard() {
  const [activeData, setActiveData] = useState(["revenue", "profit"]);

  const toggleData = (key) => {
    setActiveData((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Define chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: "#E5E7EB",
        },
        ticks: {
          stepSize: 1000,
          max: 7000,
        },
        border: {
          display: false,
        },
      },
    },
    barPercentage: 0.8,
    categoryPercentage: 0.7,
  };

  // Define data for the chart
  const labels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const data = {
    labels,
    datasets: [
      activeData.includes("revenue") && {
        label: "Revenue",
        data: [
          5000, 4800, 5500, 3800, 6000, 4800, 3200, 3200, 4800, 5500, 3800,
          4500,
        ],
        backgroundColor: "#06b6d4",
        borderRadius: 4,
      },
      activeData.includes("profit") && {
        label: "Profit",
        data: [
          4500, 3800, 3200, 3000, 5000, 3800, 3600, 3500, 3800, 3200, 3000,
          3800,
        ],
        backgroundColor: "#000000",
        borderRadius: 4,
      },
    ].filter(Boolean), // Filter out null/undefined values
  };

  return (
    <div className="rounded-[24px] border-2 border-white bg-white/50 backdrop-blur-[16.5px] p-4 sm:p-6 shadow-sm">
      <div className="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
          Chart Board
        </h2>
        <div className="flex flex-wrap items-center gap-4">
          <button
            className={`flex items-center gap-2 ${
              activeData.includes("revenue") ? "opacity-100" : "opacity-50"
            }`}
            onClick={() => toggleData("revenue")}
          >
            <div className="h-3 w-3 rounded-full bg-[#06b6d4]" />
            <span className="text-sm text-gray-500">Revenue</span>
          </button>
          <button
            className={`flex items-center gap-2 ${
              activeData.includes("profit") ? "opacity-100" : "opacity-50"
            }`}
            onClick={() => toggleData("profit")}
          >
            <div className="h-3 w-3 rounded-full bg-black" />
            <span className="text-sm text-gray-500">Profit</span>
          </button>
        </div>
      </div>
      <div className="h-[425px] sm:h-[400px] w-full min-h-[425px]">
        <Bar options={options} data={data} />
      </div>
    </div>
  );
}
