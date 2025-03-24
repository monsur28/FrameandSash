/* eslint-disable react/no-unknown-property */
export default function TrendSection() {
  return (
    <section className="px-4 py-12 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="relative w-full max-w-sm sm:max-w-xs md:max-w-sm lg:max-w-md mx-auto">
          <img
            src="https://i.ibb.co.com/wZr8MysR/wood-entry-doors-pros-jpg.png"
            alt="Elegant wooden door with glass panels and lanterns"
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>
        <div className="space-y-6 text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            2024 Design Trends for Frame & Sash
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">
            Discover the big trends that will impact your projects in 2024. Read
            our latest report for expert insights on the trends, the style
            conversations they&apos;re driving, and products that can bring your
            vision to life.
          </p>
          {/* <div className="flex justify-center md:justify-start">
            <button
              className="inline-flex items-center px-6 py-3 bg-teal-500 hover:bg-teal-600 
            text-white font-medium rounded-md transition-colors duration-200"
            >
              <span>DOWNLOAD REPORT</span>
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </button>
          </div> */}
        </div>
      </div>
    </section>
  );
}
