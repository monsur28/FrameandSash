import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, EyeOff, Eye } from "lucide-react";
import loginBanner from "../assets/Login copy.jpg";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles
import useAuth from "../Hooks/UseAuth";
import { useLanguage } from "../ContextProvider/LanguageContext";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { loginUser } = useAuth(); // Get loginUser from context
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const user = await loginUser(email, password);

      if (user) {
        // Determine the user's dashboard based on their type
        switch (user.user_type) {
          case "manufacturer":
            toast.success("Manufacturer Login Successful!", {
              position: "top-right",
              autoClose: 5000,
            });
            setTimeout(() => {
              navigate("/dashboard/manufacturer");
            }, 1000); // 1-second delay
            break;
          case "reseller":
            toast.success("Reseller Login Successful!", {
              position: "top-right",
              autoClose: 5000,
            });
            setTimeout(() => {
              navigate("/dashboard/reseller");
            }, 1000); // 1-second delay
            break;
          case "super_admin":
            toast.success("Super Admin Login Successful!", {
              position: "top-right",
              autoClose: 5000,
            });
            setTimeout(() => {
              navigate("/dashboard/superadmin");
            }, 1000); // 1-second delay
            break;
          default:
            toast.info("User Login Successful!", {
              position: "top-right",
              autoClose: 5000,
            });
            setTimeout(() => {
              navigate("/dashboard");
            }, 1000); // 1-second delay
            break;
        }
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Login failed.",
        {
          position: "top-right",
          autoClose: 5000,
        }
      );
    }
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
        <div className="bg-white rounded-full p-8 mb-3 shadow-lg">
          <div className="w-16 h-16 relative">
            {/* Logo */}
            <img src="https://i.ibb.co.com/sQsdjgJ/Logo.webp" alt="Logo" />
          </div>
        </div>

        {/* Text */}
        <h1 className="text-white text-4xl font-bold mb-2">
          {t("ADMINPANEL")}
        </h1>
        <p className="text-white text-xl mb-8">{t("Logintocontrol")}</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder={t("EmailAddress")}
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
              name="password"
              placeholder={t("password")}
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
            {t("Login")}
          </button>
        </form>
      </div>
    </div>
  );
}
