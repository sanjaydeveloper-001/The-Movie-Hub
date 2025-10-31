import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";

export default function ForgotPassword() {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const grayButton =
    "px-4 py-2 rounded-lg text-gray-200 font-medium bg-gradient-to-r from-[#7A0000] to-[#2E2E2E] hover:from-[#A00000] hover:to-[#3A3A3A] hover:shadow-[0_0_10px_#A00000] transition-all duration-300";

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_LINK}/api/users/forgotpassword`, { email });
      setMessage(res.data.message);
      setStep(2);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error sending reset code");
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}[\]|:;"'<>,.?/]).+$/;

    if (!passwordRegex.test(newPassword)) {
      setMessage("Password must include at least one letter, one number, and one symbol.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_LINK}/api/users/resetpassword`, {
        email,
        code,
        newPassword,
      });
      setMessage(res.data.message);
      setStep(3);
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-max my-10 flex items-center justify-center bg-[#0a0a0a] text-gray-200 px-5">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row w-full max-w-4xl bg-[#1a1a1a]/90 rounded-2xl shadow-lg border border-gray-800 overflow-hidden backdrop-blur-md"
      >
        {/* 🔹 Left Side — Welcome Section */}
        <div className="md:w-1/2 w-full bg-gradient-to-br from-[#8B0000] to-[#330000] flex flex-col justify-center items-center p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Reset Your Password 🔑
          </h2>
          <p className="text-gray-300 mb-6 max-w-sm">
            Forgot your password? Don’t worry — we’ll help you reset it and get
            back to your movieHub experience quickly.
          </p>

          <div
            onClick={() => navigate("/login")}
            className={`${grayButton} flex items-center justify-center gap-3 px-5 py-2.5 rounded-lg cursor-pointer transition hover:scale-[1.02]`}
          >
            Back to Login
          </div>

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

        {/* 🔹 Right Side — Form Section */}
        <div className="md:w-1/2 w-full p-8">
          {step === 1 && (
            <form onSubmit={handleEmailSubmit} className="space-y-5">
              <h2 className="text-2xl font-semibold text-red-500 mb-4 text-center">
                Forgot Password
              </h2>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 rounded-lg bg-[#111] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              {message && (
                <p className="text-center text-sm text-red-400 bg-red-950/30 py-2 rounded-lg border border-red-800">
                  {message}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  loading
                    ? "bg-gradient-to-r from-[#7A0000] to-[#A00000] opacity-70 text-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#7A0000] to-[#A00000] hover:from-[#A00000] hover:to-[#C00000] hover:shadow-[0_0_10px_#FF0000] text-white"
                }`}
              >
                {loading ? "Sending..." : "Send Code"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleResetSubmit} className="space-y-5">
              <h2 className="text-2xl font-semibold text-red-500 mb-4 text-center">
                Reset Password
              </h2>
              <input
                type="text"
                placeholder="Enter code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="w-full p-3 rounded-lg bg-[#111] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              />

              {/* New Password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full p-3 rounded-lg bg-[#111] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 pr-10"
                />
                <span
                  className="absolute right-3 top-3.5 text-gray-400 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full p-3 rounded-lg bg-[#111] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 pr-10"
                />
                <span
                  className="absolute right-3 top-3.5 text-gray-400 cursor-pointer"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {message && (
                <p
                  className={`text-center text-sm ${
                    message.includes("successfully") || message.includes("Reset")
                      ? "bg-green-950/50 text-green-400 border-green-800"
                      : "bg-red-950/30 text-red-400 border-red-800"
                  } py-2 rounded-lg border`}
                >
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  loading
                    ? "bg-gradient-to-r from-[#7A0000] to-[#A00000] opacity-70 text-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#7A0000] to-[#A00000] hover:from-[#A00000] hover:to-[#C00000] hover:shadow-[0_0_10px_#FF0000] text-white"
                }`}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          {step === 3 && (
            <p className="text-center text-green-400 text-lg font-semibold">
              {message}. Redirecting to login...
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
