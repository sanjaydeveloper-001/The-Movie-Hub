import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";

export default function Login({ setUser }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleGoogleSignup = async (response) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_LINK}/api/users/google-login`,
        {
          token: response.credential,
        }
      );
      setUser(res.data);
      localStorage.setItem("movieHub_token", res.data.token);
      navigate("/");
    } catch (err) {
      setError("Google login failed");
    }
  };

  const handleError = () => {
    setError("Google login failed");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password.trim()) {
      setError("Both fields are required.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_LINK}/api/users/login`,
        form
      );
      if (remember) {
        localStorage.setItem("movieHub_token", data.token);
      } else {
        sessionStorage.setItem("movieHub_token", data.token);
      }
      setUser(data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Network Error. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const grayButton =
    "px-4 py-2 rounded-lg text-gray-200 font-medium bg-gradient-to-r from-[#7A0000] to-[#2E2E2E] hover:from-[#A00000] hover:to-[#3A3A3A] hover:shadow-[0_0_10px_#A00000] transition-all duration-300";

  return (
    <div className="min-h-max my-10 flex items-center justify-center bg-[#0a0a0a] text-gray-200 px-5">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative flex flex-col md:flex-row w-full max-w-4xl bg-[#1a1a1a]/90 rounded-2xl shadow-lg border border-gray-800 overflow-hidden backdrop-blur-md"
      >
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center gap-2 text-gray-300 hover:text-white transition"
        >
          <FaArrowLeft size={18} />
          <span className="hidden sm:inline text-sm font-medium">Back</span>
        </button>
        {/* ✅ Left Side (Welcome Section) */}
        <div className="md:w-1/2 w-full bg-gradient-to-br from-[#8B0000] to-[#330000] flex flex-col justify-center items-center p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Welcome Back to movieHub 🎬
          </h2>
          <p className="text-gray-300 mb-6 max-w-sm">
            Dive back into your cinematic world! Login to continue tracking and
            discovering amazing movies.
          </p>

          {/* Google Button */}
          <GoogleLogin onSuccess={handleGoogleSignup} onError={handleError} />

          {/* Signup Link */}
          <div className="mt-6 text-sm text-gray-300">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-red-400 hover:text-red-500 font-semibold"
            >
              Sign Up
            </Link>
          </div>
        </div>

        {/* ✅ Right Side (Login Form) */}
        <div className="md:w-1/2 w-full p-8">
          <h2 className="text-2xl font-semibold text-red-500 mb-5 text-center">
            Login to Your Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-[#111] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg bg-[#111] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 pr-10"
                  placeholder="••••••••"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 cursor-pointer"
                >
                  {showPassword ? (
                    <FaEyeSlash size={18} />
                  ) : (
                    <FaEye size={18} />
                  )}
                </span>
              </div>

              {/* Forgot Password */}
              <div className="text-right mt-2">
                <Link
                  to="/forgotpassword"
                  className="text-sm text-red-400 hover:text-red-500"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 accent-red-600"
              />
              <label htmlFor="remember" className="text-sm text-gray-400">
                Remember me
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-center text-sm text-red-400 bg-red-950/30 py-2 rounded-lg border border-red-800">
                {error}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold transition ${
                loading
                  ? "bg-gradient-to-r from-[#7A0000] to-[#A00000] opacity-70 text-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#7A0000] to-[#A00000] hover:from-[#A00000] hover:to-[#C00000] hover:shadow-[0_0_10px_#FF0000] text-white"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
