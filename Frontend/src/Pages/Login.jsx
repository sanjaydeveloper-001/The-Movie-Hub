import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";
import LoadingOverlay from "../Components/LoadingOverlay";
import { useContext } from "react";
import { MovieContext } from "../context/MovieContext";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const {setUser} = useContext(MovieContext);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleGoogleLogin = async (response) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_LINK}/api/users/google-login`,
        { token: response.credential }
      );
      setUser(res.data);
      localStorage.setItem("movieHub_token", res.data.token);
      localStorage.setItem("userIn",true);
      navigate("/");
    } catch (err) {
      setError("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Both fields are required.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_LINK}/api/users/login`,
        form
      );
      if (remember)
        localStorage.setItem("movieHub_token", data.token);
      else
        sessionStorage.setItem("movieHub_token", data.token);
      setUser(data);
      localStorage.setItem("userIn",true);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Network error. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-max my-10 flex items-center justify-center bg-[#0a0a0a] text-gray-200 px-5">
      {loading && <LoadingOverlay text="Logging you in..." />}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative flex flex-col md:flex-row w-full max-w-4xl bg-[#1a1a1a]/90 rounded-2xl shadow-lg border border-gray-800 overflow-hidden backdrop-blur-md"
      >
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center gap-2 text-gray-300 hover:text-white transition"
        >
          <FaArrowLeft size={18} />
          <span className="hidden sm:inline text-sm font-medium">Back</span>
        </button>

        {/* Left */}
        <div className="md:w-1/2 w-full bg-gradient-to-br from-[#8B0000] to-[#330000] flex flex-col justify-center items-center p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Welcome Back 🎬
          </h2>
          <p className="text-gray-300 mb-6 max-w-sm">
            Dive back into your cinematic world! Login to continue tracking and
            discovering amazing movies.
          </p>

          <GoogleLogin onSuccess={handleGoogleLogin} onError={() => setError("Google login failed")} />

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

        {/* Right */}
        <div className="md:w-1/2 w-full p-8">
          <h2 className="text-2xl font-semibold text-red-500 mb-5 text-center">
            Login to Your Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
            <PasswordInput
              label="Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              show={showPassword}
              toggle={() => setShowPassword(!showPassword)}
            />

            <div className="flex justify-between items-center">
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
              <Link
                to="/forgotpassword"
                className="text-sm text-red-400 hover:text-red-500"
              >
                Forgot Password?
              </Link>
            </div>

            {error && (
              <p className="text-center text-sm text-red-400 bg-red-950/30 py-2 rounded-lg border border-red-800">
                {error}
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
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      <input
        {...props}
        required
        className="w-full p-3 rounded-lg bg-[#111] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
      />
    </div>
  );
}

function PasswordInput({ label, show, toggle, ...props }) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          {...props}
          required
          className="w-full p-3 rounded-lg bg-[#111] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 pr-10"
        />
        <span
          onClick={toggle}
          className="absolute right-3 top-3.5 text-gray-400 cursor-pointer"
        >
          {show ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
        </span>
      </div>
    </div>
  );
}
