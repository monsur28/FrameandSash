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

export default function MonthlyOrdersChart() {
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
          max: 50,
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

  const data = {
    labels,
    datasets: [
      {
        data: [45, 45, 35, 33, 15, 30, 20, 35, 35, 45, 35, 35],
        backgroundColor: "#009DAA",
        borderRadius: 4,
      },
      {
        data: [50, 25, 40, 19, 25, 37, 32, 40, 40, 52, 42, 47],
        backgroundColor: "#252526",
        borderRadius: 4,
      },
      {
        data: [42, 42, 48, 41, 35, 32, 35, 45, 48, 45, 55, 50],
        backgroundColor: "#CC4646",
        borderRadius: 4,
      },
      {
        data: [42, 42, 48, 41, 35, 32, 35, 45, 48, 45, 55, 50],
        backgroundColor: "#03ADD9",
        borderRadius: 4,
      },
    ],
  };

  return (
    <div className=" lg:w-full rounded-lg shadow-sm p-6">
      <div className="h-[200px]">
        <Bar options={options} data={data} />
      </div>
    </div>
  );
}
