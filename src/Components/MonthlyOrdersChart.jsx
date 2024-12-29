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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function MonthlyOrdersChart({ activeYear }) {
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
          stepSize: 10,
          max: 60,
        },
        border: {
          display: false,
        },
      },
    },
    barPercentage: 0.8,
    categoryPercentage: 0.7,
  };

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

  const dataThisYear = {
    labels,
    datasets: [
      {
        data: [40, 30, 45, 50, 60, 70, 80, 75, 65, 55, 45, 50],
        backgroundColor: "#009DAA",
        borderRadius: 4,
      },
      {
        data: [20, 25, 30, 35, 40, 45, 50, 55, 60, 50, 40, 35],
        backgroundColor: "#252526",
        borderRadius: 4,
      },
      {
        data: [35, 40, 30, 25, 30, 35, 40, 45, 50, 60, 70, 75],
        backgroundColor: "#CC4646",
        borderRadius: 4,
      },
      {
        data: [10, 15, 20, 25, 20, 15, 10, 20, 25, 30, 35, 40],
        backgroundColor: "#03ADD9",
        borderRadius: 4,
      },
    ],
  };

  const dataLastYear = {
    labels,
    datasets: [
      {
        data: [30, 25, 35, 40, 50, 60, 65, 60, 55, 50, 40, 35],
        backgroundColor: "#009DAA",
        borderRadius: 4,
      },
      {
        data: [15, 20, 25, 30, 35, 40, 45, 50, 55, 50, 45, 40],
        backgroundColor: "#252526",
        borderRadius: 4,
      },
      {
        data: [25, 30, 35, 40, 45, 50, 55, 60, 65, 60, 50, 45],
        backgroundColor: "#CC4646",
        borderRadius: 4,
      },
      {
        data: [5, 10, 15, 40, 55, 50, 85, 10, 15, 50, 25, 60],
        backgroundColor: "#03ADD9",
        borderRadius: 4,
      },
    ],
  };

  const data = activeYear === "thisYear" ? dataThisYear : dataLastYear;

  return (
    <div className="w-full lg:w-full rounded-lg shadow-sm p-6">
      <div className="h-[200px]">
        <Bar options={options} data={data} />
      </div>
    </div>
  );
}
