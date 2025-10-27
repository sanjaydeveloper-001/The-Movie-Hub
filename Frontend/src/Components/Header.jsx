import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import Logo from '../assets/Logo.png';

export default function Header({ user, setUser }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("movieHub_token");
    sessionStorage.removeItem("movieHub_token");
    setUser(null);
    setMenuOpen(false);
    navigate("/login");
  };

  const redButton =
    "px-4 py-2 rounded-lg text-white font-medium bg-gradient-to-r from-[#7A0000] to-[#A00000] hover:from-[#A00000] hover:to-[#C00000] hover:shadow-[0_0_10px_#FF0000] transition";

  const grayButton =
    "px-4 py-2 rounded-lg text-gray-300 font-medium bg-gradient-to-r from-[#2E2E2E] to-[#3A3A3A] hover:from-[#444] hover:to-[#555] hover:shadow-[0_0_10px_#555] transition";

  return (
    <header className="sticky top-0 left-0 w-full z-50 bg-gradient-to-r from-[#0a0a0a]/80 via-[#111]/80 to-[#0a0a0a]/80 backdrop-blur-md border-b border-gray-800 shadow-md">
      <div className="w-full mx-auto flex justify-between items-center p-4 px-6 md:px-10">
        {/* Logo */}
        <Link to="/" className="text-red-500 text-3xl font-bold tracking-wide flex items-center ">
          <img src={Logo} className="h-7 mt-1" alt="" />
          ovie <span className="ml-2 text-red-600">Hub</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 text-gray-300 text-sm md:text-base">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `transition ${isActive ? "text-red-500" : "hover:text-red-500"}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/watchlist"
            className={({ isActive }) =>
              `transition ${isActive ? "text-red-500" : "hover:text-red-500"}`
            }
          >
            Watchlist
          </NavLink>
          <NavLink
            to="/favourites"
            className={({ isActive }) =>
              `transition ${isActive ? "text-red-500" : "hover:text-red-500"}`
            }
          >
            Favourites
          </NavLink>
        </nav>

        {/* User / Auth Section */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                {user.photo ? (
                  <img
                    src={user.photo}
                    alt="Profile"
                    className="w-9 h-9 rounded-full border border-gray-700 object-cover"
                  />
                ) : (
                  <FaUserCircle size={30} className="text-gray-400" />
                )}
                <span className="text-gray-300 text-sm font-medium">
                  {user.username || "User"}
                </span>
                <button onClick={handleLogout} className={redButton}>
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className={grayButton}>
                  Login
                </Link>
                <Link to="/signup" className={redButton}>
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-300 focus:outline-none z-50"
          >
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* 🔥 Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-0 left-0 w-full h-80 py-10 bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-between text-lg text-gray-300 z-40 transition-all duration-300">
          <NavLink to="/" onClick={() => setMenuOpen(false)} className="hover:text-red-500 transition">
            Home
          </NavLink>
          <NavLink to="/watchlist" onClick={() => setMenuOpen(false)} className="hover:text-red-500 transition">
            Watchlist
          </NavLink>
          <NavLink to="/favourites" onClick={() => setMenuOpen(false)} className="hover:text-red-500 transition">
            Favourites
          </NavLink>

          <div className="pt-6 flex flex-col gap-3 items-center">
            {user ? (
              <>
                <span className="text-sm text-gray-400">Hi, {user.username || "User"}</span>
                <button onClick={handleLogout} className={redButton}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className={grayButton}>
                  Login
                </Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)} className={redButton}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
