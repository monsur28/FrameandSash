import { useState } from "react";
import { Mail, EyeOff, Eye } from "lucide-react";
import loginBanner from "../assets/Login copy.jpg";

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempted with:", formData);
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={loginBanner}
          alt="Login Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Logo Circle */}
        <div className="bg-white rounded-full p-8 mb-6 shadow-lg">
          <div className="w-16 h-16 relative">
            {/* Logo squares */}
            <div className="absolute right-0 bottom-0 w-12 h-12 bg-[#00B2B2]"></div>
            <div className="absolute left-0 top-0 w-8 h-8 bg-black"></div>
            <div className="absolute left-4 top-4 w-4 h-4 bg-[#00B2B2]"></div>
          </div>
        </div>

        {/* Text */}
        <h1 className="text-white text-4xl font-bold mb-2">ADMIN PANEL</h1>
        <p className="text-white text-xl mb-8">Login to control</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
          <div className="relative">
            <input
              type="email"
              placeholder="Email Address"
              className="w-full px-4 py-3 bg-gray-100/90 rounded-full pr-10 focus:outline-none focus:ring-2 focus:ring-[#00B2B2]"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-3 bg-gray-100/90 rounded-full pr-10 focus:outline-none focus:ring-2 focus:ring-[#00B2B2]"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-[#40E7E7] text-white font-semibold py-3 px-6 rounded-full hover:bg-[#33b6b6] transition-colors duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
