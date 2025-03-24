import { useState } from "react";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import useAuth from "../../Hooks/UseAuth";
import { useSweetAlert } from "../../ContextProvider/SweetAlertContext";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [activeTab, setActiveTab] = useState("login");
  const [loginError, setLoginError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const { registerUser, loginUser, googleLogin, facebookLogin } = useAuth();
  const { showAlert } = useSweetAlert();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmitRegister = async (data) => {
    const { userName, email, password, confirmPassword, terms } = data;

    let validationErrors = {};

    if (activeTab === "register") {
      if (!userName) validationErrors.userName = "Username is required";
      if (!password) validationErrors.password = "Password is required";
      if (password !== confirmPassword)
        validationErrors.confirmPassword = "Passwords must match";
      if (!terms)
        validationErrors.terms = "You must accept the terms and conditions";
    }

    if (!email) validationErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      validationErrors.email = "Invalid email format";

    if (password && password.length < 6)
      validationErrors.password = "Password must be at least 6 characters";

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      await registerUser(email, password, userName);
      showAlert("success", "Account created successfully! Please login.");
    } catch (error) {
      console.error("Registration Error:", error.message);
      alert(error.message);
    }
  };

  const onSubmitLogin = async (data, event) => {
    event.preventDefault(); // Force prevent default behavior

    setLoginError("");
    setLoading(true);

    try {
      const user = await loginUser(data.email, data.password);

      if (!user) {
        setLoginError("Incorrect email or password. Please try again.");
        setLoading(false);
        return;
      }

      showAlert("success", "Login successful!");
      navigate(user.role === "customer" ? "/userDashboard" : "/adminDashboard");
    } catch (error) {
      setLoading(false);
      setLoginError(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Side (Image Section) */}
      <div
        className="hidden md:flex w-1/2 h-auto relative bg-cover bg-center"
        style={{
          backgroundImage: "url('https://i.ibb.co/vC16sCr5/BG-copy.jpg')",
        }}
      >
        <div className="absolute bottom-10 left-10 text-white text-lg font-medium max-w-md">
          <p>
            Enjoy a seamless shopping experience, exclusive offers, and easy
            order tracking!
          </p>
        </div>
      </div>

      {/* Right Side (Form Section) */}
      <div className="flex justify-center mt-4 px-6 sm:px-12">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          {/* Tabs */}
          <div className="mb-6 flex gap-4">
            <button
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "login"
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => {
                setActiveTab("login");
                setValue("activeTab", "login");
              }}
            >
              Login
            </button>
            <button
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "register"
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => {
                setActiveTab("register");
                setValue("activeTab", "register");
              }}
            >
              Register
            </button>
          </div>

          {/* Forms */}
          {activeTab === "register" ? (
            <form
              className="space-y-4"
              onSubmit={handleSubmit(onSubmitRegister)}
            >
              <input
                {...register("userName")}
                placeholder="Username"
                className="p-2 border border-gray-300 rounded-md w-full"
              />
              {errors.userName && (
                <p className="text-red-500 text-sm">
                  {errors.userName.message}
                </p>
              )}
              <input
                {...register("email")}
                type="email"
                placeholder="Email"
                className="p-2 border border-gray-300 rounded-md w-full"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
              <div className="flex gap-4">
                <input
                  {...register("password")}
                  type="password"
                  placeholder="Password"
                  className="p-2 border border-gray-300 rounded-md w-1/2"
                />
                <input
                  {...register("confirmPassword")}
                  type="password"
                  placeholder="Confirm Password"
                  className="p-2 border border-gray-300 rounded-md w-1/2"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
              <div className="flex items-center gap-2">
                <input
                  {...register("terms")}
                  type="checkbox"
                  id="terms"
                  className="w-4 h-4 text-primary"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the Terms & Conditions
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary transition-all"
              >
                Register
              </button>
            </form>
          ) : (
            <form
              className="space-y-4"
              onSubmit={handleSubmit((data, event) =>
                onSubmitLogin(data, event)
              )}
            >
              <input
                {...register("email")}
                type="email"
                placeholder="Email"
                className="p-2 border border-gray-300 rounded-md w-full"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
              <input
                {...register("password")}
                type="password"
                placeholder="Password"
                className={`p-2 border rounded-md w-full ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
              {loginError && (
                <p className="text-red-500 text-sm">{loginError}</p>
              )}
              <button
                type="submit"
                className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary transition-all disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          )}

          {/* Social Logins */}
          <div className="flex items-center my-6">
            <div className="w-full border-t border-gray-300"></div>
            <span className="px-2 text-sm text-gray-500">OR</span>
            <div className="w-full border-t border-gray-300"></div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={googleLogin}
              className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-lg"
            >
              <FaGoogle /> Google
            </button>
            <button
              onClick={facebookLogin}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-700 text-white py-2 rounded-lg"
            >
              <FaFacebook /> Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
