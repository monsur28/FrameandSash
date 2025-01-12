import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, EyeOff, Eye } from "lucide-react";
import loginBanner from "../assets/Login copy.jpg";
import { toast, ToastContainer } from "react-toastify"; // Import toast
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    loginUser(email, password)
      .then(() => {
        // Show success toast
        toast.success(`${t("LoginSuccessfully")}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Navigate after the toast has been shown
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000); // Delay the navigation to allow the toast to show
      })
      .catch((error) => {
        toast.error(`Oops... ${error.message}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });
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

      {/* ToastContainer for React-Toastify notifications */}
      <ToastContainer />
    </div>
  );
}
