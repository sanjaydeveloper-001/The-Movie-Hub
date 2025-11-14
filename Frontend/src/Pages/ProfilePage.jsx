import { useState, useEffect, useContext } from "react";
import { MovieContext } from "../context/MovieContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaBookmark,
  FaSave,
  FaTimes,
  FaLock,
  FaSignOutAlt,
  FaArrowLeft,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { MdDelete, MdPhotoCamera } from "react-icons/md";
import { motion } from "framer-motion";
import LanguageSelector from "../Components/langSelection";
import LoadingOverlay from "../Components/LoadingOverlay";
import { languages } from "../utils/Funtions";

export default function ProfilePage() {
  const { user, setUser, favourites, watchlist } = useContext(MovieContext);

  const [loading, setLoading] = useState("");
  const [editPass, setEditPassword] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("");
  const [usernameEdit, setUsernameEdit] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [editingLang, setEditingLang] = useState(false);

  const navigate = useNavigate();
  const token =
    localStorage.getItem("movieHub_token") ||
    sessionStorage.getItem("movieHub_token");

  const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_LINK,
    headers: { Authorization: `Bearer ${token}` },
  });
  const { setLang } = useContext(MovieContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (user) {
      setNewUsername(user.username || "");
      setPhotoPreview(user.photo || "");
      setSelectedLanguage(
        user.language || localStorage.getItem("localUserLanguage") || "en"
      );
    }
    else{
      navigate(-1);
    }
  }, [user, token, navigate]);

  const handleUpdateUsername = async () => {
    if (!newUsername.trim()) return toast.error("Username cannot be empty");
    try {
      setLoading("Updating UserName");
      const { data } = await api.put("/api/users/change-username", {
        username: newUsername,
      });
      setUser((prev) => ({ ...prev, username: data.username }));
      toast.success("Username updated!");
      setUsernameEdit(false);
    } catch {
      toast.error("Failed to update username");
    } finally {
      setLoading("");
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhotoPreview(URL.createObjectURL(file));

    try {
      setLoading("Updating Photo");
      const formData = new FormData();
      formData.append("photo", file);
      const { data } = await api.put("/api/users/change-photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser((prev) => ({ ...prev, photo: data.photo }));
      toast.success("Photo updated!");
    } catch {
      toast.error("Failed to update photo");
    } finally {
      setLoading("");
    }
  };

  const handleDeletePhoto = async () => {
    try {
      setLoading("Deleting Photo");
      await api.put("/api/users/delete-photo");
      setUser((prev) => ({ ...prev, photo: "" }));
      setPhotoPreview("");
      toast.success("Photo deleted!");
    } catch {
      toast.error("Failed to delete photo");
    } finally {
      setLoading("");
    }
  };

  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      setLoading("Updating Password");
      const res = await api.put("/api/users/change-password", passwords);
      let message = res.data.message;
      if (message === "Password changed successfully") {
        toast.success(`${res.data.message}`);
        setEditPassword(false);
        setPasswords({ current: "", new: "", confirm: "" });
      } else {
        toast.error(`${res.data.message}`);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading("");
    }
  };

  const handleSaveLanguage = async () => {
    try {
      setLoading("Updating Language");
      const { data } = await api.put("/api/users/change-language", {
        email: user.email,
        language: selectedLanguage,
      });
      setUser((prev) => ({ ...prev, language: data.language }));
      localStorage.setItem("localUserLanguage", data.language);

      const langName =
      languages.find((lang) => lang.code === selectedLanguage)?.name ||
      selectedLanguage.toUpperCase();

      toast.success(`Language set to ${langName}`);
      setEditingLang(false);
      setLang(selectedLanguage);
    } catch {
      toast.error("Failed to update language");
    } finally {
      setLoading("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("movieHub_token");
    sessionStorage.removeItem("movieHub_token");
    localStorage.removeItem("userIn");
    setUser(null);
    toast.success("Logged out successfully");
    navigate(-1);
    window.location.reload();
  };

  if (!user) return <LoadingOverlay text={"Loading Profile..."} />;

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#0a0a0a] text-gray-200 px-5 my-10">
      {loading.length > 0 && <LoadingOverlay text={loading} />}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative flex flex-col md:flex-row w-full max-w-4xl bg-[#1a1a1a]/90 rounded-2xl shadow-lg border border-gray-800 overflow-hidden backdrop-blur-md"
      >
        {/* 🔙 Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center gap-2 text-gray-300 hover:text-white transition"
        >
          <FaArrowLeft size={18} />
          <span className="hidden sm:inline text-sm font-medium">Back</span>
        </button>

        {/* 🟥 LEFT SIDE - RED GRADIENT PANEL */}
        <div className="md:w-1/2 w-full bg-gradient-to-br from-[#8B0000] to-[#330000] flex flex-col justify-center items-center p-8 text-center">
          <div className="relative group mb-5">
            <img
              src={
                photoPreview ||
                user.photo ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt="Profile"
              className="w-28 h-28 rounded-full border-2 border-white object-cover"
            />
            <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition">
              <label className="cursor-pointer">
                <MdPhotoCamera className="text-white text-xl hover:scale-110 transition" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
              {(user.photo || photoPreview) && (
                <MdDelete
                  onClick={handleDeletePhoto}
                  className="text-red-400 text-xl cursor-pointer hover:scale-110 transition"
                />
              )}
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">
            {user.username}
          </h2>
          <p className="text-sm text-gray-200 mb-4">{user.email}</p>

          <div className="flex justify-center gap-6 mt-3">
            {/* ❤️ Favourites */}
            <Link
              to="/favourites"
              className="text-center group transition-transform hover:scale-105"
            >
              <FaHeart
                className="text-red-400 mx-auto mb-1 group-hover:text-red-500 transition"
                size={22}
              />
              <span className="text-sm text-gray-300 group-hover:text-white transition">
                {favourites.length} Favourites
              </span>
            </Link>

            {/* 🔖 Watchlist */}
            <Link
              to="/watchlist"
              className="text-center group transition-transform hover:scale-105"
            >
              <FaBookmark
                className="text-blue-400 mx-auto mb-1 group-hover:text-blue-500 transition"
                size={22}
              />
              <span className="text-sm text-gray-300 group-hover:text-white transition">
                {watchlist.length} Watchlist
              </span>
            </Link>
          </div>
        </div>

        {/* ⚙️ RIGHT SIDE - SETTINGS PANEL */}
        <div className="md:w-1/2 w-full p-8">
          <h2 className="text-2xl font-semibold text-red-500 mb-5 text-center">
            Profile Settings
          </h2>

          {/* Username */}
          <div className="text-center mb-5">
            {usernameEdit ? (
              <div className="flex flex-wrap items-center justify-center gap-2 w-full">
                <input
                  autoFocus={true}
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="bg-transparent border-b border-gray-600 focus:outline-none text-lg font-semibold text-center max-w-[150px] sm:max-w-[200px]"
                />
                <FaSave
                  onClick={handleUpdateUsername}
                  className="text-green-500 cursor-pointer text-lg sm:text-xl"
                />
                <FaTimes
                  onClick={() => setUsernameEdit(false)}
                  className="text-gray-400 cursor-pointer text-lg sm:text-xl"
                />
              </div>
            ) : (
              <button
                onClick={() => setUsernameEdit(true)}
                className="bg-gray-800 px-4 py-1 rounded-md hover:bg-gray-700 transition text-sm font-medium"
              >
                Edit Username
              </button>
            )}
          </div>

          {/* Language */}
          <div className="text-center mb-6 items-center justify-center gap-5">
            <div className="text-center md:flex items-center justify-center gap-5">
              <h3 className="text-lg font-semibold mb-2">🌐 Language :</h3>
              <div className="md:w-[220px]">{<LanguageSelector
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
                setEditingLang={setEditingLang}
              />}
              </div>
            </div>
            {editingLang && (
              <div className="flex gap-2 justify-center mt-3">
                <button
                  onClick={handleSaveLanguage}
                  className="bg-red-600 px-4 py-1 rounded-md hover:bg-red-700 transition font-medium"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingLang(false);
                    setSelectedLanguage(user.language || "en");
                  }}
                  className="bg-gray-700 px-4 py-1 rounded-md hover:bg-gray-600 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Password */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold mb-2 flex justify-center items-center gap-2">
              <FaLock /> Password
            </h3>

            {user.isGoogleUser ? (
              <p className="text-gray-400 text-sm italic">
                Google user can’t change password
              </p>
            ) : !editPass ? (
              <button
                onClick={() => setEditPassword(true)}
                className="bg-red-600 hover:bg-red-700 px-5 py-1 rounded-md font-medium transition"
              >
                Change Password
              </button>
            ) : (
              <div className="flex flex-col gap-3 mt-3">
                {["current", "new", "confirm"].map((key) => (
                  <div key={key} className="relative">
                    <input
                      type={showPassword[key] ? "text" : "password"}
                      placeholder={
                        key === "current"
                          ? "Current Password"
                          : key === "new"
                          ? "New Password"
                          : "Confirm Password"
                      }
                      value={passwords[key]}
                      onChange={(e) =>
                        setPasswords({ ...passwords, [key]: e.target.value })
                      }
                      className="w-full bg-[#111] border border-gray-700 rounded-md p-2 pr-10 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((prev) => ({
                          ...prev,
                          [key]: !prev[key],
                        }))
                      }
                      className="absolute right-3 top-2.5 text-gray-400"
                    >
                      {showPassword[key] ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                ))}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleChangePassword}
                    className="bg-red-600 w-1/2 py-2 rounded-md font-medium hover:bg-red-700 transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditPassword(false)}
                    className="bg-gray-700 w-1/2 py-2 rounded-md font-medium hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Logout */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 text-red-500 cursor-pointer hover:text-red-400 transition"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
