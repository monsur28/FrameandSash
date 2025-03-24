import { useState } from "react";

const faqs = [
  {
    question: "What types of windows do you offer?",
    answer:
      "We offer a wide variety of window styles including double-hung, casement, sliding, bay, and picture windows. Each type is available in different materials and finishes.",
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

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="px-4 py-12 mt-[500px] lg:mt-0">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-2">Frequently Asked Questions</h2>
        <p className="text-gray-600">We Are Here to Help</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium">{faq.question}</span>
              <span className="ml-6 flex-shrink-0 text-gray-400">
                {openIndex === index ? "−" : "+"}
              </span>
            </button>

            <div
              className={`px-6 overflow-hidden transition-all duration-200 ease-in-out ${
                openIndex === index ? "max-h-96 py-4" : "max-h-0"
              }`}
            >
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
