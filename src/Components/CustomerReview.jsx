import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const reviews = [
  {
    id: 1,
    customerName: "Emily Carter",
    rating: 5,
    review:
      "Fantastic service! The team was professional and responsive, and the product exceeded my expectations. Highly recommend!",
    date: "Nov 25, 2024 08:45 AM",
    image:
      "https://images.squarespace-cdn.com/content/v1/53b599ebe4b08a2784696956/1451882872681-B0PM3YN9RPLLA36MKVI8/image-asset.jpeg?format=500w",
  },
  {
    id: 2,
    customerName: "Michael Brown",
    rating: 4,
    review:
      "Overall, a great experience. There were a few minor issues, but customer support was quick to resolve them. I’ll definitely use this service again.",
    date: "Nov 24, 2024 10:30 AM",
    image:
      "https://images.squarespace-cdn.com/content/v1/53b599ebe4b08a2784696956/1451882872681-B0PM3YN9RPLLA36MKVI8/image-asset.jpeg?format=500w",
  },
  {
    id: 3,
    customerName: "Sophia White",
    rating: 5,
    review:
      "I was blown away by the quality and attention to detail! The entire process was seamless, and the final result was exactly what I needed.",
    date: "Nov 23, 2024 02:15 PM",
    image:
      "https://images.squarespace-cdn.com/content/v1/53b599ebe4b08a2784696956/1451882872681-B0PM3YN9RPLLA36MKVI8/image-asset.jpeg?format=500w",
  },
];

const CustomerReview = () => {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const handleNextReview = () => {
    if (currentReviewIndex < reviews.length - 1) {
      setCurrentReviewIndex(currentReviewIndex + 1);
    }
  };

  const handlePrevReview = () => {
    if (currentReviewIndex > 0) {
      setCurrentReviewIndex(currentReviewIndex - 1);
    }
  };

  const { customerName, rating, review, date, image } =
    reviews[currentReviewIndex];

  return (
    <div className="w-full flex flex-col text-black justify-between rounded-[24px] border-2 border-white bg-white50 backdrop-blur-16.5 p-8 shadow-md  ">
      {/* Stars */}
      <div className="flex gap-2 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            className="text-violet-500"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path
              d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"
              className={`${i < rating ? "text-violet-500" : "text-gray-300"}`}
            />
          </svg>
        ))}
      </div>

      {/* Review */}
      <p className="my-4 mb-0 text-base md:text-base lg:text-lg font-normal leading-relaxed tracking-wide">
        {review}
      </p>

      {/* Customer Info */}
      <div className="mt-6 flex items-center gap-6">
        <div className="h-12 w-12 overflow-hidden rounded-full shadow-sm">
          <img
            alt={customerName}
            src={image}
            width="48"
            height="48"
            className="object-cover"
          />
        </div>
        <div>
          <p className="leading-relaxed tracking-wide font-medium text-gray-800">
            {customerName}
          </p>
          <p className="text-sm leading-relaxed tracking-wide text-gray-500">
            {date}
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={handlePrevReview}
          disabled={currentReviewIndex === 0}
          aria-label="Previous Review"
          className="text-gray-600 hover:text-gray-800 disabled:text-gray-300"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button
          onClick={handleNextReview}
          disabled={currentReviewIndex === reviews.length - 1}
          aria-label="Next Review"
          className="text-gray-600 hover:text-gray-800 disabled:text-gray-300"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

export default CustomerReview;
