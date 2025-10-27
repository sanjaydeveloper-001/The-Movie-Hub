import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";

export default function Signup({ setUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ✅ Load saved form state from sessionStorage (if exists)
  const savedForm = JSON.parse(sessionStorage.getItem("signupForm")) || {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  };

  const [form, setForm] = useState(savedForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Save form state in sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem("signupForm", JSON.stringify(form));
  }, [form]);

  const handleChange = (e) => {
    setError("");
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const usernameRegex = /^[a-zA-Z0-9!@#$-]+$/;
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}[\]|:;"'<>,.?/]).+$/;

    if (
      !form.username.trim() ||
      !form.email.trim() ||
      !form.password.trim() ||
      !form.confirmPassword.trim()
    ) {
      setError("All fields are required.");
      return;
    }

    if (!usernameRegex.test(form.username)) {
      setError(
        "Username can only contain letters, numbers, and symbols (! @ # $ -)"
      );
      return;
    }

    if (!passwordRegex.test(form.password)) {
      setError(
        "Password must include at least one letter, one number, and one symbol."
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!form.agree) {
      setError("You must agree to the Terms & Conditions");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/users/signup", {
        username: form.username,
        email: form.email,
        password: form.password,
      });

      // ✅ Clear form data after successful signup
      sessionStorage.removeItem("signupForm");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async (response) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/google-login",
        { token: response.credential }
      );
      setUser(res.data);
      localStorage.setItem("movieHub_token", res.data.token);
      navigate("/");
    } catch (err) {
      setError("Google login failed");
    }
  };

  const handleError = () => setError("Google login failed");

  return (
    <div className="min-h-max my-10 flex items-center justify-center bg-[#0a0a0a] text-gray-200 px-5">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row w-full max-w-4xl bg-[#1a1a1a]/90 rounded-2xl shadow-lg border border-gray-800 overflow-hidden backdrop-blur-md"
      >
        {/* 🔙 Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center gap-2 text-gray-300 hover:text-white transition"
        >
          <FaArrowLeft size={18} />
          <span className="hidden sm:inline text-sm font-medium">Back</span>
        </button>

        {/* 🎬 Left Side */}
        <div className="md:w-1/2 w-full bg-gradient-to-br from-[#8B0000] to-[#330000] flex flex-col justify-center items-center p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Welcome to movieHub 🎬
          </h2>
          <p className="text-gray-300 mb-6 max-w-sm">
            Discover, track, and favorite your top movies. Create an account or
            join with Google to begin your journey.
          </p>

          <GoogleLogin onSuccess={handleGoogleSignup} onError={handleError} />

          <div className="mt-6 text-sm text-gray-300">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-red-400 hover:text-red-500 font-semibold"
            >
              Login
            </Link>
          </div>
        </div>

        {/* 📝 Right Side */}
        <div className="md:w-1/2 w-full p-8">
          <h2 className="text-2xl font-semibold text-red-500 mb-5 text-center">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-[#111] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter your username"
              />
            </div>

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
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </span>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg bg-[#111] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 pr-10"
                  placeholder="Re-enter password"
                />
                <span
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-3.5 text-gray-400 cursor-pointer"
                >
                  {showConfirm ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </span>
              </div>
            </div>

            {/* ✅ Terms Checkbox */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                name="agree"
                checked={form.agree}
                onChange={handleChange}
                className="mt-1"
              />
              <p className="text-sm">
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="text-red-400 hover:text-red-500 underline"
                >
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-red-400 hover:text-red-500 underline"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>

            {/* Error */}
            {error && (
              <p className="text-center text-sm text-red-400 bg-red-950/30 py-2 rounded-lg border border-red-800">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold transition ${
                loading
                  ? "bg-gradient-to-r from-[#7A0000] to-[#A00000] opacity-70 text-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#7A0000] to-[#A00000] hover:from-[#A00000] hover:to-[#C00000] hover:shadow-[0_0_10px_#FF0000] text-white"
              }`}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
