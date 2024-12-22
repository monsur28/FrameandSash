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
      "https://static.vecteezy.com/system/resources/thumbnails/033/168/356/small/a-beautiful-young-business-woman-in-a-suit-ai-generative-free-photo.jpg",
  },
  {
    id: 2,
    customerName: "Michael Brown",
    rating: 4,
    review:
      "Overall, a great experience. There were a few minor issues, but customer support was quick to resolve them. I’ll definitely use this service again.",
    date: "Nov 24, 2024 10:30 AM",
    image:
      "https://static.vecteezy.com/system/resources/thumbnails/033/168/356/small/a-beautiful-young-business-woman-in-a-suit-ai-generative-free-photo.jpg",
  },
  {
    id: 3,
    customerName: "Sophia White",
    rating: 5,
    review:
      "I was blown away by the quality and attention to detail! The entire process was seamless, and the final result was exactly what I needed.",
    date: "Nov 23, 2024 02:15 PM",
    image:
      "https://static.vecteezy.com/system/resources/thumbnails/033/168/356/small/a-beautiful-young-business-woman-in-a-suit-ai-generative-free-photo.jpg",
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
    <div className="bg-white rounded-lg shadow-md py-4 px-4">
      <h3 className="text-3xl font-bold text-[#009daa] mb-4">
        Customers Rating & Review
      </h3>

      <div className="px-20 py-5 rounded-lg  relative">
        <div className="mb-4 text-right">
          <p className="text-gray-400 text-sm">{date}</p>
        </div>

        <div className="relative border border-solid shadow-lg rounded-lg p-10">
          <img
            src={image}
            alt={customerName}
            className="w-28 h-28 rounded-full border border-gray-300 absolute -top-10 -left-8"
          />
          <div>
            <div className="lg:ml-64 ml-32 mb-10">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`${
                    i < rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <p className="text-gray-600 text-sm sm:text-base">{review}</p>
          </div>
        </div>

        {/* Navigation buttons */}
        <button
          onClick={handlePrevReview}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 text-teal-500 hover:text-teal-700 disabled:text-gray-300 transition duration-200"
          disabled={currentReviewIndex === 0}
          aria-label="Previous Review"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNextReview}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-teal-500 hover:text-teal-700 disabled:text-gray-300 transition duration-200"
          disabled={currentReviewIndex === reviews.length - 1}
          aria-label="Next Review"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default CustomerReview;
