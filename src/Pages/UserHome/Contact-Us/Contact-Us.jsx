import { Home } from "lucide-react";
import { useState } from "react";

export default function ContactUs() {
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    subject: "General Inquiry",
    message: "",
  });

  const faqData = [
    {
      question: "What types of windows do you offer?",
      answer:
        "We offer a comprehensive range of window styles including double-hung, casement, sliding, bay, and more.",
    },
    {
      question: "How do I Choose the right door?",
      answer:
        "Choosing the perfect door involves considering the style, material, and security features. We provide a variety of options, from classic wooden doors to modern fiberglass ones, ensuring you find the ideal fit for your home.",
    },
    {
      question: "Are your products energy-efficient?",
      answer:
        "Our windows and doors are designed with energy efficiency in mind, helping to keep your home comfortable while reducing energy costs. Each product meets stringent energy performance standards.",
    },
    {
      question: "What warranty do you provide?",
      answer:
        "We stand behind our products with a comprehensive warranty that covers both materials and workmanship. This gives you peace of mind knowing that your investment is protected for years to come.",
    },
    {
      question: "Can I customize my order?",
      answer:
        "Yes! We offer a wide range of customization options for both windows and doors, allowing you to select colors, styles, and materials that match your unique aesthetic preferences.",
    },
    {
      question: "How long does delivery take?",
      answer:
        "Delivery times vary based on the product and customization level, but we strive to have your order delivered within 4 to 6 weeks. You will receive updates throughout the process.",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-gray-600">
        <Home className="inline-block h-4 w-4" />
        <span>You are here: </span>
        <a href="/" className="text-teal-600 hover:text-teal-700">
          Home
        </a>
        <span> › Contact Us</span>
      </div>

      <h1 className="text-3xl font-bold text-center mb-2">Contact Us</h1>
      <p className="text-center text-gray-600 mb-12">
        Any question or remarks? Just write us a message!
      </p>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-teal-800 text-white p-8 rounded-lg md:col-span-1">
          <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
          <p className="mb-8">Say something to start a live chat!</p>
          <div className="space-y-6">
            <div>
              <p className="font-semibold mb-1">Phone:</p>
              <p>+123 4567 897</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Email:</p>
              <p>info@renewdoorsnh.com</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Address:</p>
              <p>123 Street Boston, Road No 3 Florida, 02156 United States</p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-lg md:col-span-2"
        >
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <select
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option>General Inquiry</option>
              <option>Sales Inquiry</option>
              <option>Support</option>
              <option>Other</option>
            </select>
          </div>
          <div className="mb-6">
            <textarea
              name="message"
              placeholder="Write your message..."
              value={formData.message}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[150px] resize-y"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-4 px-8 rounded-md hover:bg-teal-700 transition-colors duration-300"
          >
            Send Message
          </button>
        </form>
      </div>

      <section className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-2">
          Frequently Asked Questions
        </h2>
        <p className="text-center text-gray-600 mb-8">We Are Here to Help</p>

        <div className="">
          {faqData.map((faq, index) => (
            <div key={index} className="border-b border-gray-200">
              <button
                className="w-full py-4 px-4 text-left flex justify-between items-center hover:bg-gray-50"
                onClick={() =>
                  setActiveQuestion(activeQuestion === index ? null : index)
                }
              >
                <span className="font-medium">{faq.question}</span>
                <span className="text-2xl text-teal-600">
                  {activeQuestion === index ? "−" : "+"}
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  activeQuestion === index ? "max-h-96 py-4 px-4" : "max-h-0"
                }`}
              >
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
