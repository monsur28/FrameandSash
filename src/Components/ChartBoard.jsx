import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", Revenue: 3000, Profit: 1400 },
  { month: "Feb", Revenue: 4500, Profit: 2300 },
  { month: "Mar", Revenue: 3200, Profit: 1200 },
  { month: "Apr", Revenue: 4200, Profit: 2100 },
  { month: "May", Revenue: 3800, Profit: 1800 },
  { month: "Jun", Revenue: 3100, Profit: 1300 },
  { month: "Jul", Revenue: 3600, Profit: 1600 },
  { month: "Aug", Revenue: 4100, Profit: 2000 },
  { month: "Sep", Revenue: 4800, Profit: 2500 },
  { month: "Oct", Revenue: 5200, Profit: 2800 },
  { month: "Nov", Revenue: 4900, Profit: 2600 },
  { month: "Dec", Revenue: 5500, Profit: 3000 },
];

export default function ChartBoard() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-4xl mx-auto mt-8 border-2 border-white bg-white/50 backdrop-blur-[16.5px]">
      {/* Flex container to justify-between */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#009daa]">
          Chart Board
        </h3>
      </div>

      {/* Responsive container for the chart */}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />

          {/* Bars to display data */}
          <Bar dataKey="Revenue" fill="#3B82F6" />
          <Bar dataKey="Profit" fill="#10B981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
