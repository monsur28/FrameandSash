const NavigationButton = () => {
  return (
    <>
      {/* Navigation buttons */}
      <button
        className="custom-swiper-button-prev absolute left-0 top-1/2 transform -translate-y-1/2 z-10 
               transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none"
        aria-label="Previous slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="34"
          height="34"
          viewBox="0 0 34 34"
          fill="none"
        >
          <circle
            cx="17"
            cy="17"
            r="17"
            transform="matrix(-1 0 0 1 34 0)"
            fill="#F2F2F2"
          />
          <path
            d="M15.3658 22.23L10.4619 17.6531M10.4619 17.6531L15.3658 13.0762M10.4619 17.6531H22.2311"
            stroke="black"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <button
        className="custom-swiper-button-next absolute right-0 top-1/2 transform -translate-y-1/2 z-10 
               transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none"
        aria-label="Next slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="34"
          height="34"
          viewBox="0 0 34 34"
          fill="none"
        >
          <circle cx="17" cy="17" r="17" fill="#F2F2F2" />
          <path
            d="M18.6342 11.77L23.5381 16.3469M23.5381 16.3469L18.6342 20.9238M23.5381 16.3469H11.7689"
            stroke="black"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </>
  );
};

export default NavigationButton;
