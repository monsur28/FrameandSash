/* eslint-disable react/no-unknown-property */
export default function Testimonials() {
  const testimonials = [
    {
      name: "William Wilson",
      location: "Grand canyon, USA",
      image: "https://i.ibb.co.com/TxdsrR6K/image-5.png",
      text: "I had an amazing experience with this door and window manufacturer! The website was easy to navigate, and I loved the customization options available for my windows. The quality of the products is exceptional, and they arrived on time. Customer support was very responsive and guided me throughout the process. My home looks fantastic now—highly recommend!",
    },
    {
      name: "Kathryn Murphy",
      location: "Paris,France",
      image: "https://i.ibb.co.com/5x6dn6Wt/image-10.png",
      text: "This company exceeded my expectations. The website had detailed product descriptions and images, making it simple to choose the right doors for my home. The craftmanship is top-notch, and the installation was hassle-free. Their team even helped me with measurements to ensure a perfect fit. Great value for the price!",
    },
  ];

  return (
    <section className=" px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-gray-800 text-lg font-medium mb-2">
          HEAR WHAT OUR HAPPY SELLER HAVE TO SAY
        </h2>
        <h3 className="text-[#00A9A7] text-4xl font-bold">
          Our Clients Feedback
        </h3>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden">
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                <p className="text-gray-600">{testimonial.location}</p>
              </div>
            </div>
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-5 h-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <blockquote className="text-gray-700 italic">
              &quot;{testimonial.text}&quot;
            </blockquote>
          </div>
        ))}
      </div>

      {/* <div className="text-center">
        <button className="bg-[#00A9A7] text-white px-8 py-3 rounded-full hover:bg-[#008F8D] transition-colors">
          View More →
        </button>
      </div> */}
    </section>
  );
}
