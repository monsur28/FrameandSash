import { Link } from "react-router-dom";

export default function Banner() {
  return (
    <section
      className="relative h-screen w-full flex items-center justify-center text-center text-white bg-cover bg-center bg-no-repeat px-6"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://i.ibb.co.com/1trBYTd0/image-24-1.png')`,
      }}
    >
      <div className="max-w-4xl px-4 md:px-6">
        {/* Top Tagline */}
        <p className="text-xs sm:text-sm md:text-base tracking-[2px] uppercase mb-3 sm:mb-4">
          LIFETIME REALTY PARTNER
        </p>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6">
          Your Gateway to Quality
          <br />
          Doors & Windows
        </h1>

        {/* Subtext */}
        <p className="text-sm sm:text-lg md:text-xl leading-relaxed mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto">
          Discover durable, stylish, and energy-efficient solutions tailored to
          fit your space. Designed for comfort, built to last.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link to="/contact-us">
            <button
              onClick={() => console.log("Get in touch clicked")}
              className="bg-[#00B2B2] hover:bg-[#009999] text-white px-6 sm:px-8 py-2 sm:py-3 rounded transition-colors duration-300 text-sm sm:text-base"
            >
              Get In Touch
            </button>
          </Link>
          <Link to="/about-us">
            <button className="border border-white text-white px-6 sm:px-8 py-2 sm:py-3 rounded hover:bg-white/10 transition-colors duration-300 text-sm sm:text-base">
              Learn More
            </button>
          </Link>
        </div>
      </div>

      {/* ✅ Custom Media Queries for Breakpoints */}
      <style>
        {`
          @media (max-width: 932px) {
            section { height: 90vh; }
            h1 { font-size: 3rem; }
          }
  
          @media (max-width: 896px) {
            section { height: 85vh; }
            h1 { font-size: 2.8rem; }
            p { font-size: 1rem; }
          }
  
          @media (max-width: 844px) {
            section { height: 80vh; }
            h1 { font-size: 2.5rem; }
            p { font-size: 0.95rem; }
          }
  
          @media (max-width: 740px) {
            h1 { font-size: 2.3rem; }
            p { font-size: 0.9rem; }
          }
  
          @media (max-width: 667px) {
            section { height: 75vh; }
            h1 { font-size: 2rem; }
          }
  
          @media (max-width: 450px) {
            h1 { font-size: 1.8rem; }
            p { font-size: 0.85rem; }
            .button { width: 100%; }
          }
  
          @media (max-width: 375px) {
            h1 { font-size: 1.5rem; }
            p { font-size: 0.8rem; }
          }
          `}
      </style>
    </section>
  );
}
