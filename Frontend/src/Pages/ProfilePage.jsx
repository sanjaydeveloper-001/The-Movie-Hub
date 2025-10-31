import { useState, useEffect, useContext } from "react";
import { MovieContext } from "../context/MovieContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaBookmark,
  FaEye,
  FaEyeSlash,
  FaEdit,
  FaSave,
  FaTimes,
  FaLock,
  FaSignOutAlt,
} from "react-icons/fa";
import { MdDelete, MdPhotoCamera } from "react-icons/md";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editPass, setEditPassword] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("");
  const [usernameEdit, setUsernameEdit] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const { favourites, watchlist } = useContext(MovieContext);
  const navigate = useNavigate();

  const token =
    localStorage.getItem("movieHub_token") ||
    sessionStorage.getItem("movieHub_token");

  const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_LINK,
    headers: { Authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    if (!token) {
      toast.error("You must be logged in to view this page");
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const { data } = await api.get("/api/users/profile");
        setUser(data);
        setNewUsername(data.username);
        setPhotoPreview(data.photo || "");
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile");
      }
    };
    fetchUser();
  }, []);

  /* -------- CHANGE USERNAME -------- */
  const handleUpdateUsername = async () => {
    if (!newUsername.trim()) return toast.error("Username cannot be empty");
    try {
      setLoading(true);
      const { data } = await api.put("/api/users/change-username", {
        username: newUsername,
      });
      setUser((prev) => ({ ...prev, username: data.username }));
      toast.success("Username updated!");
      setUsernameEdit(false);
    } catch {
      toast.error("Failed to update username");
    } finally {
      setLoading(false);
    }
  };

  /* -------- CHANGE PHOTO -------- */
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhotoPreview(URL.createObjectURL(file));

    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  /* -------- DELETE PHOTO -------- */
  const handleDeletePhoto = async () => {
    try {
      setLoading(true);
      const { data } = await api.put("/api/users/delete-photo");
      setUser((prev) => ({ ...prev, photo: "" }));
      setPhotoPreview("");
      toast.success(data.message || "Photo deleted!");
    } catch {
      toast.error("Failed to delete photo");
    } finally {
      setLoading(false);
    }
  };

  /* -------- CHANGE PASSWORD -------- */
  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.put("/api/users/change-password", passwords);
      toast.success(data.message || "Password changed successfully!");
      setPasswords({ current: "", new: "", confirm: "" });
      setEditPassword(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Password change failed");
    } finally {
      setLoading(false);
    }
  };

  /* -------- LOGOUT -------- */
  const handleLogout = () => {
    localStorage.removeItem("movieHub_token");
    sessionStorage.removeItem("movieHub_token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  if (!user)
    return (
      <div className="text-gray-400 text-center p-6">Loading profile...</div>
    );

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0a0a0a] px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-[#111] rounded-2xl p-6 w-full max-w-[500px] text-gray-200 relative shadow-lg border border-gray-800"
      >
        {loading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-2xl z-50">
            <div className="text-white animate-pulse text-lg">Processing...</div>
          </div>
        )}

        {/* PROFILE PHOTO */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-3 mb-6"
        >
          <div className="relative group">
            <img
              src={
                photoPreview ||
                user.photo ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt="Profile"
              className="w-28 h-28 rounded-full border-2 border-red-500 object-cover"
            />
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
              <label className="cursor-pointer" title="Change Photo">
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
                  title="Delete Photo"
                  className="text-red-400 text-xl cursor-pointer hover:scale-110 transition"
                />
              )}
            </div>
          </div>
          <p className="text-sm text-gray-400">{user.email}</p>
        </motion.div>

        {/* USERNAME */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6 border-b border-gray-800 pb-4 text-center"
        >
          {usernameEdit ? (
            <div className="flex items-center gap-2 justify-center">
              <input
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="bg-transparent border-b border-gray-600 focus:outline-none text-lg font-semibold text-center"
              />
              <FaSave
                onClick={handleUpdateUsername}
                title="Save"
                className="text-green-500 cursor-pointer hover:scale-110"
              />
              <FaTimes
                onClick={() => setUsernameEdit(false)}
                title="Cancel"
                className="text-gray-400 cursor-pointer hover:scale-110"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-xl font-semibold">{user.username}</h2>
              <FaEdit
                onClick={() => setUsernameEdit(true)}
                title="Edit Username"
                className="text-gray-400 cursor-pointer hover:scale-110"
              />
            </div>
          )}

          <div className="flex justify-center gap-4 mt-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => navigate("/favourites")}
              className="text-red-400 hover:text-red-500 transition"
              title="Favourites"
            >
              <FaHeart size={22} />
              <span className="ml-1">{favourites.length}</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => navigate("/watchlist")}
              className="text-blue-400 hover:text-blue-500 transition"
              title="Watchlist"
            >
              <FaBookmark size={22} />
              <span className="ml-1">{watchlist.length}</span>
            </motion.button>
          </div>
        </motion.div>

        {/* PASSWORD SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <h3 className="text-lg font-semibold flex flex-col items-center justify-center gap-2 mb-3">
            <FaLock />
            Password
          </h3>

          {!editPass && !user.isGoogleUser && (
            <button
              onClick={() => setEditPassword(true)}
              className="bg-red-600 hover:bg-red-700 hover:shadow-[0_0_10px_#ef4444] transition-all px-5 py-1 rounded-lg mt-2 font-medium"
            >
              Change Password
            </button>
          )}

          {editPass && !user.isGoogleUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col gap-3"
            >
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
                    className="w-full bg-transparent border border-gray-700 rounded-md p-2 pr-10 focus:outline-none"
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

              <div className="flex justify-between gap-2 mt-3">
                <button
                  onClick={handleChangePassword}
                  className="bg-red-600 px-4 py-2 rounded-md font-medium hover:bg-red-700 hover:shadow-[0_0_10px_#ef4444] transition w-1/2"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditPassword(false)}
                  className="bg-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-600 transition w-1/2"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}

          {user.isGoogleUser && (
            <p className="text-gray-500 text-sm mt-2">
              🔒 Google users can’t change passwords here.
            </p>
          )}
        </motion.div>

        {/* LOGOUT BUTTON */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          onClick={handleLogout}
          className="mt-8 flex items-center justify-center gap-2 text-red-500 cursor-pointer hover:text-red-400 transition"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
