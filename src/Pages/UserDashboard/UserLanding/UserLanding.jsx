/* eslint-disable react/no-unknown-property */
export default function UserLandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col text-white">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://i.ibb.co.com/mV0wSbtQ/image-24-2.png"
          alt="Windows background"
          className="w-full h-full object-cover brightness-50"
        />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-grow px-4 pt-24 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Welcome To
            <br />
            Frames and Sash
          </h1>
          <p className="text-lg mb-16 max-w-2xl mx-auto">
            We are a professional supplier of high-end doors, windows, and glass
            curtain walls in China with over 15 years of manufacturing
            experience and more than 200 employees at our factory.
          </p>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "15 Years Experience",
                description:
                  "With over two decades of expertise, Wintenic leads in manufacturing and exporting, setting industry standards in quality and innovation.",
              },
              {
                title: "Factory Direct Sales",
                description:
                  "We have introduced a complete set of automated production lines for doors and windows, with an annual production capacity of 150,000 m².",
              },
              {
                title: "Full Training Support",
                description:
                  "Wintenic ensures your success by offering full support & service during installation, equipping your company with advanced windows and doors.",
              },
            ].map((feature, index) => (
              <div key={index} className="flex flex-col items-center p-6">
                <div className="w-16 h-16 mb-4 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-300 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
