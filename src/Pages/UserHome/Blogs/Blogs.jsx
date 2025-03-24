/* eslint-disable react/no-unknown-property */
const recentBlogs = [
  {
    title: "Choosing the Right Door for Your Home: A Comprehensive Guide",
    description:
      "Learn how to choose the perfect door for your home's style, security....",
    author: "JOHN DOE",
    date: "19 OCT 2023",
    img: "https://i.ibb.co.com/ks8R5NTd/img-6.png",
  },
  {
    title: "The Latest Trends in Door and Window Design for 2025",
    description:
      "Learn how to choose the perfect door for your home's style, security....",
    author: "JOHN DOE",
    date: "19 OCT 2023",
    img: "https://i.ibb.co.com/TBZSybfQ/img-8.png",
  },
  {
    title: "How to Select Energy-Efficient Windows for Your Home",
    description:
      "Learn how to choose the perfect door for your home's style, security....",
    author: "JOHN DOE",
    date: "19 OCT 2024",
    img: "https://i.ibb.co.com/XrzfJ0QC/img-9.png",
  },
];

function BlogCard({ post }) {
  return (
    <div className="flex flex-col">
      <div className="relative h-48 mb-4">
        <img
          src={post.img || "/placeholder.svg"}
          alt={post.title}
          fill
          className="object-cover rounded-lg"
        />
      </div>
      <h3 className="text-xl font-bold mb-2 mt-4">{post.title}</h3>
      <p className="text-gray-600 mb-4">{post.description}</p>
      <div className="text-sm text-gray-500">
        <span>BY {post.author}</span>
        <span className="mx-2">|</span>
        <span>{post.date}</span>
      </div>
    </div>
  );
}

export default function BlogSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-2">OUR RECENT BLOGS</h2>
        <div className="max-w-2xl mx-auto">
          <h1 className="text-5xl font-bold mb-8">
            Publish what you think,
            <br />
            don&apos;t put it on social media
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {recentBlogs.map((post, index) => (
          <BlogCard key={index} post={post} />
        ))}
      </div>

      <div className="text-center mt-16 mb-16">
        <h2 className="text-sm text-primary uppercase tracking-wider mb-4">
          PUBLISH WHAT YOU THINK
        </h2>
        <h2 className="text-4xl font-bold">LATEST BLOGS</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {recentBlogs.map((post, index) => (
          <BlogCard key={`latest-${index}`} post={post} />
        ))}
      </div>
    </div>
  );
}
