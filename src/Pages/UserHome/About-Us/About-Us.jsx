import { Github, Linkedin, Twitter } from "lucide-react";

export default function AboutUs() {
  const stats = [
    { number: "10.5k", label: "Sellers active our site" },
    { number: "33k", label: "Monthly Prooduct Sale" },
    { number: "45.5k", label: "Customer active in our site" },
    { number: "25k", label: "Anual gross sale in our site" },
  ];

  const team = [
    {
      name: "James William",
      role: "Founder & Chairman",
      image: "https://i.ibb.co.com/LXbHZpFT/image-46.png",
    },
    {
      name: "Sophia Emily",
      role: "Managing Director",
      image: "https://i.ibb.co.com/279vgGVq/image-51.png",
    },
    {
      name: "Daniel Matthew",
      role: "Product Designer",
      image: "https://i.ibb.co.com/WNGcGXjc/image-47.png",
    },
  ];

  const services = [
    {
      title: "FREE AND FAST DELIVERY",
      description: "Free delivery for all orders over $140",
    },
    {
      title: "24/7 CUSTOMER SERVICE",
      description: "Friendly 24/7 customer support",
    },
    {
      title: "MONEY BACK GUARANTEE",
      description: "We return money within 30 days",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm mb-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-cyan-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
        <span className="mx-2">You are here:</span>
        <span>Home</span>
        <span className="mx-2">›</span>
        <span className="text-cyan-500">About us</span>
      </nav>

      {/* Header */}
      <div className="mb-16">
        <h1 className="text-4xl font-bold mb-2">
          About Us- <span className="text-cyan-500">Frame and sash</span>
        </h1>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <p className="text-gray-600">
              Welcome to Frame and Sash, your trusted partner in high-quality
              windows and doors. With years of expertise in manufacturing and
              sales, we are committed to delivering durable, stylish, and
              energy-efficient solutions for homes and businesses.
            </p>
            <p className="text-gray-600">
              At Frame and Sash, we prioritize innovation, craftsmanship, and
              customer satisfaction. Our products are designed to enhance both
              aesthetics and functionality, ensuring superior insulation,
              security, and long-lasting performance.
            </p>
          </div>
          <div className="gap-4">
            <img
              src="https://i.ibb.co.com/RkvWLNYV/image-52.png"
              alt="Door sample 1"
              width={200}
              height={400}
              className="rounded-lg w-full"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-6 text-center shadow-sm"
          >
            <div className="text-3xl font-bold mb-2">{stat.number}</div>
            <div className="text-gray-600 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Team */}
      <div className="mb-16">
        {/* items-stretch ensures each column stretches to the same height */}
        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {team.map((member, index) => (
            <div
              key={index}
              className="text-center flex flex-col h-full bg-white shadow-sm rounded p-4"
            >
              {/* Fixed width and height for the image */}
              <img
                src={member.image || "/placeholder.svg"}
                alt={member.name}
                className="rounded-lg mb-4 mx-auto object-contain w-[300px] h-[400px]"
              />

              <h3 className="font-bold text-xl mb-1">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>

              {/* Social Icons at the bottom, using Lucide React */}
              <div className="flex justify-center space-x-4 mt-auto pt-4">
                <a href="#" className="text-gray-400 hover:text-gray-600">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600">
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Services */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {services.map((service, index) => (
          <div key={index} className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-cyan-500 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="font-bold text-xl mb-2">{service.title}</h3>
            <p className="text-gray-600">{service.description}</p>
          </div>
        ))}
      </div>

      {/* Contact Section */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold text-blue-600 mb-4">
              Have Questions?
            </h2>
            <h3 className="text-xl mb-4">We Are There to Advise</h3>
            <p className="text-gray-600 mb-6">
              Whether you have detailed plans for a new-build or renovation or
              are just starting out, our team is happy to help.
            </p>
            <p className="text-gray-600 mb-6">
              Contact us for one-on-one expert advice to configure your product
              to meet your specific requirements and preferences. We are
              available from Monday to Friday, 9am to 6pm CET.
            </p>
            <button className="bg-cyan-500 text-white px-6 py-3 rounded-lg hover:bg-cyan-600 transition-colors">
              Book a consultation
            </button>
          </div>
          <div>
            <img
              src="https://i.ibb.co.com/4ZfXLjHT/image-i-Bwnr-X7k-T-transformed-6.png"
              alt="Customer support representative"
              width={500}
              height={400}
              className="rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="mt-16 text-center">
        <p className="mb-2">Was this information useful?</p>
        <div className="flex items-center justify-center space-x-1">
          {[1, 2, 3, 4].map((star) => (
            <svg
              key={star}
              className="w-5 h-5 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-2">(54 ratings, Ø 4.3)</p>
      </div>
    </div>
  );
}
