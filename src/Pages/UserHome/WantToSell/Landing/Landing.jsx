import { Link } from "react-router-dom";

export default function WantToSellLanding() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation */}
      <div className="bg-white px-4 py-3 flex items-center gap-2 text-sm">
        <span className="text-teal-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0001.414-1.414l-7-7z" />
          </svg>
        </span>
        <span>You are here:</span>
        <a href="/" className="text-teal-500">
          Home
        </a>
        <span>›</span>
        <span className="text-teal-500">Want to sell</span>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Grow your business with Frame and Sash
          </h1>
          <p className="text-gray-600">
            At Frame and Sash, we prioritize innovation, craftsmanship, and
            customer satisfaction. Our products are designed to enhance both
            aesthetics and functionality, ensuring superior insulation,
            security, and long-lasting performance.
          </p>
        </div>
        <div className="relative h-[400px] rounded-2xl overflow-hidden bg-gradient-to-r from-blue-50 to-rose-50">
          <img
            src="https://i.ibb.co.com/RkvWLNYV/image-52.png"
            alt="Frame and Sash products showcase"
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">
            How It Works?
          </h2>
          <p className="text-center text-gray-500 mb-12">5 Steps of Proceed</p>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {[
              {
                step: "01",
                title: "Sign up for free",
                description: "Create your Seller Account in minutes.",
              },
              {
                step: "02",
                title: "Upload your products",
                description:
                  "Add doors and windows with images, prices, and details",
              },
              {
                step: "03",
                title: "Get order notifications",
                description:
                  "Receive instant alerts when a customer places an order.",
              },
              {
                step: "04",
                title: "Ship & Deliver",
                description: "Process the order and arrange for delivery",
              },
              {
                step: "05",
                title: "Get paid easily",
                description: "Receive secure payments hassle-free",
              },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                {/* Step Circle */}
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="100"
                    height="100"
                    viewBox="0 0 200 202"
                    fill="none"
                  >
                    <path
                      d="M197.727 101.273C197.727 155.967 153.886 200.276 99.8407 200.276C45.7952 200.276 1.9541 155.967 1.9541 101.273C1.9541 46.579 45.7952 2.26953 99.8407 2.26953C153.886 2.26953 197.727 46.579 197.727 101.273Z"
                      fill="white"
                      stroke="url(#paint0_linear_843_771)"
                      strokeWidth="3"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_843_771"
                        x1="99.8407"
                        y1="0.769531"
                        x2="171.224"
                        y2="198.339"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#E2A11A" />
                        <stop offset="1" stopColor="#D82108" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Step Number inside SVG */}
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="font-bold text-xl">{item.step}</span>
                    <span className="text-sm">STEP</span>
                  </div>
                </div>

                {/* Step Title & Description */}
                <h3 className="mt-6 font-semibold text-gray-900 text-center">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500 text-center">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Support & Assistance */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Support & Assistance
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-6 rounded-xl text-center">
            <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">24/7 Availability</h3>
            <p className="text-gray-500">
              Get round-the-clock help whenever you need it
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl text-center">
            <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Personal Account Manager
            </h3>
            <p className="text-gray-500">
              Dedicated support to guide you through selling
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl text-center">
            <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Marketing Guidelines & Tips
            </h3>
            <p className="text-gray-500">
              Expert advice to boost your sales and visibility
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="px-4 py-8 flex justify-center space-x-4">
        <button className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
          Cancel
        </button>
        <Link to="/want-to-sell/CreateManufacturer">
          <button className="px-6 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600">
            Next
          </button>
        </Link>
      </div>
    </div>
  );
}
