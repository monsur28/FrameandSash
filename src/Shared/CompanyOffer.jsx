"use client";

import { useState } from "react";
import { useLocation } from "react-router-dom";

const windows = [
  {
    type: "Windows 1",
    offerId: "0085",
    wholesellPrice: 250,
    marketPrice: 300,
    orders: 500,
  },
  {
    type: "Windows 2",
    offerId: "0086",
    wholesellPrice: 250,
    marketPrice: 300,
    rating: 4.9,
    orders: 400,
  },
  {
    type: "Windows 3",
    offerId: "0087",
    wholesellPrice: 250,
    marketPrice: 300,
    rating: 4.5,
    orders: 300,
  },
  {
    type: "Windows 4",
    offerId: "0086",
    wholesellPrice: 250,
    marketPrice: 300,
    rating: 4.7,
    orders: 200,
  },
  {
    type: "Windows 5",
    offerId: "0088",
    wholesellPrice: 250,
    marketPrice: 300,
    rating: 4.5,
    orders: 100,
  },
];

export default function CompanyOffer() {
  const location = useLocation();
  const companyData = location.state;
  const [activeTab, setActiveTab] = useState("active");

  return (
    <div className="min-h-screen rounded-lg p-6">
      {/* Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Company Info Card */}
        <div className="flex flex-row justify-center border-2 border-white bg-white50 backdrop-blur-16.5 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <img
              src={companyData.logo || ""}
              alt={`${companyData.name} logo`}
              className="w-32 h-32 object-cover bg-transparent"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
            >
              <path
                d="M13.0713 2.88508C13.8164 2.07787 14.1889 1.67426 14.5847 1.43884C15.5399 0.870784 16.716 0.85312 17.6871 1.39225C18.0895 1.61568 18.4735 2.00792 19.2415 2.79241C20.0094 3.5769 20.3934 3.96914 20.6121 4.38026C21.1399 5.37226 21.1226 6.5737 20.5665 7.54942C20.336 7.95379 19.9409 8.33434 19.1507 9.09542L9.74891 18.1509C8.25145 19.5932 7.50272 20.3144 6.56697 20.6799C5.63121 21.0454 4.6025 21.0185 2.54506 20.9647L2.26513 20.9573C1.63878 20.941 1.32561 20.9328 1.14356 20.7262C0.96151 20.5196 0.986364 20.2006 1.03607 19.5625L1.06306 19.2161C1.20297 17.4203 1.27292 16.5224 1.62358 15.7153C1.97425 14.9082 2.57913 14.2529 3.78888 12.9422L13.0713 2.88508Z"
                stroke="#252526"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M11.9995 3L18.999 9.99954"
                stroke="#252526"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M13.0005 20.9961L21 20.9961"
                stroke="#252526"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <div>
              <h1 className="text-xl font-semibold">{companyData.name}</h1>
              <p className="text-sm text-gray-600">
                5020 weston parkway, Suite 400 cary, NC 27513
              </p>
            </div>
          </div>
        </div>
        {/* Revenue Card */}
        <div className="border-2 flex flex-col justify-center items-center border-white bg-white50 backdrop-blur-16.5 rounded-3xl py-16 px-24 shadow-sm">
          <h2 className="text-xl mb-2">Revenue</h2>
          <p className="text-3xl font-bold">$10,000.00</p>
        </div>
        {/* Profit Card */}
        <div className="border-2 flex flex-col justify-center items-center border-white bg-white50 backdrop-blur-16.5 rounded-3xl p-6 shadow-sm">
          <h2 className="text-xl mb-2">Profit</h2>
          <p className="text-3xl font-bold">$5,000.00</p>
        </div>
      </div>

      {/* Order Status Tabs */}
      <div className="border-2 border-white bg-white50 backdrop-blur-16.5 rounded-2xl p-6 shadow-sm mb-8">
        <div className="flex flex-col lg:flex-row gap-4 mb-6 justify-center items-center ">
          {["active", "completed", "canceled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg flex items-center gap-2 ${
                activeTab === tab
                  ? "bg-teal-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab === "active" && (
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-2V4c4.411 0 8 3.589 8 8s-3.589 8-8 8z" />
                </svg>
              )}
              {tab === "completed" && (
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
              )}
              {tab === "canceled" && (
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                </svg>
              )}
              {`${tab.charAt(0).toUpperCase() + tab.slice(1)} Order`}
            </button>
          ))}
        </div>

        {/* Windows Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="pb-4 font-medium">Windows Type</th>
                <th className="pb-4 font-medium">OfferId</th>
                <th className="pb-4 font-medium">Wholesell Price</th>
                <th className="pb-4 font-medium">Market Price</th>
              </tr>
            </thead>
            <tbody className="divide-y-[20px] bg-white50 backdrop-blur-16.5 rounded-2xl">
              {windows.map((window) => (
                <tr
                  key={window.id}
                  className="rounded-[24px] bg-[rgba(0,157,170,0.6)] bg-opacity-50 mb-2"
                >
                  <td className="p-4 rounded-l-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-white rounded border border-gray-200" />
                      {window.type}
                    </div>
                  </td>
                  <td className="p-4">{window.offerId}</td>
                  <td className="p-4">${window.wholesellPrice}</td>
                  <td className="p-4 rounded-r-lg">${window.marketPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
