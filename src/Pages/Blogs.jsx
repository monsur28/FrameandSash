import { useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../ContextProvider/LanguageContext";

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
    title: "Top Trends in Modern Window Design",
    author: "Emily Brown",
    category: "Design",
    date: "2023-07-01",
    status: "Published",
  },
  {
    id: 4,
    title: "How to Reduce Heat Loss Through Windows",
    author: "Chris Wilson",
    category: "Energy Efficiency",
    date: "2023-07-10",
    status: "Draft",
  },
  {
    id: 5,
    title: "Understanding Double vs. Triple Glazing",
    author: "Mike Johnson",
    category: "Technology",
    date: "2023-07-15",
    status: "Published",
  },
];

export default function Blogs() {
  const [blogPosts, setBlogPosts] = useState(initialBlogPosts);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { t } = useLanguage();

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
    <div className="h-screen p-6">
      <div className="flex justify-between items-center mb-6 rounded-[24px] border-2 border-white bg-white50 backdrop-blur-16.5 p-6">
        <h1 className="text-xl lg:text-3xl font-bold">Blog Posts</h1>
        <button
          onClick={() => navigate("/dashboard/blogs/add-blog")}
          className="px-6 py-3  bg-teal-500 text-white rounded-lg hover:bg-teal-600"
        >
          {t("addBlog")}
        </button>
      </div>
      <div className="">
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
          <table className="min-w-full rounded-[24px] border-2 border-white bg-white50 backdrop-blur-16.5">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b text-left">{t("title")}</th>
                <th className="py-2 px-4 border-b text-left">{t("author")} </th>
                <th className="py-2 px-4 border-b text-left">
                  {t("category")}
                </th>
                <th className="py-2 px-4 border-b text-left">{t("date")}</th>
                <th className="py-2 px-4 border-b text-left">{t("status")}</th>
                <th className="py-2 px-4 border-b text-left">{t("actions")}</th>
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
    </div>
  );
}
