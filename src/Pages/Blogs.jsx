import { useState, useEffect } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../ContextProvider/LanguageContext";
import axiosSecure from "../Hooks/AsiosSecure";
import { useSweetAlert } from "../ContextProvider/SweetAlertContext";

export default function Blogs() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { showAlert } = useSweetAlert();
  const { t } = useLanguage();

  // Fetch blog posts from API
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await axiosSecure.get("blogs");
        setBlogPosts(response.data);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      }
    };

    fetchBlogPosts();
  }, []); // Empty dependency array means this will run once when the component is mounted

  // Delete blog post from API and state
  const handleDelete = async (id) => {
    try {
      await axiosSecure.delete(`blogs/${id}`); // Assuming delete API endpoint is set up
      showAlert.fire("Success!", "Blog post deleted successfully.", "success");
      setBlogPosts(blogPosts.filter((post) => post.id !== id));
    } catch (error) {
      console.error("Error deleting blog post:", error);
    }
  };

  // Filter blog posts based on search term
  const filteredPosts = blogPosts.filter(
    (post) =>
      (post.blog_title?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (post.author?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (post.category?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen p-6">
      <div className="flex justify-between items-center mb-6 rounded-[24px] border-2 border-white bg-white50 backdrop-blur-16.5 p-6">
        <h1 className="text-xl lg:text-3xl font-bold">Blog Posts</h1>
        <button
          onClick={() => navigate("/dashboard/blogs/add-blog")}
          className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
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
                <th className="py-2 px-4 border-b text-left">{t("author")}</th>
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
                  <td className="py-2 px-4 border-b">{post.blog_title}</td>
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
                      {/* Preview Button */}
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => navigate(`/dashboard/blogs/${post.id}`)}
                      >
                        <Eye size={18} />
                      </button>

                      {/* Edit Button */}
                      <button
                        className="text-green-500 hover:text-green-700"
                        onClick={() =>
                          navigate(`/dashboard/blogs/edit/${post.id}`)
                        }
                      >
                        <Pencil size={18} />
                      </button>

                      {/* Delete Button */}
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
