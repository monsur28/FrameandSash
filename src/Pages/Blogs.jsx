import { useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";

const initialBlogPosts = [
  {
    id: 1,
    title: "Introduction to Energy-Efficient Windows",
    author: "John Doe",
    category: "Energy Efficiency",
    date: "2023-06-15",
    status: "Published",
  },
  {
    id: 2,
    title: "Choosing the Right Window Frame Material",
    author: "Jane Smith",
    category: "Materials",
    date: "2023-06-18",
    status: "Draft",
  },
  {
    id: 3,
    title: "The Benefits of Triple Glazing",
    author: "Mike Johnson",
    category: "Technology",
    date: "2023-06-20",
    status: "Published",
  },
  {
    id: 4,
    title: "Window Styles for Modern Homes",
    author: "Emily Brown",
    category: "Design",
    date: "2023-06-22",
    status: "Draft",
  },
  {
    id: 5,
    title: "Maintaining Your Windows: A Complete Guide",
    author: "Chris Wilson",
    category: "Maintenance",
    date: "2023-06-25",
    status: "Published",
  },
];

export default function Blogs() {
  const [blogPosts, setBlogPosts] = useState(initialBlogPosts);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = (id) => {
    setBlogPosts(blogPosts.filter((post) => post.id !== id));
  };

  const filteredPosts = blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen p-6 rounded-[24px] border-2 border-white bg-white/50 backdrop-blur-[16.5px]shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Blog Posts</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search posts..."
          className="w-full p-2 border border-gray-300 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full rounded-[24px] border-2 border-white bg-white/50 backdrop-blur-[16.5px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">Title</th>
              <th className="py-2 px-4 border-b text-left">Author</th>
              <th className="py-2 px-4 border-b text-left">Category</th>
              <th className="py-2 px-4 border-b text-left">Date</th>
              <th className="py-2 px-4 border-b text-left">Status</th>
              <th className="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{post.title}</td>
                <td className="py-2 px-4 border-b">{post.author}</td>
                <td className="py-2 px-4 border-b">{post.category}</td>
                <td className="py-2 px-4 border-b">{post.date}</td>
                <td className="py-2 px-4 border-b">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      post.status === "Published"
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {post.status}
                  </span>
                </td>
                <td className="py-2 px-4 border-b">
                  <div className="flex space-x-2">
                    <button className="text-blue-500 hover:text-blue-700">
                      <Eye size={18} />
                    </button>
                    <button className="text-green-500 hover:text-green-700">
                      <Pencil size={18} />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(post.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
