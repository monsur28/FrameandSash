/* eslint-disable react/no-unknown-property */
import { useState, useEffect } from "react";

const companies = [
  {
    logo: "https://i.ibb.co/QFTT935T/ogilvy-logo-1.png",
    name: "Ogilvy",
    description:
      "Ogilvy is a New York City-based British advertising, marketing, and public relations agency",
  },
  {
    logo: "https://i.ibb.co/wFqk2ZNW/mccann-worldgroup-logo-black-1.png",
    name: "McCann Worldgroup",
    description:
      "McCann Worldgroup is a leading global marketing services company with an integrated network of advertising agencies",
  },
  {
    logo: "https://i.ibb.co/QFTT935T/ogilvy-logo-1.png",
    name: "Dentsu",
    description:
      "Dentsu is an international advertising and public relations company headquartered in Tokyo, Japan.",
  },
  {
    logo: "https://i.ibb.co/wFqk2ZNW/mccann-worldgroup-logo-black-1.png",
    name: "Leo Burnett",
    description:
      "Leo Burnett is an American advertising company, founded in 1935 in Chicago, known for its creative branding strategies.",
  },
];

export default function PopularCompany() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(2); // Default to 2 slides

  // Update slidesPerView based on screen width
  useEffect(() => {
    const updateSlidesPerView = () => {
      if (window.innerWidth < 640) {
        setSlidesPerView(1);
      } else {
        setSlidesPerView(2);
      }
    };

    updateSlidesPerView();
    window.addEventListener("resize", updateSlidesPerView);
    return () => window.removeEventListener("resize", updateSlidesPerView);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev + slidesPerView >= companies.length ? 0 : prev + slidesPerView
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev - slidesPerView < 0
        ? companies.length - slidesPerView
        : prev - slidesPerView
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="px-4 py-8 md:py-12 mt-20">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-4xl font-bold mb-4 text-[#00BFB3]">
          Popular Companies
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
          Trusted by thousands, we are a popular company known for delivering
          top-quality doors and windows that combine style, durability, and
          innovation.
        </p>
      </div>

      <div className="relative">
        {/* Navigation Arrows */}
        <div className="flex items-center justify-between">
          {/* Left Arrow */}
          <button
            onClick={prevSlide}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Previous slide"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Slides Container */}
          <div className="overflow-hidden flex-1">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${
                  (currentSlide / slidesPerView) * 100
                }%)`,
              }}
            >
              {companies.map((company, index) => (
                <div
                  key={index}
                  className="w-full sm:w-1/2 flex-shrink-0 flex flex-col items-center text-center p-6"
                >
                  <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto">
                    <img
                      src={company.logo || "/placeholder.svg"}
                      alt={company.name}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <p className="text-gray-600 mt-4 max-w-xs text-sm sm:text-base">
                    {company.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={nextSlide}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Next slide"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({
            length: Math.ceil(companies.length / slidesPerView),
          }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index * slidesPerView)}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentSlide === index * slidesPerView
                  ? "bg-[#00BFB3]"
                  : "bg-gray-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
