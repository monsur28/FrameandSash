import StatsCard from "./StateCard";
import ChartBoard from "./ChartBoard";
import TopSellingTable from "./TopSellingTable";
import CustomerReview from "./CustomerReview";
import { Calendar } from "lucide-react";

const Dashboard = () => {
  return (
    <>
      <div className="">
        <div className="flex flex-col sm:flex-row items-center sm:justify-between border-2 border-white bg-white/50 backdrop-blur-[16.5px] p-4 rounded-md shadow-md space-y-4 sm:space-y-0">
          {/* Date Range Picker */}
          <div className="flex items-center space-x-2 border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-600 w-full sm:w-auto">
            <span>Nov 1, 2024 - Nov 24, 2024</span>
            <Calendar className="w-5 h-5 text-gray-500" />
          </div>

          {/* Export Button */}
          <button className="flex items-center justify-center space-x-2 bg-teal-500 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-teal-600 transition duration-200 w-full sm:w-auto">
            <span>Export Data</span>
          </button>
        </div>
        <main className="p-4 md:p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <StatsCard title="Total Visitors" value="19587" info={true} />
                <StatsCard title="Conversion Rate" value="5%" info={true} />
                <StatsCard title="AOV" value="$575" info={true} />
                <StatsCard title="Return Customers" value="55%" info={true} />
              </div>
              <div className="lg:col-span-2">
                <ChartBoard />
              </div>
            </div>
            <div>
              <TopSellingTable />
              <div className="mt-6">
                <CustomerReview />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};
export default Dashboard;
