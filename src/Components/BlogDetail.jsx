"use client";

import { useState, useEffect } from "react";
import axiosSecure from "../Hooks/AsiosSecure";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, User } from "lucide-react";

const BlogDetail = () => {
  const [post, setPost] = useState(null);
  console.log(post);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axiosSecure.get(`/api/blogs/${id}`);
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching the post details:", error);
      }
    };

    fetchPost();
  }, [id]);

  if (!post) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="  p-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/dashboard/blog")}
          className="mb-8 flex items-center space-x-2 text-teal-700 hover:text-teal-900 transition-colors duration-300"
        >
          <ArrowLeft size={20} />
          <span>Back to Blog List</span>
        </button>

        <article className="rounded-[24px] border-2 border-white bg-white50 backdrop-blur-16.5 shadow-2xl overflow-hidden">
          <div className="h-64 overflow-hidden">
            <img
              src={
                post.image_url ||
                "https://t4.ftcdn.net/jpg/03/71/92/67/360_F_371926762_MdmDMtJbXt7DoaDrxFP0dp9Nq1tSFCnR.jpg"
              }
              alt={post.blog_title}
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {post.blog_title}
            </h1>

            <div className="flex items-center space-x-4 text-gray-600 mb-6">
              <div className="flex items-center">
                <User size={18} className="mr-2" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar size={18} className="mr-2" />
                <span>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div className="prose ">
              <p className="mb-4 text-gray-700 leading-relaxed">
                {post.blog_content}
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Share this post
              </h2>
              <div className="flex space-x-4">
                {["Twitter", "Facebook", "LinkedIn"].map((platform) => (
                  <button
                    key={platform}
                    className="px-4 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-colors duration-300"
                  >
                    Share on {platform}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;
