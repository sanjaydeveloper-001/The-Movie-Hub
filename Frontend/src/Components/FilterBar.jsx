import { useState, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

export default function FilterBar({ onSearch, onFilter, onReset }) {
  const [showFilters, setShowFilters] = useState(false);
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("");
  const [rating, setRating] = useState("");
  const [language, setLanguage] = useState("ta");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // 🔹 Restore saved filters and search query
    const savedFilters = JSON.parse(localStorage.getItem("movieFilters"));
    const savedQuery = localStorage.getItem("searchQuery");

    if (savedFilters) {
      setYear(savedFilters.year || "");
      setRating(savedFilters.rating || "");
      setLanguage(savedFilters.language || "ta");
    }

    if (savedQuery) {
      setQuery(savedQuery);
    }
  }, []);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim() || query.trim().length < 3) {
      setQuery("");
      setMessage("Type atleast 3 char to search"); 
      localStorage.removeItem("searchQuery");
      return;
    };
    await onSearch(query);
    localStorage.setItem("searchQuery", query);
  };

  const handleClearSearch = () => {
    setQuery("");
    localStorage.removeItem("searchQuery");
    onReset();
  };

  const handleApply = () => {
    const filters = { year, rating, language };
    localStorage.setItem("movieFilters", JSON.stringify(filters));
    onFilter(filters);
    setShowFilters(false);
  };

  const handleReset = () => {
    localStorage.removeItem("movieFilters");
    localStorage.removeItem("searchQuery");
    setQuery(""); 
    setYear("");
    setRating("");
    setLanguage("ta");
    onReset();
  };

  return (
    <div className="bg-[#121212] p-4 rounded-xl shadow-lg border border-gray-800 mb-6">
      {/* 🔍 Search bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="flex flex-col md:flex-row items-center gap-3"
      >
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder={`${message || '🔍 Search movies...' }`}
            value={query}
            onChange={(e) => {setQuery(e.target.value); setMessage("");}}
            className={`w-full px-4 py-2 rounded-lg bg-[#1c1c1c] ${message ? 'text-rose-500' : 'text-white' }  
                       focus:outline-none focus:ring-2 focus:ring-[#A00000]`}
          />
          {query && (
            <FaTimes
              className="absolute right-3 top-3 text-gray-400 hover:text-red-500 cursor-pointer transition"
              onClick={handleClearSearch}
            />
          )}
        </div>

        {/* 🔴 Buttons */}
        <div className="flex w-full sm:w-max gap-2 justify-between sm:justify-start">
          <button
          type="submit"
          className="cursor-pointer bg-gradient-to-r from-[#7A0000] to-[#A00000] 
                     hover:from-[#A00000] hover:to-[#C00000]
                     shadow-md hover:shadow-[0_0_10px_#FF0000]
                     px-5 py-2 rounded-lg text-white font-medium transition flex items-center gap-2"
        >
          <FaSearch /> Search
        </button>

        <button
          type="button"
          onClick={() => setShowFilters((p) => !p)}
          className="cursor-pointer bg-gradient-to-r from-[#232323] to-[#2E2E2E] 
                     hover:from-[#383838] hover:to-[#444444]
                     shadow-sm hover:shadow-[0_0_8px_#555]
                     px-5 py-2 rounded-lg text-gray-200 font-medium transition"
        >
          {showFilters ? "Close Filters" : "Filter"}
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="cursor-pointer bg-gradient-to-r from-[#2E2E2E] to-[#3A3A3A] 
                     hover:from-[#444] hover:to-[#555]
                     shadow-sm hover:shadow-[0_0_8px_#555]
                     px-5 py-2 rounded-lg text-gray-300 font-medium transition"
        >
          Reset
        </button>
        </div>
      </form>

      {/* 🎛 Filter section */}
      {showFilters && (
        <div className="mt-5 grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4 animate-fadeIn">
          {/* Year */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Release Year
            </label>
            <input
              type="number"
              placeholder="e.g. 2024"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#1c1c1c] text-white 
                         focus:outline-none focus:ring-2 focus:ring-[#A00000]
                         appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Minimum Rating
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              placeholder="e.g. 7.5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#1c1c1c] text-white 
                         focus:outline-none focus:ring-2 focus:ring-[#A00000]
                         appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="custom-select w-full px-3 py-2 rounded-lg bg-[#1c1c1c] text-white 
                         focus:outline-none focus:ring-2 focus:ring-[#A00000] cursor-pointer"
            >
              {[
                { code: "ta", name: "Tamil" },
                { code: "en", name: "English" },
                { code: "hi", name: "Hindi" },
                { code: "ml", name: "Malayalam" },
                { code: "te", name: "Telugu" },
              ].map((opt) => (
                <option key={opt.code} value={opt.code}>
                  {opt.name}
                </option>
              ))}
            </select>
          </div>

          {/* Apply */}
          <div className="flex items-end">
            <button
              onClick={handleApply}
              className="cursor-pointer w-full bg-gradient-to-r from-[#7A0000] to-[#A00000] 
                         hover:from-[#A00000] hover:to-[#C00000] 
                         hover:shadow-[0_0_12px_#FF0000]
                         py-2 rounded-lg text-white font-semibold transition"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
